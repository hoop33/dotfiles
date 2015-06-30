(function() {
  var Change, Delete, Insert, InsertAboveWithNewline, InsertAfter, InsertBelowWithNewline, Operator, Substitute, SubstituteLine, TransactionBundler, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('./general-operators'), Operator = _ref.Operator, Delete = _ref.Delete;

  _ = require('underscore-plus');

  Insert = (function(_super) {
    __extends(Insert, _super);

    function Insert() {
      return Insert.__super__.constructor.apply(this, arguments);
    }

    Insert.prototype.standalone = true;

    Insert.prototype.isComplete = function() {
      return this.standalone || Insert.__super__.isComplete.apply(this, arguments);
    };

    Insert.prototype.confirmTransaction = function(transaction) {
      var bundler;
      bundler = new TransactionBundler(transaction);
      return this.typedText = bundler.buildInsertText();
    };

    Insert.prototype.execute = function() {
      if (this.typingCompleted) {
        if (!((this.typedText != null) && this.typedText.length > 0)) {
          return;
        }
        return this.undoTransaction((function(_this) {
          return function() {
            return _this.editor.getBuffer().insert(_this.editor.getCursorBufferPosition(), _this.typedText, true);
          };
        })(this));
      } else {
        this.vimState.activateInsertMode();
        return this.typingCompleted = true;
      }
    };

    Insert.prototype.inputOperator = function() {
      return true;
    };

    return Insert;

  })(Operator);

  InsertAfter = (function(_super) {
    __extends(InsertAfter, _super);

    function InsertAfter() {
      return InsertAfter.__super__.constructor.apply(this, arguments);
    }

    InsertAfter.prototype.execute = function() {
      if (!this.editor.getLastCursor().isAtEndOfLine()) {
        this.editor.moveRight();
      }
      return InsertAfter.__super__.execute.apply(this, arguments);
    };

    return InsertAfter;

  })(Insert);

  InsertAboveWithNewline = (function(_super) {
    __extends(InsertAboveWithNewline, _super);

    function InsertAboveWithNewline() {
      return InsertAboveWithNewline.__super__.constructor.apply(this, arguments);
    }

    InsertAboveWithNewline.prototype.execute = function(count) {
      var transactionStarted;
      if (count == null) {
        count = 1;
      }
      if (!this.typingCompleted) {
        this.vimState.setInsertionCheckpoint();
      }
      this.editor.insertNewlineAbove();
      this.editor.getLastCursor().skipLeadingWhitespace();
      if (this.typingCompleted) {
        this.typedText = this.typedText.trimLeft();
        return InsertAboveWithNewline.__super__.execute.apply(this, arguments);
      }
      this.vimState.activateInsertMode(transactionStarted = true);
      return this.typingCompleted = true;
    };

    return InsertAboveWithNewline;

  })(Insert);

  InsertBelowWithNewline = (function(_super) {
    __extends(InsertBelowWithNewline, _super);

    function InsertBelowWithNewline() {
      return InsertBelowWithNewline.__super__.constructor.apply(this, arguments);
    }

    InsertBelowWithNewline.prototype.execute = function(count) {
      var transactionStarted;
      if (count == null) {
        count = 1;
      }
      if (!this.typingCompleted) {
        this.vimState.setInsertionCheckpoint();
      }
      this.editor.insertNewlineBelow();
      this.editor.getLastCursor().skipLeadingWhitespace();
      if (this.typingCompleted) {
        this.typedText = this.typedText.trimLeft();
        return InsertBelowWithNewline.__super__.execute.apply(this, arguments);
      }
      this.vimState.activateInsertMode(transactionStarted = true);
      return this.typingCompleted = true;
    };

    return InsertBelowWithNewline;

  })(Insert);

  Change = (function(_super) {
    __extends(Change, _super);

    function Change() {
      return Change.__super__.constructor.apply(this, arguments);
    }

    Change.prototype.standalone = false;

    Change.prototype.execute = function(count) {
      var lastRow, lastRowEmpty, operator, transactionStarted, _base;
      if (!this.typingCompleted) {
        this.vimState.setInsertionCheckpoint();
      }
      operator = new Delete(this.editor, this.vimState, {
        allowEOL: true,
        selectOptions: {
          excludeWhitespace: true
        }
      });
      operator.compose(this.motion);
      lastRow = this.onLastRow();
      lastRowEmpty = this.emptyLastRow();
      operator.execute(count);
      if (typeof (_base = this.motion).isLinewise === "function" ? _base.isLinewise() : void 0) {
        if (lastRowEmpty || !this.onLastRow() || !this.emptyLastRow()) {
          if (lastRow && this.motion.selectRows) {
            this.editor.insertNewlineBelow();
          } else {
            this.editor.insertNewlineAbove();
          }
        }
      }
      if (this.typingCompleted) {
        return Change.__super__.execute.apply(this, arguments);
      }
      this.vimState.activateInsertMode(transactionStarted = true);
      return this.typingCompleted = true;
    };

    Change.prototype.onLastRow = function() {
      var column, row, _ref1;
      _ref1 = this.editor.getCursorBufferPosition(), row = _ref1.row, column = _ref1.column;
      return row === this.editor.getBuffer().getLastRow();
    };

    Change.prototype.emptyLastRow = function() {
      return this.editor.getBuffer().lineLengthForRow(this.editor.getBuffer().getLastRow()) === 0;
    };

    return Change;

  })(Insert);

  Substitute = (function(_super) {
    __extends(Substitute, _super);

    function Substitute() {
      return Substitute.__super__.constructor.apply(this, arguments);
    }

    Substitute.prototype.register = '"';

    Substitute.prototype.execute = function(count) {
      var text, transactionStarated;
      if (count == null) {
        count = 1;
      }
      if (!this.typingCompleted) {
        this.vimState.setInsertionCheckpoint();
      }
      _.times(count, (function(_this) {
        return function() {
          return _this.editor.selectRight();
        };
      })(this));
      text = this.editor.getLastSelection().getText();
      this.setTextRegister(this.register, text);
      this.editor["delete"]();
      if (this.typingCompleted) {
        this.typedText = this.typedText.trimLeft();
        return Substitute.__super__.execute.apply(this, arguments);
      }
      this.vimState.activateInsertMode(transactionStarated = true);
      return this.typingCompleted = true;
    };

    return Substitute;

  })(Insert);

  SubstituteLine = (function(_super) {
    __extends(SubstituteLine, _super);

    function SubstituteLine() {
      return SubstituteLine.__super__.constructor.apply(this, arguments);
    }

    SubstituteLine.prototype.register = '"';

    SubstituteLine.prototype.execute = function(count) {
      var text, transactionStarated;
      if (count == null) {
        count = 1;
      }
      if (!this.typingCompleted) {
        this.vimState.setInsertionCheckpoint();
      }
      this.editor.moveToBeginningOfLine();
      _.times(count, (function(_this) {
        return function() {
          return _this.editor.selectDown();
        };
      })(this));
      text = this.editor.getLastSelection().getText();
      this.setTextRegister(this.register, text);
      this.editor["delete"]();
      this.editor.insertNewlineAbove();
      this.editor.getLastCursor().skipLeadingWhitespace();
      if (this.typingCompleted) {
        this.typedText = this.typedText.trimLeft();
        return SubstituteLine.__super__.execute.apply(this, arguments);
      }
      this.vimState.activateInsertMode(transactionStarated = true);
      return this.typingCompleted = true;
    };

    return SubstituteLine;

  })(Insert);

  TransactionBundler = (function() {
    function TransactionBundler(transaction) {
      this.transaction = transaction;
    }

    TransactionBundler.prototype.buildInsertText = function() {
      var chars, patch, _i, _len, _ref1;
      if (!this.transaction.patches) {
        return "";
      }
      chars = [];
      _ref1 = this.transaction.patches;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        patch = _ref1[_i];
        switch (false) {
          case !this.isTypedChar(patch):
            chars.push(this.isTypedChar(patch));
            break;
          case !this.isBackspacedChar(patch):
            chars.pop();
        }
      }
      return chars.join("");
    };

    TransactionBundler.prototype.isTypedChar = function(patch) {
      var _ref1, _ref2;
      if (!(((_ref1 = patch.newText) != null ? _ref1.length : void 0) >= 1 && ((_ref2 = patch.oldText) != null ? _ref2.length : void 0) === 0)) {
        return false;
      }
      return patch.newText;
    };

    TransactionBundler.prototype.isBackspacedChar = function(patch) {
      var _ref1;
      return patch.newText === "" && ((_ref1 = patch.oldText) != null ? _ref1.length : void 0) === 1;
    };

    return TransactionBundler;

  })();

  module.exports = {
    Insert: Insert,
    InsertAfter: InsertAfter,
    InsertAboveWithNewline: InsertAboveWithNewline,
    InsertBelowWithNewline: InsertBelowWithNewline,
    Change: Change,
    Substitute: Substitute,
    SubstituteLine: SubstituteLine
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNKQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFxQixPQUFBLENBQVEscUJBQVIsQ0FBckIsRUFBQyxnQkFBQSxRQUFELEVBQVcsY0FBQSxNQUFYLENBQUE7O0FBQUEsRUFDQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBREosQ0FBQTs7QUFBQSxFQU9NO0FBQ0osNkJBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHFCQUFBLFVBQUEsR0FBWSxJQUFaLENBQUE7O0FBQUEscUJBRUEsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxVQUFELElBQWUsd0NBQUEsU0FBQSxFQUFsQjtJQUFBLENBRlosQ0FBQTs7QUFBQSxxQkFJQSxrQkFBQSxHQUFvQixTQUFDLFdBQUQsR0FBQTtBQUNsQixVQUFBLE9BQUE7QUFBQSxNQUFBLE9BQUEsR0FBYyxJQUFBLGtCQUFBLENBQW1CLFdBQW5CLENBQWQsQ0FBQTthQUNBLElBQUMsQ0FBQSxTQUFELEdBQWEsT0FBTyxDQUFDLGVBQVIsQ0FBQSxFQUZLO0lBQUEsQ0FKcEIsQ0FBQTs7QUFBQSxxQkFRQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFHLElBQUMsQ0FBQSxlQUFKO0FBQ0UsUUFBQSxJQUFBLENBQUEsQ0FBYyx3QkFBQSxJQUFnQixJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsR0FBb0IsQ0FBbEQsQ0FBQTtBQUFBLGdCQUFBLENBQUE7U0FBQTtlQUNBLElBQUMsQ0FBQSxlQUFELENBQWlCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUNmLEtBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUixDQUFBLENBQW1CLENBQUMsTUFBcEIsQ0FBMkIsS0FBQyxDQUFBLE1BQU0sQ0FBQyx1QkFB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
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/vim-mode/lib/operators/input.coffee