(function() {
  var $$, BracketMatchingMotion, Input, MotionWithInput, Point, Range, Search, SearchBase, SearchCurrentWord, SearchViewModel, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  MotionWithInput = require('./general-motions').MotionWithInput;

  SearchViewModel = require('../view-models/search-view-model');

  Input = require('../view-models/view-model').Input;

  _ref = require('atom'), $$ = _ref.$$, Point = _ref.Point, Range = _ref.Range;

  SearchBase = (function(_super) {
    __extends(SearchBase, _super);

    SearchBase.currentSearch = null;

    function SearchBase(editorView, vimState) {
      this.editorView = editorView;
      this.vimState = vimState;
      this.reversed = __bind(this.reversed, this);
      this.repeat = __bind(this.repeat, this);
      SearchBase.__super__.constructor.call(this, this.editorView, this.vimState);
      Search.currentSearch = this;
      this.reverse = this.initiallyReversed = false;
    }

    SearchBase.prototype.repeat = function(opts) {
      var reverse;
      if (opts == null) {
        opts = {};
      }
      reverse = opts.backwards;
      if (this.initiallyReversed && reverse) {
        this.reverse = false;
      } else {
        this.reverse = reverse || this.initiallyReversed;
      }
      return this;
    };

    SearchBase.prototype.reversed = function() {
      this.initiallyReversed = this.reverse = true;
      return this;
    };

    SearchBase.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      this.scan();
      return this.match(count, (function(_this) {
        return function(pos) {
          return _this.editor.setCursorBufferPosition(pos.range.start);
        };
      })(this));
    };

    SearchBase.prototype.select = function(count) {
      var selectionStart;
      if (count == null) {
        count = 1;
      }
      this.scan();
      selectionStart = this.getSelectionStart();
      this.match(count, (function(_this) {
        return function(pos) {
          var reversed;
          reversed = selectionStart.compare(pos.range.start) > 0;
          return _this.editor.setSelectedBufferRange([selectionStart, pos.range.start], {
            reversed: reversed
          });
        };
      })(this));
      return [true];
    };

    SearchBase.prototype.getSelectionStart = function() {
      var cur, end, start, _ref1;
      cur = this.editor.getCursorBufferPosition();
      _ref1 = this.editor.getSelectedBufferRange(), start = _ref1.start, end = _ref1.end;
      if (start.compare(cur) === 0) {
        return end;
      } else {
        return start;
      }
    };

    SearchBase.prototype.match = function(count, callback) {
      var pos;
      pos = this.matches[(count - 1) % this.matches.length];
      if (pos != null) {
        return callback(pos);
      } else {
        return atom.beep();
      }
    };

    SearchBase.prototype.scan = function() {
      var after, cur, iterator, matchPoints, mod, previous, regexp, term;
      term = this.input.characters;
      mod = 'g';
      if (term.indexOf('\\c') !== -1) {
        term = term.replace('\\c', '');
        mod += 'i';
      }
      regexp = (function() {
        try {
          return new RegExp(term, mod);
        } catch (_error) {
          return new RegExp(_.escapeRegExp(term), mod);
        }
      })();
      cur = this.editor.getCursorBufferPosition();
      matchPoints = [];
      iterator = (function(_this) {
        return function(item) {
          var matchPointItem;
          matchPointItem = {
            range: item.range
          };
          return matchPoints.push(matchPointItem);
        };
      })(this);
      this.editor.scan(regexp, iterator);
      previous = _.filter(matchPoints, (function(_this) {
        return function(point) {
          if (_this.reverse) {
            return point.range.start.compare(cur) < 0;
          } else {
            return point.range.start.compare(cur) <= 0;
          }
        };
      })(this));
      after = _.difference(matchPoints, previous);
      after.push.apply(after, previous);
      if (this.reverse) {
        after = after.reverse();
      }
      return this.matches = after;
    };

    return SearchBase;

  })(MotionWithInput);

  Search = (function(_super) {
    __extends(Search, _super);

    function Search(editorView, vimState) {
      this.editorView = editorView;
      this.vimState = vimState;
      Search.__super__.constructor.call(this, this.editorView, this.vimState);
      this.viewModel = new SearchViewModel(this);
      Search.currentSearch = this;
      this.reverse = this.initiallyReversed = false;
    }

    Search.prototype.compose = function(input) {
      Search.__super__.compose.call(this, input);
      return this.viewModel.value = this.input.characters;
    };

    return Search;

  })(SearchBase);

  SearchCurrentWord = (function(_super) {
    __extends(SearchCurrentWord, _super);

    SearchCurrentWord.keywordRegex = null;

    function SearchCurrentWord(editorView, vimState) {
      var defaultIsKeyword, userIsKeyword;
      this.editorView = editorView;
      this.vimState = vimState;
      SearchCurrentWord.__super__.constructor.call(this, this.editorView, this.vimState);
      Search.currentSearch = this;
      this.reverse = this.initiallyReversed = false;
      defaultIsKeyword = "[@a-zA-Z0-9_\-]+";
      userIsKeyword = atom.config.get('vim-mode.iskeyword');
      this.keywordRegex = new RegExp(userIsKeyword || defaultIsKeyword);
      this.input = new Input(this.getCurrentWordMatch());
    }

    SearchCurrentWord.prototype.getCurrentWord = function(onRecursion) {
      var characters, cursor, wordRange;
      if (onRecursion == null) {
        onRecursion = false;
      }
      cursor = this.editor.getCursor();
      wordRange = cursor.getCurrentWordBufferRange({
        wordRegex: this.keywordRegex
      });
      characters = this.editor.getTextInBufferRange(wordRange);
      if (characters.length === 0 && !onRecursion) {
        if (this.cursorIsOnEOF()) {
          return "";
        } else {
          cursor.moveToNextWordBoundary({
            wordRegex: this.keywordRegex
          });
          return this.getCurrentWord(true);
        }
      } else {
        return characters;
      }
    };

    SearchCurrentWord.prototype.cursorIsOnEOF = function() {
      var cursor, eofPos, pos;
      cursor = this.editor.getCursor();
      pos = cursor.getMoveNextWordBoundaryBufferPosition({
        wordRegex: this.keywordRegex
      });
      eofPos = this.editor.getEofBufferPosition();
      return pos.row === eofPos.row && pos.column === eofPos.column;
    };

    SearchCurrentWord.prototype.getCurrentWordMatch = function() {
      var characters;
      characters = this.getCurrentWord();
      if (characters.length > 0) {
        if (/\W/.test(characters)) {
          return "" + characters + "\\b";
        } else {
          return "\\b" + characters + "\\b";
        }
      } else {
        return characters;
      }
    };

    SearchCurrentWord.prototype.isComplete = function() {
      return true;
    };

    SearchCurrentWord.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      if (this.input.characters.length > 0) {
        return SearchCurrentWord.__super__.execute.call(this, count);
      }
    };

    return SearchCurrentWord;

  })(SearchBase);

  BracketMatchingMotion = (function(_super) {
    __extends(BracketMatchingMotion, _super);

    BracketMatchingMotion.keywordRegex = null;

    function BracketMatchingMotion(editorView, vimState) {
      this.editorView = editorView;
      this.vimState = vimState;
      BracketMatchingMotion.__super__.constructor.call(this, this.editorView, this.vimState);
      Search.currentSearch = this;
      this.reverse = this.initiallyReversed = false;
      this.characters = [')', '(', '}', '{', ']', '['];
      this.charactersMatching = ['(', ')', '{', '}', '[', ']'];
      this.reverseSearch = [true, false, true, false, true, false];
      this.input = new Input(this.getCurrentWordMatch());
    }

    BracketMatchingMotion.prototype.getCurrentWord = function(onRecursion) {
      var cursor, index, tempPoint;
      if (onRecursion == null) {
        onRecursion = false;
      }
      cursor = this.editor.getCursor();
      tempPoint = cursor.getBufferPosition().toArray();
      this.character = this.editor.getTextInBufferRange([cursor.getBufferPosition(), new Point(tempPoint[0], tempPoint[1] + 1)]);
      this.startUp = false;
      index = this.characters.indexOf(this.character);
      if (index >= 0) {
        this.matching = this.charactersMatching[index];
        this.reverse = this.reverseSearch[index];
      } else {
        this.startUp = true;
      }
      return this.character;
    };

    BracketMatchingMotion.prototype.getCurrentWordMatch = function() {
      var characters;
      characters = this.getCurrentWord();
      return characters;
    };

    BracketMatchingMotion.prototype.isComplete = function() {
      return true;
    };

    BracketMatchingMotion.prototype.searchFor = function(character) {
      var after, cur, iterator, matchPoints, matches, previous, regexp, term;
      term = character;
      regexp = new RegExp(_.escapeRegExp(term), 'g');
      cur = this.editor.getCursorBufferPosition();
      matchPoints = [];
      iterator = (function(_this) {
        return function(item) {
          var matchPointItem;
          matchPointItem = {
            range: item.range
          };
          return matchPoints.push(matchPointItem);
        };
      })(this);
      this.editor.scan(regexp, iterator);
      previous = _.filter(matchPoints, (function(_this) {
        return function(point) {
          if (_this.reverse) {
            return point.range.start.compare(cur) < 0;
          } else {
            return point.range.start.compare(cur) <= 0;
          }
        };
      })(this));
      if (this.reverse) {
        after = [];
        after.push.apply(after, previous);
        after = after.reverse();
      } else {
        after = _.difference(matchPoints, previous);
      }
      matches = after;
      return matches;
    };

    BracketMatchingMotion.prototype.select = function(count) {
      var cur;
      if (count == null) {
        count = 1;
      }
      this.scan();
      cur = this.startUp ? this.startUpPos : this.editor.getCursorBufferPosition();
      this.match(count, (function(_this) {
        return function(pos) {
          var tempPoint;
          if (_this.reverse) {
            tempPoint = cur.toArray();
            return _this.editor.setSelectedBufferRange([pos.range.start, new Point(tempPoint[0], tempPoint[1] + 1)], {
              reversed: true
            });
          } else {
            tempPoint = pos.range.start.toArray();
            return _this.editor.setSelectedBufferRange([cur, new Point(tempPoint[0], tempPoint[1] + 1)], {
              reversed: true
            });
          }
        };
      })(this));
      return [true];
    };

    BracketMatchingMotion.prototype.scan = function() {
      var charIndex, compVal, counter, dst, i, iwin, line, matchIndex, matchesCharacter, matchesMatching, min, retVal, winner, _i, _ref1;
      if (this.startUp) {
        this.startUpPos = this.editor.getCursorBufferPosition();
        min = -1;
        iwin = -1;
        for (i = _i = 0, _ref1 = this.characters.length - 1; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
          matchesCharacter = this.searchFor(this.characters[i]);
          if (matchesCharacter.length > 0) {
            dst = matchesCharacter[0].range.start.toArray();
            if (this.startUpPos.toArray()[0] === dst[0] && this.startUpPos.toArray()[1] < dst[1]) {
              if (dst[1] < min || min === -1) {
                line = dst[0];
                min = dst[1];
                iwin = i;
              }
            }
          }
        }
        if (iwin !== -1) {
          this.editor.setCursorBufferPosition(new Point(line, min));
          this.character = this.characters[iwin];
          this.matching = this.charactersMatching[iwin];
          this.reverse = this.reverseSearch[iwin];
        }
      }
      matchesCharacter = this.searchFor(this.character);
      matchesMatching = this.searchFor(this.matching);
      if (matchesMatching.length === 0) {
        this.matches = [];
      } else {
        charIndex = 0;
        matchIndex = 0;
        counter = 1;
        winner = -1;
        if (this.reverse) {
          compVal = 1;
        } else {
          compVal = -1;
        }
        while (counter > 0) {
          if (matchIndex < matchesMatching.length && charIndex < matchesCharacter.length) {
            if (matchesCharacter[charIndex].range.compare(matchesMatching[matchIndex].range) === compVal) {
              counter = counter + 1;
              charIndex = charIndex + 1;
            } else {
              counter = counter - 1;
              winner = matchIndex;
              matchIndex = matchIndex + 1;
            }
          } else if (matchIndex < matchesMatching.length) {
            counter = counter - 1;
            winner = matchIndex;
            matchIndex = matchIndex + 1;
          } else {
            break;
          }
        }
        retVal = [];
        if (counter === 0) {
          retVal.push(matchesMatching[winner]);
        }
        this.matches = retVal;
      }
      if (this.matches.length === 0 && this.startUp) {
        return this.editor.setCursorBufferPosition(this.startUpPos);
      }
    };

    BracketMatchingMotion.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      if (this.input.characters.length > 0) {
        return BracketMatchingMotion.__super__.execute.call(this, count);
      }
    };

    return BracketMatchingMotion;

  })(SearchBase);

  module.exports = {
    Search: Search,
    SearchCurrentWord: SearchCurrentWord,
    BracketMatchingMotion: BracketMatchingMotion
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdJQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQyxrQkFBbUIsT0FBQSxDQUFRLG1CQUFSLEVBQW5CLGVBREQsQ0FBQTs7QUFBQSxFQUVBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLGtDQUFSLENBRmxCLENBQUE7O0FBQUEsRUFHQyxRQUFTLE9BQUEsQ0FBUSwyQkFBUixFQUFULEtBSEQsQ0FBQTs7QUFBQSxFQUlBLE9BQXFCLE9BQUEsQ0FBUSxNQUFSLENBQXJCLEVBQUMsVUFBQSxFQUFELEVBQUssYUFBQSxLQUFMLEVBQVksYUFBQSxLQUpaLENBQUE7O0FBQUEsRUFNTTtBQUNKLGlDQUFBLENBQUE7O0FBQUEsSUFBQSxVQUFDLENBQUEsYUFBRCxHQUFnQixJQUFoQixDQUFBOztBQUNhLElBQUEsb0JBQUUsVUFBRixFQUFlLFFBQWYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLGFBQUEsVUFDYixDQUFBO0FBQUEsTUFEeUIsSUFBQyxDQUFBLFdBQUEsUUFDMUIsQ0FBQTtBQUFBLGlEQUFBLENBQUE7QUFBQSw2Q0FBQSxDQUFBO0FBQUEsTUFBQSw0Q0FBTSxJQUFDLENBQUEsVUFBUCxFQUFtQixJQUFDLENBQUEsUUFBcEIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxNQUFNLENBQUMsYUFBUCxHQUF1QixJQUR2QixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUMsQ0FBQSxpQkFBRCxHQUFxQixLQUZoQyxDQURXO0lBQUEsQ0FEYjs7QUFBQSx5QkFNQSxNQUFBLEdBQVEsU0FBQyxJQUFELEdBQUE7QUFDTixVQUFBLE9BQUE7O1FBRE8sT0FBTztPQUNkO0FBQUEsTUFBQSxPQUFBLEdBQVUsSUFBSSxDQUFDLFNBQWYsQ0FBQTtBQUNBLE1BQUEsSUFBRyxJQUFDLENBQUEsaUJBQUQsSUFBdUIsT0FBMUI7QUFDRSxRQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsS0FBWCxDQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxPQUFBLElBQVcsSUFBQyxDQUFBLGlCQUF2QixDQUhGO09BREE7YUFLQSxLQU5NO0lBQUEsQ0FOUixDQUFBOztBQUFBLHlCQWNBLFFBQUEsR0FBVSxTQUFBLEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSxpQkFBRCxHQUFxQixJQUFDLENBQUEsT0FBRCxHQUFXLElBQWhDLENBQUE7YUFDQSxLQUZRO0lBQUEsQ0FkVixDQUFBOztBQUFBLHlCQWtCQSxPQUFBLEdBQVMsU0FBQyxLQUFELEdBQUE7O1FBQUMsUUFBTTtPQUNkO0FBQUEsTUFBQSxJQUFDLENBQUEsSUFBRCxDQUFBLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxLQUFELENBQU8sS0FBUCxFQUFjLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEdBQUQsR0FBQTtpQkFDWixLQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQWdDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBMUMsRUFEWTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWQsRUFGTztJQUFBLENBbEJULENBQUE7O0FBQUEseUJBdUJBLE1BQUEsR0FBUSxTQUFDLEtBQUQsR0FBQTtBQUNOLFVBQUEsY0FBQTs7UUFETyxRQUFNO09BQ2I7QUFBQSxNQUFBLElBQUMsQ0FBQSxJQUFELENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxjQUFBLEdBQWlCLElBQUMsQ0FBQSxpQkFBRCxDQUFBLENBRGpCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxLQUFELENBQU8sS0FBUCxFQUFjLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEdBQUQsR0FBQTtBQUNaLGNBQUEsUUFBQTtBQUFBLFVBQUEsUUFBQSxHQUFXLGNBQWMsQ0FBQyxPQUFmLENBQXVCLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBakMsQ0FBQSxHQUEwQyxDQUFyRCxDQUFBO2lCQUNBLEtBQUMsQ0FBQSxNQUFNLENBQUMsc0JBQVIsQ0FBK0IsQ0FBQyxjQUFELEVBQWlCLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBM0IsQ0FBL0IsRUFBa0U7QUFBQSxZQUFDLFVBQUEsUUFBRDtXQUFsRSxFQUZZO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBZCxDQUZBLENBQUE7YUFLQSxDQUFDLElBQUQsRUFOTTtJQUFBLENBdkJSLENBQUE7O0FBQUEseUJBK0JBLGlCQUFBLEdBQW1CLFNBQUEsR0FBQTtBQUNqQixVQUFBLHNCQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU0sSUFBQyxDQUFBLE1BQU0sQ0FBQyx1QkFBUixDQUFBLENBQU4sQ0FBQTtBQUFBLE1BQ0EsUUFBZSxJQUFDLENBQUEsTUFBTSxDQUFDLHNCQUFSLENBQUEsQ0FBZixFQUFDLGNBQUEsS0FBRCxFQUFRLFlBQUEsR0FEUixDQUFBO0FBRUEsTUFBQSxJQUFHLEtBQUssQ0FBQyxPQUFOLENBQWMsR0FBZCxDQUFBLEtBQXNCLENBQXpCO2VBQWdDLElBQWhDO09BQUEsTUFBQTtlQUF5QyxNQUF6QztPQUhpQjtJQUFBLENBL0JuQixDQUFBOztBQUFBLHlCQW9DQSxLQUFBLEdBQU8sU0FBQyxLQUFELEVBQVEsUUFBUixHQUFBO0FBQ0wsVUFBQSxHQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU0sSUFBQyxDQUFBLE9BQVEsQ0FBQSxDQUFDLEtBQUEsR0FBUSxDQUFULENBQUEsR0FBYyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQXZCLENBQWYsQ0FBQTtBQUNBLE1BQUEsSUFBRyxXQUFIO2VBQ0UsUUFBQSxDQUFTLEdBQVQsRUFERjtPQUFBLE1BQUE7ZUFHRSxJQUFJLENBQUMsSUFBTCxDQUFBLEVBSEY7T0FGSztJQUFBLENBcENQLENBQUE7O0FBQUEseUJBMkNBLElBQUEsR0FBTSxTQUFBLEdBQUE7QUFDSixVQUFBLDhEQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sSUFBQyxDQUFBLEtBQUssQ0FBQyxVQUFkLENBQUE7QUFBQSxNQUNBLEdBQUEsR0FBTSxHQUROLENBQUE7QUFFQSxNQUFBLElBQUcsSUFBSSxDQUFDLE9BQUwsQ0FBYSxLQUFiLENBQUEsS0FBdUIsQ0FBQSxDQUExQjtBQUNFLFFBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsS0FBYixFQUFtQixFQUFuQixDQUFQLENBQUE7QUFBQSxRQUNBLEdBQUEsSUFBTyxHQURQLENBREY7T0FGQTtBQUFBLE1BS0EsTUFBQTtBQUNFO2lCQUNNLElBQUEsTUFBQSxDQUFPLElBQVAsRUFBYSxHQUFiLEVBRE47U0FBQSxjQUFBO2lCQUdNLElBQUEsTUFBQSxDQUFPLENBQUMsQ0FBQyxZQUFGLENBQWUsSUFBZixDQUFQLEVBQTZCLEdBQTdCLEVBSE47O1VBTkYsQ0FBQTtBQUFBLE1BV0EsR0FBQSxHQUFNLElBQUMsQ0FBQSxNQUFNLENBQUMsdUJBQVIsQ0FBQSxDQVhOLENBQUE7QUFBQSxNQVlBLFdBQUEsR0FBYyxFQVpkLENBQUE7QUFBQSxNQWFBLFFBQUEsR0FBVyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxJQUFELEdBQUE7QUFDVCxjQUFBLGNBQUE7QUFBQSxVQUFBLGNBQUEsR0FDRTtBQUFBLFlBQUEsS0FBQSxFQUFPLElBQUksQ0FBQyxLQUFaO1dBREYsQ0FBQTtpQkFFQSxXQUFXLENBQUMsSUFBWixDQUFpQixjQUFqQixFQUhTO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FiWCxDQUFBO0FBQUEsTUFrQkEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLENBQWEsTUFBYixFQUFxQixRQUFyQixDQWxCQSxDQUFBO0FBQUEsTUFvQkEsUUFBQSxHQUFXLENBQUMsQ0FBQyxNQUFGLENBQVMsV0FBVCxFQUFzQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxLQUFELEdBQUE7QUFDL0IsVUFBQSxJQUFHLEtBQUMsQ0FBQSxPQUFKO21CQUNFLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQWxCLENBQTBCLEdBQTFCLENBQUEsR0FBaUMsRUFEbkM7V0FBQSxNQUFBO21CQUdFLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQWxCLENBQTBCLEdBQTFCLENBQUEsSUFBa0MsRUFIcEM7V0FEK0I7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF0QixDQXBCWCxDQUFBO0FBQUEsTUEwQkEsS0FBQSxHQUFRLENBQUMsQ0FBQyxVQUFGLENBQWEsV0FBYixFQUEwQixRQUExQixDQTFCUixDQUFBO0FBQUEsTUEyQkEsS0FBSyxDQUFDLElBQU4sY0FBVyxRQUFYLENBM0JBLENBQUE7QUE0QkEsTUFBQSxJQUEyQixJQUFDLENBQUEsT0FBNUI7QUFBQSxRQUFBLEtBQUEsR0FBUSxLQUFLLENBQUMsT0FBTixDQUFBLENBQVIsQ0FBQTtPQTVCQTthQThCQSxJQUFDLENBQUEsT0FBRCxHQUFXLE1BL0JQO0lBQUEsQ0EzQ04sQ0FBQTs7c0JBQUE7O0tBRHVCLGdCQU56QixDQUFBOztBQUFBLEVBbUZNO0FBQ0osNkJBQUEsQ0FBQTs7QUFBYSxJQUFBLGdCQUFFLFVBQUYsRUFBZSxRQUFmLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxhQUFBLFVBQ2IsQ0FBQTtBQUFBLE1BRHlCLElBQUMsQ0FBQSxXQUFBLFFBQzFCLENBQUE7QUFBQSxNQUFBLHdDQUFNLElBQUMsQ0FBQSxVQUFQLEVBQW1CLElBQUMsQ0FBQSxRQUFwQixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxTQUFELEdBQWlCLElBQUEsZUFBQSxDQUFnQixJQUFoQixDQURqQixDQUFBO0FBQUEsTUFFQSxNQUFNLENBQUMsYUFBUCxHQUF1QixJQUZ2QixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUMsQ0FBQSxpQkFBRCxHQUFxQixLQUhoQyxDQURXO0lBQUEsQ0FBYjs7QUFBQSxxQkFNQSxPQUFBLEdBQVMsU0FBQyxLQUFELEdBQUE7QUFDUCxNQUFBLG9DQUFNLEtBQU4sQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxLQUFYLEdBQW1CLElBQUMsQ0FBQSxLQUFLLENBQUMsV0FGbkI7SUFBQSxDQU5ULENBQUE7O2tCQUFBOztLQURtQixXQW5GckIsQ0FBQTs7QUFBQSxFQThGTTtBQUNKLHdDQUFBLENBQUE7O0FBQUEsSUFBQSxpQkFBQyxDQUFBLFlBQUQsR0FBZSxJQUFmLENBQUE7O0FBQ2EsSUFBQSwyQkFBRSxVQUFGLEVBQWUsUUFBZixHQUFBO0FBQ1gsVUFBQSwrQkFBQTtBQUFBLE1BRFksSUFBQyxDQUFBLGFBQUEsVUFDYixDQUFBO0FBQUEsTUFEeUIsSUFBQyxDQUFBLFdBQUEsUUFDMUIsQ0FBQTtBQUFBLE1BQUEsbURBQU0sSUFBQyxDQUFBLFVBQVAsRUFBbUIsSUFBQyxDQUFBLFFBQXBCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsTUFBTSxDQUFDLGFBQVAsR0FBdUIsSUFEdkIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFDLENBQUEsaUJBQUQsR0FBcUIsS0FGaEMsQ0FBQTtBQUFBLE1BS0EsZ0JBQUEsR0FBbUIsa0JBTG5CLENBQUE7QUFBQSxNQU1BLGFBQUEsR0FBZ0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG9CQUFoQixDQU5oQixDQUFBO0FBQUEsTUFPQSxJQUFDLENBQUEsWUFBRCxHQUFvQixJQUFBLE1BQUEsQ0FBTyxhQUFBLElBQWlCLGdCQUF4QixDQVBwQixDQUFBO0FBQUEsTUFTQSxJQUFDLENBQUEsS0FBRCxHQUFhLElBQUEsS0FBQSxDQUFNLElBQUMsQ0FBQSxtQkFBRCxDQUFBLENBQU4sQ0FUYixDQURXO0lBQUEsQ0FEYjs7QUFBQSxnQ0FhQSxjQUFBLEdBQWdCLFNBQUMsV0FBRCxHQUFBO0FBQ2QsVUFBQSw2QkFBQTs7UUFEZSxjQUFZO09BQzNCO0FBQUEsTUFBQSxNQUFBLEdBQVMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFSLENBQUEsQ0FBVCxDQUFBO0FBQUEsTUFDQSxTQUFBLEdBQWEsTUFBTSxDQUFDLHlCQUFQLENBQWlDO0FBQUEsUUFBQSxTQUFBLEVBQVcsSUFBQyxDQUFBLFlBQVo7T0FBakMsQ0FEYixDQUFBO0FBQUEsTUFFQSxVQUFBLEdBQWEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixTQUE3QixDQUZiLENBQUE7QUFNQSxNQUFBLElBQUcsVUFBVSxDQUFDLE1BQVgsS0FBcUIsQ0FBckIsSUFBMkIsQ0FBQSxXQUE5QjtBQUNFLFFBQUEsSUFBRyxJQUFDLENBQUEsYUFBRCxDQUFBLENBQUg7aUJBQ0UsR0FERjtTQUFBLE1BQUE7QUFHRSxVQUFBLE1BQU0sQ0FBQyxzQkFBUCxDQUE4QjtBQUFBLFlBQUEsU0FBQSxFQUFXLElBQUMsQ0FBQSxZQUFaO1dBQTlCLENBQUEsQ0FBQTtpQkFDQSxJQUFDLENBQUEsY0FBRCxDQUFnQixJQUFoQixFQUpGO1NBREY7T0FBQSxNQUFBO2VBT0UsV0FQRjtPQVBjO0lBQUEsQ0FiaEIsQ0FBQTs7QUFBQSxnQ0E2QkEsYUFBQSxHQUFlLFNBQUEsR0FBQTtBQUNiLFVBQUEsbUJBQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVIsQ0FBQSxDQUFULENBQUE7QUFBQSxNQUNBLEdBQUEsR0FBTSxNQUFNLENBQUMscUNBQVAsQ0FBNkM7QUFBQSxRQUFBLFNBQUEsRUFBVyxJQUFDLENBQUEsWUFBWjtPQUE3QyxDQUROLENBQUE7QUFBQSxNQUVBLE1BQUEsR0FBUyxJQUFDLENBQUEsTUFBTSxDQUFDLG9CQUFSLENBQUEsQ0FGVCxDQUFBO2FBR0EsR0FBRyxDQUFDLEdBQUosS0FBVyxNQUFNLENBQUMsR0FBbEIsSUFBeUIsR0FBRyxDQUFDLE1BQUosS0FBYyxNQUFNLENBQUMsT0FKakM7SUFBQSxDQTdCZixDQUFBOztBQUFBLGdDQW1DQSxtQkFBQSxHQUFxQixTQUFBLEdBQUE7QUFDbkIsVUFBQSxVQUFBO0FBQUEsTUFBQSxVQUFBLEdBQWEsSUFBQyxDQUFBLGNBQUQsQ0FBQSxDQUFiLENBQUE7QUFDQSxNQUFBLElBQUcsVUFBVSxDQUFDLE1BQVgsR0FBb0IsQ0FBdkI7QUFDRSxRQUFBLElBQUcsSUFBSSxDQUFDLElBQUwsQ0FBVSxVQUFWLENBQUg7aUJBQThCLEVBQUEsR0FBRSxVQUFGLEdBQWMsTUFBNUM7U0FBQSxNQUFBO2lCQUF1RCxLQUFBLEdBQUksVUFBSixHQUFnQixNQUF2RTtTQURGO09BQUEsTUFBQTtlQUdFLFdBSEY7T0FGbUI7SUFBQSxDQW5DckIsQ0FBQTs7QUFBQSxnQ0EwQ0EsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUFHLEtBQUg7SUFBQSxDQTFDWixDQUFBOztBQUFBLGdDQTRDQSxPQUFBLEdBQVMsU0FBQyxLQUFELEdBQUE7O1FBQUMsUUFBTTtPQUNkO0FBQUEsTUFBQSxJQUFnQixJQUFDLENBQUEsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFsQixHQUEyQixDQUEzQztlQUFBLCtDQUFNLEtBQU4sRUFBQTtPQURPO0lBQUEsQ0E1Q1QsQ0FBQTs7NkJBQUE7O0tBRDhCLFdBOUZoQyxDQUFBOztBQUFBLEVBK0lNO0FBQ0osNENBQUEsQ0FBQTs7QUFBQSxJQUFBLHFCQUFDLENBQUEsWUFBRCxHQUFlLElBQWYsQ0FBQTs7QUFDYSxJQUFBLCtCQUFFLFVBQUYsRUFBZSxRQUFmLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxhQUFBLFVBQ2IsQ0FBQTtBQUFBLE1BRHlCLElBQUMsQ0FBQSxXQUFBLFFBQzFCLENBQUE7QUFBQSxNQUFBLHVEQUFNLElBQUMsQ0FBQSxVQUFQLEVBQW1CLElBQUMsQ0FBQSxRQUFwQixDQUFBLENBQUE7QUFBQSxNQUNBLE1BQU0sQ0FBQyxhQUFQLEdBQXVCLElBRHZCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBQyxDQUFBLGlCQUFELEdBQXFCLEtBRmhDLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxVQUFELEdBQXNCLENBQUMsR0FBRCxFQUFLLEdBQUwsRUFBUyxHQUFULEVBQWEsR0FBYixFQUFpQixHQUFqQixFQUFxQixHQUFyQixDQUh0QixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsa0JBQUQsR0FBc0IsQ0FBQyxHQUFELEVBQUssR0FBTCxFQUFTLEdBQVQsRUFBYSxHQUFiLEVBQWlCLEdBQWpCLEVBQXFCLEdBQXJCLENBSnRCLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxhQUFELEdBQXNCLENBQUMsSUFBRCxFQUFNLEtBQU4sRUFBWSxJQUFaLEVBQWlCLEtBQWpCLEVBQXVCLElBQXZCLEVBQTRCLEtBQTVCLENBTHRCLENBQUE7QUFBQSxNQVFBLElBQUMsQ0FBQSxLQUFELEdBQWEsSUFBQSxLQUFBLENBQU0sSUFBQyxDQUFBLG1CQUFELENBQUEsQ0FBTixDQVJiLENBRFc7SUFBQSxDQURiOztBQUFBLG9DQVlBLGNBQUEsR0FBZ0IsU0FBQyxXQUFELEdBQUE7QUFDZCxVQUFBLHdCQUFBOztRQURlLGNBQVk7T0FDM0I7QUFBQSxNQUFBLE1BQUEsR0FBUyxJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVIsQ0FBQSxDQUFULENBQUE7QUFBQSxNQUNBLFNBQUEsR0FBWSxNQUFNLENBQUMsaUJBQVAsQ0FBQSxDQUEwQixDQUFDLE9BQTNCLENBQUEsQ0FEWixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsU0FBRCxHQUFhLElBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBNkIsQ0FBQyxNQUFNLENBQUMsaUJBQVAsQ0FBQSxDQUFELEVBQWdDLElBQUEsS0FBQSxDQUFNLFNBQVUsQ0FBQSxDQUFBLENBQWhCLEVBQW1CLFNBQVUsQ0FBQSxDQUFBLENBQVYsR0FBZSxDQUFsQyxDQUFoQyxDQUE3QixDQUZiLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxPQUFELEdBQVcsS0FIWCxDQUFBO0FBQUEsTUFJQSxLQUFBLEdBQVEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLENBQW9CLElBQUMsQ0FBQSxTQUFyQixDQUpSLENBQUE7QUFLQSxNQUFBLElBQUcsS0FBQSxJQUFTLENBQVo7QUFDRSxRQUFBLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBQyxDQUFBLGtCQUFtQixDQUFBLEtBQUEsQ0FBaEMsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFDLENBQUEsYUFBYyxDQUFBLEtBQUEsQ0FEMUIsQ0FERjtPQUFBLE1BQUE7QUFJRSxRQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBWCxDQUpGO09BTEE7YUFXQSxJQUFDLENBQUEsVUFaYTtJQUFBLENBWmhCLENBQUE7O0FBQUEsb0NBMEJBLG1CQUFBLEdBQXFCLFNBQUEsR0FBQTtBQUNuQixVQUFBLFVBQUE7QUFBQSxNQUFBLFVBQUEsR0FBYSxJQUFDLENBQUEsY0FBRCxDQUFBLENBQWIsQ0FBQTthQUNBLFdBRm1CO0lBQUEsQ0ExQnJCLENBQUE7O0FBQUEsb0NBOEJBLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFBRyxLQUFIO0lBQUEsQ0E5QlosQ0FBQTs7QUFBQSxvQ0FnQ0EsU0FBQSxHQUFVLFNBQUMsU0FBRCxHQUFBO0FBQ1IsVUFBQSxrRUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLFNBQVAsQ0FBQTtBQUFBLE1BQ0EsTUFBQSxHQUNRLElBQUEsTUFBQSxDQUFPLENBQUMsQ0FBQyxZQUFGLENBQWUsSUFBZixDQUFQLEVBQTZCLEdBQTdCLENBRlIsQ0FBQTtBQUFBLE1BSUEsR0FBQSxHQUFNLElBQUMsQ0FBQSxNQUFNLENBQUMsdUJBQVIsQ0FBQSxDQUpOLENBQUE7QUFBQSxNQUtBLFdBQUEsR0FBYyxFQUxkLENBQUE7QUFBQSxNQU1BLFFBQUEsR0FBVyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxJQUFELEdBQUE7QUFDVCxjQUFBLGNBQUE7QUFBQSxVQUFBLGNBQUEsR0FDRTtBQUFBLFlBQUEsS0FBQSxFQUFPLElBQUksQ0FBQyxLQUFaO1dBREYsQ0FBQTtpQkFFQSxXQUFXLENBQUMsSUFBWixDQUFpQixjQUFqQixFQUhTO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FOWCxDQUFBO0FBQUEsTUFXQSxJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsQ0FBYSxNQUFiLEVBQXFCLFFBQXJCLENBWEEsQ0FBQTtBQUFBLE1BYUEsUUFBQSxHQUFXLENBQUMsQ0FBQyxNQUFGLENBQVMsV0FBVCxFQUFzQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxLQUFELEdBQUE7QUFDL0IsVUFBQSxJQUFHLEtBQUMsQ0FBQSxPQUFKO21CQUNFLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQWxCLENBQTBCLEdBQTFCLENBQUEsR0FBaUMsRUFEbkM7V0FBQSxNQUFBO21CQUdFLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQWxCLENBQTBCLEdBQTFCLENBQUEsSUFBa0MsRUFIcEM7V0FEK0I7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF0QixDQWJYLENBQUE7QUFtQkEsTUFBQSxJQUFHLElBQUMsQ0FBQSxPQUFKO0FBQ0UsUUFBQSxLQUFBLEdBQVEsRUFBUixDQUFBO0FBQUEsUUFDQSxLQUFLLENBQUMsSUFBTixjQUFXLFFBQVgsQ0FEQSxDQUFBO0FBQUEsUUFFQSxLQUFBLEdBQVEsS0FBSyxDQUFDLE9BQU4sQ0FBQSxDQUZSLENBREY7T0FBQSxNQUFBO0FBS0UsUUFBQSxLQUFBLEdBQVEsQ0FBQyxDQUFDLFVBQUYsQ0FBYSxXQUFiLEVBQTBCLFFBQTFCLENBQVIsQ0FMRjtPQW5CQTtBQUFBLE1BMEJBLE9BQUEsR0FBVSxLQTFCVixDQUFBO2FBMkJBLFFBNUJRO0lBQUEsQ0FoQ1YsQ0FBQTs7QUFBQSxvQ0E4REEsTUFBQSxHQUFRLFNBQUMsS0FBRCxHQUFBO0FBQ04sVUFBQSxHQUFBOztRQURPLFFBQU07T0FDYjtBQUFBLE1BQUEsSUFBQyxDQUFBLElBQUQsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUVBLEdBQUEsR0FBUyxJQUFDLENBQUEsT0FBSixHQUFpQixJQUFDLENBQUEsVUFBbEIsR0FBa0MsSUFBQyxDQUFBLE1BQU0sQ0FBQyx1QkFBUixDQUFBLENBRnhDLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxLQUFELENBQU8sS0FBUCxFQUFjLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEdBQUQsR0FBQTtBQUNaLGNBQUEsU0FBQTtBQUFBLFVBQUEsSUFBRyxLQUFDLENBQUEsT0FBSjtBQUNFLFlBQUEsU0FBQSxHQUFZLEdBQUcsQ0FBQyxPQUFKLENBQUEsQ0FBWixDQUFBO21CQUNBLEtBQUMsQ0FBQSxNQUFNLENBQUMsc0JBQVIsQ0FBK0IsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQVgsRUFBc0IsSUFBQSxLQUFBLENBQU0sU0FBVSxDQUFBLENBQUEsQ0FBaEIsRUFBbUIsU0FBVSxDQUFBLENBQUEsQ0FBVixHQUFlLENBQWxDLENBQXRCLENBQS9CLEVBQTRGO0FBQUEsY0FBQyxRQUFBLEVBQVUsSUFBWDthQUE1RixFQUZGO1dBQUEsTUFBQTtBQUlFLFlBQUEsU0FBQSxHQUFZLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQWhCLENBQUEsQ0FBWixDQUFBO21CQUNBLEtBQUMsQ0FBQSxNQUFNLENBQUMsc0JBQVIsQ0FBK0IsQ0FBRSxHQUFGLEVBQVcsSUFBQSxLQUFBLENBQU0sU0FBVSxDQUFBLENBQUEsQ0FBaEIsRUFBbUIsU0FBVSxDQUFBLENBQUEsQ0FBVixHQUFlLENBQWxDLENBQVgsQ0FBL0IsRUFBaUY7QUFBQSxjQUFDLFFBQUEsRUFBVSxJQUFYO2FBQWpGLEVBTEY7V0FEWTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWQsQ0FKQSxDQUFBO2FBV0EsQ0FBQyxJQUFELEVBWk07SUFBQSxDQTlEUixDQUFBOztBQUFBLG9DQTRFQSxJQUFBLEdBQU0sU0FBQSxHQUFBO0FBQ0osVUFBQSw4SEFBQTtBQUFBLE1BQUEsSUFBRyxJQUFDLENBQUEsT0FBSjtBQUNFLFFBQUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQUEsQ0FBZCxDQUFBO0FBQUEsUUFDQSxHQUFBLEdBQU0sQ0FBQSxDQUROLENBQUE7QUFBQSxRQUVBLElBQUEsR0FBTyxDQUFBLENBRlAsQ0FBQTtBQUdBLGFBQVMsb0hBQVQsR0FBQTtBQUNFLFVBQUEsZ0JBQUEsR0FBbUIsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFDLENBQUEsVUFBVyxDQUFBLENBQUEsQ0FBdkIsQ0FBbkIsQ0FBQTtBQUNBLFVBQUEsSUFBRyxnQkFBZ0IsQ0FBQyxNQUFqQixHQUEwQixDQUE3QjtBQUNFLFlBQUEsR0FBQSxHQUFNLGdCQUFpQixDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBaEMsQ0FBQSxDQUFOLENBQUE7QUFDQSxZQUFBLElBQUcsSUFBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLENBQUEsQ0FBc0IsQ0FBQSxDQUFBLENBQXRCLEtBQTRCLEdBQUksQ0FBQSxDQUFBLENBQWhDLElBQXVDLElBQUMsQ0FBQSxVQUFVLENBQUMsT0FBWixDQUFBLENBQXNCLENBQUEsQ0FBQSxDQUF0QixHQUEyQixHQUFJLENBQUEsQ0FBQSxDQUF6RTtBQUNFLGNBQUEsSUFBRyxHQUFJLENBQUEsQ0FBQSxDQUFKLEdBQVMsR0FBVCxJQUFnQixHQUFBLEtBQU8sQ0FBQSxDQUExQjtBQUNFLGdCQUFBLElBQUEsR0FBTyxHQUFJLENBQUEsQ0FBQSxDQUFYLENBQUE7QUFBQSxnQkFDQSxHQUFBLEdBQU0sR0FBSSxDQUFBLENBQUEsQ0FEVixDQUFBO0FBQUEsZ0JBRUEsSUFBQSxHQUFPLENBRlAsQ0FERjtlQURGO2FBRkY7V0FGRjtBQUFBLFNBSEE7QUFZQSxRQUFBLElBQUcsSUFBQSxLQUFRLENBQUEsQ0FBWDtBQUNFLFVBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyx1QkFBUixDQUFvQyxJQUFBLEtBQUEsQ0FBTSxJQUFOLEVBQVcsR0FBWCxDQUFwQyxDQUFBLENBQUE7QUFBQSxVQUNBLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBQyxDQUFBLFVBQVcsQ0FBQSxJQUFBLENBRHpCLENBQUE7QUFBQSxVQUVBLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBQyxDQUFBLGtCQUFtQixDQUFBLElBQUEsQ0FGaEMsQ0FBQTtBQUFBLFVBR0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFDLENBQUEsYUFBYyxDQUFBLElBQUEsQ0FIMUIsQ0FERjtTQWJGO09BQUE7QUFBQSxNQW1CQSxnQkFBQSxHQUFtQixJQUFDLENBQUEsU0FBRCxDQUFXLElBQUMsQ0FBQSxTQUFaLENBbkJuQixDQUFBO0FBQUEsTUFvQkEsZUFBQSxHQUFrQixJQUFDLENBQUEsU0FBRCxDQUFXLElBQUMsQ0FBQSxRQUFaLENBcEJsQixDQUFBO0FBcUJBLE1BQUEsSUFBRyxlQUFlLENBQUMsTUFBaEIsS0FBMEIsQ0FBN0I7QUFDRSxRQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsRUFBWCxDQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsU0FBQSxHQUFZLENBQVosQ0FBQTtBQUFBLFFBQ0EsVUFBQSxHQUFhLENBRGIsQ0FBQTtBQUFBLFFBRUEsT0FBQSxHQUFVLENBRlYsQ0FBQTtBQUFBLFFBR0EsTUFBQSxHQUFTLENBQUEsQ0FIVCxDQUFBO0FBSUEsUUFBQSxJQUFHLElBQUMsQ0FBQSxPQUFKO0FBQ0UsVUFBQSxPQUFBLEdBQVUsQ0FBVixDQURGO1NBQUEsTUFBQTtBQUdFLFVBQUEsT0FBQSxHQUFVLENBQUEsQ0FBVixDQUhGO1NBSkE7QUFRQSxlQUFNLE9BQUEsR0FBVSxDQUFoQixHQUFBO0FBQ0UsVUFBQSxJQUFHLFVBQUEsR0FBYSxlQUFlLENBQUMsTUFBN0IsSUFBd0MsU0FBQSxHQUFZLGdCQUFnQixDQUFDLE1BQXhFO0FBQ0UsWUFBQSxJQUFHLGdCQUFpQixDQUFBLFNBQUEsQ0FBVSxDQUFDLEtBQUssQ0FBQyxPQUFsQyxDQUEwQyxlQUFnQixDQUFBLFVBQUEsQ0FBVyxDQUFDLEtBQXRFLENBQUEsS0FBZ0YsT0FBbkY7QUFDRSxjQUFBLE9BQUEsR0FBVSxPQUFBLEdBQVUsQ0FBcEIsQ0FBQTtBQUFBLGNBQ0EsU0FBQSxHQUFZLFNBQUEsR0FBWSxDQUR4QixDQURGO2FBQUEsTUFBQTtBQUlFLGNBQUEsT0FBQSxHQUFVLE9BQUEsR0FBVSxDQUFwQixDQUFBO0FBQUEsY0FDQSxNQUFBLEdBQVMsVUFEVCxDQUFBO0FBQUEsY0FFQSxVQUFBLEdBQWEsVUFBQSxHQUFhLENBRjFCLENBSkY7YUFERjtXQUFBLE1BUUssSUFBRyxVQUFBLEdBQWEsZUFBZSxDQUFDLE1BQWhDO0FBQ0gsWUFBQSxPQUFBLEdBQVUsT0FBQSxHQUFVLENBQXBCLENBQUE7QUFBQSxZQUNBLE1BQUEsR0FBUyxVQURULENBQUE7QUFBQSxZQUVBLFVBQUEsR0FBYSxVQUFBLEdBQWEsQ0FGMUIsQ0FERztXQUFBLE1BQUE7QUFLSCxrQkFMRztXQVRQO1FBQUEsQ0FSQTtBQUFBLFFBd0JBLE1BQUEsR0FBUyxFQXhCVCxDQUFBO0FBeUJBLFFBQUEsSUFBRyxPQUFBLEtBQVcsQ0FBZDtBQUNFLFVBQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxlQUFnQixDQUFBLE1BQUEsQ0FBNUIsQ0FBQSxDQURGO1NBekJBO0FBQUEsUUEyQkEsSUFBQyxDQUFBLE9BQUQsR0FBVyxNQTNCWCxDQUhGO09BckJBO0FBcURBLE1BQUEsSUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsS0FBbUIsQ0FBbkIsSUFBeUIsSUFBQyxDQUFBLE9BQTdCO2VBQ0UsSUFBQyxDQUFBLE1BQU0sQ0FBQyx1QkFBUixDQUFnQyxJQUFDLENBQUEsVUFBakMsRUFERjtPQXRESTtJQUFBLENBNUVOLENBQUE7O0FBQUEsb0NBdUlBLE9BQUEsR0FBUyxTQUFDLEtBQUQsR0FBQTs7UUFBQyxRQUFNO09BQ2Q7QUFBQSxNQUFBLElBQWdCLElBQUMsQ0FBQSxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQWxCLEdBQTJCLENBQTNDO2VBQUEsbURBQU0sS0FBTixFQUFBO09BRE87SUFBQSxDQXZJVCxDQUFBOztpQ0FBQTs7S0FEa0MsV0EvSXBDLENBQUE7O0FBQUEsRUEwUkEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUFBQSxJQUFDLFFBQUEsTUFBRDtBQUFBLElBQVMsbUJBQUEsaUJBQVQ7QUFBQSxJQUEyQix1QkFBQSxxQkFBM0I7R0ExUmpCLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/vim-mode/lib/motions/search-motion.coffee