(function() {
  var Find, MotionWithInput, Point, Range, Till, ViewModel, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  MotionWithInput = require('./general-motions').MotionWithInput;

  ViewModel = require('../view-models/view-model').ViewModel;

  _ref = require('atom'), Point = _ref.Point, Range = _ref.Range;

  Find = (function(_super) {
    __extends(Find, _super);

    function Find(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      Find.__super__.constructor.call(this, this.editor, this.vimState);
      this.vimState.currentFind = this;
      this.viewModel = new ViewModel(this, {
        "class": 'find',
        singleChar: true,
        hidden: true
      });
      this.backwards = false;
      this.repeatReversed = false;
      this.offset = 0;
    }

    Find.prototype.match = function(count) {
      var currentPosition, i, index, line, point, _i, _j, _ref1, _ref2;
      currentPosition = this.editor.getCursorBufferPosition();
      line = this.editor.lineTextForBufferRow(currentPosition.row);
      if (this.backwards) {
        index = currentPosition.column;
        for (i = _i = 0, _ref1 = count - 1; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
          index = line.lastIndexOf(this.input.characters, index - 1);
        }
        if (index !== -1) {
          point = new Point(currentPosition.row, index + this.offset);
          return {
            point: point,
            range: new Range(point, currentPosition)
          };
        }
      } else {
        index = currentPosition.column;
        for (i = _j = 0, _ref2 = count - 1; 0 <= _ref2 ? _j <= _ref2 : _j >= _ref2; i = 0 <= _ref2 ? ++_j : --_j) {
          index = line.indexOf(this.input.characters, index + 1);
        }
        if (index !== -1) {
          point = new Point(currentPosition.row, index - this.offset);
          return {
            point: point,
            range: new Range(currentPosition, point.add([0, 1]))
          };
        }
      }
    };

    Find.prototype.reverse = function() {
      this.backwards = !this.backwards;
      return this;
    };

    Find.prototype.execute = function(count) {
      var match;
      if (count == null) {
        count = 1;
      }
      if ((match = this.match(count)) != null) {
        return this.editor.setCursorBufferPosition(match.point);
      }
    };

    Find.prototype.select = function(count, _arg) {
      var match, requireEOL;
      if (count == null) {
        count = 1;
      }
      requireEOL = (_arg != null ? _arg : {}).requireEOL;
      if ((match = this.match(count)) != null) {
        this.editor.setSelectedBufferRange(match.range);
        return [true];
      }
      return [false];
    };

    Find.prototype.repeat = function(opts) {
      if (opts == null) {
        opts = {};
      }
      opts.reverse = !!opts.reverse;
      if (opts.reverse !== this.repeatReversed) {
        this.reverse();
        this.repeatReversed = opts.reverse;
      }
      return this;
    };

    return Find;

  })(MotionWithInput);

  Till = (function(_super) {
    __extends(Till, _super);

    function Till(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      Till.__super__.constructor.call(this, this.editor, this.vimState);
      this.offset = 1;
    }

    return Till;

  })(Find);

  module.exports = {
    Find: Find,
    Till: Till
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxrQkFBbUIsT0FBQSxDQUFRLG1CQUFSLEVBQW5CLGVBQUQsQ0FBQTs7QUFBQSxFQUNDLFlBQWEsT0FBQSxDQUFRLDJCQUFSLEVBQWIsU0FERCxDQUFBOztBQUFBLEVBRUEsT0FBaUIsT0FBQSxDQUFRLE1BQVIsQ0FBakIsRUFBQyxhQUFBLEtBQUQsRUFBUSxhQUFBLEtBRlIsQ0FBQTs7QUFBQSxFQUlNO0FBQ0osMkJBQUEsQ0FBQTs7QUFBYSxJQUFBLGNBQUUsTUFBRixFQUFXLFFBQVgsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsTUFEcUIsSUFBQyxDQUFBLFdBQUEsUUFDdEIsQ0FBQTtBQUFBLE1BQUEsc0NBQU0sSUFBQyxDQUFBLE1BQVAsRUFBZSxJQUFDLENBQUEsUUFBaEIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsUUFBUSxDQUFDLFdBQVYsR0FBd0IsSUFEeEIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFNBQUQsR0FBaUIsSUFBQSxTQUFBLENBQVUsSUFBVixFQUFhO0FBQUEsUUFBQSxPQUFBLEVBQU8sTUFBUDtBQUFBLFFBQWUsVUFBQSxFQUFZLElBQTNCO0FBQUEsUUFBaUMsTUFBQSxFQUFRLElBQXpDO09BQWIsQ0FGakIsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFNBQUQsR0FBYSxLQUhiLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxjQUFELEdBQWtCLEtBSmxCLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxNQUFELEdBQVUsQ0FMVixDQURXO0lBQUEsQ0FBYjs7QUFBQSxtQkFRQSxLQUFBLEdBQU8sU0FBQyxLQUFELEdBQUE7QUFDTCxVQUFBLDREQUFBO0FBQUEs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
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/vim-mode/lib/motions/find-motion.coffee