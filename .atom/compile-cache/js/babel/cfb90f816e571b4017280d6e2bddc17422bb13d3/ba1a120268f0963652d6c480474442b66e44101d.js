/**
 *
 *  Web Starter Kit
 *  Copyright 2014 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var pagespeed = require('psi');
var reload = browserSync.reload;

var AUTOPREFIXER_BROWSERS = ['ie >= 10', 'ie_mob >= 10', 'ff >= 30', 'chrome >= 34', 'safari >= 7', 'opera >= 23', 'ios >= 7', 'android >= 4.4', 'bb >= 10'];

// Lint JavaScript
gulp.task('jshint', function () {
  return gulp.src('app/scripts/**/*.js').pipe(reload({ stream: true, once: true })).pipe($.jshint()).pipe($.jshint.reporter('jshint-stylish')).pipe($['if'](!browserSync.active, $.jshint.reporter('fail')));
});

// Optimize Images
gulp.task('images', function () {
  return gulp.src('app/images/**/*').pipe($.cache($.imagemin({
    progressive: true,
    interlaced: true
  }))).pipe(gulp.dest('dist/images')).pipe($.size({ title: 'images' }));
});

// Copy All Files At The Root Level (app)
gulp.task('copy', function () {
  return gulp.src(['app/*', '!app/*.html', 'node_modules/apache-server-configs/dist/.htaccess'], {
    dot: true
  }).pipe(gulp.dest('dist')).pipe($.size({ title: 'copy' }));
});

// Copy Web Fonts To Dist
gulp.task('fonts', function () {
  return gulp.src(['app/fonts/**']).pipe(gulp.dest('dist/fonts')).pipe($.size({ title: 'fonts' }));
});

// Compile and Automatically Prefix Stylesheets
gulp.task('styles', function () {
  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src(['app/styles/*.scss', 'app/styles/**/*.css', 'app/styles/components/components.scss']).pipe($.sourcemaps.init()).pipe($.changed('.tmp/styles', { extension: '.css' })).pipe($.sass({
    precision: 10,
    onError: console.error.bind(console, 'Sass error:')
  })).pipe($.autoprefixer({ browsers: AUTOPREFIXER_BROWSERS })).pipe($.sourcemaps.write()).pipe(gulp.dest('.tmp/styles'))
  // Concatenate And Minify Styles
  .pipe($['if']('*.css', $.csso())).pipe(gulp.dest('dist/styles')).pipe($.size({ title: 'styles' }));
});

// Scan Your HTML For Assets & Optimize Them
gulp.task('html', function () {
  var assets = $.useref.assets({ searchPath: '{.tmp,app}' });

  return gulp.src('app/**/*.html').pipe(assets)
  // Concatenate And Minify JavaScript
  .pipe($['if']('*.js', $.uglify({ preserveComments: 'some' })))
  // Remove Any Unused CSS
  // Note: If not using the Style Guide, you can delete it from
  // the next line to only include styles your project uses.
  .pipe($['if']('*.css', $.uncss({
    html: ['app/index.html', 'app/styleguide.html'],
    // CSS Selectors for UnCSS to ignore
    ignore: [/.navdrawer-container.open/, /.app-bar.open/]
  })))
  // Concatenate And Minify Styles
  // In case you are still using useref build blocks
  .pipe($['if']('*.css', $.csso())).pipe(assets.restore()).pipe($.useref())
  // Update Production Style Guide Paths
  .pipe($.replace('components/components.css', 'components/main.min.css'))
  // Minify Any HTML
  .pipe($['if']('*.html', $.minifyHtml()))
  // Output Files
  .pipe(gulp.dest('dist')).pipe($.size({ title: 'html' }));
});

// Clean Output Directory
gulp.task('clean', del.bind(null, ['.tmp', 'dist/*', '!dist/.git'], { dot: true }));

// Watch Files For Changes & Reload
gulp.task('serve', ['styles'], function () {
  browserSync({
    notify: false,
    // Customize the BrowserSync console logging prefix
    logPrefix: 'WSK',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: ['.tmp', 'app']
  });

  gulp.watch(['app/**/*.html'], reload);
  gulp.watch(['app/styles/**/*.{scss,css}'], ['styles', reload]);
  gulp.watch(['app/scripts/**/*.js'], ['jshint']);
  gulp.watch(['app/images/**/*'], reload);
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], function () {
  browserSync({
    notify: false,
    logPrefix: 'WSK',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: 'dist'
  });
});

// Build Production Files, the Default Task
gulp.task('default', ['clean'], function (cb) {
  runSequence('styles', ['jshint', 'html', 'images', 'fonts', 'copy'], cb);
});

// Run PageSpeed Insights
gulp.task('pagespeed', function (cb) {
  // Update the below URL to the public URL of your site
  pagespeed.output('example.com', {
    strategy: 'mobile' }, cb);
});

// Load custom tasks from the `tasks` directory
// try { require('require-dir')('tasks'); } catch (err) { console.error(err); }

// By default we use the PageSpeed Insights free (no API key) tier.
// Use a Google Developer API key if you have one: http://goo.gl/RkN0vE
// key: 'YOUR_API_KEY'
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9yd2FybmVyL0Ryb3Bib3gvY29uZmlnLy5hdG9tL3BhY2thZ2VzL3NldGktc3ludGF4L3NhbXBsZS1maWxlcy9HdWxwZmlsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBLFlBQVksQ0FBQzs7O0FBR2IsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNCLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLENBQUM7QUFDdkMsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3pCLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUMxQyxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDMUMsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQy9CLElBQUksTUFBTSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7O0FBRWhDLElBQUkscUJBQXFCLEdBQUcsQ0FDMUIsVUFBVSxFQUNWLGNBQWMsRUFDZCxVQUFVLEVBQ1YsY0FBYyxFQUNkLGFBQWEsRUFDYixhQUFhLEVBQ2IsVUFBVSxFQUNWLGdCQUFnQixFQUNoQixVQUFVLENBQ1gsQ0FBQzs7O0FBR0YsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsWUFBWTtBQUM5QixTQUFPLElBQUksQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FDbkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsQ0FDeEMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUNoQixJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUN6QyxJQUFJLENBQUMsQ0FBQyxNQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUMvRCxDQUFDLENBQUM7OztBQUdILElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFlBQVk7QUFDOUIsU0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQy9CLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7QUFDdkIsZUFBVyxFQUFFLElBQUk7QUFDakIsY0FBVSxFQUFFLElBQUk7R0FDakIsQ0FBQyxDQUFDLENBQUMsQ0FDSCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUM5QixJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDcEMsQ0FBQyxDQUFDOzs7QUFHSCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxZQUFZO0FBQzVCLFNBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUNkLE9BQU8sRUFDUCxhQUFhLEVBQ2IsbURBQW1ELENBQ3BELEVBQUU7QUFDRCxPQUFHLEVBQUUsSUFBSTtHQUNWLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUN2QixJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLEtBQUssRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDbEMsQ0FBQyxDQUFDOzs7QUFHSCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxZQUFZO0FBQzdCLFNBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQzlCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQzdCLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUMsQ0FBQztDQUNuQyxDQUFDLENBQUM7OztBQUdILElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFlBQVk7O0FBRTlCLFNBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUNkLG1CQUFtQixFQUNuQixxQkFBcUIsRUFDckIsdUNBQXVDLENBQ3hDLENBQUMsQ0FDQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUN6QixJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsRUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQyxDQUNuRCxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUNYLGFBQVMsRUFBRSxFQUFFO0FBQ2IsV0FBTyxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUM7R0FDcEQsQ0FBQyxDQUFDLENBQ0YsSUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFBQyxRQUFRLEVBQUUscUJBQXFCLEVBQUMsQ0FBQyxDQUFDLENBQ3ZELElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDOztHQUU5QixJQUFJLENBQUMsQ0FBQyxNQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQzdCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQzlCLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUMsQ0FBQztDQUNwQyxDQUFDLENBQUM7OztBQUdILElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFlBQVk7QUFDNUIsTUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBQyxVQUFVLEVBQUUsWUFBWSxFQUFDLENBQUMsQ0FBQzs7QUFFekQsU0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUM3QixJQUFJLENBQUMsTUFBTSxDQUFDOztHQUVaLElBQUksQ0FBQyxDQUFDLE1BQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFDLGdCQUFnQixFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUMsQ0FBQzs7OztHQUl4RCxJQUFJLENBQUMsQ0FBQyxNQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDMUIsUUFBSSxFQUFFLENBQ0osZ0JBQWdCLEVBQ2hCLHFCQUFxQixDQUN0Qjs7QUFFRCxVQUFNLEVBQUUsQ0FDTiwyQkFBMkIsRUFDM0IsZUFBZSxDQUNoQjtHQUNGLENBQUMsQ0FBQyxDQUFDOzs7R0FHSCxJQUFJLENBQUMsQ0FBQyxNQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FDdEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7R0FFaEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsMkJBQTJCLEVBQUUseUJBQXlCLENBQUMsQ0FBQzs7R0FFdkUsSUFBSSxDQUFDLENBQUMsTUFBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQzs7R0FFcEMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FDdkIsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ2xDLENBQUMsQ0FBQzs7O0FBR0gsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLFlBQVksQ0FBQyxFQUFFLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQzs7O0FBR2xGLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsWUFBWTtBQUN6QyxhQUFXLENBQUM7QUFDVixVQUFNLEVBQUUsS0FBSzs7QUFFYixhQUFTLEVBQUUsS0FBSzs7Ozs7QUFLaEIsVUFBTSxFQUFFLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQztHQUN4QixDQUFDLENBQUM7O0FBRUgsTUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLGVBQWUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3RDLE1BQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyw0QkFBNEIsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDL0QsTUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQ2hELE1BQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0NBQ3pDLENBQUMsQ0FBQzs7O0FBR0gsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRSxZQUFZO0FBQy9DLGFBQVcsQ0FBQztBQUNWLFVBQU0sRUFBRSxLQUFLO0FBQ2IsYUFBUyxFQUFFLEtBQUs7Ozs7O0FBS2hCLFVBQU0sRUFBRSxNQUFNO0dBQ2YsQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDOzs7QUFHSCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLFVBQVUsRUFBRSxFQUFFO0FBQzVDLGFBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7Q0FDMUUsQ0FBQyxDQUFDOzs7QUFHSCxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxVQUFVLEVBQUUsRUFBRTs7QUFFbkMsV0FBUyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUU7QUFDOUIsWUFBUSxFQUFFLFFBQVEsRUFJbkIsRUFBRSxFQUFFLENBQUMsQ0FBQztDQUNSLENBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvcndhcm5lci9Ecm9wYm94L2NvbmZpZy8uYXRvbS9wYWNrYWdlcy9zZXRpLXN5bnRheC9zYW1wbGUtZmlsZXMvR3VscGZpbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqXG4gKiAgV2ViIFN0YXJ0ZXIgS2l0XG4gKiAgQ29weXJpZ2h0IDIwMTQgR29vZ2xlIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICBodHRwczovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlXG4gKlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLy8gSW5jbHVkZSBHdWxwICYgVG9vbHMgV2UnbGwgVXNlXG52YXIgZ3VscCA9IHJlcXVpcmUoJ2d1bHAnKTtcbnZhciAkID0gcmVxdWlyZSgnZ3VscC1sb2FkLXBsdWdpbnMnKSgpO1xudmFyIGRlbCA9IHJlcXVpcmUoJ2RlbCcpO1xudmFyIHJ1blNlcXVlbmNlID0gcmVxdWlyZSgncnVuLXNlcXVlbmNlJyk7XG52YXIgYnJvd3NlclN5bmMgPSByZXF1aXJlKCdicm93c2VyLXN5bmMnKTtcbnZhciBwYWdlc3BlZWQgPSByZXF1aXJlKCdwc2knKTtcbnZhciByZWxvYWQgPSBicm93c2VyU3luYy5yZWxvYWQ7XG5cbnZhciBBVVRPUFJFRklYRVJfQlJPV1NFUlMgPSBbXG4gICdpZSA+PSAxMCcsXG4gICdpZV9tb2IgPj0gMTAnLFxuICAnZmYgPj0gMzAnLFxuICAnY2hyb21lID49IDM0JyxcbiAgJ3NhZmFyaSA+PSA3JyxcbiAgJ29wZXJhID49IDIzJyxcbiAgJ2lvcyA+PSA3JyxcbiAgJ2FuZHJvaWQgPj0gNC40JyxcbiAgJ2JiID49IDEwJ1xuXTtcblxuLy8gTGludCBKYXZhU2NyaXB0XG5ndWxwLnRhc2soJ2pzaGludCcsIGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIGd1bHAuc3JjKCdhcHAvc2NyaXB0cy8qKi8qLmpzJylcbiAgICAucGlwZShyZWxvYWQoe3N0cmVhbTogdHJ1ZSwgb25jZTogdHJ1ZX0pKVxuICAgIC5waXBlKCQuanNoaW50KCkpXG4gICAgLnBpcGUoJC5qc2hpbnQucmVwb3J0ZXIoJ2pzaGludC1zdHlsaXNoJykpXG4gICAgLnBpcGUoJC5pZighYnJvd3NlclN5bmMuYWN0aXZlLCAkLmpzaGludC5yZXBvcnRlcignZmFpbCcpKSk7XG59KTtcblxuLy8gT3B0aW1pemUgSW1hZ2VzXG5ndWxwLnRhc2soJ2ltYWdlcycsIGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIGd1bHAuc3JjKCdhcHAvaW1hZ2VzLyoqLyonKVxuICAgIC5waXBlKCQuY2FjaGUoJC5pbWFnZW1pbih7XG4gICAgICBwcm9ncmVzc2l2ZTogdHJ1ZSxcbiAgICAgIGludGVybGFjZWQ6IHRydWVcbiAgICB9KSkpXG4gICAgLnBpcGUoZ3VscC5kZXN0KCdkaXN0L2ltYWdlcycpKVxuICAgIC5waXBlKCQuc2l6ZSh7dGl0bGU6ICdpbWFnZXMnfSkpO1xufSk7XG5cbi8vIENvcHkgQWxsIEZpbGVzIEF0IFRoZSBSb290IExldmVsIChhcHApXG5ndWxwLnRhc2soJ2NvcHknLCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBndWxwLnNyYyhbXG4gICAgJ2FwcC8qJyxcbiAgICAnIWFwcC8qLmh0bWwnLFxuICAgICdub2RlX21vZHVsZXMvYXBhY2hlLXNlcnZlci1jb25maWdzL2Rpc3QvLmh0YWNjZXNzJ1xuICBdLCB7XG4gICAgZG90OiB0cnVlXG4gIH0pLnBpcGUoZ3VscC5kZXN0KCdkaXN0JykpXG4gICAgLnBpcGUoJC5zaXplKHt0aXRsZTogJ2NvcHknfSkpO1xufSk7XG5cbi8vIENvcHkgV2ViIEZvbnRzIFRvIERpc3Rcbmd1bHAudGFzaygnZm9udHMnLCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBndWxwLnNyYyhbJ2FwcC9mb250cy8qKiddKVxuICAgIC5waXBlKGd1bHAuZGVzdCgnZGlzdC9mb250cycpKVxuICAgIC5waXBlKCQuc2l6ZSh7dGl0bGU6ICdmb250cyd9KSk7XG59KTtcblxuLy8gQ29tcGlsZSBhbmQgQXV0b21hdGljYWxseSBQcmVmaXggU3R5bGVzaGVldHNcbmd1bHAudGFzaygnc3R5bGVzJywgZnVuY3Rpb24gKCkge1xuICAvLyBGb3IgYmVzdCBwZXJmb3JtYW5jZSwgZG9uJ3QgYWRkIFNhc3MgcGFydGlhbHMgdG8gYGd1bHAuc3JjYFxuICByZXR1cm4gZ3VscC5zcmMoW1xuICAgICdhcHAvc3R5bGVzLyouc2NzcycsXG4gICAgJ2FwcC9zdHlsZXMvKiovKi5jc3MnLFxuICAgICdhcHAvc3R5bGVzL2NvbXBvbmVudHMvY29tcG9uZW50cy5zY3NzJ1xuICBdKVxuICAgIC5waXBlKCQuc291cmNlbWFwcy5pbml0KCkpXG4gICAgLnBpcGUoJC5jaGFuZ2VkKCcudG1wL3N0eWxlcycsIHtleHRlbnNpb246ICcuY3NzJ30pKVxuICAgIC5waXBlKCQuc2Fzcyh7XG4gICAgICBwcmVjaXNpb246IDEwLFxuICAgICAgb25FcnJvcjogY29uc29sZS5lcnJvci5iaW5kKGNvbnNvbGUsICdTYXNzIGVycm9yOicpXG4gICAgfSkpXG4gICAgLnBpcGUoJC5hdXRvcHJlZml4ZXIoe2Jyb3dzZXJzOiBBVVRPUFJFRklYRVJfQlJPV1NFUlN9KSlcbiAgICAucGlwZSgkLnNvdXJjZW1hcHMud3JpdGUoKSlcbiAgICAucGlwZShndWxwLmRlc3QoJy50bXAvc3R5bGVzJykpXG4gICAgLy8gQ29uY2F0ZW5hdGUgQW5kIE1pbmlmeSBTdHlsZXNcbiAgICAucGlwZSgkLmlmKCcqLmNzcycsICQuY3NzbygpKSlcbiAgICAucGlwZShndWxwLmRlc3QoJ2Rpc3Qvc3R5bGVzJykpXG4gICAgLnBpcGUoJC5zaXplKHt0aXRsZTogJ3N0eWxlcyd9KSk7XG59KTtcblxuLy8gU2NhbiBZb3VyIEhUTUwgRm9yIEFzc2V0cyAmIE9wdGltaXplIFRoZW1cbmd1bHAudGFzaygnaHRtbCcsIGZ1bmN0aW9uICgpIHtcbiAgdmFyIGFzc2V0cyA9ICQudXNlcmVmLmFzc2V0cyh7c2VhcmNoUGF0aDogJ3sudG1wLGFwcH0nfSk7XG5cbiAgcmV0dXJuIGd1bHAuc3JjKCdhcHAvKiovKi5odG1sJylcbiAgICAucGlwZShhc3NldHMpXG4gICAgLy8gQ29uY2F0ZW5hdGUgQW5kIE1pbmlmeSBKYXZhU2NyaXB0XG4gICAgLnBpcGUoJC5pZignKi5qcycsICQudWdsaWZ5KHtwcmVzZXJ2ZUNvbW1lbnRzOiAnc29tZSd9KSkpXG4gICAgLy8gUmVtb3ZlIEFueSBVbnVzZWQgQ1NTXG4gICAgLy8gTm90ZTogSWYgbm90IHVzaW5nIHRoZSBTdHlsZSBHdWlkZSwgeW91IGNhbiBkZWxldGUgaXQgZnJvbVxuICAgIC8vIHRoZSBuZXh0IGxpbmUgdG8gb25seSBpbmNsdWRlIHN0eWxlcyB5b3VyIHByb2plY3QgdXNlcy5cbiAgICAucGlwZSgkLmlmKCcqLmNzcycsICQudW5jc3Moe1xuICAgICAgaHRtbDogW1xuICAgICAgICAnYXBwL2luZGV4Lmh0bWwnLFxuICAgICAgICAnYXBwL3N0eWxlZ3VpZGUuaHRtbCdcbiAgICAgIF0sXG4gICAgICAvLyBDU1MgU2VsZWN0b3JzIGZvciBVbkNTUyB0byBpZ25vcmVcbiAgICAgIGlnbm9yZTogW1xuICAgICAgICAvLm5hdmRyYXdlci1jb250YWluZXIub3Blbi8sXG4gICAgICAgIC8uYXBwLWJhci5vcGVuL1xuICAgICAgXVxuICAgIH0pKSlcbiAgICAvLyBDb25jYXRlbmF0ZSBBbmQgTWluaWZ5IFN0eWxlc1xuICAgIC8vIEluIGNhc2UgeW91IGFyZSBzdGlsbCB1c2luZyB1c2VyZWYgYnVpbGQgYmxvY2tzXG4gICAgLnBpcGUoJC5pZignKi5jc3MnLCAkLmNzc28oKSkpXG4gICAgLnBpcGUoYXNzZXRzLnJlc3RvcmUoKSlcbiAgICAucGlwZSgkLnVzZXJlZigpKVxuICAgIC8vIFVwZGF0ZSBQcm9kdWN0aW9uIFN0eWxlIEd1aWRlIFBhdGhzXG4gICAgLnBpcGUoJC5yZXBsYWNlKCdjb21wb25lbnRzL2NvbXBvbmVudHMuY3NzJywgJ2NvbXBvbmVudHMvbWFpbi5taW4uY3NzJykpXG4gICAgLy8gTWluaWZ5IEFueSBIVE1MXG4gICAgLnBpcGUoJC5pZignKi5odG1sJywgJC5taW5pZnlIdG1sKCkpKVxuICAgIC8vIE91dHB1dCBGaWxlc1xuICAgIC5waXBlKGd1bHAuZGVzdCgnZGlzdCcpKVxuICAgIC5waXBlKCQuc2l6ZSh7dGl0bGU6ICdodG1sJ30pKTtcbn0pO1xuXG4vLyBDbGVhbiBPdXRwdXQgRGlyZWN0b3J5XG5ndWxwLnRhc2soJ2NsZWFuJywgZGVsLmJpbmQobnVsbCwgWycudG1wJywgJ2Rpc3QvKicsICchZGlzdC8uZ2l0J10sIHtkb3Q6IHRydWV9KSk7XG5cbi8vIFdhdGNoIEZpbGVzIEZvciBDaGFuZ2VzICYgUmVsb2FkXG5ndWxwLnRhc2soJ3NlcnZlJywgWydzdHlsZXMnXSwgZnVuY3Rpb24gKCkge1xuICBicm93c2VyU3luYyh7XG4gICAgbm90aWZ5OiBmYWxzZSxcbiAgICAvLyBDdXN0b21pemUgdGhlIEJyb3dzZXJTeW5jIGNvbnNvbGUgbG9nZ2luZyBwcmVmaXhcbiAgICBsb2dQcmVmaXg6ICdXU0snLFxuICAgIC8vIFJ1biBhcyBhbiBodHRwcyBieSB1bmNvbW1lbnRpbmcgJ2h0dHBzOiB0cnVlJ1xuICAgIC8vIE5vdGU6IHRoaXMgdXNlcyBhbiB1bnNpZ25lZCBjZXJ0aWZpY2F0ZSB3aGljaCBvbiBmaXJzdCBhY2Nlc3NcbiAgICAvLyAgICAgICB3aWxsIHByZXNlbnQgYSBjZXJ0aWZpY2F0ZSB3YXJuaW5nIGluIHRoZSBicm93c2VyLlxuICAgIC8vIGh0dHBzOiB0cnVlLFxuICAgIHNlcnZlcjogWycudG1wJywgJ2FwcCddXG4gIH0pO1xuXG4gIGd1bHAud2F0Y2goWydhcHAvKiovKi5odG1sJ10sIHJlbG9hZCk7XG4gIGd1bHAud2F0Y2goWydhcHAvc3R5bGVzLyoqLyoue3Njc3MsY3NzfSddLCBbJ3N0eWxlcycsIHJlbG9hZF0pO1xuICBndWxwLndhdGNoKFsnYXBwL3NjcmlwdHMvKiovKi5qcyddLCBbJ2pzaGludCddKTtcbiAgZ3VscC53YXRjaChbJ2FwcC9pbWFnZXMvKiovKiddLCByZWxvYWQpO1xufSk7XG5cbi8vIEJ1aWxkIGFuZCBzZXJ2ZSB0aGUgb3V0cHV0IGZyb20gdGhlIGRpc3QgYnVpbGRcbmd1bHAudGFzaygnc2VydmU6ZGlzdCcsIFsnZGVmYXVsdCddLCBmdW5jdGlvbiAoKSB7XG4gIGJyb3dzZXJTeW5jKHtcbiAgICBub3RpZnk6IGZhbHNlLFxuICAgIGxvZ1ByZWZpeDogJ1dTSycsXG4gICAgLy8gUnVuIGFzIGFuIGh0dHBzIGJ5IHVuY29tbWVudGluZyAnaHR0cHM6IHRydWUnXG4gICAgLy8gTm90ZTogdGhpcyB1c2VzIGFuIHVuc2lnbmVkIGNlcnRpZmljYXRlIHdoaWNoIG9uIGZpcnN0IGFjY2Vzc1xuICAgIC8vICAgICAgIHdpbGwgcHJlc2VudCBhIGNlcnRpZmljYXRlIHdhcm5pbmcgaW4gdGhlIGJyb3dzZXIuXG4gICAgLy8gaHR0cHM6IHRydWUsXG4gICAgc2VydmVyOiAnZGlzdCdcbiAgfSk7XG59KTtcblxuLy8gQnVpbGQgUHJvZHVjdGlvbiBGaWxlcywgdGhlIERlZmF1bHQgVGFza1xuZ3VscC50YXNrKCdkZWZhdWx0JywgWydjbGVhbiddLCBmdW5jdGlvbiAoY2IpIHtcbiAgcnVuU2VxdWVuY2UoJ3N0eWxlcycsIFsnanNoaW50JywgJ2h0bWwnLCAnaW1hZ2VzJywgJ2ZvbnRzJywgJ2NvcHknXSwgY2IpO1xufSk7XG5cbi8vIFJ1biBQYWdlU3BlZWQgSW5zaWdodHNcbmd1bHAudGFzaygncGFnZXNwZWVkJywgZnVuY3Rpb24gKGNiKSB7XG4gIC8vIFVwZGF0ZSB0aGUgYmVsb3cgVVJMIHRvIHRoZSBwdWJsaWMgVVJMIG9mIHlvdXIgc2l0ZVxuICBwYWdlc3BlZWQub3V0cHV0KCdleGFtcGxlLmNvbScsIHtcbiAgICBzdHJhdGVneTogJ21vYmlsZScsXG4gICAgLy8gQnkgZGVmYXVsdCB3ZSB1c2UgdGhlIFBhZ2VTcGVlZCBJbnNpZ2h0cyBmcmVlIChubyBBUEkga2V5KSB0aWVyLlxuICAgIC8vIFVzZSBhIEdvb2dsZSBEZXZlbG9wZXIgQVBJIGtleSBpZiB5b3UgaGF2ZSBvbmU6IGh0dHA6Ly9nb28uZ2wvUmtOMHZFXG4gICAgLy8ga2V5OiAnWU9VUl9BUElfS0VZJ1xuICB9LCBjYik7XG59KTtcblxuLy8gTG9hZCBjdXN0b20gdGFza3MgZnJvbSB0aGUgYHRhc2tzYCBkaXJlY3Rvcnlcbi8vIHRyeSB7IHJlcXVpcmUoJ3JlcXVpcmUtZGlyJykoJ3Rhc2tzJyk7IH0gY2F0Y2ggKGVycikgeyBjb25zb2xlLmVycm9yKGVycik7IH1cbiJdfQ==