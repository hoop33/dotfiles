(function() {
  module.exports = function(colorPicker) {
    return {
      Emitter: (require('../modules/Emitter'))(),
      element: null,
      color: null,
      emitOutputFormat: function(format) {
        return this.Emitter.emit('outputFormat', format);
      },
      onOutputFormat: function(callback) {
        return this.Emitter.on('outputFormat', callback);
      },
      activate: function() {
        var hasChild, _isClicking;
        this.element = {
          el: (function() {
            var _classPrefix, _el;
            _classPrefix = colorPicker.element.el.className;
            _el = document.createElement('div');
            _el.classList.add("" + _classPrefix + "-color");
            return _el;
          })(),
          addClass: function(className) {
            this.el.classList.add(className);
            return this;
          },
          removeClass: function(className) {
            this.el.classList.remove(className);
            return this;
          },
          height: function() {
            return this.el.offsetHeight;
          },
          add: function(element) {
            this.el.appendChild(element);
            return this;
          },
          setColor: function(smartColor) {
            return this.el.style.backgroundColor = smartColor.toRGBA();
          }
        };
        colorPicker.element.add(this.element.el);
        setTimeout((function(_this) {
          return function() {
            var _newHeight;
            _newHeight = colorPicker.element.height() + _this.element.height();
            return colorPicker.element.setHeight(_newHeight);
          };
        })(this));
        hasChild = function(element, child) {
          var _parent;
          if (child && (_parent = child.parentNode)) {
            if (child === element) {
              return true;
            } else {
              return hasChild(element, _parent);
            }
          }
          return false;
        };
        _isClicking = false;
        colorPicker.onMouseDown((function(_this) {
          return function(e, isOnPicker) {
            if (!(isOnPicker && hasChild(_this.element.el, e.target))) {
              return;
            }
            e.preventDefault();
            return _isClicking = true;
          };
        })(this));
        colorPicker.onMouseMove(function(e) {
          return _isClicking = false;
        });
        colorPicker.onMouseUp((function(_this) {
          return function(e) {
            if (!_isClicking) {
              return;
            }
            colorPicker.replace(_this.color);
            return colorPicker.element.close();
          };
        })(this));
        colorPicker.onKeyDown((function(_this) {
          return function(e) {
            if (e.which !== 13) {
              return;
            }
            e.stopPropagation();
            return colorPicker.replace(_this.color);
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var Alpha;
            Alpha = colorPicker.getExtension('Alpha');
            Alpha.onColorChanged(function(smartColor) {
              _this.element.setColor((function() {
                if (smartColor) {
                  return smartColor;
                } else {
                  return colorPicker.SmartColor.HEX('#f00');
                }
              })());
            });
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var Alpha, Format, Return, setColor, _currentColor, _formatFormat, _inputColor, _text;
            Alpha = colorPicker.getExtension('Alpha');
            Return = colorPicker.getExtension('Return');
            Format = colorPicker.getExtension('Format');
            _text = document.createElement('p');
            _text.classList.add("" + _this.element.el.className + "-text");
            colorPicker.onBeforeOpen(function() {
              return _this.color = null;
            });
            _inputColor = null;
            colorPicker.onInputColor(function(smartColor, wasFound) {
              return _inputColor = wasFound ? smartColor : null;
            });
            _formatFormat = null;
            Format.onFormatChanged(function(format) {
              return _formatFormat = format;
            });
            colorPicker.onInputColor(function() {
              return _formatFormat = null;
            });
            setColor = function(smartColor) {
              var _format, _function, _outputColor, _preferredFormat;
              _preferredFormat = atom.config.get('color-picker.preferredFormat');
              _format = _formatFormat || (_inputColor != null ? _inputColor.format : void 0) || _preferredFormat || 'RGB';
              _function = smartColor.getAlpha() < 1 ? smartColor["to" + _format + "A"] || smartColor["to" + _format] : smartColor["to" + _format];
              _outputColor = (function() {
                if (_inputColor && (_inputColor.format === _format || _inputColor.format === ("" + _format + "A"))) {
                  if (smartColor.equals(_inputColor)) {
                    return _inputColor.value;
                  }
                }
                return _function.call(smartColor);
              })();
              if (_outputColor === _this.color) {
                return;
              }
              if (_inputColor && atom.config.get('color-picker.automaticReplace')) {
                colorPicker.replace(_outputColor);
              }
              _this.color = _outputColor;
              _text.innerText = _outputColor;
              return _this.emitOutputFormat(_format);
            };
            _currentColor = null;
            Alpha.onColorChanged(function(smartColor) {
              setColor(_currentColor = (function() {
                if (smartColor) {
                  return smartColor;
                } else {
                  return colorPicker.SmartColor.HEX('#f00');
                }
              })());
            });
            Format.onFormatChanged(function() {
              return setColor(_currentColor);
            });
            Return.onVisibility(function(visibility) {
              if (visibility) {
                return _this.element.addClass('is--returnVisible');
              } else {
                return _this.element.removeClass('is--returnVisible');
              }
            });
            return _this.element.add(_text);
          };
        })(this));
        return this;
      }
    };
  };

}).call(this);
