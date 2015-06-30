(function() {
  var AlphaSelector, ColorPickerView, Convert, HueSelector, SaturationSelector, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  View = require('atom').View;

  Convert = require('./ColorPicker-convert');

  SaturationSelector = null;

  HueSelector = null;

  AlphaSelector = null;

  module.exports = ColorPickerView = (function(_super) {
    __extends(ColorPickerView, _super);

    function ColorPickerView() {
      return ColorPickerView.__super__.constructor.apply(this, arguments);
    }

    ColorPickerView.content = function() {
      var c, i;
      i = 'ColorPicker';
      c = "" + i + "-";
      return this.div({
        id: i,
        "class": i
      }, (function(_this) {
        return function() {
          _this.div({
            id: "" + c + "loader",
            "class": "" + c + "loader"
          }, function() {
            _this.div({
              "class": "" + c + "loaderDot"
            });
            _this.div({
              "class": "" + c + "loaderDot"
            });
            return _this.div({
              "class": "" + c + "loaderDot"
            });
          });
          _this.div({
            id: "" + c + "color",
            "class": "" + c + "color"
          }, function() {
            return _this.div({
              id: "" + c + "value",
              "class": "" + c + "value"
            });
          });
          _this.div({
            id: "" + c + "initialWrapper",
            "class": "" + c + "initialWrapper"
          }, function() {
            return _this.div({
              id: "" + c + "initial",
              "class": "" + c + "initial"
            });
          });
          return _this.div({
            id: "" + c + "picker",
            "class": "" + c + "picker"
          }, function() {
            _this.div({
              id: "" + c + "saturationSelectorWrapper",
              "class": "" + c + "saturationSelectorWrapper"
            }, function() {
              _this.div({
                id: "" + c + "saturationSelection",
                "class": "" + c + "saturationSelection"
              });
              return _this.canvas({
                id: "" + c + "saturationSelector",
                "class": "" + c + "saturationSelector",
                width: '180px',
                height: '180px'
              });
            });
            _this.div({
              id: "" + c + "alphaSelectorWrapper",
              "class": "" + c + "alphaSelectorWrapper"
            }, function() {
              _this.div({
                id: "" + c + "alphaSelection",
                "class": "" + c + "alphaSelection"
              });
              return _this.canvas({
                id: "" + c + "alphaSelector",
                "class": "" + c + "alphaSelector",
                width: '20px',
                height: '180px'
              });
            });
            return _this.div({
              id: "" + c + "hueSelectorWrapper",
              "class": "" + c + "hueSelectorWrapper"
            }, function() {
              _this.div({
                id: "" + c + "hueSelection",
                "class": "" + c + "hueSelection"
              });
              return _this.canvas({
                id: "" + c + "hueSelector",
                "class": "" + c + "hueSelector",
                width: '20px',
                height: '180px'
              });
            });
          });
        };
      })(this));
    };

    ColorPickerView.prototype.initialize = function() {
      atom.views.getView(atom.workspace).querySelector('.vertical').appendChild(this.element);
      SaturationSelector = (require('./ColorPicker-saturationSelector'))(this.element);
      AlphaSelector = (require('./ColorPicker-alphaSelector'))(this.element);
      HueSelector = (require('./ColorPicker-hueSelector'))(this.element);
      HueSelector.render();
      return this.bind();
    };

    ColorPickerView.prototype.destroy = function() {
      this.close();
      this.remove();
      return this.detach();
    };

    ColorPickerView.prototype.storage = {
      activeView: null,
      selectedColor: null,
      pickedColor: null,
      saturation: {
        x: 0,
        y: 0
      },
      hue: 0,
      alpha: 0
    };

    ColorPickerView.prototype.reset = function() {
      this.addClass('is--visible is--initial');
      this.removeClass('no--arrow is--pointer is--searching');
      (this.find('#ColorPicker-color')).css('background-color', '').css('border-bottom-color', '');
      (this.find('#ColorPicker-value')).attr('data-variable', '').html('');
    };

    ColorPickerView.prototype.isOpen = false;

    ColorPickerView.prototype.open = function() {
      var _Editor, _ScrollView, _colorPickerHeight, _colorPickerWidth, _halfColorPickerWidth, _left, _offset, _position, _selectedColor, _top, _viewHeight, _viewWidth;
      this.isOpen = true;
      _selectedColor = this.storage.selectedColor;
      if (!_selectedColor || _selectedColor.hasOwnProperty('pointer')) {
        this.addClass('is--pointer');
      }
      if (!_selectedColor) {
        this.addClass('is--searching');
      }
      _colorPickerWidth = this.width();
      _colorPickerHeight = this.height();
      _halfColorPickerWidth = _colorPickerWidth / 2;
      _Editor = atom.workspace.getActiveTextEditor();
      _ScrollView = (atom.views.getView(_Editor)).shadowRoot.querySelector('.scroll-view');
      _position = _Editor.pixelPositionForScreenPosition(_Editor.getCursorScreenPosition());
      _offset = this.getOffsetWith(atom.views.getView(atom.workspace.getActivePane()), _ScrollView);
      _top = 15 + _position.top - _Editor.$scrollTop.value + _Editor.$lineHeightInPixels.value + _offset.top;
      _left = _position.left - _Editor.$scrollLeft.value + _offset.left - _halfColorPickerWidth;
      _viewWidth = _Editor.$width.value;
      _viewHeight = _Editor.$height.value;
      if (_top + _colorPickerHeight - 15 > _viewHeight) {
        _top = _viewHeight + _offset.top - _colorPickerHeight - 20;
        this.addClass('no--arrow');
      }
      if (_left + _colorPickerWidth > _viewWidth) {
        _left = _viewWidth + _offset.left - _colorPickerWidth - 20;
        this.addClass('no--arrow');
      }
      if (_top < 20) {
        this.addClass('no--arrow');
      }
      if (_left < 20) {
        this.addClass('no--arrow');
      }
      this.css('top', Math.max(20, _top)).css('left', Math.max(20, _left));
    };

    ColorPickerView.prototype.close = function() {
      this.isOpen = false;
      return this.removeClass('is--visible is--initial is--searching is--error');
    };

    ColorPickerView.prototype.error = function() {
      this.storage.selectedColor = null;
      this.removeClass('is--searching').addClass('is--error');
    };

    ColorPickerView.prototype.scroll = function() {
      if (this.isOpen) {
        return this.close();
      }
    };

    ColorPickerView.prototype.getOffsetWith = function(target, element) {
      var _el, _offset;
      _el = element;
      _offset = {
        top: 0,
        left: 0
      };
      while (!((_el === target) || !_el)) {
        _offset.top += _el.offsetTop;
        _offset.left += _el.offsetLeft;
        _el = _el.offsetParent;
      }
      _offset.top += target.offsetTop;
      _offset.left += target.offsetLeft;
      return _offset;
    };

    ColorPickerView.prototype.bind = function() {
      var Emitter, bindScroll, _editor, _i, _len, _ref, _workspace;
      _workspace = atom.workspace;
      Emitter = {
        bindings: {},
        emit: function() {
          var args, event, _bindings, _callback, _i, _len;
          event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
          if (!(_bindings = this.bindings[event])) {
            return;
          }
          for (_i = 0, _len = _bindings.length; _i < _len; _i++) {
            _callback = _bindings[_i];
            _callback.apply(null, args);
          }
        },
        on: function(event, callback) {
          if (!this.bindings[event]) {
            this.bindings[event] = [];
          }
          this.bindings[event].push(callback);
        },
        onMouseDown: function(callback) {
          return this.on('mousedown', callback);
        },
        onMouseMove: function(callback) {
          return this.on('mousemove', callback);
        },
        onMouseUp: function(callback) {
          return this.on('mouseup', callback);
        }
      };
      window.addEventListener('mousedown', function(e) {
        return Emitter.emit('mousedown', e);
      });
      window.addEventListener('mousemove', function(e) {
        return Emitter.emit('mousemove', e);
      });
      window.addEventListener('mouseup', function(e) {
        return Emitter.emit('mouseup', e);
      });
      window.onresize = (function(_this) {
        return function() {
          return _this.close();
        };
      })(this);
      _workspace.getActivePane().onDidChangeActiveItem((function(_this) {
        return function() {
          return _this.close();
        };
      })(this));
      bindScroll = (function(_this) {
        return function(editor) {
          return editor.onDidChangeScrollTop(function() {
            return _this.close();
          });
        };
      })(this);
      _ref = atom.workspace.getTextEditors();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _editor = _ref[_i];
        bindScroll(_editor);
      }
      _workspace.onDidAddTextEditor((function(_this) {
        return function(_arg) {
          var textEditor;
          textEditor = _arg.textEditor;
          return bindScroll(textEditor);
        };
      })(this));
      (function(_this) {
        return (function() {
          Emitter.onMouseDown(function(e) {
            var _className, _color, _pointer, _target;
            _target = e.target;
            _className = _target.className;
            if ((_className.split('-'))[0] !== 'ColorPicker') {
              return _this.close();
            }
            _color = _this.storage.selectedColor;
            switch (_className) {
              case 'ColorPicker-color':
                if ((_color != null ? _color.hasOwnProperty('pointer') : void 0) && (_pointer = _color.pointer)) {
                  (atom.workspace.open(_pointer.filePath))["finally"](function() {
                    _editor = atom.workspace.activePaneItem;
                    _editor.clearSelections();
                    _editor.setSelectedBufferRange(_pointer.range);
                    return _editor.scrollToCursorPosition();
                  });
                } else {
                  _this.replaceColor();
                }
                return _this.close();
              case 'ColorPicker-initialWrapper':
                _this.inputColor(_color);
                return _this.addClass('is--initial');
            }
          });
          atom.views.getView(_workspace).addEventListener('keydown', function(e) {
            if (!_this.isOpen) {
              return;
            }
            if (e.which !== 13) {
              return _this.close();
            }
            e.preventDefault();
            e.stopPropagation();
            _this.replaceColor();
            return _this.close();
          });
        });
      })(this)();
      (function(_this) {
        return (function() {
          var updateSaturationSelection, _isGrabbingSaturationSelection;
          _isGrabbingSaturationSelection = false;
          updateSaturationSelection = function(e) {
            var _offset, _offsetX, _offsetY;
            if (!_this.isOpen) {
              return;
            }
            _offset = _this.getOffsetWith(_this.element.offsetParent, SaturationSelector.el);
            _offsetY = Math.max(1, Math.min(SaturationSelector.height, e.pageY - _offset.top));
            _offsetX = Math.max(1, Math.min(SaturationSelector.width, e.pageX - _offset.left));
            switch (e.type) {
              case 'mousedown':
                if (e.target.className !== 'ColorPicker-saturationSelector') {
                  return;
                }
                e.preventDefault();
                _isGrabbingSaturationSelection = true;
                break;
              case 'mousemove':
                if (!_isGrabbingSaturationSelection) {
                  return;
                }
                e.preventDefault();
                break;
              case 'mouseup':
                _isGrabbingSaturationSelection = false;
            }
            if (!_isGrabbingSaturationSelection) {
              return;
            }
            _this.setSaturation(_offsetX, _offsetY);
            return _this.refreshColor('saturation');
          };
          Emitter.onMouseDown(updateSaturationSelection);
          Emitter.onMouseMove(updateSaturationSelection);
          Emitter.onMouseUp(updateSaturationSelection);
        });
      })(this)();
      (function(_this) {
        return (function() {
          var updateAlphaSelector, _isGrabbingAlphaSelection;
          _isGrabbingAlphaSelection = false;
          updateAlphaSelector = function(e) {
            var _offsetTop, _offsetY;
            if (!_this.isOpen) {
              return;
            }
            _offsetTop = (_this.getOffsetWith(_this.element.offsetParent, AlphaSelector.el)).top;
            _offsetY = Math.max(1, Math.min(AlphaSelector.height, e.pageY - _offsetTop));
            switch (e.type) {
              case 'mousedown':
                if (e.target.className !== 'ColorPicker-alphaSelector') {
                  return;
                }
                e.preventDefault();
                _isGrabbingAlphaSelection = true;
                break;
              case 'mousemove':
                if (!_isGrabbingAlphaSelection) {
                  return;
                }
                e.preventDefault();
                break;
              case 'mouseup':
                _isGrabbingAlphaSelection = false;
            }
            if (!_isGrabbingAlphaSelection) {
              return;
            }
            _this.setAlpha(_offsetY);
            return _this.refreshColor('alpha');
          };
          Emitter.onMouseDown(updateAlphaSelector);
          Emitter.onMouseMove(updateAlphaSelector);
          Emitter.onMouseUp(updateAlphaSelector);
        });
      })(this)();
      (function(_this) {
        return (function() {
          var updateHueControls, _isGrabbingHueSelection;
          _isGrabbingHueSelection = false;
          updateHueControls = function(e) {
            var _offsetTop, _offsetY;
            if (!_this.isOpen) {
              return;
            }
            _offsetTop = (_this.getOffsetWith(_this.element.offsetParent, HueSelector.el)).top;
            _offsetY = Math.max(1, Math.min(HueSelector.height, e.pageY - _offsetTop));
            switch (e.type) {
              case 'mousedown':
                if (e.target.className !== 'ColorPicker-hueSelector') {
                  return;
                }
                e.preventDefault();
                _isGrabbingHueSelection = true;
                break;
              case 'mousemove':
                if (!_isGrabbingHueSelection) {
                  return;
                }
                e.preventDefault();
                break;
              case 'mouseup':
                _isGrabbingHueSelection = false;
            }
            if (!_isGrabbingHueSelection) {
              return;
            }
            _this.setHue(_offsetY);
            return _this.refreshColor('hue');
          };
          Emitter.onMouseDown(updateHueControls);
          Emitter.onMouseMove(updateHueControls);
          Emitter.onMouseUp(updateHueControls);
        });
      })(this)();
    };

    ColorPickerView.prototype.setSaturation = function(positionX, positionY) {
      this.storage.saturation.x = positionX;
      this.storage.saturation.y = positionY;
      SaturationSelector.setPosition({
        top: positionY,
        left: positionX
      });
    };

    ColorPickerView.prototype.refreshSaturationCanvas = function() {
      var _color;
      _color = HueSelector.getColorAtPosition(this.storage.hue);
      SaturationSelector.render(_color.color);
    };

    ColorPickerView.prototype.setAlpha = function(positionY) {
      this.storage.alpha = positionY;
      AlphaSelector.setPosition({
        top: positionY
      });
    };

    ColorPickerView.prototype.refreshAlphaCanvas = function() {
      var _color, _saturation;
      _saturation = this.storage.saturation;
      _color = SaturationSelector.getColorAtPosition(_saturation.x, _saturation.y);
      AlphaSelector.render(Convert.hexToRgb(_color.color));
    };

    ColorPickerView.prototype.setHue = function(positionY) {
      this.storage.hue = positionY;
      HueSelector.setPosition({
        top: positionY
      });
    };

    ColorPickerView.prototype.setColor = function(color, preferredColorType) {
      var _alphaFactor, _alphaValue, _color, _displayColor, _h, _hexRgbFragments, _hsl, _l, _rgb, _s, _saturation, _setInitialColor;
      if (!color) {
        this.removeClass('is--initial');
      } else {
        _setInitialColor = true;
      }
      _saturation = this.storage.saturation;
      if (color == null) {
        color = SaturationSelector.getColorAtPosition(_saturation.x, _saturation.y);
      }
      _color = _displayColor = color.color;
      _alphaValue = 100 - (((this.storage.alpha / AlphaSelector.height) * 100) << 0);
      _alphaFactor = _alphaValue / 100;
      if (preferredColorType) {
        if (preferredColorType === 'hsl' || preferredColorType === 'hsla') {
          _hsl = Convert.hsvToHsl(Convert.rgbToHsv(Convert.hexToRgb(_color)));
          _h = _hsl[0] << 0;
          _s = (_hsl[1] * 100) << 0;
          _l = (_hsl[2] * 100) << 0;
        } else {
          _hexRgbFragments = (Convert.hexToRgb(_color)).join(', ');
        }
        if (_alphaValue === 100) {
          _displayColor = (function() {
            switch (preferredColorType) {
              case 'rgb':
              case 'rgba':
                return "rgb(" + _hexRgbFragments + ")";
              case 'hsl':
              case 'hsla':
                return "hsl(" + _h + ", " + _s + "%, " + _l + "%)";
              default:
                return _color;
            }
          })();
        } else {
          _displayColor = (function() {
            switch (preferredColorType) {
              case 'rgb':
              case 'rgba':
              case 'hex':
                return "rgba(" + _hexRgbFragments + ", " + _alphaFactor + ")";
              case 'hexa':
                return "rgba(" + _color + ", " + _alphaFactor + ")";
              case 'hsl':
              case 'hsla':
                return "hsla(" + _h + ", " + _s + "%, " + _l + "%, " + _alphaFactor + ")";
            }
          })();
        }
      }
      if (_alphaValue !== 100) {
        _rgb = (function() {
          switch (color.type) {
            case 'hexa':
              return Convert.hexaToRgb(_color);
            case 'hex':
              return Convert.hexToRgb(_color);
            case 'rgb':
              return _color;
          }
        })();
        if (_rgb) {
          _color = "rgba(" + (_rgb.join(', ')) + ", " + _alphaFactor + ")";
        }
      }
      this.storage.pickedColor = _displayColor;
      (this.find('#ColorPicker-color')).css('background-color', _color).css('border-bottom-color', _color);
      (this.find('#ColorPicker-value')).html(_displayColor);
      if (_setInitialColor) {
        (this.find('#ColorPicker-initial')).css('background-color', _color).html(_displayColor);
      }
      if (color.hasOwnProperty('pointer')) {
        this.removeClass('is--searching').find('#ColorPicker-value').attr('data-variable', color.match);
      }
    };

    ColorPickerView.prototype.refreshColor = function(trigger) {
      if (trigger === 'hue') {
        this.refreshSaturationCanvas();
      }
      if (trigger === 'hue' || trigger === 'saturation') {
        this.refreshAlphaCanvas();
      }
      this.setColor(void 0, this.storage.selectedColor.type);
    };

    ColorPickerView.prototype.inputColor = function(color) {
      var _alpha, _color, _hasClass, _hsv, _saturationX, _saturationY;
      if (!this) {
        return;
      }
      _hasClass = this[0].className.match(/(is\-\-color\_(\w+))\s/);
      if (_hasClass) {
        this.removeClass(_hasClass[1]);
      }
      this.addClass("is--color_" + color.type);
      _color = color.color;
      _hsv = (function() {
        switch (color.type) {
          case 'hex':
            return Convert.rgbToHsv(Convert.hexToRgb(_color));
          case 'hexa':
            return Convert.rgbToHsv(Convert.hexaToRgb(_color));
          case 'rgb':
          case 'rgba':
            return Convert.rgbToHsv(_color);
          case 'hsl':
          case 'hsla':
            return Convert.hslToHsv([parseInt(color.regexMatch[1], 10), (parseInt(color.regexMatch[2], 10)) / 100, (parseInt(color.regexMatch[3], 10)) / 100]);
        }
      })();
      if (!_hsv) {
        return;
      }
      this.setHue((HueSelector.height / 360) * _hsv[0]);
      _saturationX = Math.max(1, SaturationSelector.width * _hsv[1]);
      _saturationY = Math.max(1, SaturationSelector.height * (1 - _hsv[2]));
      this.setSaturation(_saturationX, _saturationY);
      this.refreshSaturationCanvas();
      _alpha = (function() {
        switch (color.type) {
          case 'rgba':
            return color.regexMatch[7];
          case 'hexa':
            return color.regexMatch[4];
          case 'hsla':
            return color.regexMatch[4];
        }
      })();
      if (_alpha) {
        this.setAlpha(AlphaSelector.height * (1 - parseFloat(_alpha)));
      } else if (!_alpha) {
        this.setAlpha(0);
      }
      this.refreshAlphaCanvas();
      this.setColor(color);
    };

    ColorPickerView.prototype.selectColor = function() {
      var _color, _editor;
      _color = this.storage.selectedColor;
      _editor = atom.workspace.getActiveEditor();
      if (!_color) {
        return;
      }
      _editor.clearSelections();
      _editor.addSelectionForBufferRange({
        start: {
          column: _color.index,
          row: _color.row
        },
        end: {
          column: _color.end,
          row: _color.row
        }
      });
    };

    ColorPickerView.prototype.replaceColor = function() {
      var _color, _editor, _newColor;
      _color = this.storage.selectedColor;
      _newColor = this.storage.pickedColor;
      _editor = atom.workspace.getActiveEditor();
      if (!_color) {
        return;
      }
      this.selectColor();
      _editor.replaceSelectedText(null, (function(_this) {
        return function() {
          return _newColor;
        };
      })(this));
      _editor.clearSelections();
      _editor.addSelectionForBufferRange({
        start: {
          column: _color.index,
          row: _color.row
        },
        end: {
          column: _color.index + _newColor.length,
          row: _color.row
        }
      });
    };

    return ColorPickerView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBSUk7QUFBQSxNQUFBLDhFQUFBO0lBQUE7O3NCQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsTUFBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQUEsR0FBVSxPQUFBLENBQVEsdUJBQVIsQ0FEVixDQUFBOztBQUFBLEVBR0Esa0JBQUEsR0FBcUIsSUFIckIsQ0FBQTs7QUFBQSxFQUlBLFdBQUEsR0FBYyxJQUpkLENBQUE7O0FBQUEsRUFLQSxhQUFBLEdBQWdCLElBTGhCLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNuQixzQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxlQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTtBQUNOLFVBQUEsSUFBQTtBQUFBLE1BQUEsQ0FBQSxHQUFJLGFBQUosQ0FBQTtBQUFBLE1BQ0EsQ0FBQSxHQUFJLEVBQUEsR0FBZixDQUFlLEdBQU8sR0FEWCxDQUFBO2FBR0EsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsRUFBQSxFQUFJLENBQUo7QUFBQSxRQUFPLE9BQUEsRUFBTyxDQUFkO09BQUwsRUFBc0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNsQixVQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLEVBQUEsRUFBSSxFQUFBLEdBQXhCLENBQXdCLEdBQU8sUUFBWDtBQUFBLFlBQW9CLE9BQUEsRUFBTyxFQUFBLEdBQS9DLENBQStDLEdBQU8sUUFBbEM7V0FBTCxFQUFnRCxTQUFBLEdBQUE7QUFDNUMsWUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sRUFBQSxHQUEvQixDQUErQixHQUFPLFdBQWQ7YUFBTCxDQUFBLENBQUE7QUFBQSxZQUNBLEtB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
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/color-picker/lib/ColorPicker-view.coffee