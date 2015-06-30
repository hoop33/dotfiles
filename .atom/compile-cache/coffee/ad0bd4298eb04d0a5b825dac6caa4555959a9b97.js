(function() {
  var SelectAWord, SelectInsideBrackets, SelectInsideQuotes, SelectInsideWord, TextObject,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TextObject = (function() {
    function TextObject(editor, state) {
      this.editor = editor;
      this.state = state;
    }

    TextObject.prototype.isComplete = function() {
      return true;
    };

    TextObject.prototype.isRecordable = function() {
      return false;
    };

    return TextObject;

  })();

  SelectInsideWord = (function(_super) {
    __extends(SelectInsideWord, _super);

    function SelectInsideWord() {
      return SelectInsideWord.__super__.constructor.apply(this, arguments);
    }

    SelectInsideWord.prototype.select = function() {
      this.editor.selectWordsContainingCursors();
      return [true];
    };

    return SelectInsideWord;

  })(TextObject);

  SelectInsideQuotes = (function(_super) {
    __extends(SelectInsideQuotes, _super);

    function SelectInsideQuotes(editor, char, includeQuotes) {
      this.editor = editor;
      this.char = char;
      this.includeQuotes = includeQuotes;
    }

    SelectInsideQuotes.prototype.findOpeningQuote = function(pos) {
      var line, start;
      start = pos.copy();
      pos = pos.copy();
      while (pos.row >= 0) {
        line = this.editor.lineTextForBufferRow(pos.row);
        if (pos.column === -1) {
          pos.column = line.length - 1;
        }
        while (pos.column >= 0) {
          if (line[pos.column] === this.char) {
            if (pos.column === 0 || line[pos.column - 1] !== '\\') {
              if (this.isStartQuote(pos)) {
                return pos;
              } else {
                return this.lookForwardOnLine(start);
              }
            }
          }
          --pos.column;
        }
        pos.column = -1;
        --pos.row;
      }
      return this.lookForwardOnLine(start);
    };

    SelectInsideQuotes.prototype.isStartQuote = function(end) {
      var line, numQuotes;
      line = this.editor.lineTextForBufferRow(end.row);
      numQuotes = line.substring(0, end.column + 1).replace("'" + this.char, '').split(this.char).length - 1;
      return numQuotes % 2;
    };

    SelectInsideQuotes.prototype.lookForwardOnLine = function(pos) {
      var index, line;
      line = this.editor.lineTextForBufferRow(pos.row);
      index = line.substring(pos.column).indexOf(this.char);
      if (index >= 0) {
        pos.column += index;
        return pos;
      }
      return null;
    };

    SelectInsideQuotes.prototype.findClosingQuote = function(start) {
      var end, endLine, escaping;
      end = start.copy();
      escaping = false;
      while (end.row < this.editor.getLineCount()) {
        endLine = this.editor.lineTextForBufferRow(end.row);
        while (end.column < endLine.length) {
          if (endLine[end.column] === '\\') {
            ++end.column;
          } else if (endLine[end.column] === this.char) {
            if (this.includeQuotes) {
              --start.column;
            }
            if (this.includeQuotes) {
              ++end.column;
            }
            this.editor.expandSelectionsForward((function(_this) {
              return function(selection) {
                selection.cursor.setBufferPosition(start);
                return selection.selectToBufferPosition(end);
              };
            })(this));
            return {
              select: [true],
              end: end
            };
          }
          ++end.column;
        }
        end.column = 0;
        ++end.row;
      }
      return {
        select: [false],
        end: end
      };
    };

    SelectInsideQuotes.prototype.select = function() {
      var end, select, start, _ref;
      start = this.findOpeningQuote(this.editor.getCursorBufferPosition());
      if (start == null) {
        return [false];
      }
      ++start.column;
      _ref = this.findClosingQuote(start), select = _ref.select, end = _ref.end;
      return select;
    };

    return SelectInsideQuotes;

  })(TextObject);

  SelectInsideBrackets = (function(_super) {
    __extends(SelectInsideBrackets, _super);

    function SelectInsideBrackets(editor, beginChar, endChar, includeBrackets) {
      this.editor = editor;
      this.beginChar = beginChar;
      this.endChar = endChar;
      this.includeBrackets = includeBrackets;
    }

    SelectInsideBrackets.prototype.findOpeningBracket = function(pos) {
      var depth, line;
      pos = pos.copy();
      depth = 0;
      while (pos.row >= 0) {
        line = this.editor.lineTextForBufferRow(pos.row);
        if (pos.column === -1) {
          pos.column = line.length - 1;
        }
        while (pos.column >= 0) {
          switch (line[pos.column]) {
            case this.endChar:
              ++depth;
              break;
            case this.beginChar:
              if (--depth < 0) {
                return pos;
              }
          }
          --pos.column;
        }
        pos.column = -1;
        --pos.row;
      }
    };

    SelectInsideBrackets.prototype.findClosingBracket = function(start) {
      var depth, end, endLine;
      end = start.copy();
      depth = 0;
      while (end.row < this.editor.getLineCount()) {
        endLine = this.editor.lineTextForBufferRow(end.row);
        while (end.column < endLine.length) {
          switch (endLine[end.column]) {
            case this.beginChar:
              ++depth;
              break;
            case this.endChar:
              if (--depth < 0) {
                if (this.includeBrackets) {
                  --start.column;
                }
                if (this.includeBrackets) {
                  ++end.column;
                }
                this.editor.expandSelectionsForward((function(_this) {
                  return function(selection) {
                    selection.cursor.setBufferPosition(start);
                    return selection.selectToBufferPosition(end);
                  };
                })(this));
                return {
                  select: [true],
                  end: end
                };
              }
          }
          ++end.column;
        }
        end.column = 0;
        ++end.row;
      }
      return {
        select: [false],
        end: end
      };
    };

    SelectInsideBrackets.prototype.select = function() {
      var end, select, start, _ref;
      start = this.findOpeningBracket(this.editor.getCursorBufferPosition());
      if (start == null) {
        return [false];
      }
      ++start.column;
      _ref = this.findClosingBracket(start), select = _ref.select, end = _ref.end;
      return select;
    };

    return SelectInsideBrackets;

  })(TextObject);

  SelectAWord = (function(_super) {
    __extends(SelectAWord, _super);

    function SelectAWord() {
      return SelectAWord.__super__.constructor.apply(this, arguments);
    }

    SelectAWord.prototype.select = function() {
      this.editor.selectWordsContainingCursors();
      this.editor.selectToBeginningOfNextWord();
      return [true];
    };

    return SelectAWord;

  })(TextObject);

  module.exports = {
    TextObject: TextObject,
    SelectInsideWord: SelectInsideWord,
    SelectInsideQuotes: SelectInsideQuotes,
    SelectInsideBrackets: SelectInsideBrackets,
    SelectAWord: SelectAWord
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1GQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBTTtBQUNTLElBQUEsb0JBQUUsTUFBRixFQUFXLEtBQVgsR0FBQTtBQUFtQixNQUFsQixJQUFDLENBQUEsU0FBQSxNQUFpQixDQUFBO0FBQUEsTUFBVCxJQUFDLENBQUEsUUFBQSxLQUFRLENBQW5CO0lBQUEsQ0FBYjs7QUFBQSx5QkFFQSxVQUFBLEdBQVksU0FBQSxHQUFBO2FBQUcsS0FBSDtJQUFBLENBRlosQ0FBQTs7QUFBQSx5QkFHQSxZQUFBLEdBQWMsU0FBQSxHQUFBO2FBQUcsTUFBSDtJQUFBLENBSGQsQ0FBQTs7c0JBQUE7O01BREYsQ0FBQTs7QUFBQSxFQU1NO0FBQ0osdUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLCtCQUFBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixNQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsNEJBQVIsQ0FBQSxDQUFBLENBQUE7YUFDQSxDQUFDLElBQUQsRUFGTTtJQUFBLENBQVIsQ0FBQTs7NEJBQUE7O0tBRDZCLFdBTi9CLENBQUE7O0FBQUEsRUFlTTtBQUNKLHlDQUFBLENBQUE7O0FBQWEsSUFBQSw0QkFBRSxNQUFGLEVBQVcsSUFBWCxFQUFrQixhQUFsQixHQUFBO0FBQWtDLE1BQWpDLElBQUMsQ0FBQSxTQUFBLE1BQWdDLENBQUE7QUFBQSxNQUF4QixJQUFDLENBQUEsT0FBQSxJQUF1QixDQUFBO0FBQUEsTUFBakIsSUFBQyxDQUFBLGdCQUFBLGFBQWdCLENBQWxDO0lBQUEsQ0FBYjs7QUFBQSxpQ0FFQSxnQkFBQSxHQUFrQixTQUFDLEdBQUQsR0FBQTtBQUNoQixVQUFBLFdBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxHQUFHLENBQUMsSUFBSixDQUFBLENBQVIsQ0FBQTtBQUFBLE1BQ0EsR0FB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
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/vim-mode/lib/text-objects.coffee