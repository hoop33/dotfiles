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
        return this.editor.transact((function(_this) {
          return function() {
            return _this.editor.getBuffer().insert(_this.editor.getCursorBufferPosition(), _this.typedText, {
              normalizeLineEndings: true
            });
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

    Change.prototype.register = '"';

    Change.prototype.execute = function(count) {
      var transactionStarted, _base;
      if (!this.typingCompleted) {
        this.vimState.setInsertionCheckpoint();
      }
      if (_.contains(this.motion.select(count, {
        excludeWhitespace: true
      }), true)) {
        this.setTextRegister(this.register, this.editor.getSelectedText());
        if (typeof (_base = this.motion).isLinewise === "function" ? _base.isLinewise() : void 0) {
          this.editor.insertNewline();
          this.editor.moveLeft();
        } else {
          this.editor["delete"]();
        }
      }
      if (this.typingCompleted) {
        return Change.__super__.execute.apply(this, arguments);
      }
      this.vimState.activateInsertMode(transactionStarted = true);
      return this.typingCompleted = true;
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
          _this.editor.selectToEndOfLine();
          return _this.editor.selectRight();
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNKQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFxQixPQUFBLENBQVEscUJBQVIsQ0FBckIsRUFBQyxnQkFBQSxRQUFELEVBQVcsY0FBQSxNQUFYLENBQUE7O0FBQUEsRUFDQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBREosQ0FBQTs7QUFBQSxFQU9NO0FBQ0osNkJBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHFCQUFBLFVBQUEsR0FBWSxJQUFaLENBQUE7O0FBQUEscUJBRUEsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxVQUFELElBQWUsd0NBQUEsU0FBQSxFQUFsQjtJQUFBLENBRlosQ0FBQTs7QUFBQSxxQkFJQSxrQkFBQSxHQUFvQixTQUFDLFdBQUQsR0FBQTtBQUNsQixVQUFBLE9BQUE7QUFBQSxNQUFBLE9BQUEsR0FBYyxJQUFBLGtCQUFBLENBQW1CLFdBQW5CLENBQWQsQ0FBQTthQUNBLElBQUMsQ0FBQSxTQUFELEdBQWEsT0FBTyxDQUFDLGVBQVIsQ0FBQSxFQUZLO0lBQUEsQ0FKcEIsQ0FBQTs7QUFBQSxxQkFRQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFHLElBQUMsQ0FBQSxlQUFKO0FBQ0UsUUFBQSxJQUFBLENBQUEsQ0FBYyx3QkFBQSxJQUFnQixJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsR0FBb0IsQ0FBbEQsQ0FBQTtBQUFBLGdCQUFBLENBQUE7U0FBQTtlQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixDQUFpQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFDZixLQUFDLENBQUEsTUFBTSxDQUFDLFNBQVIsQ0FBQSxDQUFtQixDQUFDLE1BQXBCLENBQ0UsS0FBQyxDQUFBLE1BQU0s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
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/vim-mode/lib/operators/input.coffee