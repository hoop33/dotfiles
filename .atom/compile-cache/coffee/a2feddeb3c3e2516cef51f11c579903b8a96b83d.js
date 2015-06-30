(function() {
  var Autoindent, Indent, Operator, Outdent,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Operator = require('./general-operators').Operator;

  Indent = (function(_super) {
    __extends(Indent, _super);

    function Indent() {
      return Indent.__super__.constructor.apply(this, arguments);
    }

    Indent.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return this.indent(count);
    };

    Indent.prototype.indent = function(count, direction) {
      var mode, row;
      if (direction == null) {
        direction = 'indent';
      }
      row = this.editor.getCursorScreenRow();
      mode = this.vimState.mode;
      this.motion.select(count);
      if (direction === 'indent') {
        this.editor.indentSelectedRows();
      } else if (direction === 'outdent') {
        this.editor.outdentSelectedRows();
      } else if (direction === 'auto') {
        this.editor.autoIndentSelectedRows();
      }
      if (mode !== 'visual') {
        this.editor.setCursorScreenPosition([row, 0]);
        this.editor.moveCursorToFirstCharacterOfLine();
        return this.vimState.activateCommandMode();
      }
    };

    return Indent;

  })(Operator);

  Outdent = (function(_super) {
    __extends(Outdent, _super);

    function Outdent() {
      return Outdent.__super__.constructor.apply(this, arguments);
    }

    Outdent.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return this.indent(count, 'outdent');
    };

    return Outdent;

  })(Indent);

  Autoindent = (function(_super) {
    __extends(Autoindent, _super);

    function Autoindent() {
      return Autoindent.__super__.constructor.apply(this, arguments);
    }

    Autoindent.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return this.indent(count, 'auto');
    };

    return Autoindent;

  })(Indent);

  module.exports = {
    Indent: Indent,
    Outdent: Outdent,
    Autoindent: Autoindent
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxXQUFZLE9BQUEsQ0FBUSxxQkFBUixFQUFaLFFBQUQsQ0FBQTs7QUFBQSxFQUlNO0FBTUosNkJBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHFCQUFBLE9BQUEsR0FBUyxTQUFDLEtBQUQsR0FBQTs7UUFBQyxRQUFNO09BQ2Q7YUFBQSxJQUFDLENBQUEsTUFBRCxDQUFRLEtBQVIsRUFETztJQUFBLENBQVQsQ0FBQTs7QUFBQSxxQkFTQSxNQUFBLEdBQVEsU0FBQyxLQUFELEVBQVEsU0FBUixHQUFBO0FBQ04sVUFBQSxTQUFBOztRQURjLFlBQVU7T0FDeEI7QUFBQSxNQUFBLEdBQUEsR0FBTSxJQUFDLENBQUEsTUFBTSxDQUFDLGtCQUFSLENBQUEsQ0FBTixDQUFBO0FBQUEsTUFDQSxJQUFBLEdBQU8sSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQURqQixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsQ0FBZSxLQUFmLENBSEEsQ0FBQTtBQUlBLE1BQUEsSUFBRyxTQUFBLEtBQWEsUUFBaEI7QUFDRSxRQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsa0JBQVIsQ0FBQSxDQUFBLENBREY7T0FBQSxNQUVLLElBQUcsU0FBQSxLQUFhLFNBQWhCO0FBQ0gsUUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLG1CQUFSLENBQUEsQ0FBQSxDQURHO09BQUEsTUFFQSxJQUFHLFNBQUEsS0FBYSxNQUFoQjtBQUNILFFBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxzQkFBUixDQUFBLENBQUEsQ0FERztPQVJMO0FBV0EsTUFBQSxJQUFHLElBQUEsS0FBUSxRQUFYO0FBQ0UsUUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQWdDLENBQUMsR0FBRCxFQUFNLENBQU4sQ0FBaEMsQ0FBQSxDQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsTUFBTSxDQUFDLGdDQUFSLENBQUEsQ0FEQSxDQUFBO2VBRUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxtQkFBVixDQUFBLEVBSEY7T0FaTTtJQUFBLENBVFIsQ0FBQTs7a0JBQUE7O0tBTm1CLFNBSnJCLENBQUE7O0FBQUEsRUF1Q007QUFNSiw4QkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEsc0JBQUEsT0FBQSxHQUFTLFNBQUMsS0FBRCxHQUFBOztRQUFDLFFBQU07T0FDZDthQUFBLElBQUMsQ0FBQSxNQUFELENBQVEsS0FBUixFQUFlLFNBQWYsRUFETztJQUFBLENBQVQsQ0FBQTs7bUJBQUE7O0tBTm9CLE9BdkN0QixDQUFBOztBQUFBLEVBbURNO0FBTUosaUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHlCQUFBLE9BQUEsR0FBUyxTQUFDLEtBQUQsR0FBQTs7UUFBQyxRQUFNO09BQ2Q7YUFBQSxJQUFDLENBQUEsTUFBRCxDQUFRLEtBQVIsRUFBZSxNQUFmLEVBRE87SUFBQSxDQUFULENBQUE7O3NCQUFBOztLQU51QixPQW5EekIsQ0FBQTs7QUFBQSxFQTREQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtBQUFBLElBQUMsUUFBQSxNQUFEO0FBQUEsSUFBUyxTQUFBLE9BQVQ7QUFBQSxJQUFrQixZQUFBLFVBQWxCO0dBNURqQixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/vim-mode/lib/operators/indent-operators.coffee