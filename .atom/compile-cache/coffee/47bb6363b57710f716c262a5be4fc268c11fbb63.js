(function() {
  module.exports = function(picker) {
    var Convert, _context, _el, _height, _selection, _width;
    Convert = require('./ColorPicker-convert');
    _el = picker.querySelector('#ColorPicker-saturationSelector');
    _selection = picker.querySelector('#ColorPicker-saturationSelection');
    _context = _el.getContext('2d');
    _width = _el.offsetWidth;
    _height = _el.offsetHeight;
    return {
      el: _el,
      width: _width,
      height: _height,
      render: function(hex) {
        var _gradient, _hsl;
        _hsl = Convert.hexToHsl(hex);
        _context.clearRect(0, 0, _width, _height);
        _gradient = _context.createLinearGradient(0, 0, _width, 1);
        _gradient.addColorStop(.01, '#fff');
        _gradient.addColorStop(.99, "hsl(" + _hsl[0] + ", 100%, 50%)");
        _context.fillStyle = _gradient;
        _context.fillRect(0, 0, _width, _height);
        _gradient = _context.createLinearGradient(0, 0, 1, _height);
        _gradient.addColorStop(.01, 'rgba(0, 0, 0, 0)');
        _gradient.addColorStop(.99, '#000');
        _context.fillStyle = _gradient;
        _context.fillRect(0, 0, _width, _height);
      },
      setPosition: function(_arg) {
        var left, top;
        top = _arg.top, left = _arg.left;
        _selection.style['top'] = (top / _height) * 100 + '%';
        _selection.style['left'] = (left / _width) * 100 + '%';
      },
      getColorAtPosition: function(positionX, positionY) {
        var _data;
        _data = (_context.getImageData(positionX - 1, positionY - 1, 1, 1)).data;
        return {
          color: '#' + Convert.rgbToHex(_data),
          type: 'hex'
        };
      }
    };
  };

}).call(this);
