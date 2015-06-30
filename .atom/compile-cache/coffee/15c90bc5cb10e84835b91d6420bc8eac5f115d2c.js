(function() {
  module.exports = function(colorPicker) {
    return {
      Emitter: (require('../modules/Emitter'))(),
      element: null,
      color: null,
      emitVisibility: function(visible) {
        if (visible == null) {
          visible = true;
        }
        return this.Emitter.emit('visible', visible);
      },
      onVisibility: function(callback) {
        return this.Emitter.on('visible', callback);
      },
      activate: function() {
        var View, hasChild, _isClicking;
        View = this;
        this.element = {
          el: (function() {
            var _classPrefix, _el;
            _classPrefix = colorPicker.element.el.className;
            _el = document.createElement('div');
            _el.classList.add("" + _classPrefix + "-return");
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
          hasClass: function(className) {
            return this.el.classList.contains(className);
          },
          hide: function() {
            this.removeClass('is--visible');
            return View.emitVisibility(false);
          },
          show: function() {
            this.addClass('is--visible');
            return View.emitVisibility(true);
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
            if (!(_isClicking && _this.color)) {
              return;
            }
            return colorPicker.emitInputColor(_this.color);
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var Alpha;
            Alpha = colorPicker.getExtension('Alpha');
            colorPicker.onBeforeOpen(function() {
              return _this.color = null;
            });
            colorPicker.onInputColor(function(smartColor, wasFound) {
              if (wasFound) {
                return _this.color = smartColor;
              }
            });
            Alpha.onColorChanged(function(smartColor) {
              if (!_this.color) {
                return _this.element.hide();
              }
              if (smartColor.equals(_this.color)) {
                return _this.element.hide();
              } else {
                return _this.element.show();
              }
            });
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            colorPicker.onInputColor(function(smartColor, wasFound) {
              if (wasFound) {
                return _this.element.setColor(smartColor);
              }
            });
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var setColor, _text;
            _text = document.createElement('p');
            _text.classList.add("" + _this.element.el.className + "-text");
            setColor = function(smartColor) {
              return _text.innerText = smartColor.value;
            };
            colorPicker.onInputColor(function(smartColor, wasFound) {
              if (wasFound) {
                return setColor(smartColor);
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
