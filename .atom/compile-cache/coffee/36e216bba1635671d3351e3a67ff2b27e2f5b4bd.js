(function() {
  module.exports = function(picker) {
    var _context, _el, _height, _selection, _width;
    _el = picker.querySelector('#ColorPicker-alphaSelector');
    _selection = picker.querySelector('#ColorPicker-alphaSelection');
    _context = _el.getContext('2d');
    _width = _el.offsetWidth;
    _height = _el.offsetHeight;
    return {
      el: _el,
      width: _width,
      height: _height,
      render: function(color) {
        var _gradient, _rgbString;
        _gradient = _context.createLinearGradient(0, 0, 1, _height);
        _context.clearRect(0, 0, _width, _height);
        _rgbString = color.join(', ');
        _gradient.addColorStop(0, "rgba(" + _rgbString + ", 1)");
        _gradient.addColorStop(1, "rgba(" + _rgbString + ", 0)");
        _context.fillStyle = _gradient;
        _context.fillRect(0, 0, _width, _height);
      },
      setPosition: function(_arg) {
        var top;
        top = _arg.top;
        _selection.style['top'] = (top / _height) * 100 + '%';
      }
    };
  };

}).call(this);
