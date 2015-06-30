(function() {
  var AlphaSelector, ColorPickerView, Convert, HueSelector, SaturationSelector, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  View = require('atom-space-pen-views').View;

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
      _position = _Editor.displayBuffer.pixelPositionForScreenPosition(_Editor.getCursorScreenPosition());
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
      _editor = atom.workspace.getActiveTextEditor();
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
      _editor = atom.workspace.getActiveTextEditor();
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
