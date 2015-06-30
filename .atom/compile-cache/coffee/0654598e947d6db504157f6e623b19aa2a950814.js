(function() {
  var Find, MotionWithInput, Point, Range, Till, ViewModel, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  MotionWithInput = require('./general-motions').MotionWithInput;

  ViewModel = require('../view-models/view-model').ViewModel;

  _ref = require('atom'), Point = _ref.Point, Range = _ref.Range;

  Find = (function(_super) {
    __extends(Find, _super);

    function Find(editorView, vimState) {
      this.editorView = editorView;
      this.vimState = vimState;
      Find.__super__.constructor.call(this, this.editorView, this.vimState);
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
      currentPosition = this.editorView.editor.getCursorBufferPosition();
      line = this.editorView.editor.lineForBufferRow(currentPosition.row);
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
            range: new Range(currentPosition, point.translate([0, 1]))
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
        return this.editorView.editor.setCursorBufferPosition(match.point);
      }
    };

    Find.prototype.select = function(count, _arg) {
      var match, requireEOL;
      if (count == null) {
        count = 1;
      }
      requireEOL = (_arg != null ? _arg : {}).requireEOL;
      if ((match = this.match(count)) != null) {
        this.editorView.editor.setSelectedBufferRange(match.range);
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

    function Till(editorView, vimState) {
      this.editorView = editorView;
      this.vimState = vimState;
      Till.__super__.constructor.call(this, this.editorView, this.vimState);
      this.offset = 1;
    }

    return Till;

  })(Find);

  module.exports = {
    Find: Find,
    Till: Till
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxrQkFBbUIsT0FBQSxDQUFRLG1CQUFSLEVBQW5CLGVBQUQsQ0FBQTs7QUFBQSxFQUNDLFlBQWEsT0FBQSxDQUFRLDJCQUFSLEVBQWIsU0FERCxDQUFBOztBQUFBLEVBRUEsT0FBaUIsT0FBQSxDQUFRLE1BQVIsQ0FBakIsRUFBQyxhQUFBLEtBQUQsRUFBUSxhQUFBLEtBRlIsQ0FBQTs7QUFBQSxFQUlNO0FBQ0osMkJBQUEsQ0FBQTs7QUFBYSxJQUFBLGNBQUUsVUFBRixFQUFlLFFBQWYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLGFBQUEsVUFDYixDQUFBO0FBQUEsTUFEeUIsSUFBQyxDQUFBLFdBQUEsUUFDMUIsQ0FBQTtBQUFBLE1BQUEsc0NBQU0sSUFBQyxDQUFBLFVBQVAsRUFBbUIsSUFBQyxDQUFBLFFBQXBCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxXQUFWLEdBQXdCLElBRHhCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxTQUFELEdBQWlCLElBQUEsU0FBQSxDQUFVLElBQVYsRUFBYTtBQUFBLFFBQUEsT0FBQSxFQUFPLE1BQVA7QUFBQSxRQUFlLFVBQUEsRUFBWSxJQUEzQjtBQUFBLFFBQWlDLE1BQUEsRUFBUSxJQUF6QztPQUFiLENBRmpCLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxTQUFELEdBQWEsS0FIYixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsY0FBRCxHQUFrQixLQUpsQixDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsTUFBRCxHQUFVLENBTFYsQ0FEVztJQUFBLENBQWI7O0FBQUEsbUJBUUEsS0FBQSxHQUFPLFNBQUMsS0FBRCxHQUFBO0FBQ0wsVUFBQSw0REFBQTtBQUFB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
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/vim-mode/lib/motions/find-motion.coffee