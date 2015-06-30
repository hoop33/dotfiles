(function() {
  var Delete, Join, Mark, Operator, OperatorError, OperatorWithInput, Point, Range, Repeat, ToggleCase, Utils, ViewModel, Yank, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  _ref = require('atom'), Point = _ref.Point, Range = _ref.Range;

  ViewModel = require('../view-models/view-model').ViewModel;

  Utils = require('../utils');

  OperatorError = (function() {
    function OperatorError(message) {
      this.message = message;
      this.name = 'Operator Error';
    }

    return OperatorError;

  })();

  Operator = (function() {
    Operator.prototype.vimState = null;

    Operator.prototype.motion = null;

    Operator.prototype.complete = null;

    Operator.prototype.selectOptions = null;

    function Operator(editor, vimState, _arg) {
      this.editor = editor;
      this.vimState = vimState;
      this.selectOptions = (_arg != null ? _arg : {}).selectOptions;
      this.complete = false;
    }

    Operator.prototype.isComplete = function() {
      return this.complete;
    };

    Operator.prototype.isRecordable = function() {
      return true;
    };

    Operator.prototype.compose = function(motion) {
      if (!motion.select) {
        throw new OperatorError('Must compose with a motion');
      }
      this.motion = motion;
      return this.complete = true;
    };

    Operator.prototype.canComposeWith = function(operation) {
      return operation.select != null;
    };

    Operator.prototype.setTextRegister = function(register, text) {
      var type, _ref1;
      if ((_ref1 = this.motion) != null ? typeof _ref1.isLinewise === "function" ? _ref1.isLinewise() : void 0 : void 0) {
        type = 'linewise';
        if (text.slice(-1) !== '\n') {
          text += '\n';
        }
      } else {
        type = Utils.copyType(text);
      }
      return this.vimState.setRegister(register, {
        text: text,
        type: type
      });
    };

    return Operator;

  })();

  OperatorWithInput = (function(_super) {
    __extends(OperatorWithInput, _super);

    function OperatorWithInput(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.editor = this.editor;
      this.complete = false;
    }

    OperatorWithInput.prototype.canComposeWith = function(operation) {
      return (operation.characters != null) || (operation.select != null);
    };

    OperatorWithInput.prototype.compose = function(operation) {
      if (operation.select != null) {
        this.motion = operation;
      }
      if (operation.characters != null) {
        this.input = operation;
        return this.complete = true;
      }
    };

    return OperatorWithInput;

  })(Operator);

  Delete = (function(_super) {
    __extends(Delete, _super);

    Delete.prototype.register = '"';

    Delete.prototype.allowEOL = null;

    function Delete(editor, vimState, _arg) {
      var _base, _ref1;
      this.editor = editor;
      this.vimState = vimState;
      _ref1 = _arg != null ? _arg : {}, this.allowEOL = _ref1.allowEOL, this.selectOptions = _ref1.selectOptions;
      this.complete = false;
      if (this.selectOptions == null) {
        this.selectOptions = {};
      }
      if ((_base = this.selectOptions).requireEOL == null) {
        _base.requireEOL = true;
      }
    }

    Delete.prototype.execute = function(count) {
      var cursor, text, _base, _i, _len, _ref1;
      if (_.contains(this.motion.select(count, this.selectOptions), true)) {
        text = this.editor.getSelectedText();
        this.setTextRegister(this.register, text);
        this.editor["delete"]();
        _ref1 = this.editor.getCursors();
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          cursor = _ref1[_i];
          if (typeof (_base = this.motion).isLinewise === "function" ? _base.isLinewise() : void 0) {
            cursor.moveToBeginningOfLine();
          } else {
            if (cursor.isAtEndOfLine()) {
              cursor.moveLeft();
            }
          }
        }
      }
      return this.vimState.activateCommandMode();
    };

    return Delete;

  })(Operator);

  ToggleCase = (function(_super) {
    __extends(ToggleCase, _super);

    function ToggleCase(editor, vimState, _arg) {
      this.editor = editor;
      this.vimState = vimState;
      this.selectOptions = (_arg != null ? _arg : {}).selectOptions;
      this.complete = true;
    }

    ToggleCase.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      if (this.vimState.mode === 'visual') {
        this.editor.replaceSelectedText({}, function(text) {
          return text.split('').map(function(char) {
            var lower;
            lower = char.toLowerCase();
            if (char === lower) {
              return char.toUpperCase();
            } else {
              return lower;
            }
          }).join('');
        });
      } else {
        this.editor.transact((function(_this) {
          return function() {
            var cursor, cursorCount, lineLength, point, _i, _len, _ref1, _results;
            _ref1 = _this.editor.getCursors();
            _results = [];
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              cursor = _ref1[_i];
              point = cursor.getBufferPosition();
              lineLength = _this.editor.lineTextForBufferRow(point.row).length;
              cursorCount = Math.min(count, lineLength - point.column);
              _results.push(_.times(cursorCount, function() {
                var char, range;
                point = cursor.getBufferPosition();
                range = Range.fromPointWithDelta(point, 0, 1);
                char = _this.editor.getTextInBufferRange(range);
                if (char === char.toLowerCase()) {
                  _this.editor.setTextInBufferRange(range, char.toUpperCase());
                } else {
                  _this.editor.setTextInBufferRange(range, char.toLowerCase());
                }
                if (!(point.column >= lineLength - 1)) {
                  return cursor.moveRight();
                }
              }));
            }
            return _results;
          };
        })(this));
      }
      return this.vimState.activateCommandMode();
    };

    return ToggleCase;

  })(Operator);

  Yank = (function(_super) {
    __extends(Yank, _super);

    function Yank() {
      return Yank.__super__.constructor.apply(this, arguments);
    }

    Yank.prototype.register = '"';

    Yank.prototype.execute = function(count) {
      var i, newPositions, originalPosition, originalPositions, startPositions, text;
      originalPositions = this.editor.getCursorBufferPositions();
      if (_.contains(this.motion.select(count), true)) {
        text = this.editor.getSelectedText();
        startPositions = _.pluck(this.editor.getSelectedBufferRanges(), "start");
        newPositions = (function() {
          var _base, _i, _len, _results;
          _results = [];
          for (i = _i = 0, _len = originalPositions.length; _i < _len; i = ++_i) {
            originalPosition = originalPositions[i];
            if (startPositions[i] && (this.vimState.mode === 'visual' || !(typeof (_base = this.motion).isLinewise === "function" ? _base.isLinewise() : void 0))) {
              _results.push(Point.min(startPositions[i], originalPositions[i]));
            } else {
              _results.push(originalPosition);
            }
          }
          return _results;
        }).call(this);
      } else {
        text = '';
        newPositions = originalPositions;
      }
      this.setTextRegister(this.register, text);
      this.editor.setSelectedBufferRanges(newPositions.map(function(p) {
        return new Range(p, p);
      }));
      return this.vimState.activateCommandMode();
    };

    return Yank;

  })(Operator);

  Join = (function(_super) {
    __extends(Join, _super);

    function Join(editor, vimState, _arg) {
      this.editor = editor;
      this.vimState = vimState;
      this.selectOptions = (_arg != null ? _arg : {}).selectOptions;
      this.complete = true;
    }

    Join.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      this.editor.transact((function(_this) {
        return function() {
          return _.times(count, function() {
            return _this.editor.joinLines();
          });
        };
      })(this));
      return this.vimState.activateCommandMode();
    };

    return Join;

  })(Operator);

  Repeat = (function(_super) {
    __extends(Repeat, _super);

    function Repeat(editor, vimState, _arg) {
      this.editor = editor;
      this.vimState = vimState;
      this.selectOptions = (_arg != null ? _arg : {}).selectOptions;
      this.complete = true;
    }

    Repeat.prototype.isRecordable = function() {
      return false;
    };

    Repeat.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return this.editor.transact((function(_this) {
        return function() {
          return _.times(count, function() {
            var cmd;
            cmd = _this.vimState.history[0];
            return cmd != null ? cmd.execute() : void 0;
          });
        };
      })(this));
    };

    return Repeat;

  })(Operator);

  Mark = (function(_super) {
    __extends(Mark, _super);

    function Mark(editor, vimState, _arg) {
      this.editor = editor;
      this.vimState = vimState;
      this.selectOptions = (_arg != null ? _arg : {}).selectOptions;
      Mark.__super__.constructor.call(this, this.editor, this.vimState);
      this.viewModel = new ViewModel(this, {
        "class": 'mark',
        singleChar: true,
        hidden: true
      });
    }

    Mark.prototype.execute = function() {
      this.vimState.setMark(this.input.characters, this.editor.getCursorBufferPosition());
      return this.vimState.activateCommandMode();
    };

    return Mark;

  })(OperatorWithInput);

  module.exports = {
    Operator: Operator,
    OperatorWithInput: OperatorWithInput,
    OperatorError: OperatorError,
    Delete: Delete,
    ToggleCase: ToggleCase,
    Yank: Yank,
    Join: Join,
    Repeat: Repeat,
    Mark: Mark
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlJQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLE9BQWlCLE9BQUEsQ0FBUSxNQUFSLENBQWpCLEVBQUMsYUFBQSxLQUFELEVBQVEsYUFBQSxLQURSLENBQUE7O0FBQUEsRUFFQyxZQUFhLE9BQUEsQ0FBUSwyQkFBUixFQUFiLFNBRkQsQ0FBQTs7QUFBQSxFQUdBLEtBQUEsR0FBUSxPQUFBLENBQVEsVUFBUixDQUhSLENBQUE7O0FBQUEsRUFLTTtBQUNTLElBQUEsdUJBQUUsT0FBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsVUFBQSxPQUNiLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxJQUFELEdBQVEsZ0JBQVIsQ0FEVztJQUFBLENBQWI7O3lCQUFBOztNQU5GLENBQUE7O0FBQUEsRUFTTTtBQUNKLHVCQUFBLFFBQUEsR0FBVSxJQUFWLENBQUE7O0FBQUEsdUJBQ0EsTUFBQSxHQUFRLElBRFIsQ0FBQTs7QUFBQSx1QkFFQSxRQUFBLEdBQVUsSUFGVixDQUFBOztBQUFBLHVCQUdBLGFBQUEsR0FBZSxJQUhmLENBQUE7O0FBT2EsSUFBQSxrQkFBRSxNQUFGLEVBQVcsUUFBWCxFQUFxQixJQUFyQixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsU0FBQSxNQUNiLENBQUE7QUFBQSxNQURxQixJQUFDLENBQUEsV0FBQSxRQUN0QixDQUFBO0FBQUEsTUFEaUMsSUFBQyxDQUFBLGdDQUFGLE9BQWlCLElBQWYsYUFDbEMsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQUFaLENBRFc7SUFBQSxDQVBiOztBQUFBLHVCQWFBLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEs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
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/vim-mode/lib/operators/general-operators.coffee