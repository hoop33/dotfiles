(function() {
  var $$, Delete, Join, Mark, Operator, OperatorError, OperatorWithInput, Point, Range, Repeat, ToggleCase, ViewModel, Yank, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  _ref = require('atom'), $$ = _ref.$$, Point = _ref.Point, Range = _ref.Range;

  ViewModel = require('../view-models/view-model').ViewModel;

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

    Operator.prototype.undoTransaction = function(fn) {
      return this.editor.getBuffer().transact(fn);
    };

    return Operator;

  })();

  OperatorWithInput = (function(_super) {
    __extends(OperatorWithInput, _super);

    function OperatorWithInput(editorView, vimState) {
      this.editorView = editorView;
      this.vimState = vimState;
      this.editor = this.editorView.editor;
      this.complete = false;
    }

    OperatorWithInput.prototype.canComposeWith = function(operation) {
      return operation.characters != null;
    };

    OperatorWithInput.prototype.compose = function(input) {
      if (!input.characters) {
        throw new OperatorError('Must compose with an Input');
      }
      this.input = input;
      return this.complete = true;
    };

    return OperatorWithInput;

  })(Operator);

  Delete = (function(_super) {
    __extends(Delete, _super);

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
      var cursor, validSelection, _base, _base1;
      if (count == null) {
        count = 1;
      }
      cursor = this.editor.getCursor();
      if (_.contains(this.motion.select(count, this.selectOptions), true)) {
        validSelection = true;
      }
      if (validSelection != null) {
        this.editor["delete"]();
        if (!this.allowEOL && cursor.isAtEndOfLine() && !(typeof (_base = this.motion).isLinewise === "function" ? _base.isLinewise() : void 0)) {
          this.editor.moveCursorLeft();
        }
      }
      if (typeof (_base1 = this.motion).isLinewise === "function" ? _base1.isLinewise() : void 0) {
        this.editor.setCursorScreenPosition([cursor.getScreenRow(), 0]);
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
      var lastCharIndex, pos;
      if (count == null) {
        count = 1;
      }
      pos = this.editor.getCursorBufferPosition();
      lastCharIndex = this.editor.lineLengthForBufferRow(pos.row) - 1;
      count = Math.min(count, this.editor.lineLengthForBufferRow(pos.row) - pos.column);
      if (this.editor.getBuffer().isRowBlank(pos.row)) {
        return;
      }
      this.undoTransaction((function(_this) {
        return function() {
          return _.times(count, function() {
            var char, point, range;
            point = _this.editor.getCursorBufferPosition();
            range = Range.fromPointWithDelta(point, 0, 1);
            char = _this.editor.getTextInBufferRange(range);
            if (char === char.toLowerCase()) {
              _this.editor.setTextInBufferRange(range, char.toUpperCase());
            } else {
              _this.editor.setTextInBufferRange(range, char.toLowerCase());
            }
            if (!(point.column >= lastCharIndex)) {
              return _this.editor.moveCursorRight();
            }
          });
        };
      })(this));
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
      var originalPosition, selectedPosition, text, type, _base, _base1;
      if (count == null) {
        count = 1;
      }
      originalPosition = this.editor.getCursorScreenPosition();
      if (_.contains(this.motion.select(count), true)) {
        selectedPosition = this.editor.getCursorScreenPosition();
        text = this.editor.getSelection().getText();
        originalPosition = Point.min(originalPosition, selectedPosition);
      } else {
        text = '';
      }
      type = (typeof (_base = this.motion).isLinewise === "function" ? _base.isLinewise() : void 0) ? 'linewise' : 'character';
      if ((typeof (_base1 = this.motion).isLinewise === "function" ? _base1.isLinewise() : void 0) && text.slice(-1) !== '\n') {
        text += '\n';
      }
      this.vimState.setRegister(this.register, {
        text: text,
        type: type
      });
      this.editor.setCursorScreenPosition(originalPosition);
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
      this.undoTransaction((function(_this) {
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
      return this.undoTransaction((function(_this) {
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

    function Mark(editorView, vimState, _arg) {
      this.editorView = editorView;
      this.vimState = vimState;
      this.selectOptions = (_arg != null ? _arg : {}).selectOptions;
      Mark.__super__.constructor.call(this, this.editorView, this.vimState);
      this.viewModel = new ViewModel(this, {
        "class": 'mark',
        singleChar: true,
        hidden: true
      });
    }

    Mark.prototype.execute = function() {
      this.vimState.setMark(this.input.characters, this.editorView.editor.getCursorBufferPosition());
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhIQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLE9BQXFCLE9BQUEsQ0FBUSxNQUFSLENBQXJCLEVBQUMsVUFBQSxFQUFELEVBQUssYUFBQSxLQUFMLEVBQVksYUFBQSxLQURaLENBQUE7O0FBQUEsRUFFQyxZQUFhLE9BQUEsQ0FBUSwyQkFBUixFQUFiLFNBRkQsQ0FBQTs7QUFBQSxFQUlNO0FBQ1MsSUFBQSx1QkFBRSxPQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxVQUFBLE9BQ2IsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxnQkFBUixDQURXO0lBQUEsQ0FBYjs7eUJBQUE7O01BTEYsQ0FBQTs7QUFBQSxFQVFNO0FBQ0osdUJBQUEsUUFBQSxHQUFVLElBQVYsQ0FBQTs7QUFBQSx1QkFDQSxNQUFBLEdBQVEsSUFEUixDQUFBOztBQUFBLHVCQUVBLFFBQUEsR0FBVSxJQUZWLENBQUE7O0FBQUEsdUJBR0EsYUFBQSxHQUFlLElBSGYsQ0FBQTs7QUFPYSxJQUFBLGtCQUFFLE1BQUYsRUFBVyxRQUFYLEVBQXFCLElBQXJCLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxTQUFBLE1BQ2IsQ0FBQTtBQUFBLE1BRHFCLElBQUMsQ0FBQSxXQUFBLFFBQ3RCLENBQUE7QUFBQSxNQURpQyxJQUFDLENBQUEsZ0NBQUYsT0FBaUIsSUFBZixhQUNsQyxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZLEtBQVosQ0FEVztJQUFBLENBUGI7O0FBQUEsdUJBYUEsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxTQUFKO0lBQUEsQ0FiWixDQUFBOztBQUFBLHVCQW1C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
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/vim-mode/lib/operators/general-operators.coffee