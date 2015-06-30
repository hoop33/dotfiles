(function() {
  module.exports = function(colorPicker) {
    return {
      Emitter: (require('../modules/Emitter'))(),
      element: null,
      control: null,
      canvas: null,
      emitSelectionChanged: function() {
        return this.Emitter.emit('selectionChanged', this.control.selection);
      },
      onSelectionChanged: function(callback) {
        return this.Emitter.on('selectionChanged', callback);
      },
      emitColorChanged: function() {
        return this.Emitter.emit('colorChanged', this.control.selection.color);
      },
      onColorChanged: function(callback) {
        return this.Emitter.on('colorChanged', callback);
      },
      activate: function() {
        var Body;
        Body = colorPicker.getExtension('Body');
        this.element = {
          el: (function() {
            var _classPrefix, _el;
            _classPrefix = Body.element.el.className;
            _el = document.createElement('div');
            _el.classList.add("" + _classPrefix + "-saturation");
            return _el;
          })(),
          width: 0,
          height: 0,
          getWidth: function() {
            return this.width || this.el.offsetWidth;
          },
          getHeight: function() {
            return this.height || this.el.offsetHeight;
          },
          rect: null,
          getRect: function() {
            return this.rect || this.updateRect();
          },
          updateRect: function() {
            return this.rect = this.el.getClientRects()[0];
          },
          add: function(element) {
            this.el.appendChild(element);
            return this;
          }
        };
        Body.element.add(this.element.el, 0);
        colorPicker.onOpen((function(_this) {
          return function() {
            var _rect;
            if (!(_this.element.updateRect() && (_rect = _this.element.getRect()))) {
              return;
            }
            _this.width = _rect.width;
            return _this.height = _rect.height;
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var Hue, Saturation, _elementHeight, _elementWidth;
            Saturation = _this;
            Hue = colorPicker.getExtension('Hue');
            _elementWidth = _this.element.getWidth();
            _elementHeight = _this.element.getHeight();
            _this.canvas = {
              el: (function() {
                var _el;
                _el = document.createElement('canvas');
                _el.width = _elementWidth;
                _el.height = _elementHeight;
                _el.classList.add("" + Saturation.element.el.className + "-canvas");
                return _el;
              })(),
              context: null,
              getContext: function() {
                return this.context || (this.context = this.el.getContext('2d'));
              },
              getColorAtPosition: function(x, y) {
                return colorPicker.SmartColor.HSVArray([Hue.getHue(), x / Saturation.element.getWidth() * 100, 100 - (y / Saturation.element.getHeight() * 100)]);
              },
              render: function(smartColor) {
                var _context, _gradient, _hslArray;
                _hslArray = ((function() {
                  if (!smartColor) {
                    return colorPicker.SmartColor.HEX('#f00');
                  } else {
                    return smartColor;
                  }
                })()).toHSLArray();
                _context = this.getContext();
                _context.clearRect(0, 0, _elementWidth, _elementHeight);
                _gradient = _context.createLinearGradient(0, 0, _elementWidth, 1);
                _gradient.addColorStop(.01, 'hsl(0, 100%, 100%)');
                _gradient.addColorStop(.99, "hsl(" + _hslArray[0] + ", 100%, 50%)");
                _context.fillStyle = _gradient;
                _context.fillRect(0, 0, _elementWidth, _elementHeight);
                _gradient = _context.createLinearGradient(0, 0, 1, _elementHeight);
                _gradient.addColorStop(.01, 'rgba(0, 0, 0, 0)');
                _gradient.addColorStop(.99, 'rgba(0, 0, 0, 1)');
                _context.fillStyle = _gradient;
                _context.fillRect(0, 0, _elementWidth, _elementHeight);
              }
            };
            Hue.onColorChanged(function(smartColor) {
              return _this.canvas.render(smartColor);
            });
            _this.canvas.render();
            return _this.element.add(_this.canvas.el);
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var Hue, Saturation, hasChild;
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
            Saturation = _this;
            Hue = colorPicker.getExtension('Hue');
            _this.control = {
              el: (function() {
                var _el;
                _el = document.createElement('div');
                _el.classList.add("" + Saturation.element.el.className + "-control");
                return _el;
              })(),
              isGrabbing: false,
              selection: {
                x: null,
                y: 0,
                color: null
              },
              setSelection: function(e, saturation, key) {
                var _position, _rect, _x, _y;
                if (saturation == null) {
                  saturation = null;
                }
                if (key == null) {
                  key = null;
                }
                if (!(Saturation.canvas && (_rect = Saturation.element.getRect()))) {
                  return;
                }
                if (e) {
                  _x = e.pageX - _rect.left;
                  _y = e.pageY - _rect.top;
                } else if ((typeof saturation === 'number') && (typeof key === 'number')) {
                  _x = _rect.width * saturation;
                  _y = _rect.height * key;
                } else {
                  if (typeof this.selection.x !== 'number') {
                    this.selection.x = _rect.width;
                  }
                  _x = this.selection.x;
                  _y = this.selection.y;
                }
                _x = this.selection.x = Math.max(0, Math.min(_rect.width, _x));
                _y = this.selection.y = Math.max(0, Math.min(_rect.height, _y));
                _position = {
                  x: Math.max(6, Math.min(_rect.width - 7, _x)),
                  y: Math.max(6, Math.min(_rect.height - 7, _y))
                };
                this.selection.color = Saturation.canvas.getColorAtPosition(_x, _y);
                requestAnimationFrame((function(_this) {
                  return function() {
                    _this.el.style.left = "" + _position.x + "px";
                    return _this.el.style.top = "" + _position.y + "px";
                  };
                })(this));
                return Saturation.emitSelectionChanged();
              },
              refreshSelection: function() {
                return this.setSelection();
              }
            };
            _this.control.refreshSelection();
            colorPicker.onInputColor(function(smartColor) {
              var h, s, v, _ref;
              _ref = smartColor.toHSVArray(), h = _ref[0], s = _ref[1], v = _ref[2];
              return _this.control.setSelection(null, s, 1 - v);
            });
            Saturation.onSelectionChanged(function() {
              return Saturation.emitColorChanged();
            });
            colorPicker.onOpen(function() {
              return _this.control.refreshSelection();
            });
            colorPicker.onOpen(function() {
              return _this.control.isGrabbing = false;
            });
            colorPicker.onClose(function() {
              return _this.control.isGrabbing = false;
            });
            Hue.onColorChanged(function() {
              return _this.control.refreshSelection();
            });
            colorPicker.onMouseDown(function(e, isOnPicker) {
              if (!(isOnPicker && hasChild(Saturation.element.el, e.target))) {
                return;
              }
              e.preventDefault();
              _this.control.isGrabbing = true;
              return _this.control.setSelection(e);
            });
            colorPicker.onMouseMove(function(e) {
              if (!_this.control.isGrabbing) {
                return;
              }
              return _this.control.setSelection(e);
            });
            colorPicker.onMouseUp(function(e) {
              if (!_this.control.isGrabbing) {
                return;
              }
              _this.control.isGrabbing = false;
              return _this.control.setSelection(e);
            });
            return _this.element.add(_this.control.el);
          };
        })(this));
        return this;
      }
    };
  };

}).call(this);
