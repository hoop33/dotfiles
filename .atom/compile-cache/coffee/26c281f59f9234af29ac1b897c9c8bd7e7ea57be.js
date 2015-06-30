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

    FocusAction.prototype.paneContainer = function() {
      return atom.views.getView(atom.workspace.paneContainer);
    };

    FocusAction.prototype.focusCursor = function() {
      var editor;
      editor = atom.workspace.getActiveTextEditor();
      return editor != null ? editor.scrollToCursorPosition() : void 0;
    };

    return FocusAction;

  })();

  FocusPaneViewOnLeft = (function(_super) {
    __extends(FocusPaneViewOnLeft, _super);

    function FocusPaneViewOnLeft() {
      return FocusPaneViewOnLeft.__super__.constructor.apply(this, arguments);
    }

    FocusPaneViewOnLeft.prototype.execute = function() {
      this.paneContainer().focusPaneViewOnLeft();
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
      this.paneContainer().focusPaneViewOnRight();
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
      this.paneContainer().focusPaneViewAbove();
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
      this.paneContainer().focusPaneViewBelow();
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
      atom.workspace.activatePreviousPane();
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
