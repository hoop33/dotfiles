(function() {
  module.exports = function(colorPicker) {
    return {
      element: null,
      activate: function() {
        var _halfArrowWidth;
        _halfArrowWidth = null;
        this.element = {
          el: (function() {
            var _classPrefix, _el;
            _classPrefix = colorPicker.element.el.className;
            _el = document.createElement('div');
            _el.classList.add("" + _classPrefix + "-arrow");
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
          width: function() {
            return this.el.offsetWidth;
          },
          height: function() {
            return this.el.offsetHeight;
          },
          setPosition: function(x) {
            this.el.style.left = "" + x + "px";
            return this;
          },
          setColor: function(smartColor) {
            this.el.style.borderTopColor = (typeof smartColor.toRGBA === "function" ? smartColor.toRGBA() : void 0) || 'none';
            return this.el.style.borderBottomColor = (typeof smartColor.toRGBA === "function" ? smartColor.toRGBA() : void 0) || 'none';
          }
        };
        colorPicker.element.add(this.element.el);
        setTimeout((function(_this) {
          return function() {
            return _halfArrowWidth = (_this.element.width() / 2) << 0;
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var _newHeight;
            _newHeight = colorPicker.element.height() + _this.element.height();
            return colorPicker.element.setHeight(_newHeight);
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var Alpha;
            Alpha = colorPicker.getExtension('Alpha');
            Alpha.onColorChanged(function(smartColor) {
              if (smartColor) {
                return _this.element.setColor(smartColor);
              } else {
                return colorPicker.SmartColor.HEX('#f00');
              }
            });
          };
        })(this));
        colorPicker.onInputVariable((function(_this) {
          return function() {
            return _this.element.setColor(colorPicker.SmartColor.RGBAArray([0, 0, 0, 0]));
          };
        })(this));
        colorPicker.onInputVariableColor((function(_this) {
          return function(smartColor) {
            if (!smartColor) {
              return;
            }
            return _this.element.setColor(smartColor);
          };
        })(this));
        colorPicker.onPositionChange((function(_this) {
          return function(position, colorPickerPosition) {
            return _this.element.setPosition(position.x - colorPickerPosition.x);
          };
        })(this));
        return this;
      }
    };
  };

}).call(this);
