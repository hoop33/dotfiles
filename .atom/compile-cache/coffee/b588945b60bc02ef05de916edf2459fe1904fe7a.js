(function() {
  var Change, Delete, Indent, Join, Operator, OperatorError, Outdent, Put, Repeat, Yank, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

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

    Operator.prototype.undoTransaction = function(fn) {
      return this.editor.getBuffer().transact(fn);
    };

    return Operator;

  })();

  Delete = (function(_super) {
    __extends(Delete, _super);

    Delete.prototype.allowEOL = null;

    function Delete(editor, vimState, _arg) {
      var _base, _ref;
      this.editor = editor;
      this.vimState = vimState;
      _ref = _arg != null ? _arg : {}, this.allowEOL = _ref.allowEOL, this.selectOptions = _ref.selectOptions;
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
        return this.editor.setCursorScreenPosition([cursor.getScreenRow(), 0]);
      }
    };

    return Delete;

  })(Operator);

  Change = (function(_super) {
    __extends(Change, _super);

    function Change() {
      return Change.__super__.constructor.apply(this, arguments);
    }

    Change.prototype.execute = function(count) {
      var operator;
      if (count == null) {
        count = 1;
      }
      operator = new Delete(this.editor, this.vimState, {
        allowEOL: true,
        selectOptions: {
          excludeWhitespace: true
        }
      });
      operator.compose(this.motion);
      operator.execute(count);
      return this.vimState.activateInsertMode();
    };

    return Change;

  })(Operator);

  Yank = (function(_super) {
    __extends(Yank, _super);

    function Yank() {
      return Yank.__super__.constructor.apply(this, arguments);
    }

    Yank.prototype.register = '"';

    Yank.prototype.execute = function(count) {
      var originalPosition, text, type, _base, _base1;
      if (count == null) {
        count = 1;
      }
      originalPosition = this.editor.getCursorScreenPosition();
      if (_.contains(this.motion.select(count), true)) {
        text = this.editor.getSelection().getText();
      } else {
        text = '';
      }
      type = (typeof (_base = this.motion).isLinewise === "function" ? _base.isLinewise() : void 0) ? 'linewise' : 'character';
      this.vimState.setRegister(this.register, {
        text: text,
        type: type
      });
      if (typeof (_base1 = this.motion).isLinewise === "function" ? _base1.isLinewise() : void 0) {
        return this.editor.setCursorScreenPosition(originalPosition);
      } else {
        return this.editor.clearSelections();
      }
    };

    return Yank;

  })(Operator);

  Indent = (function(_super) {
    __extends(Indent, _super);

    function Indent() {
      return Indent.__super__.constructor.apply(this, arguments);
    }

    Indent.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return this.indent(count);
    };

    Indent.prototype.indent = function(count, direction) {
      var row;
      if (direction == null) {
        direction = 'indent';
      }
      row = this.editor.getCursorScreenRow();
      this.motion.select(count);
      if (direction === 'indent') {
        this.editor.indentSelectedRows();
      } else if (direction === 'outdent') {
        this.editor.outdentSelectedRows();
      }
      this.editor.setCursorScreenPosition([row, 0]);
      return this.editor.moveCursorToFirstCharacterOfLine();
    };

    return Indent;

  })(Operator);

  Outdent = (function(_super) {
    __extends(Outdent, _super);

    function Outdent() {
      return Outdent.__super__.constructor.apply(this, arguments);
    }

    Outdent.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return this.indent(count, 'outdent');
    };

    return Outdent;

  })(Indent);

  Put = (function(_super) {
    __extends(Put, _super);

    Put.prototype.register = '"';

    function Put(editor, vimState, _arg) {
      var _ref;
      this.editor = editor;
      this.vimState = vimState;
      _ref = _arg != null ? _arg : {}, this.location = _ref.location, this.selectOptions = _ref.selectOptions;
      if (this.location == null) {
        this.location = 'after';
      }
      this.complete = true;
    }

    Put.prototype.execute = function(count) {
      var originalPosition, text, textToInsert, type, _ref;
      if (count == null) {
        count = 1;
      }
      _ref = this.vimState.getRegister(this.register) || {}, text = _ref.text, type = _ref.type;
      if (!text) {
        return;
      }
      if (this.location === 'after') {
        if (type === 'linewise') {
          if (this.onLastRow()) {
            this.editor.moveCursorToEndOfLine();
            originalPosition = this.editor.getCursorScreenPosition();
            originalPosition.row += 1;
          } else {
            this.editor.moveCursorDown();
          }
        } else {
          if (!this.onLastColumn()) {
            this.editor.moveCursorRight();
          }
        }
      }
      if (type === 'linewise' && (originalPosition == null)) {
        this.editor.moveCursorToBeginningOfLine();
        originalPosition = this.editor.getCursorScreenPosition();
      }
      textToInsert = _.times(count, function() {
        return text;
      }).join('');
      if (this.location === 'after' && type === 'linewise' && this.onLastRow()) {
        textToInsert = "\n" + (textToInsert.substring(0, textToInsert.length - 1));
      }
      this.editor.insertText(textToInsert);
      if (originalPosition != null) {
        this.editor.setCursorScreenPosition(originalPosition);
        return this.editor.moveCursorToFirstCharacterOfLine();
      }
    };

    Put.prototype.onLastRow = function() {
      var column, row, _ref;
      _ref = this.editor.getCursorBufferPosition(), row = _ref.row, column = _ref.column;
      return row === this.editor.getBuffer().getLastRow();
    };

    Put.prototype.onLastColumn = function() {
      return this.editor.getCursor().isAtEndOfLine();
    };

    return Put;

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
      return this.undoTransaction((function(_this) {
        return function() {
          return _.times(count, function() {
            return _this.editor.joinLine();
          });
        };
      })(this));
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

  module.exports = {
    Operator: Operator,
    OperatorError: OperatorError,
    Delete: Delete,
    Change: Change,
    Yank: Yank,
    Indent: Indent,
    Outdent: Outdent,
    Put: Put,
    Join: Join,
    Repeat: Repeat
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9GQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUVNO0FBQ1MsSUFBQSx1QkFBRSxPQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxVQUFBLE9BQ2IsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxnQkFBUixDQURXO0lBQUEsQ0FBYjs7eUJBQUE7O01BSEYsQ0FBQTs7QUFBQSxFQU1NO0FBQ0osdUJBQUEsUUFBQSxHQUFVLElBQVYsQ0FBQTs7QUFBQSx1QkFDQSxNQUFBLEdBQVEsSUFEUixDQUFBOztBQUFBLHVCQUVBLFFBQUEsR0FBVSxJQUZWLENBQUE7O0FBQUEsdUJBR0EsYUFBQSxHQUFlLElBSGYsQ0FBQTs7QUFPYSxJQUFBLGtCQUFFLE1BQUYsRUFBVyxRQUFYLEVBQXFCLElBQXJCLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxTQUFBLE1BQ2IsQ0FBQTtBQUFBLE1BRHFCLElBQUMsQ0FBQSxXQUFBLFFBQ3RCLENBQUE7QUFBQSxNQURpQyxJQUFDLENBQUEsZ0NBQUYsT0FBaUIsSUFBZixhQUNsQyxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZLEtBQVosQ0FEVztJQUFBLENBUGI7O0FBQUEsdUJBYUEsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxTQUFKO0lBQUEsQ0FiWixDQUFBOztBQUFBLHVCQW1CQSxZQUFBLEdBQWMsU0FBQSxHQUFBO2FBQUcsS0FBSDtJQUFBLENBbkJkLENBQUE7O0FBQUEsdUJBMEJBLE9BQUEsR0FBUyxTQUFDLE1BQUQsR0FBQTtBQUNQLE1BQUEsSUFBRyxDQUFBLE1BQVUsQ0FBQyxNQUFkO0FBQ0UsY0FBVSxJQUFB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
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/vim-mode/lib/operators.coffee