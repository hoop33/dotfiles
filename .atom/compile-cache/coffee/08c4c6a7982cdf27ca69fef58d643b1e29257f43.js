(function() {
  var Operator, Put, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  Operator = require('./general-operators').Operator;

  module.exports = Put = (function(_super) {
    __extends(Put, _super);

    Put.prototype.register = '"';

    function Put(editor, vimState, _arg) {
      var _ref;
      this.editor = editor;
      this.vimState = vimState;
      _ref = _arg != null ? _arg : {}, this.location = _ref.location, this.selectOptions = _ref.selectOptions;
      if (this.location == null) {
        this.location = 'after';
      }
      this.complete = true;
    }

    Put.prototype.execute = function(count) {
      var originalPosition, selection, text, textToInsert, type, _ref;
      if (count == null) {
        count = 1;
      }
      _ref = this.vimState.getRegister(this.register) || {}, text = _ref.text, type = _ref.type;
      if (!text) {
        return;
      }
      textToInsert = _.times(count, function() {
        return text;
      }).join('');
      selection = this.editor.getSelectedBufferRange();
      if (selection.isEmpty()) {
        if (type === 'linewise') {
          textToInsert = textToInsert.replace(/\n$/, '');
          if (this.location === 'after' && this.onLastRow()) {
            textToInsert = "\n" + textToInsert;
          } else {
            textToInsert = "" + textToInsert + "\n";
          }
        }
        if (this.location === 'after') {
          if (type === 'linewise') {
            if (this.onLastRow()) {
              this.editor.moveToEndOfLine();
              originalPosition = this.editor.getCursorScreenPosition();
              originalPosition.row += 1;
            } else {
              this.editor.moveDown();
            }
          } else {
            if (!this.onLastColumn()) {
              this.editor.moveRight();
            }
          }
        }
        if (type === 'linewise' && (originalPosition == null)) {
          this.editor.moveToBeginningOfLine();
          originalPosition = this.editor.getCursorScreenPosition();
        }
      }
      this.editor.insertText(textToInsert);
      if (originalPosition != null) {
        this.editor.setCursorScreenPosition(originalPosition);
        this.editor.moveToFirstCharacterOfLine();
      }
      this.vimState.activateCommandMode();
      if (type !== 'linewise') {
        return this.editor.moveLeft();
      }
    };

    Put.prototype.onLastRow = function() {
      var column, row, _ref;
      _ref = this.editor.getCursorBufferPosition(), row = _ref.row, column = _ref.column;
      return row === this.editor.getBuffer().getLastRow();
    };

    Put.prototype.onLastColumn = function() {
      return this.editor.getLastCursor().isAtEndOfLine();
    };

    return Put;

  })(Operator);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNDLFdBQVksT0FBQSxDQUFRLHFCQUFSLEVBQVosUUFERCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FJTTtBQUNKLDBCQUFBLENBQUE7O0FBQUEsa0JBQUEsUUFBQSxHQUFVLEdBQVYsQ0FBQTs7QUFFYSxJQUFBLGFBQUUsTUFBRixFQUFXLFFBQVgsRUFBcUIsSUFBckIsR0FBQTtBQUNYLFVBQUEsSUFBQTtBQUFBLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsTUFEcUIsSUFBQyxDQUFBLFdBQUEsUUFDdEIsQ0FBQTtBQUFBLDRCQURnQyxPQUE0QixJQUEzQixJQUFDLENBQUEsZ0JBQUEsVUFBVSxJQUFDLENBQUEscUJBQUEsYUFDN0MsQ0FBQTs7UUFBQSxJQUFDLENBQUEsV0FBWTtPQUFiO0FBQUEsTUFDQSxJQUFDLENBQUEsUUFBRCxHQUFZLElBRFosQ0FEVztJQUFBLENBRmI7O0FBQUEsa0JBV0EsT0FBQSxHQUFTLFNBQUMsS0FBRCxHQUFBO0FBQ1AsVUFBQSwyREFBQTs7UUFEUSxRQUFNO09BQ2Q7QUFBQSxNQUFBLE9BQWUsSUFBQyxDQUFBLFFBQVEsQ0FBQyxXQUFWLENBQXNCLElBQUMsQ0FBQSxRQUF2QixDQUFBLElBQW9DLEVBQW5ELEVBQUMsWUFBQSxJQUFELEVBQU8sWUFBQSxJQUFQLENBQUE7QUFDQSxNQUFBLElBQUEsQ0FBQSxJQUFBO0FBQUEsY0FBQSxDQUFBO09BREE7QUFBQSxNQUdBLFlBQUEsR0FBZSxDQUFDLENBQUMsS0FBRixDQUFRLEtBQVIsRUFBZSxTQUFBLEdBQUE7ZUFBRyxLQUFIO01BQUEs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
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/vim-mode/lib/operators/put-operator.coffee