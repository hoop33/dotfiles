module.exports = function (grunt) {

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint']);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9yd2FybmVyL0Ryb3Bib3gvY29uZmlnLy5hdG9tL3BhY2thZ2VzL3NldGktc3ludGF4L3NhbXBsZS1maWxlcy9HcnVudGZpbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLEtBQUssRUFBRTs7QUFFL0IsT0FBSyxDQUFDLFVBQVUsQ0FBQztBQUNmLFVBQU0sRUFBRTtBQUNOLFdBQUssRUFBRSxDQUFDLGNBQWMsRUFBRSxhQUFhLEVBQUUsY0FBYyxDQUFDO0FBQ3RELGFBQU8sRUFBRTtBQUNQLGVBQU8sRUFBRTtBQUNQLGdCQUFNLEVBQUUsSUFBSTtTQUNiO09BQ0Y7S0FDRjtBQUNELFNBQUssRUFBRTtBQUNMLFdBQUssRUFBRSxDQUFDLHFCQUFxQixDQUFDO0FBQzlCLFdBQUssRUFBRSxDQUFDLFFBQVEsQ0FBQztLQUNsQjtHQUNGLENBQUMsQ0FBQzs7QUFFSCxPQUFLLENBQUMsWUFBWSxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFDM0MsT0FBSyxDQUFDLFlBQVksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDOztBQUUxQyxPQUFLLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Q0FFM0MsQ0FBQyIsImZpbGUiOiIvVXNlcnMvcndhcm5lci9Ecm9wYm94L2NvbmZpZy8uYXRvbS9wYWNrYWdlcy9zZXRpLXN5bnRheC9zYW1wbGUtZmlsZXMvR3J1bnRmaWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihncnVudCkge1xuXG4gIGdydW50LmluaXRDb25maWcoe1xuICAgIGpzaGludDoge1xuICAgICAgZmlsZXM6IFsnR3J1bnRmaWxlLmpzJywgJ3NyYy8qKi8qLmpzJywgJ3Rlc3QvKiovKi5qcyddLFxuICAgICAgb3B0aW9uczoge1xuICAgICAgICBnbG9iYWxzOiB7XG4gICAgICAgICAgalF1ZXJ5OiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHdhdGNoOiB7XG4gICAgICBmaWxlczogWyc8JT0ganNoaW50LmZpbGVzICU+J10sXG4gICAgICB0YXNrczogWydqc2hpbnQnXVxuICAgIH1cbiAgfSk7XG5cbiAgZ3J1bnQubG9hZE5wbVRhc2tzKCdncnVudC1jb250cmliLWpzaGludCcpO1xuICBncnVudC5sb2FkTnBtVGFza3MoJ2dydW50LWNvbnRyaWItd2F0Y2gnKTtcblxuICBncnVudC5yZWdpc3RlclRhc2soJ2RlZmF1bHQnLCBbJ2pzaGludCddKTtcblxufTtcbiJdfQ==