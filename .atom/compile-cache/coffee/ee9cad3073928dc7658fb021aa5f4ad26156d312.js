(function() {
  module.exports = function() {
    var ColorRegexes, Convert, n, value, _i, _len, _ref;
    ColorRegexes = {};
    _ref = require('./ColorRegexes');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      value = _ref[_i];
      ColorRegexes[value.type] = value.regex;
    }
    Convert = (require('./Convert'))();
    n = function(number) {
      number = "" + number;
      if (atom.config.get('color-picker.abbreviateValues')) {
        if (number[0] === '0' && number[1] === '.') {
          number = number.substring(1);
        }
      }
      return number;
    };
    return {
      color: function(type, value, RGBAArray) {
        return {
          type: type,
          value: value,
          RGBAArray: RGBAArray,
          equals: function(smartColor) {
            if (!smartColor) {
              return false;
            }
            return smartColor.RGBAArray[0] === this.RGBAArray[0] && smartColor.RGBAArray[1] === this.RGBAArray[1] && smartColor.RGBAArray[2] === this.RGBAArray[2] && smartColor.RGBAArray[3] === this.RGBAArray[3];
          },
          getAlpha: function() {
            return this.RGBAArray[3];
          },
          toRGB: function() {
            return "rgb(" + (this.toRGBArray().join(', ')) + ")";
          },
          toRGBArray: function() {
            return [this.RGBAArray[0], this.RGBAArray[1], this.RGBAArray[2]];
          },
          toRGBA: function() {
            var _rgbaArray;
            _rgbaArray = this.toRGBAArray();
            return "rgba(" + _rgbaArray[0] + ", " + _rgbaArray[1] + ", " + _rgbaArray[2] + ", " + (n(_rgbaArray[3])) + ")";
          },
          toRGBAArray: function() {
            return this.RGBAArray;
          },
          toHSL: function() {
            var _hslArray;
            _hslArray = this.toHSLArray();
            return "hsl(" + _hslArray[0] + ", " + _hslArray[1] + "%, " + _hslArray[2] + "%)";
          },
          toHSLArray: function() {
            return Convert.rgbToHsl(this.toRGBArray());
          },
          toHSLA: function() {
            var _hslaArray;
            _hslaArray = this.toHSLAArray();
            return "hsla(" + _hslaArray[0] + ", " + _hslaArray[1] + "%, " + _hslaArray[2] + "%, " + (n(_hslaArray[3])) + ")";
          },
          toHSLAArray: function() {
            return this.toHSLArray().concat([this.getAlpha()]);
          },
          toHSV: function() {
            var _hsvArray;
            _hsvArray = this.toHSVArray();
            return "hsv(" + (Math.round(_hsvArray[0])) + ", " + ((_hsvArray[1] * 100) << 0) + "%, " + ((_hsvArray[2] * 100) << 0) + "%)";
          },
          toHSVArray: function() {
            return Convert.rgbToHsv(this.toRGBArray());
          },
          toHSVA: function() {
            var _hsvaArray;
            _hsvaArray = this.toHSVAArray();
            return "hsva(" + (Math.round(_hsvaArray[0])) + ", " + ((_hsvaArray[1] * 100) << 0) + "%, " + ((_hsvaArray[2] * 100) << 0) + "%, " + (n(_hsvaArray[3])) + ")";
          },
          toHSVAArray: function() {
            return this.toHSVArray().concat([this.getAlpha()]);
          },
          toVEC: function() {
            var _vecArray;
            _vecArray = this.toVECArray();
            return "vec3(" + _vecArray[0] + ", " + _vecArray[1] + ", " + _vecArray[2] + ")";
          },
          toVECArray: function() {
            return Convert.rgbToVec(this.toRGBArray());
          },
          toVECA: function() {
            var _vecaArray;
            _vecaArray = this.toVECAArray();
            return "vec4(" + _vecaArray[0] + ", " + _vecaArray[1] + ", " + _vecaArray[2] + ", " + (n(_vecaArray[3])) + ")";
          },
          toVECAArray: function() {
            return this.toVECArray().concat([this.getAlpha()]);
          },
          toHEX: function() {
            var _hex;
            _hex = Convert.rgbToHex(this.RGBAArray);
            if (atom.config.get('color-picker.abbreviateValues')) {
              if (_hex[0] === _hex[1] && _hex[2] === _hex[3] && _hex[4] === _hex[5]) {
                _hex = "" + _hex[0] + _hex[2] + _hex[4];
              }
            }
            if (atom.config.get('color-picker.uppercaseColorValues')) {
              _hex = _hex.toUpperCase();
            }
            return '#' + _hex;
          },
          toHEXA: function() {
            return "rgba(" + (this.toHEX()) + ", " + (n(this.getAlpha())) + ")";
          }
        };
      },
      RGB: function(value) {
        return this.color('RGB', value, (function() {
          var _match;
          _match = value.match(new RegExp(ColorRegexes['rgb'].source, 'i'));
          return [parseInt(_match[1], 10), parseInt(_match[2], 10), parseInt(_match[3], 10)].concat([1]);
        })());
      },
      RGBArray: function(value) {
        return this.color('RGBArray', value, (function() {
          return value.concat([1]);
        })());
      },
      RGBA: function(value) {
        return this.color('RGBA', value, (function() {
          var _match;
          _match = value.match(new RegExp(ColorRegexes['rgba'].source, 'i'));
          return [parseInt(_match[1], 10), parseInt(_match[2], 10), parseInt(_match[3], 10)].concat([parseFloat(_match[4], 10)]);
        })());
      },
      RGBAArray: function(value) {
        return this.color('RGBAArray', value, value);
      },
      HSL: function(value) {
        return this.color('HSL', value, (function() {
          var _match;
          _match = value.match(new RegExp(ColorRegexes['hsl'].source, 'i'));
          return (Convert.hslToRgb([parseInt(_match[1], 10), parseInt(_match[2], 10), parseInt(_match[3], 10)])).concat([1]);
        })());
      },
      HSLArray: function(value) {
        return this.color('HSLArray', value, (function() {
          return (Convert.hslToRgb(value)).concat([1]);
        })());
      },
      HSLA: function(value) {
        return this.color('HSLA', value, (function() {
          var _match;
          _match = value.match(new RegExp(ColorRegexes['hsla'].source, 'i'));
          return (Convert.hslToRgb([parseInt(_match[1], 10), parseInt(_match[2], 10), parseInt(_match[3], 10)])).concat([parseFloat(_match[4], 10)]);
        })());
      },
      HSLAArray: function(value) {
        return this.color('HSLAArray', value, (function() {
          return (Convert.hslToRgb(value)).concat([value[3]]);
        })());
      },
      HSV: function(value) {
        return this.color('HSV', value, (function() {
          var _match;
          _match = value.match(new RegExp(ColorRegexes['hsv'].source, 'i'));
          return (Convert.hsvToRgb([parseInt(_match[1], 10), parseInt(_match[2], 10), parseInt(_match[3], 10)])).concat([1]);
        })());
      },
      HSVArray: function(value) {
        return this.color('HSVArray', value, (function() {
          return (Convert.hsvToRgb(value)).concat([1]);
        })());
      },
      HSVA: function(value) {
        return this.color('HSVA', value, (function() {
          var _match;
          _match = value.match(new RegExp(ColorRegexes['hsva'].source, 'i'));
          return (Convert.hsvToRgb([parseInt(_match[1], 10), parseInt(_match[2], 10), parseInt(_match[3], 10)])).concat([parseFloat(_match[4], 10)]);
        })());
      },
      HSVAArray: function(value) {
        return this.color('HSVAArray', value, (function() {
          return (Convert.hsvToRgb(value)).concat([value[3]]);
        })());
      },
      VEC: function(value) {
        return this.color('VEC', value, (function() {
          var _match;
          _match = value.match(new RegExp(ColorRegexes['vec3'].source, 'i'));
          return (Convert.vecToRgb([(parseFloat(_match[1], 10)).toFixed(2), (parseFloat(_match[2], 10)).toFixed(2), (parseFloat(_match[3], 10)).toFixed(2)])).concat([1]);
        })());
      },
      VECArray: function(value) {
        return this.color('VECArray', value, (function() {
          return (Convert.vecToRgb(value)).concat([1]);
        })());
      },
      VECA: function(value) {
        return this.color('VECA', value, (function() {
          var _match;
          _match = value.match(new RegExp(ColorRegexes['vec4'].source, 'i'));
          return (Convert.vecToRgb([(parseFloat(_match[1], 10)).toFixed(2), (parseFloat(_match[2], 10)).toFixed(2), (parseFloat(_match[3], 10)).toFixed(2)])).concat([parseFloat(_match[4], 10)]);
        })());
      },
      VECAArray: function(value) {
        return this.color('VECAArray', value, (function() {
          return (Convert.vecToRgb(value)).concat([value[3]]);
        })());
      },
      HEX: function(value) {
        return this.color('HEX', value, (function() {
          return (Convert.hexToRgb(value)).concat([1]);
        })());
      },
      HEXA: function(value) {
        return this.color('HEXA', value, (function() {
          var _match;
          _match = value.match(new RegExp(ColorRegexes['hexa'].source, 'i'));
          return (Convert.hexToRgb(_match[1])).concat([parseFloat(_match[2], 10)]);
        })());
      }
    };
  };

}).call(this);
