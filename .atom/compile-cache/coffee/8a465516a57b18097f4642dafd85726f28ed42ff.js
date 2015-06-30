(function() {
  var map;

  map = require('../lib/map');

  describe('map', function() {
    it('should have a context for HTML', function() {
      var html;
      html = map['HTML'];
      expect(html).toContain('jquery');
      return expect(html).toContain('zepto');
    });
    it('should have a context for HTML (Rails)', function() {
      var html;
      html = map['HTML (Rails)'];
      expect(html).toContain('jquery');
      expect(html).toContain('zepto');
      expect(html).toContain('ruby');
      expect(html).toContain('rubygems');
      return expect(html).toContain('rails');
    });
    it('should have a context for Coffeescript', function() {
      var coffee;
      coffee = map['CoffeeScript'];
      expect(coffee).toContain('coffee');
      return expect(coffee).toContain('jquery');
    });
    it('should have a context for Handlebars', function() {
      var handlebars;
      handlebars = map['Handlebars'];
      expect(handlebars).toContain('html');
      expect(handlebars).toContain('javascript');
      return expect(handlebars).toContain('yui');
    });
    return it('should have a context for JavaScript', function() {
      var js;
      js = map['JavaScript'];
      expect(js).toContain('javascript');
      expect(js).toContain('jquery');
      return expect(js).toContain('unity3d');
    });
  });

}).call(this);
