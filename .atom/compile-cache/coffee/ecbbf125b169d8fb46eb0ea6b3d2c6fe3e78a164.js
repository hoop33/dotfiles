(function() {
  module.exports = function() {
    return {
      hexToRgb: function(hex) {
        hex = hex.replace('#', '');
        if (hex.length === 3) {
          hex = hex.replace(/(.)(.)(.)/, "$1$1$2$2$3$3");
        }
        return [parseInt(hex.substr(0, 2), 16), parseInt(hex.substr(2, 2), 16), parseInt(hex.substr(4, 2), 16)];
      },
      hexaToRgb: function(hexa) {
        return this.hexToRgb((hexa.match(/rgba\((\#.+),/))[1]);
      },
      hexToHsl: function(hex) {
        return this.rgbToHsl(this.hexToRgb(hex.replace('#', '')));
      },
      rgbToHex: function(rgb) {
        var _componentToHex;
        _componentToHex = function(component) {
          var _hex;
          _hex = component.toString(16);
          if (_hex.length === 1) {
            return "0" + _hex;
          } else {
            return _hex;
          }
        };
        return [_componentToHex(rgb[0]), _componentToHex(rgb[1]), _componentToHex(rgb[2])].join('');
      },
      rgbToHsl: function(_arg) {
        var b, g, r, _d, _h, _l, _max, _min, _s;
        r = _arg[0], g = _arg[1], b = _arg[2];
        r /= 255;
        g /= 255;
        b /= 255;
        _max = Math.max(r, g, b);
        _min = Math.min(r, g, b);
        _l = (_max + _min) / 2;
        if (_max === _min) {
          return [0, 0, Math.floor(_l * 100)];
        }
        _d = _max - _min;
        _s = _l > 0.5 ? _d / (2 - _max - _min) : _d / (_max + _min);
        switch (_max) {
          case r:
            _h = (g - b) / _d + (g < b ? 6 : 0);
            break;
          case g:
            _h = (b - r) / _d + 2;
            break;
          case b:
            _h = (r - g) / _d + 4;
        }
        _h /= 6;
        return [Math.floor(_h * 360), Math.floor(_s * 100), Math.floor(_l * 100)];
      },
      rgbToHsv: function(_arg) {
        var b, computedH, computedS, computedV, d, g, h, maxRGB, minRGB, r;
        r = _arg[0], g = _arg[1], b = _arg[2];
        computedH = 0;
        computedS = 0;
        computedV = 0;
        if ((r == null) || (g == null) || (b == null) || isNaN(r) || isNaN(g) || isNaN(b)) {
          return;
        }
        if (r < 0 || g < 0 || b < 0 || r > 255 || g > 255 || b > 255) {
          return;
        }
        r = r / 255;
        g = g / 255;
        b = b / 255;
        minRGB = Math.min(r, Math.min(g, b));
        maxRGB = Math.max(r, Math.max(g, b));
        if (minRGB === maxRGB) {
          computedV = minRGB;
          return [0, 0, computedV];
        }
        d = (r === minRGB ? g - b : (b === minRGB ? r - g : b - r));
        h = (r === minRGB ? 3 : (b === minRGB ? 1 : 5));
        computedH = 60 * (h - d / (maxRGB - minRGB));
        computedS = (maxRGB - minRGB) / maxRGB;
        computedV = maxRGB;
        return [computedH, computedS, computedV];
      },
      hsvToHsl: function(_arg) {
        var h, s, v;
        h = _arg[0], s = _arg[1], v = _arg[2];
        return [h, s * v / ((h = (2 - s) * v) < 1 ? h : 2 - h), h / 2];
      },
      hsvToRgb: function(_arg) {
        var h, s, v, _f, _i, _p, _q, _result, _t;
        h = _arg[0], s = _arg[1], v = _arg[2];
        h /= 60;
        s /= 100;
        v /= 100;
        if (s === 0) {
          return [Math.round(v * 255), Math.round(v * 255), Math.round(v * 255)];
        }
        _i = Math.floor(h);
        _f = h - _i;
        _p = v * (1 - s);
        _q = v * (1 - s * _f);
        _t = v * (1 - s * (1 - _f));
        _result = (function() {
          switch (_i) {
            case 0:
              return [v, _t, _p];
            case 1:
              return [_q, v, _p];
            case 2:
              return [_p, v, _t];
            case 3:
              return [_p, _q, v];
            case 4:
              return [_t, _p, v];
            case 5:
              return [v, _p, _q];
            default:
              return [v, _t, _p];
          }
        })();
        return [Math.round(_result[0] * 255), Math.round(_result[1] * 255), Math.round(_result[2] * 255)];
      },
      hslToHsv: function(_arg) {
        var h, l, s;
        h = _arg[0], s = _arg[1], l = _arg[2];
        s /= 100;
        l /= 100;
        s *= l < .5 ? l : 1 - l;
        return [h, (2 * s / (l + s)) || 0, l + s];
      },
      hslToRgb: function(input) {
        var h, s, v, _ref;
        _ref = this.hslToHsv(input), h = _ref[0], s = _ref[1], v = _ref[2];
        return this.hsvToRgb([h, s * 100, v * 100]);
      },
      vecToRgb: function(input) {
        return [(input[0] * 255) << 0, (input[1] * 255) << 0, (input[2] * 255) << 0];
      },
      rgbToVec: function(input) {
        return [(input[0] / 255).toFixed(2), (input[1] / 255).toFixed(2), (input[2] / 255).toFixed(2)];
      }
    };
  };

}).call(this);
