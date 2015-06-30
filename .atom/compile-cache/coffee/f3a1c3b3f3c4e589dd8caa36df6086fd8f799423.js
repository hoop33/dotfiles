(function() {
  module.exports = function(picker) {
    var Convert, _context, _el, _height, _hexes, _hexesLength, _selection, _width;
    Convert = require('./ColorPicker-convert');
    _hexes = ['#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF', '#FF0000'];
    _hexesLength = _hexes.length;
    _el = picker.querySelector('#ColorPicker-hueSelector');
    _selection = picker.querySelector('#ColorPicker-hueSelection');
    _context = _el.getContext('2d');
    _width = _el.offsetWidth;
    _height = _el.offsetHeight;
    return {
      el: _el,
      width: _width,
      height: _height,
      render: function() {
        var hex, i, _gradient, _i, _len, _step;
        _gradient = _context.createLinearGradient(0, 0, 1, _height);
        _step = 1 / (_hexesLength - 1);
        for (i = _i = 0, _len = _hexes.length; _i < _len; i = ++_i) {
          hex = _hexes[i];
          _gradient.addColorStop(_step * i, hex);
        }
        _context.fillStyle = _gradient;
        _context.fillRect(0, 0, _width, _height);
      },
      setPosition: function(_arg) {
        var top;
        top = _arg.top;
        _selection.style['top'] = (top / _height) * 100 + '%';
      },
      getColorAtPosition: function(positionY) {
        var _data;
        _data = (_context.getImageData(1, positionY - 1, 1, 1)).data;
        return {
          color: '#' + Convert.rgbToHex(_data),
          type: 'hex'
        };
      }
    };
  };

}).call(this);
