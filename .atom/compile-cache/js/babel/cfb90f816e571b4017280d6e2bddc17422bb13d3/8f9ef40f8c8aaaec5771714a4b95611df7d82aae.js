var koa = require('koa');
var app = koa();

// x-response-time

app.use(function* (next) {
  var start = new Date();
  yield next;
  var ms = new Date() - start;
  this.set('X-Response-Time', ms + 'ms');
});

// logger

app.use(function* (next) {
  var start = new Date();
  yield next;
  var ms = new Date() - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

// response

app.use(function* () {
  this.body = 'Hello World';
});

app.listen(3000);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9yd2FybmVyL0Ryb3Bib3gvY29uZmlnLy5hdG9tL3BhY2thZ2VzL3NldGktc3ludGF4L3NhbXBsZS1maWxlcy9KYXZhU2NyaXB0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN6QixJQUFJLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQzs7OztBQUloQixHQUFHLENBQUMsR0FBRyxDQUFDLFdBQVcsSUFBSSxFQUFDO0FBQ3RCLE1BQUksS0FBSyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7QUFDdkIsUUFBTSxJQUFJLENBQUM7QUFDWCxNQUFJLEVBQUUsR0FBRyxJQUFJLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQztBQUM1QixNQUFJLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztDQUN4QyxDQUFDLENBQUM7Ozs7QUFJSCxHQUFHLENBQUMsR0FBRyxDQUFDLFdBQVcsSUFBSSxFQUFDO0FBQ3RCLE1BQUksS0FBSyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7QUFDdkIsUUFBTSxJQUFJLENBQUM7QUFDWCxNQUFJLEVBQUUsR0FBRyxJQUFJLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQztBQUM1QixTQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7Q0FDdEQsQ0FBQyxDQUFDOzs7O0FBSUgsR0FBRyxDQUFDLEdBQUcsQ0FBQyxhQUFZO0FBQ2xCLE1BQUksQ0FBQyxJQUFJLEdBQUcsYUFBYSxDQUFDO0NBQzNCLENBQUMsQ0FBQzs7QUFFSCxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9yd2FybmVyL0Ryb3Bib3gvY29uZmlnLy5hdG9tL3BhY2thZ2VzL3NldGktc3ludGF4L3NhbXBsZS1maWxlcy9KYXZhU2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGtvYSA9IHJlcXVpcmUoJ2tvYScpO1xudmFyIGFwcCA9IGtvYSgpO1xuXG4vLyB4LXJlc3BvbnNlLXRpbWVcblxuYXBwLnVzZShmdW5jdGlvbiAqKG5leHQpe1xuICB2YXIgc3RhcnQgPSBuZXcgRGF0ZSgpO1xuICB5aWVsZCBuZXh0O1xuICB2YXIgbXMgPSBuZXcgRGF0ZSgpIC0gc3RhcnQ7XG4gIHRoaXMuc2V0KCdYLVJlc3BvbnNlLVRpbWUnLCBtcyArICdtcycpO1xufSk7XG5cbi8vIGxvZ2dlclxuXG5hcHAudXNlKGZ1bmN0aW9uICoobmV4dCl7XG4gIHZhciBzdGFydCA9IG5ldyBEYXRlKCk7XG4gIHlpZWxkIG5leHQ7XG4gIHZhciBtcyA9IG5ldyBEYXRlKCkgLSBzdGFydDtcbiAgY29uc29sZS5sb2coJyVzICVzIC0gJXMnLCB0aGlzLm1ldGhvZCwgdGhpcy51cmwsIG1zKTtcbn0pO1xuXG4vLyByZXNwb25zZVxuXG5hcHAudXNlKGZ1bmN0aW9uICooKXtcbiAgdGhpcy5ib2R5ID0gJ0hlbGxvIFdvcmxkJztcbn0pO1xuXG5hcHAubGlzdGVuKDMwMDApO1xuIl19