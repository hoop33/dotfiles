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

    Find.prototype.match = function(cursor, count) {
      var currentPosition, i, index, line, _i, _j, _ref1, _ref2;
      currentPosition = cursor.getBufferPosition();
      line = this.editor.lineTextForBufferRow(currentPosition.row);
      if (this.backwards) {
        index = currentPosition.column;
        for (i = _i = 0, _ref1 = count - 1; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
          index = line.lastIndexOf(this.input.characters, index - 1);
        }
        if (index >= 0) {
          return new Point(currentPosition.row, index + this.offset);
        }
      } else {
        index = currentPosition.column;
        for (i = _j = 0, _ref2 = count - 1; 0 <= _ref2 ? _j <= _ref2 : _j >= _ref2; i = 0 <= _ref2 ? ++_j : --_j) {
          index = line.indexOf(this.input.characters, index + 1);
        }
        if (index >= 0) {
          return new Point(currentPosition.row, index - this.offset);
        }
      }
    };

    Find.prototype.reverse = function() {
      this.backwards = !this.backwards;
      return this;
    };

    Find.prototype.moveCursor = function(cursor, count) {
      var match;
      if (count == null) {
        count = 1;
      }
      if ((match = this.match(cursor, count)) != null) {
        return cursor.setBufferPosition(match);
      }
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxrQkFBbUIsT0FBQSxDQUFRLG1CQUFSLEVBQW5CLGVBQUQsQ0FBQTs7QUFBQSxFQUNDLFlBQWEsT0FBQSxDQUFRLDJCQUFSLEVBQWIsU0FERCxDQUFBOztBQUFBLEVBRUEsT0FBaUIsT0FBQSxDQUFRLE1BQVIsQ0FBakIsRUFBQyxhQUFBLEtBQUQsRUFBUSxhQUFBLEtBRlIsQ0FBQTs7QUFBQSxFQUlNO0FBQ0osMkJBQUEsQ0FBQTs7QUFBYSxJQUFBLGNBQUUsTUFBRixFQUFXLFFBQVgsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsTUFEcUIsSUFBQyxDQUFBLFdBQUEsUUFDdEIsQ0FBQTtBQUFBLE1BQUEsc0NBQU0sSUFBQyxDQUFBLE1BQVAsRUFBZSxJQUFDLENBQUEsUUFBaEIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsUUFBUSxDQUFDLFdBQVYsR0FBd0IsSUFEeEIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFNBQUQsR0FBaUIsSUFBQSxTQUFBLENBQVUsSUFBVixFQUFhO0FBQUEsUUFBQSxPQUFBLEVBQU8sTUFBUDtBQUFBLFFBQWUsVUFBQSxFQUFZLElBQTNCO0FBQUEsUUFBaUMsTUFBQSxFQUFRLElBQXpDO09BQWIsQ0FGakIsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFNBQUQsR0FBYSxLQUhiLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxjQUFELEdBQWtCLEtBSmxCLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxNQUFELEdBQVUsQ0FMVixDQURXO0lBQUEsQ0FBYjs7QUFBQSxtQkFRQSxLQUFBLEdBQU8sU0FBQyxNQUFELEVBQVMsS0FBVCxHQUFBO0FBQ0wsVUFBQSxx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
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/vim-mode/lib/motions/find-motion.coffee