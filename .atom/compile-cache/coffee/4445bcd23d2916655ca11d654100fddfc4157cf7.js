(function() {
  var Change, Delete, Insert, InsertAboveWithNewline, InsertAfter, InsertAfterEndOfLine, InsertAtBeginningOfLine, InsertBelowWithNewline, Operator, Substitute, SubstituteLine, TransactionBundler, settings, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('./general-operators'), Operator = _ref.Operator, Delete = _ref.Delete;

  _ = require('underscore-plus');

  settings = require('../settings');

  Insert = (function(_super) {
    __extends(Insert, _super);

    function Insert() {
      return Insert.__super__.constructor.apply(this, arguments);
    }

    Insert.prototype.standalone = true;

    Insert.prototype.isComplete = function() {
      return this.standalone || Insert.__super__.isComplete.apply(this, arguments);
    };

    Insert.prototype.confirmChanges = function(changes) {
      var bundler;
      bundler = new TransactionBundler(changes, this.editor);
      return this.typedText = bundler.buildInsertText();
    };

    Insert.prototype.execute = function() {
      var cursor, _i, _len, _ref1;
      if (this.typingCompleted) {
        if (!((this.typedText != null) && this.typedText.length > 0)) {
          return;
        }
        this.editor.insertText(this.typedText, {
          normalizeLineEndings: true
        });
        _ref1 = this.editor.getCursors();
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          cursor = _ref1[_i];
          if (!cursor.isAtBeginningOfLine()) {
            cursor.moveLeft();
          }
        }
      } else {
        this.vimState.activateInsertMode();
        this.typingCompleted = true;
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

  InsertAfterEndOfLine = (function(_super) {
    __extends(InsertAfterEndOfLine, _super);

    function InsertAfterEndOfLine() {
      return InsertAfterEndOfLine.__super__.constructor.apply(this, arguments);
    }

    InsertAfterEndOfLine.prototype.execute = function() {
      this.editor.moveToEndOfLine();
      return InsertAfterEndOfLine.__super__.execute.apply(this, arguments);
    };

    return InsertAfterEndOfLine;

  })(Insert);

  InsertAtBeginningOfLine = (function(_super) {
    __extends(InsertAtBeginningOfLine, _super);

    function InsertAtBeginningOfLine() {
      return InsertAtBeginningOfLine.__super__.constructor.apply(this, arguments);
    }

    InsertAtBeginningOfLine.prototype.execute = function() {
      this.editor.moveToBeginningOfLine();
      this.editor.moveToFirstCharacterOfLine();
      return InsertAtBeginningOfLine.__super__.execute.apply(this, arguments);
    };

    return InsertAtBeginningOfLine;

  })(Insert);

  InsertAboveWithNewline = (function(_super) {
    __extends(InsertAboveWithNewline, _super);

    function InsertAboveWithNewline() {
      return InsertAboveWithNewline.__super__.constructor.apply(this, arguments);
    }

    InsertAboveWithNewline.prototype.execute = function(count) {
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
      this.vimState.activateInsertMode();
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
      this.vimState.activateInsertMode();
      return this.typingCompleted = true;
    };

    return InsertBelowWithNewline;

  })(Insert);

  Change = (function(_super) {
    __extends(Change, _super);

    Change.prototype.standalone = false;

    Change.prototype.register = null;

    function Change(editor, vimState, _arg) {
      this.editor = editor;
      this.vimState = vimState;
      this.selectOptions = (_arg != null ? _arg : {}).selectOptions;
      this.register = settings.defaultRegister();
    }

    Change.prototype.execute = function(count) {
      var selection, _base, _i, _len, _ref1;
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
          _ref1 = this.editor.getSelections();
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            selection = _ref1[_i];
            selection.deleteSelectedText();
          }
        }
      }
      if (this.typingCompleted) {
        return Change.__super__.execute.apply(this, arguments);
      }
      this.vimState.activateInsertMode();
      return this.typingCompleted = true;
    };

    return Change;

  })(Insert);

  Substitute = (function(_super) {
    __extends(Substitute, _super);

    Substitute.prototype.register = null;

    function Substitute(editor, vimState, _arg) {
      this.editor = editor;
      this.vimState = vimState;
      this.selectOptions = (_arg != null ? _arg : {}).selectOptions;
      this.register = settings.defaultRegister();
    }

    Substitute.prototype.execute = function(count) {
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
      this.setTextRegister(this.register, this.editor.getSelectedText());
      this.editor["delete"]();
      if (this.typingCompleted) {
        this.typedText = this.typedText.trimLeft();
        return Substitute.__super__.execute.apply(this, arguments);
      }
      this.vimState.activateInsertMode();
      return this.typingCompleted = true;
    };

    return Substitute;

  })(Insert);

  SubstituteLine = (function(_super) {
    __extends(SubstituteLine, _super);

    SubstituteLine.prototype.register = null;

    function SubstituteLine(editor, vimState, _arg) {
      this.editor = editor;
      this.vimState = vimState;
      this.selectOptions = (_arg != null ? _arg : {}).selectOptions;
      this.register = settings.defaultRegister();
    }

    SubstituteLine.prototype.execute = function(count) {
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
      this.setTextRegister(this.register, this.editor.getSelectedText());
      this.editor["delete"]();
      this.editor.insertNewlineAbove();
      this.editor.getLastCursor().skipLeadingWhitespace();
      if (this.typingCompleted) {
        this.typedText = this.typedText.trimLeft();
        return SubstituteLine.__super__.execute.apply(this, arguments);
      }
      this.vimState.activateInsertMode();
      return this.typingCompleted = true;
    };

    return SubstituteLine;

  })(Insert);

  TransactionBundler = (function() {
    function TransactionBundler(changes, editor) {
      this.changes = changes;
      this.editor = editor;
      this.start = null;
      this.end = null;
    }

    TransactionBundler.prototype.buildInsertText = function() {
      var change, _i, _len, _ref1;
      _ref1 = this.changes;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        change = _ref1[_i];
        this.addChange(change);
      }
      if (this.start != null) {
        return this.editor.getTextInBufferRange([this.start, this.end]);
      } else {
        return "";
      }
    };

    TransactionBundler.prototype.addChange = function(change) {
      if (change.newRange == null) {
        return;
      }
      if (this.isRemovingFromPrevious(change)) {
        this.subtractRange(change.oldRange);
      }
      if (this.isAddingWithinPrevious(change)) {
        return this.addRange(change.newRange);
      }
    };

    TransactionBundler.prototype.isAddingWithinPrevious = function(change) {
      if (!this.isAdding(change)) {
        return false;
      }
      if (this.start === null) {
        return true;
      }
      return this.start.isLessThanOrEqual(change.newRange.start) && this.end.isGreaterThanOrEqual(change.newRange.start);
    };

    TransactionBundler.prototype.isRemovingFromPrevious = function(change) {
      if (!(this.isRemoving(change) && (this.start != null))) {
        return false;
      }
      return this.start.isLessThanOrEqual(change.oldRange.start) && this.end.isGreaterThanOrEqual(change.oldRange.end);
    };

    TransactionBundler.prototype.isAdding = function(change) {
      return change.newText.length > 0;
    };

    TransactionBundler.prototype.isRemoving = function(change) {
      return change.oldText.length > 0;
    };

    TransactionBundler.prototype.addRange = function(range) {
      var cols, rows;
      if (this.start === null) {
        this.start = range.start, this.end = range.end;
        return;
      }
      rows = range.end.row - range.start.row;
      if (range.start.row === this.end.row) {
        cols = range.end.column - range.start.column;
      } else {
        cols = 0;
      }
      return this.end = this.end.translate([rows, cols]);
    };

    TransactionBundler.prototype.subtractRange = function(range) {
      var cols, rows;
      rows = range.end.row - range.start.row;
      if (range.end.row === this.end.row) {
        cols = range.end.column - range.start.column;
      } else {
        cols = 0;
      }
      return this.end = this.end.translate([-rows, -cols]);
    };

    return TransactionBundler;

  })();

  module.exports = {
    Insert: Insert,
    InsertAfter: InsertAfter,
    InsertAfterEndOfLine: InsertAfterEndOfLine,
    InsertAtBeginningOfLine: InsertAtBeginningOfLine,
    InsertAboveWithNewline: InsertAboveWithNewline,
    InsertBelowWithNewline: InsertBelowWithNewline,
    Change: Change,
    Substitute: Substitute,
    SubstituteLine: SubstituteLine
  };

}).call(this);
