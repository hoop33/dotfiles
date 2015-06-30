(function() {
  var AlphaSelector, ColorPicker, ColorPickerView, Convert, HueSelector, SaturationSelector, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom').View;

  Convert = require('./ColorPicker-convert');

  ColorPicker = null;

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
      ColorPicker = require('./ColorPicker');
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
      var _colorPickerHeight, _colorPickerWidth, _gutterWidth, _halfColorPickerWidth, _left, _pane, _paneOffset, _position, _scroll, _scrollbar, _selectedColor, _tabBarHeight, _top, _view, _viewHeight, _viewWidth;
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
      _pane = atom.workspace.getActivePane()._view;
      _paneOffset = {
        top: _pane[0].offsetTop,
        left: _pane[0].offsetLeft
      };
      _tabBarHeight = (_pane.find('.tab-bar')).height();
      this.storage.activeView = _view = _pane.activeView;
      _position = _view.pixelPositionForScreenPosition(_view.getEditor().getCursorScreenPosition());
      _gutterWidth = (_view.find('.gutter')).width();
      _scroll = {
        top: _view.scrollTop(),
        left: _view.scrollLeft()
      };
      _scrollbar = _view.verticalScrollbar;
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBR0k7QUFBQSxNQUFBLDJGQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBRSxPQUFTLE9BQUEsQ0FBUSxNQUFSLEVBQVQsSUFBRixDQUFBOztBQUFBLEVBQ0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSx1QkFBUixDQURWLENBQUE7O0FBQUEsRUFHQSxXQUFBLEdBQWMsSUFIZCxDQUFBOztBQUFBLEVBSUEsa0JBQUEsR0FBcUIsSUFKckIsQ0FBQTs7QUFBQSxFQUtBLFdBQUEsR0FBYyxJQUxkLENBQUE7O0FBQUEsRUFNQSxhQUFBLEdBQWdCLElBTmhCLENBQUE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNuQixzQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxlQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTtBQUNOLFVBQUEsQ0FBQTtBQUFBLE1BQUEsQ0FBQSxHQUFJLGNBQUosQ0FBQTthQUVBLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLEVBQUEsRUFBSSxhQUFKO0FBQUEsUUFBbUIsT0FBQSxFQUFPLGFBQTFCO09BQUwsRUFBOEMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUMxQyxVQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLEVBQUEsRUFBSSxFQUFBLEdBQXhCLENBQXdCLEdBQU8sUUFBWDtBQUFBLFlBQW9CLE9BQUEsRUFBTyxFQUFBLEdBQS9DLENBQStDLEdBQU8sUUFBbEM7V0FBTCxFQUFnRCxTQUFBLEdBQUE7QUFDNUMsWUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sRUFBQSxHQUEvQixDQUErQixHQUFPLFdBQWQ7YUFBTCxDQUFBLENBQUE7QUFBQSxZQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7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
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/color-picker/lib/ColorPicker-view.coffee