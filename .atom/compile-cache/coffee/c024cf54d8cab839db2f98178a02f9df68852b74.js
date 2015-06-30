(function() {
  var CurrentSelection, Motion, MotionError, MotionWithInput, MoveDown, MoveLeft, MoveRight, MoveToBeginningOfLine, MoveToBottomOfScreen, MoveToEndOfWholeWord, MoveToEndOfWord, MoveToFirstCharacterOfLine, MoveToFirstCharacterOfLineDown, MoveToFirstCharacterOfLineUp, MoveToLastCharacterOfLine, MoveToLine, MoveToMiddleOfScreen, MoveToNextParagraph, MoveToNextWholeWord, MoveToNextWord, MoveToPreviousParagraph, MoveToPreviousWholeWord, MoveToPreviousWord, MoveToRelativeLine, MoveToScreenLine, MoveToStartOfFile, MoveToTopOfScreen, MoveUp, MoveVertically, Point, Range, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('underscore-plus');

  _ref = require('atom'), Point = _ref.Point, Range = _ref.Range;

  MotionError = (function() {
    function MotionError(message) {
      this.message = message;
      this.name = 'Motion Error';
    }

    return MotionError;

  })();

  Motion = (function() {
    function Motion(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.vimState.desiredCursorColumn = null;
    }

    Motion.prototype.isComplete = function() {
      return true;
    };

    Motion.prototype.isRecordable = function() {
      return false;
    };

    Motion.prototype.inVisualMode = function() {
      return this.vimState.mode === "visual";
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

    CurrentSelection.prototype.isLinewise = function() {
      return this.vimState.mode === 'visual' && this.vimState.submode === 'linewise';
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

    MoveLeft.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var column;
          column = _this.editor.getCursorBufferPosition().column;
          if (column > 0) {
            return _this.editor.moveLeft();
          }
        };
      })(this));
    };

    MoveLeft.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var column;
          column = _this.editor.getCursorBufferPosition().column;
          if (column > 0) {
            _this.editor.selectLeft();
            return true;
          } else {
            return false;
          }
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

    MoveRight.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var column, row, _ref1;
          _ref1 = _this.editor.getCursorBufferPosition(), row = _ref1.row, column = _ref1.column;
          if (column < _this.editor.lineTextForBufferRow(row).length - 1) {
            return _this.editor.moveRight();
          }
        };
      })(this));
    };

    MoveRight.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var end, rowLength, start, _ref1;
          _ref1 = _this.editor.getSelectedBufferRange(), start = _ref1.start, end = _ref1.end;
          rowLength = _this.editor.getLastCursor().getCurrentBufferLine().length;
          if (end.column < rowLength) {
            _this.editor.selectRight();
            return true;
          } else {
            return false;
          }
        };
      })(this));
    };

    return MoveRight;

  })(Motion);

  MoveVertically = (function(_super) {
    __extends(MoveVertically, _super);

    function MoveVertically(editor, vimState) {
      var column;
      this.editor = editor;
      this.vimState = vimState;
      column = this.vimState.desiredCursorColumn;
      MoveVertically.__super__.constructor.call(this, this.editor, this.vimState);
      this.vimState.desiredCursorColumn = column;
    }

    MoveVertically.prototype.isLinewise = function() {
      return this.vimState.mode === 'visual' && this.vimState.submode === 'linewise';
    };

    MoveVertically.prototype.execute = function(count) {
      var column, nextColumn, nextLineLength, nextRow, row, _ref1;
      if (count == null) {
        count = 1;
      }
      _ref1 = this.editor.getCursorBufferPosition(), row = _ref1.row, column = _ref1.column;
      nextRow = this.nextValidRow(count);
      if (nextRow !== row) {
        nextLineLength = this.editor.lineTextForBufferRow(nextRow).length;
        nextColumn = this.vimState.desiredCursorColumn || column;
        if (nextColumn >= nextLineLength) {
          this.editor.setCursorBufferPosition([nextRow, nextLineLength - 1]);
          return this.vimState.desiredCursorColumn = nextColumn;
        } else {
          this.editor.setCursorBufferPosition([nextRow, nextColumn]);
          return this.vimState.desiredCursorColumn = null;
        }
      }
    };

    MoveVertically.prototype.nextValidRow = function(count) {
      var column, maxRow, minRow, row, _ref1;
      _ref1 = this.editor.getCursorBufferPosition(), row = _ref1.row, column = _ref1.column;
      maxRow = this.editor.getLastBufferRow();
      minRow = 0;
      _.times(count, (function(_this) {
        return function() {
          var _results;
          if (_this.editor.isFoldedAtBufferRow(row)) {
            _results = [];
            while (_this.editor.isFoldedAtBufferRow(row)) {
              _results.push(row += _this.directionIncrement());
            }
            return _results;
          } else {
            return row += _this.directionIncrement();
          }
        };
      })(this));
      if (row > maxRow) {
        return maxRow;
      } else if (row < minRow) {
        return minRow;
      } else {
        return row;
      }
    };

    return MoveVertically;

  })(Motion);

  MoveUp = (function(_super) {
    __extends(MoveUp, _super);

    function MoveUp() {
      return MoveUp.__super__.constructor.apply(this, arguments);
    }

    MoveUp.prototype.directionIncrement = function() {
      return -1;
    };

    MoveUp.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      if (!this.inVisualMode()) {
        this.editor.moveToBeginningOfLine();
        this.editor.moveDown();
        this.editor.selectUp();
      }
      return _.times(count, (function(_this) {
        return function() {
          var range, selection;
          if (_this.isLinewise()) {
            selection = _this.editor.getLastSelection();
            range = selection.getBufferRange().copy();
            if (range.coversSameRows(_this.vimState.initialSelectedRange)) {
              range.start.row--;
            } else {
              if (range.start.row < _this.vimState.initialSelectedRange.start.row) {
                range.start.row--;
              } else {
                range.end.row--;
              }
            }
            selection.setBufferRange(range);
          } else {
            _this.editor.selectUp();
          }
          return true;
        };
      })(this));
    };

    return MoveUp;

  })(MoveVertically);

  MoveDown = (function(_super) {
    __extends(MoveDown, _super);

    function MoveDown() {
      return MoveDown.__super__.constructor.apply(this, arguments);
    }

    MoveDown.prototype.directionIncrement = function() {
      return 1;
    };

    MoveDown.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      if (!this.inVisualMode()) {
        this.editor.selectLinesContainingCursors();
      }
      return _.times(count, (function(_this) {
        return function() {
          var range, selection;
          if (_this.isLinewise()) {
            selection = _this.editor.getLastSelection();
            range = selection.getBufferRange().copy();
            if (range.start.row < _this.vimState.initialSelectedRange.start.row) {
              range.start.row++;
            } else {
              range.end.row++;
            }
            selection.setBufferRange(range);
          } else {
            _this.editor.selectDown();
          }
          return true;
        };
      })(this));
    };

    return MoveDown;

  })(MoveVertically);

  MoveToPreviousWord = (function(_super) {
    __extends(MoveToPreviousWord, _super);

    function MoveToPreviousWord() {
      return MoveToPreviousWord.__super__.constructor.apply(this, arguments);
    }

    MoveToPreviousWord.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          return _this.editor.moveToBeginningOfWord();
        };
      })(this));
    };

    MoveToPreviousWord.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          _this.editor.selectToBeginningOfWord();
          return true;
        };
      })(this));
    };

    return MoveToPreviousWord;

  })(Motion);

  MoveToPreviousWholeWord = (function(_super) {
    __extends(MoveToPreviousWholeWord, _super);

    function MoveToPreviousWholeWord() {
      return MoveToPreviousWholeWord.__super__.constructor.apply(this, arguments);
    }

    MoveToPreviousWholeWord.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var _results;
          _this.editor.moveToBeginningOfWord();
          _results = [];
          while (!_this.isWholeWord() && !_this.isBeginningOfFile()) {
            _results.push(_this.editor.moveToBeginningOfWord());
          }
          return _results;
        };
      })(this));
    };

    MoveToPreviousWholeWord.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          _this.editor.selectToBeginningOfWord();
          while (!_this.isWholeWord() && !_this.isBeginningOfFile()) {
            _this.editor.selectToBeginningOfWord();
          }
          return true;
        };
      })(this));
    };

    MoveToPreviousWholeWord.prototype.isWholeWord = function() {
      var char;
      char = this.editor.getLastCursor().getCurrentWordPrefix().slice(-1);
      return char === ' ' || char === '\n';
    };

    MoveToPreviousWholeWord.prototype.isBeginningOfFile = function() {
      var cur;
      cur = this.editor.getCursorBufferPosition();
      return !cur.row && !cur.column;
    };

    return MoveToPreviousWholeWord;

  })(Motion);

  MoveToNextWord = (function(_super) {
    __extends(MoveToNextWord, _super);

    function MoveToNextWord() {
      return MoveToNextWord.__super__.constructor.apply(this, arguments);
    }

    MoveToNextWord.prototype.execute = function(count) {
      var cursor;
      if (count == null) {
        count = 1;
      }
      cursor = this.editor.getLastCursor();
      return _.times(count, (function(_this) {
        return function() {
          var current, next;
          current = cursor.getBufferPosition();
          next = cursor.getBeginningOfNextWordBufferPosition();
          if (_this.isEndOfFile()) {
            return;
          }
          if (cursor.isAtEndOfLine()) {
            cursor.moveDown();
            cursor.moveToBeginningOfLine();
            return cursor.skipLeadingWhitespace();
          } else if (current.row === next.row && current.column === next.column) {
            return cursor.moveToEndOfWord();
          } else {
            return cursor.moveToBeginningOfNextWord();
          }
        };
      })(this));
    };

    MoveToNextWord.prototype.select = function(count, _arg) {
      var cursor, excludeWhitespace;
      if (count == null) {
        count = 1;
      }
      excludeWhitespace = (_arg != null ? _arg : {}).excludeWhitespace;
      cursor = this.editor.getLastCursor();
      return _.times(count, (function(_this) {
        return function() {
          var current, next;
          current = cursor.getBufferPosition();
          next = cursor.getBeginningOfNextWordBufferPosition();
          if (current.row !== next.row || excludeWhitespace || current === next) {
            _this.editor.selectToEndOfWord();
          } else {
            _this.editor.selectToBeginningOfNextWord();
          }
          return true;
        };
      })(this));
    };

    MoveToNextWord.prototype.isEndOfFile = function() {
      var cur, eof;
      cur = this.editor.getLastCursor().getBufferPosition();
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

    MoveToNextWholeWord.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var _results;
          _this.editor.moveToBeginningOfNextWord();
          _results = [];
          while (!_this.isWholeWord() && !_this.isEndOfFile()) {
            _results.push(_this.editor.moveToBeginningOfNextWord());
          }
          return _results;
        };
      })(this));
    };

    MoveToNextWholeWord.prototype.select = function(count, _arg) {
      var cursor, excludeWhitespace;
      if (count == null) {
        count = 1;
      }
      excludeWhitespace = (_arg != null ? _arg : {}).excludeWhitespace;
      cursor = this.editor.getLastCursor();
      return _.times(count, (function(_this) {
        return function() {
          var current, next;
          current = cursor.getBufferPosition();
          next = cursor.getBeginningOfNextWordBufferPosition(/[^\s]/);
          if (current.row !== next.row || excludeWhitespace) {
            _this.editor.selectToEndOfWord();
          } else {
            _this.editor.selectToBeginningOfNextWord();
            while (!_this.isWholeWord() && !_this.isEndOfFile()) {
              _this.editor.selectToBeginningOfNextWord();
            }
          }
          return true;
        };
      })(this));
    };

    MoveToNextWholeWord.prototype.isWholeWord = function() {
      var char;
      char = this.editor.getLastCursor().getCurrentWordPrefix().slice(-1);
      return char === ' ' || char === '\n';
    };

    MoveToNextWholeWord.prototype.isEndOfFile = function() {
      var cur, last;
      last = this.editor.getEofBufferPosition();
      cur = this.editor.getCursorBufferPosition();
      return last.row === cur.row && last.column === cur.column;
    };

    return MoveToNextWholeWord;

  })(Motion);

  MoveToEndOfWord = (function(_super) {
    __extends(MoveToEndOfWord, _super);

    function MoveToEndOfWord() {
      return MoveToEndOfWord.__super__.constructor.apply(this, arguments);
    }

    MoveToEndOfWord.prototype.execute = function(count) {
      var cursor;
      if (count == null) {
        count = 1;
      }
      cursor = this.editor.getLastCursor();
      return _.times(count, (function(_this) {
        return function() {
          return cursor.setBufferPosition(_this.nextBufferPosition({
            exclusive: true
          }));
        };
      })(this));
    };

    MoveToEndOfWord.prototype.select = function(count) {
      var cursor;
      if (count == null) {
        count = 1;
      }
      cursor = this.editor.getLastCursor();
      return _.times(count, (function(_this) {
        return function() {
          var bufferPosition, screenPosition;
          bufferPosition = _this.nextBufferPosition();
          screenPosition = _this.editor.screenPositionForBufferPosition(bufferPosition);
          _this.editor.selectToScreenPosition(screenPosition);
          return true;
        };
      })(this));
    };

    MoveToEndOfWord.prototype.nextBufferPosition = function(_arg) {
      var current, cursor, exclusive, next;
      exclusive = (_arg != null ? _arg : {}).exclusive;
      cursor = this.editor.getLastCursor();
      current = cursor.getBufferPosition();
      next = cursor.getEndOfCurrentWordBufferPosition();
      if (exclusive) {
        next.column -= 1;
      }
      if (exclusive && current.row === next.row && current.column === next.column) {
        cursor.moveRight();
        next = cursor.getEndOfCurrentWordBufferPosition();
        next.column -= 1;
      }
      return next;
    };

    return MoveToEndOfWord;

  })(Motion);

  MoveToEndOfWholeWord = (function(_super) {
    __extends(MoveToEndOfWholeWord, _super);

    function MoveToEndOfWholeWord() {
      return MoveToEndOfWholeWord.__super__.constructor.apply(this, arguments);
    }

    MoveToEndOfWholeWord.prototype.execute = function(count) {
      var cursor;
      if (count == null) {
        count = 1;
      }
      cursor = this.editor.getLastCursor();
      return _.times(count, (function(_this) {
        return function() {
          return cursor.setBufferPosition(_this.nextBufferPosition({
            exclusive: true
          }));
        };
      })(this));
    };

    MoveToEndOfWholeWord.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var bufferPosition, screenPosition;
          bufferPosition = _this.nextBufferPosition();
          screenPosition = _this.editor.screenPositionForBufferPosition(bufferPosition);
          _this.editor.selectToScreenPosition(screenPosition);
          return true;
        };
      })(this));
    };

    MoveToEndOfWholeWord.prototype.nextBufferPosition = function(_arg) {
      var column, exclusive, position, row, scanRange, start, _ref1;
      exclusive = (_arg != null ? _arg : {}).exclusive;
      _ref1 = this.editor.getCursorBufferPosition(), row = _ref1.row, column = _ref1.column;
      start = new Point(row, column + 1);
      scanRange = [start, this.editor.getEofBufferPosition()];
      position = this.editor.getEofBufferPosition();
      this.editor.scanInBufferRange(/\S+/, scanRange, (function(_this) {
        return function(_arg1) {
          var range, stop;
          range = _arg1.range, stop = _arg1.stop;
          position = range.end;
          return stop();
        };
      })(this));
      if (exclusive) {
        position.column -= 1;
      }
      return position;
    };

    return MoveToEndOfWholeWord;

  })(Motion);

  MoveToNextParagraph = (function(_super) {
    __extends(MoveToNextParagraph, _super);

    function MoveToNextParagraph() {
      return MoveToNextParagraph.__super__.constructor.apply(this, arguments);
    }

    MoveToNextParagraph.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          return _this.editor.setCursorScreenPosition(_this.nextPosition());
        };
      })(this));
    };

    MoveToNextParagraph.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          _this.editor.selectToScreenPosition(_this.nextPosition());
          return true;
        };
      })(this));
    };

    MoveToNextParagraph.prototype.nextPosition = function() {
      var column, position, row, scanRange, start, _ref1;
      start = this.editor.getCursorBufferPosition();
      scanRange = [start, this.editor.getEofBufferPosition()];
      _ref1 = this.editor.getEofBufferPosition(), row = _ref1.row, column = _ref1.column;
      position = new Point(row, column - 1);
      this.editor.scanInBufferRange(/^\n*$/g, scanRange, (function(_this) {
        return function(_arg) {
          var range, stop;
          range = _arg.range, stop = _arg.stop;
          if (!range.start.isEqual(start)) {
            position = range.start;
            return stop();
          }
        };
      })(this));
      return this.editor.screenPositionForBufferPosition(position);
    };

    return MoveToNextParagraph;

  })(Motion);

  MoveToPreviousParagraph = (function(_super) {
    __extends(MoveToPreviousParagraph, _super);

    function MoveToPreviousParagraph() {
      return MoveToPreviousParagraph.__super__.constructor.apply(this, arguments);
    }

    MoveToPreviousParagraph.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          return _this.editor.setCursorScreenPosition(_this.previousPosition());
        };
      })(this));
    };

    MoveToPreviousParagraph.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          _this.editor.selectToScreenPosition(_this.previousPosition());
          return true;
        };
      })(this));
    };

    MoveToPreviousParagraph.prototype.previousPosition = function() {
      var column, position, row, scanRange, start;
      start = this.editor.getCursorBufferPosition();
      row = start.row, column = start.column;
      scanRange = [[row - 1, column], [0, 0]];
      position = new Point(0, 0);
      this.editor.backwardsScanInBufferRange(/^\n*$/g, scanRange, (function(_this) {
        return function(_arg) {
          var range, stop;
          range = _arg.range, stop = _arg.stop;
          if (!range.start.isEqual(new Point(0, 0))) {
            position = range.start;
            return stop();
          }
        };
      })(this));
      return this.editor.screenPositionForBufferPosition(position);
    };

    return MoveToPreviousParagraph;

  })(Motion);

  MoveToLine = (function(_super) {
    __extends(MoveToLine, _super);

    function MoveToLine() {
      this.selectRows = __bind(this.selectRows, this);
      return MoveToLine.__super__.constructor.apply(this, arguments);
    }

    MoveToLine.prototype.isLinewise = function() {
      return true;
    };

    MoveToLine.prototype.execute = function(count) {
      this.setCursorPosition(count);
      return this.editor.getLastCursor().skipLeadingWhitespace();
    };

    MoveToLine.prototype.select = function(count, _arg) {
      var column, end, requireEOL, row, start, _ref1;
      if (count == null) {
        count = this.editor.getLineCount();
      }
      requireEOL = (_arg != null ? _arg : {}).requireEOL;
      _ref1 = this.editor.getCursorBufferPosition(), row = _ref1.row, column = _ref1.column;
      if (row >= count) {
        start = count - 1;
        end = row;
      } else {
        start = row;
        end = count - 1;
      }
      this.editor.setSelectedBufferRange(this.selectRows(start, end, {
        requireEOL: requireEOL
      }));
      return _.times(count, function() {
        return true;
      });
    };

    MoveToLine.prototype.selectRows = function(start, end, _arg) {
      var buffer, endPoint, requireEOL, startPoint;
      requireEOL = (_arg != null ? _arg : {}).requireEOL;
      startPoint = null;
      endPoint = null;
      buffer = this.editor.getBuffer();
      if (end >= buffer.getLastRow()) {
        end = buffer.getLastRow();
        if (start > 0 && requireEOL && start === end) {
          startPoint = [start - 1, buffer.lineLengthForRow(start - 1)];
        } else {
          startPoint = [start, 0];
        }
        endPoint = [end, buffer.lineLengthForRow(end)];
      } else {
        startPoint = [start, 0];
        endPoint = [end + 1, 0];
      }
      return new Range(startPoint, endPoint);
    };

    MoveToLine.prototype.setCursorPosition = function(count) {
      return this.editor.setCursorBufferPosition([this.getDestinationRow(count), 0]);
    };

    MoveToLine.prototype.getDestinationRow = function(count) {
      if (count != null) {
        return count - 1;
      } else {
        return this.editor.getLineCount() - 1;
      }
    };

    return MoveToLine;

  })(Motion);

  MoveToRelativeLine = (function(_super) {
    __extends(MoveToRelativeLine, _super);

    function MoveToRelativeLine() {
      return MoveToRelativeLine.__super__.constructor.apply(this, arguments);
    }

    MoveToRelativeLine.prototype.select = function(count, _arg) {
      var column, requireEOL, row, _ref1;
      if (count == null) {
        count = 1;
      }
      requireEOL = (_arg != null ? _arg : {}).requireEOL;
      _ref1 = this.editor.getCursorBufferPosition(), row = _ref1.row, column = _ref1.column;
      this.editor.setSelectedBufferRange(this.selectRows(row, row + (count - 1), {
        requireEOL: requireEOL
      }));
      return _.times(count, function() {
        return true;
      });
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

    MoveToScreenLine.prototype.setCursorPosition = function(count) {
      return this.editor.setCursorScreenPosition([this.getDestinationRow(count), 0]);
    };

    return MoveToScreenLine;

  })(MoveToLine);

  MoveToBeginningOfLine = (function(_super) {
    __extends(MoveToBeginningOfLine, _super);

    function MoveToBeginningOfLine() {
      return MoveToBeginningOfLine.__super__.constructor.apply(this, arguments);
    }

    MoveToBeginningOfLine.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return this.editor.moveToBeginningOfLine();
    };

    MoveToBeginningOfLine.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          _this.editor.selectToBeginningOfLine();
          return true;
        };
      })(this));
    };

    return MoveToBeginningOfLine;

  })(Motion);

  MoveToFirstCharacterOfLine = (function(_super) {
    __extends(MoveToFirstCharacterOfLine, _super);

    function MoveToFirstCharacterOfLine(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.cursor = this.editor.getLastCursor();
      MoveToFirstCharacterOfLine.__super__.constructor.call(this, this.editor, this.vimState);
    }

    MoveToFirstCharacterOfLine.prototype.execute = function() {
      return this.editor.setCursorBufferPosition([this.cursor.getBufferRow(), this.getDestinationColumn()]);
    };

    MoveToFirstCharacterOfLine.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      if (this.getDestinationColumn() !== this.cursor.getBufferColumn()) {
        return _.times(count, (function(_this) {
          return function() {
            _this.editor.selectToFirstCharacterOfLine();
            return true;
          };
        })(this));
      }
    };

    MoveToFirstCharacterOfLine.prototype.getDestinationColumn = function() {
      return this.editor.lineTextForBufferRow(this.cursor.getBufferRow()).search(/\S/);
    };

    return MoveToFirstCharacterOfLine;

  })(Motion);

  MoveToLastCharacterOfLine = (function(_super) {
    __extends(MoveToLastCharacterOfLine, _super);

    function MoveToLastCharacterOfLine() {
      return MoveToLastCharacterOfLine.__super__.constructor.apply(this, arguments);
    }

    MoveToLastCharacterOfLine.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      this.vimState.desiredCursorColumn = Infinity;
      return _.times(count, (function(_this) {
        return function() {
          _this.editor.moveToEndOfLine();
          if (_this.editor.getLastCursor().getBufferColumn() !== 0) {
            return _this.editor.moveLeft();
          }
        };
      })(this));
    };

    MoveToLastCharacterOfLine.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          _this.editor.selectToEndOfLine();
          return true;
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

    MoveToFirstCharacterOfLineUp.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      (new MoveUp(this.editor, this.vimState)).execute(count);
      return (new MoveToFirstCharacterOfLine(this.editor, this.vimState)).execute();
    };

    MoveToFirstCharacterOfLineUp.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return (new MoveUp(this.editor, this.vimState)).select(count);
    };

    return MoveToFirstCharacterOfLineUp;

  })(Motion);

  MoveToFirstCharacterOfLineDown = (function(_super) {
    __extends(MoveToFirstCharacterOfLineDown, _super);

    function MoveToFirstCharacterOfLineDown() {
      return MoveToFirstCharacterOfLineDown.__super__.constructor.apply(this, arguments);
    }

    MoveToFirstCharacterOfLineDown.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      (new MoveDown(this.editor, this.vimState)).execute(count);
      return (new MoveToFirstCharacterOfLine(this.editor, this.vimState)).execute();
    };

    MoveToFirstCharacterOfLineDown.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return (new MoveDown(this.editor, this.vimState)).select(count);
    };

    return MoveToFirstCharacterOfLineDown;

  })(Motion);

  MoveToStartOfFile = (function(_super) {
    __extends(MoveToStartOfFile, _super);

    function MoveToStartOfFile() {
      return MoveToStartOfFile.__super__.constructor.apply(this, arguments);
    }

    MoveToStartOfFile.prototype.isLinewise = function() {
      return this.vimState.mode === 'visual' && this.vimState.submode === 'linewise';
    };

    MoveToStartOfFile.prototype.getDestinationRow = function(count) {
      if (count == null) {
        count = 1;
      }
      return count - 1;
    };

    MoveToStartOfFile.prototype.getDestinationColumn = function(row) {
      if (this.isLinewise()) {
        return 0;
      } else {
        return this.editor.lineTextForBufferRow(row).search(/\S/);
      }
    };

    MoveToStartOfFile.prototype.getStartingColumn = function(column) {
      if (this.isLinewise()) {
        return column;
      } else {
        return column + 1;
      }
    };

    MoveToStartOfFile.prototype.select = function(count) {
      var bufferRange, column, destinationCol, destinationRow, row, startingCol, _ref1;
      if (count == null) {
        count = 1;
      }
      _ref1 = this.editor.getCursorBufferPosition(), row = _ref1.row, column = _ref1.column;
      startingCol = this.getStartingColumn(column);
      destinationRow = this.getDestinationRow(count);
      destinationCol = this.getDestinationColumn(destinationRow);
      bufferRange = new Range([row, startingCol], [destinationRow, destinationCol]);
      return this.editor.setSelectedBufferRange(bufferRange, {
        reversed: true
      });
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
    MoveToLine: MoveToLine,
    MoveToRelativeLine: MoveToRelativeLine,
    MoveToBeginningOfLine: MoveToBeginningOfLine,
    MoveToFirstCharacterOfLineUp: MoveToFirstCharacterOfLineUp,
    MoveToFirstCharacterOfLineDown: MoveToFirstCharacterOfLineDown,
    MoveToFirstCharacterOfLine: MoveToFirstCharacterOfLine,
    MoveToLastCharacterOfLine: MoveToLastCharacterOfLine,
    MoveToStartOfFile: MoveToStartOfFile,
    MoveToTopOfScreen: MoveToTopOfScreen,
    MoveToBottomOfScreen: MoveToBottomOfScreen,
    MoveToMiddleOfScreen: MoveToMiddleOfScreen,
    MoveToEndOfWholeWord: MoveToEndOfWholeWord,
    MotionError: MotionError
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJqQkFBQTtJQUFBOztzRkFBQTs7QUFBQSxFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsT0FBaUIsT0FBQSxDQUFRLE1BQVIsQ0FBakIsRUFBQyxhQUFBLEtBQUQsRUFBUSxhQUFBLEtBRFIsQ0FBQTs7QUFBQSxFQUdNO0FBQ1MsSUFBQSxxQkFBRSxPQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxVQUFBLE9BQ2IsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxjQUFSLENBRFc7SUFBQSxDQUFiOzt1QkFBQTs7TUFKRixDQUFBOztBQUFBLEVBT007QUFDUyxJQUFBLGdCQUFFLE1BQUYsRUFBVyxRQUFYLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxTQUFBLE1BQ2IsQ0FBQTtBQUFBLE1BRHFCLElBQUMsQ0FBQSxXQUFBLFFBQ3RCLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxRQUFRLENBQUMsbUJBQVYsR0FBZ0MsSUFBaEMsQ0FEVztJQUFBLENBQWI7O0FBQUEscUJBR0EsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUFHLEtBQUg7SUFBQSxDQUhaLENBQUE7O0FBQUEscUJBSUEsWUFBQSxHQUFjLFNBQUEsR0FBQTthQUFHLE1BQUg7SUFBQSxDQUpkLENBQUE7O0FBQUEscUJBS0EsWUFBQSxHQUFjLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxRQUFRLENBQUMsSUFBVixLQUFrQixTQUFyQjtJQUFBLENBTGQsQ0FBQTs7a0JBQUE7O01BUkYsQ0FBQTs7QUFBQSxFQWVNO0FBQ0osdUNBQUEsQ0FBQTs7QUFBYSxJQUFBLDBCQUFFLE1BQUYsRUFBVyxRQUFYLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxTQUFBLE1BQ2Is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
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/vim-mode/lib/motions/general-motions.coffee