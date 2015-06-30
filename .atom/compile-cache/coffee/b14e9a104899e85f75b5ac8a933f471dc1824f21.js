(function() {
  module.exports = function(colorPicker) {
    return {
      element: null,
      activate: function() {
        this.element = {
          el: (function() {
            var _classPrefix, _el;
            _classPrefix = colorPicker.element.el.className;
            _el = document.createElement('div');
            _el.classList.add("" + _classPrefix + "-body");
            return _el;
          })(),
          height: function() {
            return this.el.offsetHeight;
          },
          add: function(element, weight) {
            if (weight) {
              if (weight > this.el.children.length) {
                this.el.appendChild(element);
              } else {
                this.el.insertBefore(element, this.el.children[weight]);
              }
            } else {
              this.el.appendChild(element);
            }
            return this;
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
        return this;
      }
    };
  };

}).call(this);
