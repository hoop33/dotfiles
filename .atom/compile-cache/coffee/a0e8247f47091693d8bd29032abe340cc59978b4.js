(function() {
  var BracketMatchingMotion, Input, MotionWithInput, Point, Range, Search, SearchBase, SearchCurrentWord, SearchViewModel, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  MotionWithInput = require('./general-motions').MotionWithInput;

  SearchViewModel = require('../view-models/search-view-model');

  Input = require('../view-models/view-model').Input;

  _ref = require('atom'), Point = _ref.Point, Range = _ref.Range;

  SearchBase = (function(_super) {
    __extends(SearchBase, _super);

    SearchBase.currentSearch = null;

    function SearchBase(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.reversed = __bind(this.reversed, this);
      this.repeat = __bind(this.repeat, this);
      SearchBase.__super__.constructor.call(this, this.editor, this.vimState);
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
      var addToMod, after, cur, iterator, matchPoints, mod, previous, regexp, term, usingSmartcase;
      addToMod = (function(_this) {
        return function(modifier) {
          if (mod.indexOf(modifier) === -1) {
            return mod += modifier;
          } else {

          }
        };
      })(this);
      term = this.input.characters;
      mod = '';
      addToMod('g');
      usingSmartcase = atom.config.get('vim-mode.useSmartcaseForSearch');
      if (usingSmartcase && !term.match('[A-Z]')) {
        addToMod('i');
      }
      if (term.indexOf('\\c') !== -1) {
        term = term.replace('\\c', '');
        addToMod('i');
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

    function Search(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      Search.__super__.constructor.call(this, this.editor, this.vimState);
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

    function SearchCurrentWord(editor, vimState) {
      var defaultIsKeyword, userIsKeyword;
      this.editor = editor;
      this.vimState = vimState;
      SearchCurrentWord.__super__.constructor.call(this, this.editor, this.vimState);
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
      cursor = this.editor.getLastCursor();
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
      cursor = this.editor.getLastCursor();
      pos = cursor.getNextWordBoundaryBufferPosition({
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

    function BracketMatchingMotion(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      BracketMatchingMotion.__super__.constructor.call(this, this.editor, this.vimState);
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
      cursor = this.editor.getLastCursor();
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRIQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQyxrQkFBbUIsT0FBQSxDQUFRLG1CQUFSLEVBQW5CLGVBREQsQ0FBQTs7QUFBQSxFQUVBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLGtDQUFSLENBRmxCLENBQUE7O0FBQUEsRUFHQyxRQUFTLE9BQUEsQ0FBUSwyQkFBUixFQUFULEtBSEQsQ0FBQTs7QUFBQSxFQUlBLE9BQWlCLE9BQUEsQ0FBUSxNQUFSLENBQWpCLEVBQUMsYUFBQSxLQUFELEVBQVEsYUFBQSxLQUpSLENBQUE7O0FBQUEsRUFNTTtBQUNKLGlDQUFBLENBQUE7O0FBQUEsSUFBQSxVQUFDLENBQUEsYUFBRCxHQUFnQixJQUFoQixDQUFBOztBQUNhLElBQUEsb0JBQUUsTUFBRixFQUFXLFFBQVgsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsTUFEcUIsSUFBQyxDQUFBLFdBQUEsUUFDdEIsQ0FBQTtBQUFBLGlEQUFBLENBQUE7QUFBQSw2Q0FBQSxDQUFBO0FBQUEsTUFBQSw0Q0FBTSxJQUFDLENBQUEsTUFBUCxFQUFlLElBQUMsQ0FBQSxRQUFoQixDQUFBLENBQUE7QUFBQSxNQUNBLE1BQU0sQ0FBQyxhQUFQLEdBQXVCLElBRHZCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBQyxDQUFBLGlCQUFELEdBQXFCLEtBRmhDLENBRFc7SUFBQSxDQURiOztBQUFBLHlCQU1BLE1BQUEsR0FBUSxTQUFDLElBQUQsR0FBQTtBQUNOLFVBQUEsT0FBQTs7UUFETyxPQUFPO09BQ2Q7QUFBQSxNQUFBLE9BQUEsR0FBVSxJQUFJLENBQUMsU0FBZixD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
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/vim-mode/lib/motions/search-motion.coffee