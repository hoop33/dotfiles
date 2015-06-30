(function() {
  var AllWhitespace, CurrentSelection, Motion, MotionError, MotionWithInput, MoveDown, MoveLeft, MoveRight, MoveToAbsoluteLine, MoveToBeginningOfLine, MoveToBottomOfScreen, MoveToEndOfWholeWord, MoveToEndOfWord, MoveToFirstCharacterOfLine, MoveToFirstCharacterOfLineAndDown, MoveToFirstCharacterOfLineDown, MoveToFirstCharacterOfLineUp, MoveToLastCharacterOfLine, MoveToLine, MoveToMiddleOfScreen, MoveToNextParagraph, MoveToNextWholeWord, MoveToNextWord, MoveToPreviousParagraph, MoveToPreviousWholeWord, MoveToPreviousWord, MoveToRelativeLine, MoveToScreenLine, MoveToStartOfFile, MoveToTopOfScreen, MoveUp, Point, Range, WholeWordOrEmptyLineRegex, WholeWordRegex, settings, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  _ref = require('atom'), Point = _ref.Point, Range = _ref.Range;

  settings = require('../settings');

  WholeWordRegex = /\S+/;

  WholeWordOrEmptyLineRegex = /^\s*$|\S+/;

  AllWhitespace = /^\s$/;

  MotionError = (function() {
    function MotionError(message) {
      this.message = message;
      this.name = 'Motion Error';
    }

    return MotionError;

  })();

  Motion = (function() {
    Motion.prototype.operatesInclusively = true;

    Motion.prototype.operatesLinewise = false;

    function Motion(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
    }

    Motion.prototype.select = function(count, options) {
      var selection, value;
      value = (function() {
        var _i, _len, _ref1, _results;
        _ref1 = this.editor.getSelections();
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          selection = _ref1[_i];
          if (this.isLinewise()) {
            this.moveSelectionLinewise(selection, count, options);
          } else if (this.isInclusive()) {
            this.moveSelectionInclusively(selection, count, options);
          } else {
            this.moveSelection(selection, count, options);
          }
          _results.push(!selection.isEmpty());
        }
        return _results;
      }).call(this);
      this.editor.mergeCursors();
      this.editor.mergeIntersectingSelections();
      return value;
    };

    Motion.prototype.execute = function(count) {
      var cursor, _i, _len, _ref1;
      _ref1 = this.editor.getCursors();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        cursor = _ref1[_i];
        this.moveCursor(cursor, count);
      }
      return this.editor.mergeCursors();
    };

    Motion.prototype.moveSelectionLinewise = function(selection, count, options) {
      return selection.modifySelection((function(_this) {
        return function() {
          var isEmpty, isReversed, newEndRow, newStartRow, oldEndRow, oldStartRow, wasEmpty, wasReversed, _ref1, _ref2;
          _ref1 = selection.getBufferRowRange(), oldStartRow = _ref1[0], oldEndRow = _ref1[1];
          wasEmpty = selection.isEmpty();
          wasReversed = selection.isReversed();
          if (!(wasEmpty || wasReversed)) {
            selection.cursor.moveLeft();
          }
          _this.moveCursor(selection.cursor, count, options);
          isEmpty = selection.isEmpty();
          isReversed = selection.isReversed();
          if (!(isEmpty || isReversed)) {
            selection.cursor.moveRight();
          }
          _ref2 = selection.getBufferRowRange(), newStartRow = _ref2[0], newEndRow = _ref2[1];
          if (isReversed && !wasReversed) {
            newEndRow = Math.max(newEndRow, oldStartRow);
          }
          if (wasReversed && !isReversed) {
            newStartRow = Math.min(newStartRow, oldEndRow);
          }
          return selection.setBufferRange([[newStartRow, 0], [newEndRow + 1, 0]]);
        };
      })(this));
    };

    Motion.prototype.moveSelectionInclusively = function(selection, count, options) {
      return selection.modifySelection((function(_this) {
        return function() {
          var isEmpty, isReversed, newEnd, newStart, oldEnd, oldStart, range, wasEmpty, wasReversed, _ref1, _ref2;
          range = selection.getBufferRange();
          _ref1 = [range.start, range.end], oldStart = _ref1[0], oldEnd = _ref1[1];
          wasEmpty = selection.isEmpty();
          wasReversed = selection.isReversed();
          if (!(wasEmpty || wasReversed)) {
            selection.cursor.moveLeft();
          }
          _this.moveCursor(selection.cursor, count, options);
          isEmpty = selection.isEmpty();
          isReversed = selection.isReversed();
          if (!(isEmpty || isReversed)) {
            selection.cursor.moveRight();
          }
          range = selection.getBufferRange();
          _ref2 = [range.start, range.end], newStart = _ref2[0], newEnd = _ref2[1];
          if ((isReversed || isEmpty) && !(wasReversed || wasEmpty)) {
            selection.setBufferRange([newStart, [newEnd.row, oldStart.column + 1]]);
          }
          if (wasReversed && !isReversed) {
            return selection.setBufferRange([[newStart.row, oldEnd.column - 1], newEnd]);
          }
        };
      })(this));
    };

    Motion.prototype.moveSelection = function(selection, count, options) {
      return selection.modifySelection((function(_this) {
        return function() {
          return _this.moveCursor(selection.cursor, count, options);
        };
      })(this));
    };

    Motion.prototype.ensureCursorIsWithinLine = function(cursor) {
      var column, goalColumn, lastColumn, row, _ref1;
      if (this.vimState.mode === 'visual' || !cursor.selection.isEmpty()) {
        return;
      }
      goalColumn = cursor.goalColumn;
      _ref1 = cursor.getBufferPosition(), row = _ref1.row, column = _ref1.column;
      lastColumn = cursor.getCurrentLineBufferRange().end.column;
      if (column >= lastColumn - 1) {
        cursor.setBufferPosition([row, Math.max(lastColumn - 1, 0)]);
      }
      return cursor.goalColumn != null ? cursor.goalColumn : cursor.goalColumn = goalColumn;
    };

    Motion.prototype.isComplete = function() {
      return true;
    };

    Motion.prototype.isRecordable = function() {
      return false;
    };

    Motion.prototype.isLinewise = function() {
      var _ref1, _ref2;
      if (((_ref1 = this.vimState) != null ? _ref1.mode : void 0) === 'visual') {
        return ((_ref2 = this.vimState) != null ? _ref2.submode : void 0) === 'linewise';
      } else {
        return this.operatesLinewise;
      }
    };

    Motion.prototype.isInclusive = function() {
      return this.vimState.mode === 'visual' || this.operatesInclusively;
    };

    return Motion;

  })();

  CurrentSelection = (function(_super) {
    __extends(CurrentSelection, _super);

    function CurrentSelection(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      CurrentSelection.__super__.constructor.call(this, this.editor, this.vimState);
      this.selection = this.editor.getSelectedBufferRanges();
    }

    CurrentSelection.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        return true;
      });
    };

    CurrentSelection.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      this.editor.setSelectedBufferRanges(this.selection);
      return _.times(count, function() {
        return true;
      });
    };

    return CurrentSelection;

  })(Motion);

  MotionWithInput = (function(_super) {
    __extends(MotionWithInput, _super);

    function MotionWithInput(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      MotionWithInput.__super__.constructor.call(this, this.editor, this.vimState);
      this.complete = false;
    }

    MotionWithInput.prototype.isComplete = function() {
      return this.complete;
    };

    MotionWithInput.prototype.canComposeWith = function(operation) {
      return operation.characters != null;
    };

    MotionWithInput.prototype.compose = function(input) {
      if (!input.characters) {
        throw new MotionError('Must compose with an Input');
      }
      this.input = input;
      return this.complete = true;
    };

    return MotionWithInput;

  })(Motion);

  MoveLeft = (function(_super) {
    __extends(MoveLeft, _super);

    function MoveLeft() {
      return MoveLeft.__super__.constructor.apply(this, arguments);
    }

    MoveLeft.prototype.operatesInclusively = false;

    MoveLeft.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          if (!cursor.isAtBeginningOfLine() || settings.wrapLeftRightMotion()) {
            cursor.moveLeft();
          }
          return _this.ensureCursorIsWithinLine(cursor);
        };
      })(this));
    };

    return MoveLeft;

  })(Motion);

  MoveRight = (function(_super) {
    __extends(MoveRight, _super);

    function MoveRight() {
      return MoveRight.__super__.constructor.apply(this, arguments);
    }

    MoveRight.prototype.operatesInclusively = false;

    MoveRight.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          if (!cursor.isAtEndOfLine()) {
            cursor.moveRight();
          }
          if (settings.wrapLeftRightMotion() && cursor.isAtEndOfLine()) {
            cursor.moveRight();
          }
          return _this.ensureCursorIsWithinLine(cursor);
        };
      })(this));
    };

    return MoveRight;

  })(Motion);

  MoveUp = (function(_super) {
    __extends(MoveUp, _super);

    function MoveUp() {
      return MoveUp.__super__.constructor.apply(this, arguments);
    }

    MoveUp.prototype.operatesLinewise = true;

    MoveUp.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          if (cursor.getScreenRow() !== 0) {
            cursor.moveUp();
            return _this.ensureCursorIsWithinLine(cursor);
          }
        };
      })(this));
    };

    return MoveUp;

  })(Motion);

  MoveDown = (function(_super) {
    __extends(MoveDown, _super);

    function MoveDown() {
      return MoveDown.__super__.constructor.apply(this, arguments);
    }

    MoveDown.prototype.operatesLinewise = true;

    MoveDown.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          if (cursor.getScreenRow() !== _this.editor.getLastScreenRow()) {
            cursor.moveDown();
            return _this.ensureCursorIsWithinLine(cursor);
          }
        };
      })(this));
    };

    return MoveDown;

  })(Motion);

  MoveToPreviousWord = (function(_super) {
    __extends(MoveToPreviousWord, _super);

    function MoveToPreviousWord() {
      return MoveToPreviousWord.__super__.constructor.apply(this, arguments);
    }

    MoveToPreviousWord.prototype.operatesInclusively = false;

    MoveToPreviousWord.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        return cursor.moveToBeginningOfWord();
      });
    };

    return MoveToPreviousWord;

  })(Motion);

  MoveToPreviousWholeWord = (function(_super) {
    __extends(MoveToPreviousWholeWord, _super);

    function MoveToPreviousWholeWord() {
      return MoveToPreviousWholeWord.__super__.constructor.apply(this, arguments);
    }

    MoveToPreviousWholeWord.prototype.operatesInclusively = false;

    MoveToPreviousWholeWord.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var _results;
          cursor.moveToBeginningOfWord();
          _results = [];
          while (!_this.isWholeWord(cursor) && !_this.isBeginningOfFile(cursor)) {
            _results.push(cursor.moveToBeginningOfWord());
          }
          return _results;
        };
      })(this));
    };

    MoveToPreviousWholeWord.prototype.isWholeWord = function(cursor) {
      var char;
      char = cursor.getCurrentWordPrefix().slice(-1);
      return AllWhitespace.test(char);
    };

    MoveToPreviousWholeWord.prototype.isBeginningOfFile = function(cursor) {
      var cur;
      cur = cursor.getBufferPosition();
      return !cur.row && !cur.column;
    };

    return MoveToPreviousWholeWord;

  })(Motion);

  MoveToNextWord = (function(_super) {
    __extends(MoveToNextWord, _super);

    function MoveToNextWord() {
      return MoveToNextWord.__super__.constructor.apply(this, arguments);
    }

    MoveToNextWord.prototype.wordRegex = null;

    MoveToNextWord.prototype.operatesInclusively = false;

    MoveToNextWord.prototype.moveCursor = function(cursor, count, options) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var current, next;
          current = cursor.getBufferPosition();
          next = (options != null ? options.excludeWhitespace : void 0) ? cursor.getEndOfCurrentWordBufferPosition({
            wordRegex: _this.wordRegex
          }) : cursor.getBeginningOfNextWordBufferPosition({
            wordRegex: _this.wordRegex
          });
          if (_this.isEndOfFile(cursor)) {
            return;
          }
          if (cursor.isAtEndOfLine()) {
            cursor.moveDown();
            cursor.moveToBeginningOfLine();
            return cursor.skipLeadingWhitespace();
          } else if (current.row === next.row && current.column === next.column) {
            return cursor.moveToEndOfWord();
          } else {
            return cursor.setBufferPosition(next);
          }
        };
      })(this));
    };

    MoveToNextWord.prototype.isEndOfFile = function(cursor) {
      var cur, eof;
      cur = cursor.getBufferPosition();
      eof = this.editor.getEofBufferPosition();
      return cur.row === eof.row && cur.column === eof.column;
    };

    return MoveToNextWord;

  })(Motion);

  MoveToNextWholeWord = (function(_super) {
    __extends(MoveToNextWholeWord, _super);

    function MoveToNextWholeWord() {
      return MoveToNextWholeWord.__super__.constructor.apply(this, arguments);
    }

    MoveToNextWholeWord.prototype.wordRegex = WholeWordOrEmptyLineRegex;

    return MoveToNextWholeWord;

  })(MoveToNextWord);

  MoveToEndOfWord = (function(_super) {
    __extends(MoveToEndOfWord, _super);

    function MoveToEndOfWord() {
      return MoveToEndOfWord.__super__.constructor.apply(this, arguments);
    }

    MoveToEndOfWord.prototype.wordRegex = null;

    MoveToEndOfWord.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var current, next;
          current = cursor.getBufferPosition();
          next = cursor.getEndOfCurrentWordBufferPosition({
            wordRegex: _this.wordRegex
          });
          if (next.column > 0) {
            next.column--;
          }
          if (next.isEqual(current)) {
            cursor.moveRight();
            if (cursor.isAtEndOfLine()) {
              cursor.moveDown();
              cursor.moveToBeginningOfLine();
            }
            next = cursor.getEndOfCurrentWordBufferPosition({
              wordRegex: _this.wordRegex
            });
            if (next.column > 0) {
              next.column--;
            }
          }
          return cursor.setBufferPosition(next);
        };
      })(this));
    };

    return MoveToEndOfWord;

  })(Motion);

  MoveToEndOfWholeWord = (function(_super) {
    __extends(MoveToEndOfWholeWord, _super);

    function MoveToEndOfWholeWord() {
      return MoveToEndOfWholeWord.__super__.constructor.apply(this, arguments);
    }

    MoveToEndOfWholeWord.prototype.wordRegex = WholeWordRegex;

    return MoveToEndOfWholeWord;

  })(MoveToEndOfWord);

  MoveToNextParagraph = (function(_super) {
    __extends(MoveToNextParagraph, _super);

    function MoveToNextParagraph() {
      return MoveToNextParagraph.__super__.constructor.apply(this, arguments);
    }

    MoveToNextParagraph.prototype.operatesInclusively = false;

    MoveToNextParagraph.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          return cursor.moveToBeginningOfNextParagraph();
        };
      })(this));
    };

    return MoveToNextParagraph;

  })(Motion);

  MoveToPreviousParagraph = (function(_super) {
    __extends(MoveToPreviousParagraph, _super);

    function MoveToPreviousParagraph() {
      return MoveToPreviousParagraph.__super__.constructor.apply(this, arguments);
    }

    MoveToPreviousParagraph.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          return cursor.moveToBeginningOfPreviousParagraph();
        };
      })(this));
    };

    return MoveToPreviousParagraph;

  })(Motion);

  MoveToLine = (function(_super) {
    __extends(MoveToLine, _super);

    function MoveToLine() {
      return MoveToLine.__super__.constructor.apply(this, arguments);
    }

    MoveToLine.prototype.operatesLinewise = true;

    MoveToLine.prototype.getDestinationRow = function(count) {
      if (count != null) {
        return count - 1;
      } else {
        return this.editor.getLineCount() - 1;
      }
    };

    return MoveToLine;

  })(Motion);

  MoveToAbsoluteLine = (function(_super) {
    __extends(MoveToAbsoluteLine, _super);

    function MoveToAbsoluteLine() {
      return MoveToAbsoluteLine.__super__.constructor.apply(this, arguments);
    }

    MoveToAbsoluteLine.prototype.moveCursor = function(cursor, count) {
      cursor.setBufferPosition([this.getDestinationRow(count), Infinity]);
      cursor.moveToFirstCharacterOfLine();
      if (cursor.getBufferColumn() === 0) {
        return cursor.moveToEndOfLine();
      }
    };

    return MoveToAbsoluteLine;

  })(MoveToLine);

  MoveToRelativeLine = (function(_super) {
    __extends(MoveToRelativeLine, _super);

    function MoveToRelativeLine() {
      return MoveToRelativeLine.__super__.constructor.apply(this, arguments);
    }

    MoveToRelativeLine.prototype.operatesLinewise = true;

    MoveToRelativeLine.prototype.moveCursor = function(cursor, count) {
      var column, row, _ref1;
      if (count == null) {
        count = 1;
      }
      _ref1 = cursor.getBufferPosition(), row = _ref1.row, column = _ref1.column;
      return cursor.setBufferPosition([row + (count - 1), 0]);
    };

    return MoveToRelativeLine;

  })(MoveToLine);

  MoveToScreenLine = (function(_super) {
    __extends(MoveToScreenLine, _super);

    function MoveToScreenLine(editor, vimState, scrolloff) {
      this.editor = editor;
      this.vimState = vimState;
      this.scrolloff = scrolloff;
      this.scrolloff = 2;
      MoveToScreenLine.__super__.constructor.call(this, this.editor, this.vimState);
    }

    MoveToScreenLine.prototype.moveCursor = function(cursor, count) {
      var column, row, _ref1;
      if (count == null) {
        count = 1;
      }
      _ref1 = cursor.getBufferPosition(), row = _ref1.row, column = _ref1.column;
      return cursor.setScreenPosition([this.getDestinationRow(count), 0]);
    };

    return MoveToScreenLine;

  })(MoveToLine);

  MoveToBeginningOfLine = (function(_super) {
    __extends(MoveToBeginningOfLine, _super);

    function MoveToBeginningOfLine() {
      return MoveToBeginningOfLine.__super__.constructor.apply(this, arguments);
    }

    MoveToBeginningOfLine.prototype.operatesInclusively = false;

    MoveToBeginningOfLine.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        return cursor.moveToBeginningOfLine();
      });
    };

    return MoveToBeginningOfLine;

  })(Motion);

  MoveToFirstCharacterOfLine = (function(_super) {
    __extends(MoveToFirstCharacterOfLine, _super);

    function MoveToFirstCharacterOfLine() {
      return MoveToFirstCharacterOfLine.__super__.constructor.apply(this, arguments);
    }

    MoveToFirstCharacterOfLine.prototype.operatesInclusively = false;

    MoveToFirstCharacterOfLine.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        cursor.moveToBeginningOfLine();
        return cursor.moveToFirstCharacterOfLine();
      });
    };

    return MoveToFirstCharacterOfLine;

  })(Motion);

  MoveToFirstCharacterOfLineAndDown = (function(_super) {
    __extends(MoveToFirstCharacterOfLineAndDown, _super);

    function MoveToFirstCharacterOfLineAndDown() {
      return MoveToFirstCharacterOfLineAndDown.__super__.constructor.apply(this, arguments);
    }

    MoveToFirstCharacterOfLineAndDown.prototype.operatesLinewise = true;

    MoveToFirstCharacterOfLineAndDown.prototype.operatesInclusively = true;

    MoveToFirstCharacterOfLineAndDown.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 0;
      }
      _.times(count - 1, function() {
        return cursor.moveDown();
      });
      cursor.moveToBeginningOfLine();
      return cursor.moveToFirstCharacterOfLine();
    };

    return MoveToFirstCharacterOfLineAndDown;

  })(Motion);

  MoveToLastCharacterOfLine = (function(_super) {
    __extends(MoveToLastCharacterOfLine, _super);

    function MoveToLastCharacterOfLine() {
      return MoveToLastCharacterOfLine.__super__.constructor.apply(this, arguments);
    }

    MoveToLastCharacterOfLine.prototype.operatesInclusively = false;

    MoveToLastCharacterOfLine.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          cursor.moveToEndOfLine();
          cursor.goalColumn = Infinity;
          return _this.ensureCursorIsWithinLine(cursor);
        };
      })(this));
    };

    return MoveToLastCharacterOfLine;

  })(Motion);

  MoveToFirstCharacterOfLineUp = (function(_super) {
    __extends(MoveToFirstCharacterOfLineUp, _super);

    function MoveToFirstCharacterOfLineUp() {
      return MoveToFirstCharacterOfLineUp.__super__.constructor.apply(this, arguments);
    }

    MoveToFirstCharacterOfLineUp.prototype.operatesLinewise = true;

    MoveToFirstCharacterOfLineUp.prototype.operatesInclusively = true;

    MoveToFirstCharacterOfLineUp.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      _.times(count, function() {
        return cursor.moveUp();
      });
      cursor.moveToBeginningOfLine();
      return cursor.moveToFirstCharacterOfLine();
    };

    return MoveToFirstCharacterOfLineUp;

  })(Motion);

  MoveToFirstCharacterOfLineDown = (function(_super) {
    __extends(MoveToFirstCharacterOfLineDown, _super);

    function MoveToFirstCharacterOfLineDown() {
      return MoveToFirstCharacterOfLineDown.__super__.constructor.apply(this, arguments);
    }

    MoveToFirstCharacterOfLineDown.prototype.operatesLinewise = true;

    MoveToFirstCharacterOfLineDown.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      _.times(count, function() {
        return cursor.moveDown();
      });
      cursor.moveToBeginningOfLine();
      return cursor.moveToFirstCharacterOfLine();
    };

    return MoveToFirstCharacterOfLineDown;

  })(Motion);

  MoveToStartOfFile = (function(_super) {
    __extends(MoveToStartOfFile, _super);

    function MoveToStartOfFile() {
      return MoveToStartOfFile.__super__.constructor.apply(this, arguments);
    }

    MoveToStartOfFile.prototype.moveCursor = function(cursor, count) {
      var column, row, _ref1;
      if (count == null) {
        count = 1;
      }
      _ref1 = this.editor.getCursorBufferPosition(), row = _ref1.row, column = _ref1.column;
      cursor.setBufferPosition([this.getDestinationRow(count), 0]);
      if (!this.isLinewise()) {
        return cursor.moveToFirstCharacterOfLine();
      }
    };

    return MoveToStartOfFile;

  })(MoveToLine);

  MoveToTopOfScreen = (function(_super) {
    __extends(MoveToTopOfScreen, _super);

    function MoveToTopOfScreen() {
      return MoveToTopOfScreen.__super__.constructor.apply(this, arguments);
    }

    MoveToTopOfScreen.prototype.getDestinationRow = function(count) {
      var firstScreenRow, offset;
      if (count == null) {
        count = 0;
      }
      firstScreenRow = this.editor.getFirstVisibleScreenRow();
      if (firstScreenRow > 0) {
        offset = Math.max(count - 1, this.scrolloff);
      } else {
        offset = count > 0 ? count - 1 : count;
      }
      return firstScreenRow + offset;
    };

    return MoveToTopOfScreen;

  })(MoveToScreenLine);

  MoveToBottomOfScreen = (function(_super) {
    __extends(MoveToBottomOfScreen, _super);

    function MoveToBottomOfScreen() {
      return MoveToBottomOfScreen.__super__.constructor.apply(this, arguments);
    }

    MoveToBottomOfScreen.prototype.getDestinationRow = function(count) {
      var lastRow, lastScreenRow, offset;
      if (count == null) {
        count = 0;
      }
      lastScreenRow = this.editor.getLastVisibleScreenRow();
      lastRow = this.editor.getBuffer().getLastRow();
      if (lastScreenRow !== lastRow) {
        offset = Math.max(count - 1, this.scrolloff);
      } else {
        offset = count > 0 ? count - 1 : count;
      }
      return lastScreenRow - offset;
    };

    return MoveToBottomOfScreen;

  })(MoveToScreenLine);

  MoveToMiddleOfScreen = (function(_super) {
    __extends(MoveToMiddleOfScreen, _super);

    function MoveToMiddleOfScreen() {
      return MoveToMiddleOfScreen.__super__.constructor.apply(this, arguments);
    }

    MoveToMiddleOfScreen.prototype.getDestinationRow = function(count) {
      var firstScreenRow, height, lastScreenRow;
      firstScreenRow = this.editor.getFirstVisibleScreenRow();
      lastScreenRow = this.editor.getLastVisibleScreenRow();
      height = lastScreenRow - firstScreenRow;
      return Math.floor(firstScreenRow + (height / 2));
    };

    return MoveToMiddleOfScreen;

  })(MoveToScreenLine);

  module.exports = {
    Motion: Motion,
    MotionWithInput: MotionWithInput,
    CurrentSelection: CurrentSelection,
    MoveLeft: MoveLeft,
    MoveRight: MoveRight,
    MoveUp: MoveUp,
    MoveDown: MoveDown,
    MoveToPreviousWord: MoveToPreviousWord,
    MoveToPreviousWholeWord: MoveToPreviousWholeWord,
    MoveToNextWord: MoveToNextWord,
    MoveToNextWholeWord: MoveToNextWholeWord,
    MoveToEndOfWord: MoveToEndOfWord,
    MoveToNextParagraph: MoveToNextParagraph,
    MoveToPreviousParagraph: MoveToPreviousParagraph,
    MoveToAbsoluteLine: MoveToAbsoluteLine,
    MoveToRelativeLine: MoveToRelativeLine,
    MoveToBeginningOfLine: MoveToBeginningOfLine,
    MoveToFirstCharacterOfLineUp: MoveToFirstCharacterOfLineUp,
    MoveToFirstCharacterOfLineDown: MoveToFirstCharacterOfLineDown,
    MoveToFirstCharacterOfLine: MoveToFirstCharacterOfLine,
    MoveToFirstCharacterOfLineAndDown: MoveToFirstCharacterOfLineAndDown,
    MoveToLastCharacterOfLine: MoveToLastCharacterOfLine,
    MoveToStartOfFile: MoveToStartOfFile,
    MoveToTopOfScreen: MoveToTopOfScreen,
    MoveToBottomOfScreen: MoveToBottomOfScreen,
    MoveToMiddleOfScreen: MoveToMiddleOfScreen,
    MoveToEndOfWholeWord: MoveToEndOfWholeWord,
    MotionError: MotionError
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNxQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQSxPQUFpQixPQUFBLENBQVEsTUFBUixDQUFqQixFQUFDLGFBQUEsS0FBRCxFQUFRLGFBQUEsS0FEUixDQUFBOztBQUFBLEVBRUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBRlgsQ0FBQTs7QUFBQSxFQUlBLGNBQUEsR0FBaUIsS0FKakIsQ0FBQTs7QUFBQSxFQUtBLHlCQUFBLEdBQTRCLFdBTDVCLENBQUE7O0FBQUEsRUFNQSxhQUFBLEdBQWdCLE1BTmhCLENBQUE7O0FBQUEsRUFRTTtBQUNTLElBQUEscUJBQUUsT0FBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsVUFBQSxPQUNiLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxJQUFELEdBQVEsY0FBUixDQURXO0lBQUEsQ0FBYjs7dUJBQUE7O01BVEYsQ0FBQTs7QUFBQSxFQVlNO0FBQ0oscUJBQUEsbUJBQUEsR0FBcUIsSUFBckIsQ0FBQTs7QUFBQSxxQkFDQSxnQkFBQSxHQUFrQixLQURsQixDQUFBOztBQUdhLElBQUEsZ0JBQUUsTUFBRixFQUFXLFFBQVgsR0FBQTtBQUFzQixNQUFyQixJQUFDLENBQUEsU0FBQSxNQUFvQixDQUFBO0FBQUEsTUFBWixJQUFDLENBQUEsV0FBQSxRQUFXLENBQXRCO0lBQUEsQ0FIYjs7QUFBQSxxQkFLQSxNQUFBLEdBQVEsU0FBQyxLQUFELEVBQVEsT0FBUixHQUFBO0FBQ04sVUFBQSxnQkFBQTtBQUFBLE1BQUEsS0FBQTs7QUFBUTtBQUFBO2FBQUEsNENBQUE7Z0NBQUE7QUFDTixVQUFBLElBQUcsSUFBQyxDQUFBLFVBQUQsQ0FBQSxDQUFIO0FBQ0Us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
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/vim-mode/lib/motions/general-motions.coffee