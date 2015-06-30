(function() {
  var FocusAction, FocusPaneViewAbove, FocusPaneViewBelow, FocusPaneViewOnLeft, FocusPaneViewOnRight, FocusPreviousPaneView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FocusAction = (function() {
    function FocusAction() {}

    FocusAction.prototype.isComplete = function() {
      return true;
    };

    FocusAction.prototype.isRecordable = function() {
      return false;
    };

    FocusAction.prototype.focusCursor = function() {
      var cursorPosition, editor, editorView;
      editor = atom.workspace.getActivePaneItem();
      editorView = atom.workspaceView.getActiveView();
      if ((editor != null) && (editorView != null)) {
        cursorPosition = editor.getCursorBufferPosition();
        return editorView.scrollToBufferPosition(cursorPosition);
      }
    };

    return FocusAction;

  })();

  FocusPaneViewOnLeft = (function(_super) {
    __extends(FocusPaneViewOnLeft, _super);

    function FocusPaneViewOnLeft() {
      return FocusPaneViewOnLeft.__super__.constructor.apply(this, arguments);
    }

    FocusPaneViewOnLeft.prototype.execute = function() {
      atom.workspaceView.focusPaneViewOnLeft();
      return this.focusCursor();
    };

    return FocusPaneViewOnLeft;

  })(FocusAction);

  FocusPaneViewOnRight = (function(_super) {
    __extends(FocusPaneViewOnRight, _super);

    function FocusPaneViewOnRight() {
      return FocusPaneViewOnRight.__super__.constructor.apply(this, arguments);
    }

    FocusPaneViewOnRight.prototype.execute = function() {
      atom.workspaceView.focusPaneViewOnRight();
      return this.focusCursor();
    };

    return FocusPaneViewOnRight;

  })(FocusAction);

  FocusPaneViewAbove = (function(_super) {
    __extends(FocusPaneViewAbove, _super);

    function FocusPaneViewAbove() {
      return FocusPaneViewAbove.__super__.constructor.apply(this, arguments);
    }

    FocusPaneViewAbove.prototype.execute = function() {
      atom.workspaceView.focusPaneViewAbove();
      return this.focusCursor();
    };

    return FocusPaneViewAbove;

  })(FocusAction);

  FocusPaneViewBelow = (function(_super) {
    __extends(FocusPaneViewBelow, _super);

    function FocusPaneViewBelow() {
      return FocusPaneViewBelow.__super__.constructor.apply(this, arguments);
    }

    FocusPaneViewBelow.prototype.execute = function() {
      atom.workspaceView.focusPaneViewBelow();
      return this.focusCursor();
    };

    return FocusPaneViewBelow;

  })(FocusAction);

  FocusPreviousPaneView = (function(_super) {
    __extends(FocusPreviousPaneView, _super);

    function FocusPreviousPaneView() {
      return FocusPreviousPaneView.__super__.constructor.apply(this, arguments);
    }

    FocusPreviousPaneView.prototype.execute = function() {
      atom.workspaceView.focusPreviousPaneView();
      return this.focusCursor();
    };

    return FocusPreviousPaneView;

  })(FocusAction);

  module.exports = {
    FocusPaneViewOnLeft: FocusPaneViewOnLeft,
    FocusPaneViewOnRight: FocusPaneViewOnRight,
    FocusPaneViewAbove: FocusPaneViewAbove,
    FocusPaneViewBelow: FocusPaneViewBelow,
    FocusPreviousPaneView: FocusPreviousPaneView
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFIQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBTTtBQUNTLElBQUEscUJBQUEsR0FBQSxDQUFiOztBQUFBLDBCQUNBLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFBRyxLQUFIO0lBQUEsQ0FEWixDQUFBOztBQUFBLDBCQUVBLFlBQUEsR0FBYyxTQUFBLEdBQUE7YUFBRyxNQUFIO0lBQUEsQ0FGZCxDQUFBOztBQUFBLDBCQUlBLFdBQUEsR0FBYSxTQUFBLEdBQUE7QUFDWCxVQUFBLGtDQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBZixDQUFBLENBQVQsQ0FBQTtBQUFBLE1BQ0EsVUFBQSxHQUFhLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBbkIsQ0FBQSxDQURiLENBQUE7QUFFQSxNQUFBLElBQUcsZ0JBQUEsSUFBWSxvQkFBZjtBQUNFLFFBQUEsY0FBQSxHQUFpQixNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFqQixDQUFBO2VBQ0EsVUFBVSxDQUFDLHNCQUFYLENBQWtDLGNBQWxDLEVBRkY7T0FIVztJQUFBLENBSmIsQ0FBQTs7dUJBQUE7O01BREYsQ0FBQTs7QUFBQSxFQVlNO0FBQ0osMENBQUEsQ0FBQTs7OztLQUFBOztBQUFBLGtDQUFBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxNQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsbUJBQW5CLENBQUEsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLFdBQUQsQ0FBQSxFQUZPO0lBQUEsQ0FBVCxDQUFBOzsrQkFBQTs7S0FEZ0MsWUFabEMsQ0FBQTs7QUFBQSxFQWlCTTtBQUNKLDJDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxtQ0FBQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLG9CQUFuQixDQUFBLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxXQUFELENBQUEsRUFGTztJQUFBLENBQVQsQ0FBQTs7Z0NBQUE7O0tBRGlDLFlBakJuQyxDQUFBOztBQUFBLEVBc0JNO0FBQ0oseUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLGlDQUFBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxNQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsa0JBQW5CLENBQUEsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLFdBQUQsQ0FBQSxFQUZPO0lBQUEsQ0FBVCxDQUFBOzs4QkFBQTs7S0FEK0IsWUF0QmpDLENBQUE7O0FBQUEsRUEyQk07QUFDSix5Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsaUNBQUEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLE1BQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxrQkFBbkIsQ0FBQSxDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsV0FBRCxDQUFBLEVBRk87SUFBQSxDQUFULENBQUE7OzhCQUFBOztLQUQrQixZQTNCakMsQ0FBQTs7QUFBQSxFQWdDTTtBQUNKLDRDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxvQ0FBQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLHFCQUFuQixDQUFBLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxXQUFELENBQUEsRUFGTztJQUFBLENBQVQsQ0FBQTs7aUNBQUE7O0tBRGtDLFlBaENwQyxDQUFBOztBQUFBLEVBcUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBQUEsSUFBRSxxQkFBQSxtQkFBRjtBQUFBLElBQXVCLHNCQUFBLG9CQUF2QjtBQUFBLElBQ2Ysb0JBQUEsa0JBRGU7QUFBQSxJQUNLLG9CQUFBLGtCQURMO0FBQUEsSUFDeUIsdUJBQUEscUJBRHpCO0dBckNqQixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/vim-mode/lib/panes.coffee