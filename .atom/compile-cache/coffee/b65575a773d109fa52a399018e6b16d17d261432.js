(function() {
  var $, EditorView, Point, PromptView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), $ = _ref.$, EditorView = _ref.EditorView, Point = _ref.Point, View = _ref.View;

  module.exports = PromptView = (function(_super) {
    __extends(PromptView, _super);

    function PromptView() {
      return PromptView.__super__.constructor.apply(this, arguments);
    }

    PromptView.attach = function() {
      return new PromptView;
    };

    PromptView.content = function() {
      return this.div({
        "class": 'emmet-prompt overlay from-top mini'
      }, (function(_this) {
        return function() {
          _this.subview('miniEditor', new EditorView({
            mini: true
          }));
          return _this.div({
            "class": 'message',
            outlet: 'message'
          });
        };
      })(this));
    };

    PromptView.prototype.detaching = false;

    PromptView.prototype.initialize = function(prompt, callback, _arg) {
      this.prompt = prompt;
      this.callback = callback;
      this.caller = _arg.caller, this.callerArgs = _arg.callerArgs, this.callerContext = _arg.callerContext;
      this.toggle();
      this.miniEditor.hiddenInput.on('focusout', (function(_this) {
        return function() {
          if (!_this.detaching) {
            return _this.detach();
          }
        };
      })(this));
      this.on('core:confirm', (function(_this) {
        return function() {
          return _this.confirm();
        };
      })(this));
      return this.on('core:cancel', (function(_this) {
        return function() {
          return _this.detach();
        };
      })(this));
    };

    PromptView.prototype.toggle = function() {
      if (this.hasParent()) {
        return this.detach();
      } else {
        return this.attach();
      }
    };

    PromptView.prototype.detach = function() {
      var _ref1;
      if (!this.hasParent()) {
        return;
      }
      this.detaching = true;
      this.miniEditor.setText('');
      if ((_ref1 = this.previouslyFocusedElement) != null ? _ref1.isOnDom() : void 0) {
        this.previouslyFocusedElement.focus();
      } else {
        atom.workspaceView.focus();
      }
      PromptView.__super__.detach.apply(this, arguments);
      this.detaching = false;
      return this.attached = false;
    };

    PromptView.prototype.confirm = function() {
      var text;
      text = this.miniEditor.getText();
      this.detach();
      return this.callback(this.message, this.callerContext, text, this.caller, this.callerArgs);
    };

    PromptView.prototype.attach = function() {
      this.attached = true;
      this.previouslyFocusedElement = $(':focus');
      atom.workspaceView.append(this);
      this.message.text(this.prompt);
      return this.miniEditor.focus();
    };

    return PromptView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUErQixPQUFBLENBQVEsTUFBUixDQUEvQixFQUFDLFNBQUEsQ0FBRCxFQUFJLGtCQUFBLFVBQUosRUFBZ0IsYUFBQSxLQUFoQixFQUF1QixZQUFBLElBQXZCLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUosaUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsVUFBQyxDQUFBLE1BQUQsR0FBUyxTQUFBLEdBQUE7YUFBRyxHQUFBLENBQUEsV0FBSDtJQUFBLENBQVQsQ0FBQTs7QUFBQSxJQUVBLFVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLG9DQUFQO09BQUwsRUFBa0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNoRCxVQUFBLEtBQUMsQ0FBQSxPQUFELENBQVMsWUFBVCxFQUEyQixJQUFBLFVBQUEsQ0FBVztBQUFBLFlBQUEsSUFBQSxFQUFNLElBQU47V0FBWCxDQUEzQixDQUFBLENBQUE7aUJBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLFNBQVA7QUFBQSxZQUFrQixNQUFBLEVBQVEsU0FBMUI7V0FBTCxFQUZnRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxELEVBRFE7SUFBQSxDQUZWLENBQUE7O0FBQUEseUJBT0EsU0FBQSxHQUFXLEtBUFgsQ0FBQTs7QUFBQSx5QkFTQSxVQUFBLEdBQVksU0FBRSxNQUFGLEVBQVcsUUFBWCxFQUFxQixJQUFyQixHQUFBO0FBQ1YsTUFEVyxJQUFDLENBQUEsU0FBQSxNQUNaLENBQUE7QUFB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
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/emmet/lib/dialog.coffee