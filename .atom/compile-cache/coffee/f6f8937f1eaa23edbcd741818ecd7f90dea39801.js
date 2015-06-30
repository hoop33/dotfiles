(function() {
  var MotionWithInput, MoveToFirstCharacterOfLine, MoveToMark, Point, Range, ViewModel, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('./general-motions'), MotionWithInput = _ref.MotionWithInput, MoveToFirstCharacterOfLine = _ref.MoveToFirstCharacterOfLine;

  ViewModel = require('../view-models/view-model').ViewModel;

  _ref1 = require('atom'), Point = _ref1.Point, Range = _ref1.Range;

  module.exports = MoveToMark = (function(_super) {
    __extends(MoveToMark, _super);

    function MoveToMark(editor, vimState, linewise) {
      this.editor = editor;
      this.vimState = vimState;
      this.linewise = linewise != null ? linewise : true;
      MoveToMark.__super__.constructor.call(this, this.editor, this.vimState);
      this.viewModel = new ViewModel(this, {
        "class": 'move-to-mark',
        singleChar: true,
        hidden: true
      });
    }

    MoveToMark.prototype.isLinewise = function() {
      return this.linewise;
    };

    MoveToMark.prototype.execute = function() {
      var markPosition;
      markPosition = this.vimState.getMark(this.input.characters);
      if (this.input.characters === '`') {
        if (markPosition == null) {
          markPosition = [0, 0];
        }
        this.vimState.setMark('`', this.editor.getCursorBufferPosition());
      }
      if (markPosition != null) {
        this.editor.setCursorBufferPosition(markPosition);
      }
      if (this.linewise) {
        return new MoveToFirstCharacterOfLine(this.editor, this.vimState).execute();
      }
    };

    MoveToMark.prototype.select = function(count, _arg) {
      var currentPosition, markPosition, requireEOL, selectionRange;
      if (count == null) {
        count = 1;
      }
      requireEOL = (_arg != null ? _arg : {}).requireEOL;
      markPosition = this.vimState.getMark(this.input.characters);
      if (markPosition == null) {
        return [false];
      }
      currentPosition = this.editor.getCursorBufferPosition();
      selectionRange = null;
      if (currentPosition.isGreaterThan(markPosition)) {
        if (this.linewise) {
          currentPosition = this.editor.clipBufferPosition([currentPosition.row, Infinity]);
          markPosition = new Point(markPosition.row, 0);
        }
        selectionRange = new Range(markPosition, currentPosition);
      } else {
        if (this.linewise) {
          markPosition = this.editor.clipBufferPosition([markPosition.row, Infinity]);
          currentPosition = new Point(currentPosition.row, 0);
        }
        selectionRange = new Range(currentPosition, markPosition);
      }
      this.editor.setSelectedBufferRange(selectionRange, {
        requireEOL: requireEOL
      });
      return [true];
    };

    return MoveToMark;

  })(MotionWithInput);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZGQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFnRCxPQUFBLENBQVEsbUJBQVIsQ0FBaEQsRUFBQyx1QkFBQSxlQUFELEVBQWtCLGtDQUFBLDBCQUFsQixDQUFBOztBQUFBLEVBQ0MsWUFBYSxPQUFBLENBQVEsMkJBQVIsRUFBYixTQURELENBQUE7O0FBQUEsRUFFQSxRQUFpQixPQUFBLENBQVEsTUFBUixDQUFqQixFQUFDLGNBQUEsS0FBRCxFQUFRLGNBQUEsS0FGUixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLGlDQUFBLENBQUE7O0FBQWEsSUFBQSxvQkFBRSxNQUFGLEVBQVcsUUFBWCxFQUFzQixRQUF0QixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsU0FBQSxNQUNiLENBQUE7QUFBQSxNQURxQixJQUFDLENBQUEsV0FBQSxRQUN0QixDQUFBO0FBQUEsTUFEZ0MsSUFBQyxDQUFBLDhCQUFBLFdBQVMsSUFDMUMsQ0FBQTtBQUFBLE1BQUEsNENBQU0sSUFBQyxDQUFBLE1BQVAsRUFBZSxJQUFDLENBQUEsUUFBaEIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsU0FBRCxHQUFpQixJQUFBLFNBQUEsQ0FBVSxJQUFWLEVBQWE7QUFBQSxRQUFBLE9BQUEsRUFBTyxjQUFQO0FBQUEsUUFBdUIsVUFBQSxFQUFZLElBQW5DO0FBQUEsUUFBeUMsTUFBQSxFQUFRLElBQWpEO09BQWIsQ0FEakIsQ0FEVztJQUFBLENBQWI7O0FBQUEseUJBSUEsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxTQUFKO0lBQUEsQ0FKWixDQUFBOztBQUFBLHlCQU1BLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxVQUFBLFlBQUE7QUFBQSxNQUFBLFlB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
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/vim-mode/lib/motions/move-to-mark-motion.coffee