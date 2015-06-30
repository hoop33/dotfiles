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
      var mode, start;
      if (direction == null) {
        direction = 'indent';
      }
      mode = this.vimState.mode;
      this.motion.select(count);
      start = this.editor.getSelectedBufferRange().start;
      if (direction === 'indent') {
        this.editor.indentSelectedRows();
      } else if (direction === 'outdent') {
        this.editor.outdentSelectedRows();
      } else if (direction === 'auto') {
        this.editor.autoIndentSelectedRows();
      }
      if (mode !== 'visual') {
        this.editor.setCursorScreenPosition([start.row, 0]);
        this.editor.moveToFirstCharacterOfLine();
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxXQUFZLE9BQUEsQ0FBUSxxQkFBUixFQUFaLFFBQUQsQ0FBQTs7QUFBQSxFQUlNO0FBTUosNkJBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHFCQUFBLE9BQUEsR0FBUyxTQUFDLEtBQUQsR0FBQTs7UUFBQyxRQUFNO09BQ2Q7YUFBQSxJQUFDLENBQUEsTUFBRCxDQUFRLEtBQVIsRUFETztJQUFBLENBQVQsQ0FBQTs7QUFBQSxxQkFTQSxNQUFBLEdBQVEsU0FBQyxLQUFELEVBQVEsU0FBUixHQUFBO0FBQ04sVUFBQSxXQUFBOztRQURjLFlBQVU7T0FDeEI7QUFBQSxNQUFBLElBQUEsR0FBTyxJQUFDLENBQUEsUUFBUSxDQUFDLElBQWpCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixDQUFlLEtBQWYsQ0FGQSxDQUFBO0FBQUEsTUFHQyxRQUFTLElBQUMsQ0FBQSxNQUFNLENBQUMsc0JBQVIsQ0FBQSxFQUFULEtBSEQsQ0FBQTtBQUlBLE1BQUEsSUFBRyxTQUFBLEtBQWEsUUFBaEI7QUFDRSxRQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsa0JBQVIsQ0FBQSxDQUFBLENBREY7T0FBQSxNQUVLLElBQUcsU0FBQSxLQUFhLFNBQWhCO0FBQ0gsUUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLG1CQUFSLENBQUEsQ0FBQSxDQURHO09BQUEsTUFFQSxJQUFHLFNBQUEsS0FBYSxNQUFoQjtBQUNILFFBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxzQkFBUixDQUFBLENBQUEsQ0FERztPQVJMO0FBV0EsTUFBQSxJQUFHLElBQUEsS0FBUSxRQUFYO0FBQ0UsUUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQWdDLENBQUMsS0FBSyxDQUFDLEdBQVAsRUFBWSxDQUFaLENBQWhDLENBQUEsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQywwQkFBUixDQUFBLENBREEsQ0FBQTtlQUVBLElBQUMsQ0FBQSxRQUFRLENBQUMsbUJBQVYsQ0FBQSxFQUhGO09BWk07SUFBQSxDQVRSLENBQUE7O2tCQUFBOztLQU5tQixTQUpyQixDQUFBOztBQUFBLEVBdUNNO0FBTUosOEJBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHNCQUFBLE9BQUEsR0FBUyxTQUFDLEtBQUQsR0FBQTs7UUFBQyxRQUFNO09BQ2Q7YUFBQSxJQUFDLENBQUEsTUFBRCxDQUFRLEtBQVIsRUFBZSxTQUFmLEVBRE87SUFBQSxDQUFULENBQUE7O21CQUFBOztLQU5vQixPQXZDdEIsQ0FBQTs7QUFBQSxFQW1ETTtBQU1KLGlDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSx5QkFBQSxPQUFBLEdBQVMsU0FBQyxLQUFELEdBQUE7O1FBQUMsUUFBTTtPQUNkO2FBQUEsSUFBQyxDQUFBLE1BQUQsQ0FBUSxLQUFSLEVBQWUsTUFBZixFQURPO0lBQUEsQ0FBVCxDQUFBOztzQkFBQTs7S0FOdUIsT0FuRHpCLENBQUE7O0FBQUEsRUE0REEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUFBQSxJQUFDLFFBQUEsTUFBRDtBQUFBLElBQVMsU0FBQSxPQUFUO0FBQUEsSUFBa0IsWUFBQSxVQUFsQjtHQTVEakIsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/vim-mode/lib/operators/indent-operators.coffee