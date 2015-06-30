(function() {
  var OperatorWithInput, Range, Replace, ViewModel, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  OperatorWithInput = require('./general-operators').OperatorWithInput;

  ViewModel = require('../view-models/view-model').ViewModel;

  Range = require('atom').Range;

  module.exports = Replace = (function(_super) {
    __extends(Replace, _super);

    function Replace(editor, vimState, _arg) {
      this.editor = editor;
      this.vimState = vimState;
      this.selectOptions = (_arg != null ? _arg : {}).selectOptions;
      Replace.__super__.constructor.call(this, this.editor, this.vimState);
      this.viewModel = new ViewModel(this, {
        "class": 'replace',
        hidden: true,
        singleChar: true,
        defaultText: '\n'
      });
    }

    Replace.prototype.execute = function(count) {
      var currentRowLength, pos;
      if (count == null) {
        count = 1;
      }
      pos = this.editor.getCursorBufferPosition();
      currentRowLength = this.editor.lineTextForBufferRow(pos.row).length;
      this.undoTransaction((function(_this) {
        return function() {
          var start;
          if (_this.motion != null) {
            if (_.contains(_this.motion.select(1), true)) {
              _this.editor.replaceSelectedText(null, function(text) {
                return Array(text.length + 1).join(_this.input.characters);
              });
              return _this.editor.setCursorBufferPosition(_this.editor.getLastSelection().getBufferRange().start);
            }
          } else {
            if (!(currentRowLength > 0)) {
              return;
            }
            if (!(currentRowLength - pos.column >= count)) {
              return;
            }
            start = _this.editor.getCursorBufferPosition();
            _.times(count, function() {
              var point;
              point = _this.editor.getCursorBufferPosition();
              _this.editor.setTextInBufferRange(Range.fromPointWithDelta(point, 0, 1), _this.input.characters);
              return _this.editor.moveRight();
            });
            _this.editor.setCursorBufferPosition(start);
            if (_this.input.characters === "\n") {
              _.times(count, function() {
                return _this.editor.moveDown();
              });
              return _this.editor.moveToFirstCharacterOfLine();
            }
          }
        };
      })(this));
      return this.vimState.activateCommandMode();
    };

    return Replace;

  })(OperatorWithInput);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNDLG9CQUFxQixPQUFBLENBQVEscUJBQVIsRUFBckIsaUJBREQsQ0FBQTs7QUFBQSxFQUVDLFlBQWEsT0FBQSxDQUFRLDJCQUFSLEVBQWIsU0FGRCxDQUFBOztBQUFBLEVBR0MsUUFBUyxPQUFBLENBQVEsTUFBUixFQUFULEtBSEQsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiw4QkFBQSxDQUFBOztBQUFhLElBQUEsaUJBQUUsTUFBRixFQUFXLFFBQVgsRUFBcUIsSUFBckIsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsTUFEcUIsSUFBQyxDQUFBLFdBQUEsUUFDdEIsQ0FBQTtBQUFBLE1BRGlDLElBQUMsQ0FBQSxnQ0FBRixPQUFpQixJQUFmLGFBQ2xDLENBQUE7QUFBQSxNQUFBLHlDQUFNLElBQUMsQ0FBQSxNQUFQLEVBQWUsSUFBQyxDQUFBLFFBQWhCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFNBQUQsR0FBaUIsSUFBQSxTQUFBLENBQVUsSUFBVixFQUFhO0FBQUEsUUFBQSxPQUFBLEVBQU8sU0FBUDtBQUFBLFFBQWtCLE1BQUEsRUFBUSxJQUExQjtBQUFBLFFBQWdDLFVBQUEsRUFBWSxJQUE1QztBQUFBLFFBQWtELFdBQUEsRUFBYSxJQUEvRDtPQUFiLENBRGpCLENBRFc7SUFBQSxDQUFiOztBQUFBLHNCQUlBLE9BQUEsR0FBUyxTQUFDLEtBQUQsR0FBQTtBQUNQLFVBQUEscUJBQUE7O1FBRFEsUUFBTTtPQUNkO0FBQUEsTUFBQSxHQUFBLEdBQU0sSUFBQyxDQUFBLE1B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
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/vim-mode/lib/operators/replace-operator.coffee