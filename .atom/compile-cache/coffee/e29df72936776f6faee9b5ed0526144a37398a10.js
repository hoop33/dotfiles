(function() {
  module.exports = function() {
    var COLOR_REGEXES, Convert, MATCH_ORDER, f, n, s;
    Convert = (require('./Convert'))();
    COLOR_REGEXES = {
      HSL: /hsl\s*?\(\s*([0-9]|[1-9][0-9]|[1|2][0-9][0-9]|3[0-5][0-9]|360)\s*?,\s*?([0-9]|[1-9][0-9]|100)\%?\s*?,\s*?([0-9]|[1-9][0-9]|100)\%?\s*\)/i,
      HSLA: /hsla\s*?\(\s*([0-9]|[1-9][0-9]|[1|2][0-9][0-9]|3[0-5][0-9]|360)\s*?,\s*?([0-9]|[1-9][0-9]|100)\%?\s*?,\s*?([0-9]|[1-9][0-9]|100)\%?\s*?,\s*?(0|1|1.0|0*\.\d+)\s*?\)/i,
      HSV: /hsv\s*?\(\s*([0-9]|[1-9][0-9]|[1|2][0-9][0-9]|3[0-5][0-9]|360)\s*?,\s*?([0-9]|[1-9][0-9]|100)\%?\s*?,\s*?([0-9]|[1-9][0-9]|100)\%?\s*\)/i,
      HSVA: /hsva\s*?\(\s*([0-9]|[1-9][0-9]|[1|2][0-9][0-9]|3[0-5][0-9]|360)\s*?,\s*?([0-9]|[1-9][0-9]|100)\%?\s*?,\s*?([0-9]|[1-9][0-9]|100)\%?\s*?,\s*?(0|1|1.0|0*\.\d+)\s*?\)/i,
      VEC: /vec3\s*?\(\s*?([0]?\.[0-9]*|1\.0|1|0)[f]?\s*?\,\s*?([0]?\.[0-9]*|1\.0|1|0)[f]?\s*?\,\s*?([0]?\.[0-9]*|1\.0|1|0)[f]?\s*?\)/i,
      VECA: /vec4\s*?\(\s*?([0]?\.[0-9]*|1\.0|1|0)[f]?\s*?\,\s*?([0]?\.[0-9]*|1\.0|1|0)[f]?\s*?\,\s*?([0]?\.[0-9]*|1\.0|1|0)[f]?\s*?\,\s*?([0]?\.[0-9]*|1\.0|1|0)[f]?\s*?\)/i,
      RGB: /rgb\s*?\(\s*?([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\s*?,\s*?([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\s*?,\s*?([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\s*?\)/i,
      RGBA: /rgba\s*?\(\s*?([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][<0-9]|25[0-5])\s*?,\s*?([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\s*?,\s*?([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\s*?,\s*?(0|1|1.0|0*\.\d+)\s*?\)/i,
      HEX: /(\#[a-f0-9]{6}|\#[a-f0-9]{3})/i,
      HEXA: /rgba\s*?\(\s*(\#[a-f0-9]{6}|\#[a-f0-9]{3})\s*?,\s*?(0|1|1.0|0*\.\d+)\s*?\)/i
    };
    MATCH_ORDER = ['HSL', 'HSLA', 'HSV', 'HSVA', 'VEC', 'VECA', 'RGB', 'RGBA', 'HEXA', 'HEX'];
    n = function(number) {
      number = "" + number;
      if (atom.config.get('color-picker.abbreviateValues')) {
        if (number[0] === '0' && number[1] === '.') {
          return number.substring(1);
        } else if ((parseFloat(number, 10)) === 1) {
          return '1';
        }
      }
      return number;
    };
    f = function(number) {
      number = "" + number;
      if (number[3] && number[3] === '0') {
        return number.substring(0, 3);
      }
      return number;
    };
    s = function(string) {
      if (atom.config.get('color-picker.abbreviateValues')) {
        return string.replace(/\s/g, '');
      }
      return string;
    };
    return {
      find: function(string) {
        var SmartColor, _colors, _fn, _format, _i, _j, _len, _len1, _match, _matches, _regExp;
        SmartColor = this;
        _colors = [];
        for (_i = 0, _len = MATCH_ORDER.length; _i < _len; _i++) {
          _format = MATCH_ORDER[_i];
          if (!(_regExp = COLOR_REGEXES[_format])) {
            continue;
          }
          _matches = string.match(new RegExp(_regExp.source, 'ig'));
          if (!_matches) {
            continue;
          }
          _fn = function(_format, _match) {
            var _index;
            if ((_index = string.indexOf(_match)) === -1) {
              return;
            }
            _colors.push({
              match: _match,
              format: _format,
              start: _index,
              end: _index + _match.length,
              getSmartColor: function() {
                return SmartColor[_format](_match);
              },
              isColor: true
            });
            return string = string.replace(_match, (new Array(_match.length + 1)).join(' '));
          };
          for (_j = 0, _len1 = _matches.length; _j < _len1; _j++) {
            _match = _matches[_j];
            _fn(_format, _match);
          }
        }
        return _colors;
      },
      color: function(format, value, RGBAArray) {
        return {
          format: format,
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
            return s("rgb(" + (this.toRGBArray().join(', ')) + ")");
          },
          toRGBArray: function() {
            return [this.RGBAArray[0], this.RGBAArray[1], this.RGBAArray[2]];
          },
          toRGBA: function() {
            var _rgbaArray;
            _rgbaArray = this.toRGBAArray();
            return s("rgba(" + _rgbaArray[0] + ", " + _rgbaArray[1] + ", " + _rgbaArray[2] + ", " + (n(_rgbaArray[3])) + ")");
          },
          toRGBAArray: function() {
            return this.RGBAArray;
          },
          toHSL: function() {
            var _hslArray;
            _hslArray = this.toHSLArray();
            return s("hsl(" + _hslArray[0] + ", " + _hslArray[1] + "%, " + _hslArray[2] + "%)");
          },
          toHSLArray: function() {
            return Convert.rgbToHsl(this.toRGBArray());
          },
          toHSLA: function() {
            var _hslaArray;
            _hslaArray = this.toHSLAArray();
            return s("hsla(" + _hslaArray[0] + ", " + _hslaArray[1] + "%, " + _hslaArray[2] + "%, " + (n(_hslaArray[3])) + ")");
          },
          toHSLAArray: function() {
            return this.toHSLArray().concat([this.getAlpha()]);
          },
          toHSV: function() {
            var _hsvArray;
            _hsvArray = this.toHSVArray();
            return s("hsv(" + (Math.round(_hsvArray[0])) + ", " + ((_hsvArray[1] * 100) << 0) + "%, " + ((_hsvArray[2] * 100) << 0) + "%)");
          },
          toHSVArray: function() {
            return Convert.rgbToHsv(this.toRGBArray());
          },
          toHSVA: function() {
            var _hsvaArray;
            _hsvaArray = this.toHSVAArray();
            return s("hsva(" + (Math.round(_hsvaArray[0])) + ", " + ((_hsvaArray[1] * 100) << 0) + "%, " + ((_hsvaArray[2] * 100) << 0) + "%, " + (n(_hsvaArray[3])) + ")");
          },
          toHSVAArray: function() {
            return this.toHSVArray().concat([this.getAlpha()]);
          },
          toVEC: function() {
            var _vecArray;
            _vecArray = this.toVECArray();
            return s("vec3(" + (f(_vecArray[0])) + ", " + (f(_vecArray[1])) + ", " + (f(_vecArray[2])) + ")");
          },
          toVECArray: function() {
            return Convert.rgbToVec(this.toRGBArray());
          },
          toVECA: function() {
            var _vecaArray;
            _vecaArray = this.toVECAArray();
            return s("vec4(" + (f(_vecaArray[0])) + ", " + (f(_vecaArray[1])) + ", " + (f(_vecaArray[2])) + ", " + (f(_vecaArray[3])) + ")");
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
            return s("rgba(" + (this.toHEX()) + ", " + (n(this.getAlpha())) + ")");
          }
        };
      },
      RGB: function(value) {
        return this.color('RGB', value, (function() {
          var _match;
          _match = value.match(COLOR_REGEXES.RGB);
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
          _match = value.match(COLOR_REGEXES.RGBA);
          return [parseInt(_match[1], 10), parseInt(_match[2], 10), parseInt(_match[3], 10)].concat([parseFloat(_match[4], 10)]);
        })());
      },
      RGBAArray: function(value) {
        return this.color('RGBAArray', value, value);
      },
      HSL: function(value) {
        return this.color('HSL', value, (function() {
          var _match;
          _match = value.match(COLOR_REGEXES.HSL);
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
          _match = value.match(COLOR_REGEXES.HSLA);
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
          _match = value.match(COLOR_REGEXES.HSV);
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
          _match = value.match(COLOR_REGEXES.HSVA);
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
          _match = value.match(COLOR_REGEXES.VEC);
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
          _match = value.match(COLOR_REGEXES.VECA);
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
          _match = value.match(COLOR_REGEXES.HEXA);
          return (Convert.hexToRgb(_match[1])).concat([parseFloat(_match[2], 10)]);
        })());
      }
    };
  };

}).call(this);
