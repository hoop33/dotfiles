(function() {
  var AlphaSelector, ColorPickerView, Convert, HueSelector, SaturationSelector, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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
      var c;
      c = 'ColorPicker-';
      return this.div({
        id: 'ColorPicker',
        "class": 'ColorPicker'
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
      (atom.workspaceView.find('.vertical')).append(this);
      SaturationSelector = require('./ColorPicker-saturationSelector');
      AlphaSelector = require('./ColorPicker-alphaSelector');
      HueSelector = require('./ColorPicker-hueSelector');
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

    ColorPickerView.prototype.isOpen = false;

    ColorPickerView.prototype.reset = function() {
      this.addClass('is--visible is--initial');
      this.removeClass('no--arrow is--pointer is--searching');
      (this.find('#ColorPicker-color')).css('background-color', '').css('border-bottom-color', '');
      return (this.find('#ColorPicker-value')).attr('data-variable', '').html('');
    };

    ColorPickerView.prototype.open = function() {
      var _colorPickerHeight, _colorPickerWidth, _gutterWidth, _halfColorPickerWidth, _left, _pane, _paneOffset, _paneZero, _position, _scroll, _scrollbar, _selectedColor, _tabBarHeight, _top, _view, _viewHeight, _viewWidth;
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
      _pane = atom.workspaceView.getActivePaneView();
      _paneZero = (_pane && _pane[0]) || {
        offsetTop: 0,
        offsetLeft: 0
      };
      _paneOffset = {
        top: _paneZero.offsetTop,
        left: _paneZero.offsetLeft
      };
      _tabBarHeight = (_pane.find('.tab-bar')).height();
      this.storage.activeView = _view = _pane.activeView;
      _position = _view.pixelPositionForScreenPosition(_view.getEditor().getCursorScreenPosition());
      _gutterWidth = (_view.find('.gutter')).width();
      _scroll = {
        top: _view.scrollTop(),
        left: _view.scrollLeft()
      };
      _scrollbar = _view.find('.vertical-scrollbar');
      if (_scrollbar) {
        _scrollbar.on('scroll.color-picker', (function(_this) {
          return function() {
            return _this.scroll();
          };
        })(this));
      }
      _top = 15 + _position.top - _scroll.top + _view.lineHeight + _tabBarHeight;
      _left = _position.left - _scroll.left + _gutterWidth;
      _viewWidth = _view.width();
      _viewHeight = _view.height();
      if (_top + _colorPickerHeight - 15 > _viewHeight) {
        _top = _viewHeight + _tabBarHeight - _colorPickerHeight - 20;
        this.addClass('no--arrow');
      }
      _top += _paneOffset.top;
      if (_left + _halfColorPickerWidth > _viewWidth) {
        _left = _viewWidth - _halfColorPickerWidth - 20;
        this.addClass('no--arrow');
      }
      _left += _paneOffset.left - _halfColorPickerWidth;
      return this.css('top', Math.max(20, _top)).css('left', Math.max(20, _left));
    };

    ColorPickerView.prototype.close = function() {
      this.isOpen = false;
      this.removeClass('is--visible is--initial is--searching is--error');
      if (!(this.storage.activeView && this.storage.activeView.verticalScrollbar)) {
        return;
      }
      return this.storage.activeView.verticalScrollbar.off('scroll.color-picker');
    };

    ColorPickerView.prototype.error = function() {
      this.storage.selectedColor = null;
      return this.removeClass('is--searching').addClass('is--error');
    };

    ColorPickerView.prototype.scroll = function() {
      if (this.isOpen) {
        return this.close();
      }
    };

    ColorPickerView.prototype.bind = function() {
      var $body;
      window.onresize = (function(_this) {
        return function() {
          if (_this.isOpen) {
            return _this.close();
          }
        };
      })(this);
      atom.workspaceView.on('pane:active-item-changed', (function(_this) {
        return function() {
          return _this.close();
        };
      })(this));
      $body = this.parents('body');
      (function(_this) {
        return (function() {
          return $body.on('mousedown', function(e) {
            var _className, _color, _pointer, _target;
            _target = e.target;
            _className = _target.className;
            if (!/ColorPicker/.test(_className)) {
              return _this.close();
            }
            _color = _this.storage.selectedColor;
            switch (_className) {
              case 'ColorPicker-color':
                if ((_color != null ? _color.hasOwnProperty('pointer') : void 0) && (_pointer = _color.pointer)) {
                  (atom.workspace.open(_pointer.filePath))["finally"](function() {
                    var _editor;
                    _editor = atom.workspace.activePaneItem;
                    _editor.clearSelections();
                    return _editor.setSelectedBufferRange(_pointer.range);
                  });
                } else {
                  _this.replaceColor();
                }
                return _this.close();
              case 'ColorPicker-initialWrapper':
                _this.inputColor(_color);
                return _this.addClass('is--initial');
            }
          }).on('keydown', function(e) {
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
          var _isGrabbingSaturationSelection;
          _isGrabbingSaturationSelection = false;
          return $body.on('mousedown mousemove mouseup', function(e) {
            var _offset, _offsetX, _offsetY;
            _offset = SaturationSelector.$el.offset();
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
          });
        });
      })(this)();
      (function(_this) {
        return (function() {
          var _isGrabbingAlphaSelection;
          _isGrabbingAlphaSelection = false;
          return $body.on('mousedown mousemove mouseup', function(e) {
            var _offsetTop, _offsetY;
            _offsetTop = AlphaSelector.$el.offset().top;
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
          });
        });
      })(this)();
      return (function(_this) {
        return function() {
          var _isGrabbingHueSelection;
          _isGrabbingHueSelection = false;
          return $body.on('mousedown mousemove mouseup', function(e) {
            var _offsetTop, _offsetY;
            _offsetTop = HueSelector.$el.offset().top;
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
          });
        };
      })(this)();
    };

    ColorPickerView.prototype.setSaturation = function(positionX, positionY) {
      var _percentageLeft, _percentageTop;
      this.storage.saturation.x = positionX;
      this.storage.saturation.y = positionY;
      _percentageTop = (positionY / SaturationSelector.height) * 100;
      _percentageLeft = (positionX / SaturationSelector.width) * 100;
      return SaturationSelector.$selection.css('top', _percentageTop + '%').css('left', _percentageLeft + '%');
    };

    ColorPickerView.prototype.refreshSaturationCanvas = function() {
      var _color;
      _color = HueSelector.getColorAtPosition(this.storage.hue);
      return SaturationSelector.render(_color.color);
    };

    ColorPickerView.prototype.setAlpha = function(positionY) {
      this.storage.alpha = positionY;
      return AlphaSelector.$selection.css('top', (positionY / AlphaSelector.height) * 100 + '%');
    };

    ColorPickerView.prototype.refreshAlphaCanvas = function() {
      var _color, _saturation;
      _saturation = this.storage.saturation;
      _color = SaturationSelector.getColorAtPosition(_saturation.x, _saturation.y);
      return AlphaSelector.render(Convert.hexToRgb(_color.color));
    };

    ColorPickerView.prototype.setHue = function(positionY) {
      this.storage.hue = positionY;
      return HueSelector.$selection.css('top', (positionY / HueSelector.height) * 100 + '%');
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
        return this.removeClass('is--searching').find('#ColorPicker-value').attr('data-variable', color.match);
      }
    };

    ColorPickerView.prototype.refreshColor = function(trigger) {
      if (trigger === 'hue') {
        this.refreshSaturationCanvas();
      }
      if (trigger === 'hue' || trigger === 'saturation') {
        this.refreshAlphaCanvas();
      }
      return this.setColor(void 0, this.storage.selectedColor.type);
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
      return this.setColor(color);
    };

    ColorPickerView.prototype.selectColor = function() {
      var _color, _editor;
      _color = this.storage.selectedColor;
      _editor = atom.workspace.getActiveEditor();
      if (!_color) {
        return;
      }
      _editor.clearSelections();
      return _editor.addSelectionForBufferRange({
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
      return _editor.addSelectionForBufferRange({
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBR0k7QUFBQSxNQUFBLDhFQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxNQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBQ0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSx1QkFBUixDQURWLENBQUE7O0FBQUEsRUFHQSxrQkFBQSxHQUFxQixJQUhyQixDQUFBOztBQUFBLEVBSUEsV0FBQSxHQUFjLElBSmQsQ0FBQTs7QUFBQSxFQUtBLGFBQUEsR0FBZ0IsSUFMaEIsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBQ25CLHNDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLGVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO0FBQ04sVUFBQSxDQUFBO0FBQUEsTUFBQSxDQUFBLEdBQUksY0FBSixDQUFBO2FBRUEsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsRUFBQSxFQUFJLGFBQUo7QUFBQSxRQUFtQixPQUFBLEVBQU8sYUFBMUI7T0FBTCxFQUE4QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQzFDLFVBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsRUFBQSxFQUFJLEVBQUEsR0FBeEIsQ0FBd0IsR0FBTyxRQUFYO0FBQUEsWUFBb0IsT0FBQSxFQUFPLEVBQUEsR0FBL0MsQ0FBK0MsR0FBTyxRQUFsQztXQUFMLEVBQWdELFNBQUEsR0FBQTtBQUM1QyxZQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxFQUFBLEdBQS9CLENBQStCLEdBQU8sV0FBZDthQUFMLENBQUEsQ0FBQTtBQUFBLFlBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLEVBQUEsR0FBL0Is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
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/color-picker/lib/ColorPicker-view.coffee