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
      this.editor.selectWord();
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
      var line;
      pos = pos.copy();
      while (pos.row >= 0) {
        line = this.editor.lineForBufferRow(pos.row);
        if (pos.column === -1) {
          pos.column = line.length - 1;
        }
        while (pos.column >= 0) {
          if (line[pos.column] === this.char) {
            if (pos.column === 0 || line[pos.column - 1] !== '\\') {
              return pos;
            }
          }
          --pos.column;
        }
        pos.column = -1;
        --pos.row;
      }
    };

    SelectInsideQuotes.prototype.findClosingQuote = function(start) {
      var end, endLine, escaping;
      end = start.copy();
      escaping = false;
      while (end.row < this.editor.getLineCount()) {
        endLine = this.editor.lineForBufferRow(end.row);
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
        line = this.editor.lineForBufferRow(pos.row);
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
        endLine = this.editor.lineForBufferRow(end.row);
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
      this.editor.selectWord();
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1GQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBTTtBQUNTLElBQUEsb0JBQUUsTUFBRixFQUFXLEtBQVgsR0FBQTtBQUFtQixNQUFsQixJQUFDLENBQUEsU0FBQSxNQUFpQixDQUFBO0FBQUEsTUFBVCxJQUFDLENBQUEsUUFBQSxLQUFRLENBQW5CO0lBQUEsQ0FBYjs7QUFBQSx5QkFFQSxVQUFBLEdBQVksU0FBQSxHQUFBO2FBQUcsS0FBSDtJQUFBLENBRlosQ0FBQTs7QUFBQSx5QkFHQSxZQUFBLEdBQWMsU0FBQSxHQUFBO2FBQUcsTUFBSDtJQUFBLENBSGQsQ0FBQTs7c0JBQUE7O01BREYsQ0FBQTs7QUFBQSxFQU1NO0FBQ0osdUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLCtCQUFBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixNQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixDQUFBLENBQUEsQ0FBQTthQUNBLENBQUMsSUFBRCxFQUZNO0lBQUEsQ0FBUixDQUFBOzs0QkFBQTs7S0FENkIsV0FOL0IsQ0FBQTs7QUFBQSxFQWVNO0FBQ0oseUNBQUEsQ0FBQTs7QUFBYSxJQUFBLDRCQUFFLE1BQUYsRUFBVyxJQUFYLEVBQWtCLGFBQWxCLEdBQUE7QUFBa0MsTUFBakMsSUFBQyxDQUFBLFNBQUEsTUFBZ0MsQ0FBQTtBQUFBLE1BQXhCLElBQUMsQ0FBQSxPQUFBLElBQXVCLENBQUE7QUFBQSxNQUFqQixJQUFDLENBQUEsZ0JBQUEsYUFBZ0IsQ0FBbEM7SUFBQSxDQUFiOztBQUFBLGlDQUVBLGdCQUFBLEdBQWtCLFNBQUMsR0FBRCxHQUFBO0FBQ2hCLFVBQUEsSUFBQTtBQUFBLE1BQUEsR0FBQSxHQUFNLEdBQUcsQ0FBQyxJQUFKLENBQUEsQ0FBTixDQUFBO0FBQ0EsYUFBTSxHQUFH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
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/vim-mode/lib/text-objects.coffee