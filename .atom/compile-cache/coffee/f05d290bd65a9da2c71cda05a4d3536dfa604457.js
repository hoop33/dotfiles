(function() {
  var View, VimCommandModeInputView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom').View;

  module.exports = VimCommandModeInputView = (function(_super) {
    __extends(VimCommandModeInputView, _super);

    function VimCommandModeInputView() {
      this.remove = __bind(this.remove, this);
      this.cancel = __bind(this.cancel, this);
      this.focus = __bind(this.focus, this);
      this.confirm = __bind(this.confirm, this);
      return VimCommandModeInputView.__super__.constructor.apply(this, arguments);
    }

    VimCommandModeInputView.content = function() {
      return this.div({
        "class": 'command-mode-input'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'editor-container',
            outlet: 'editorContainer'
          });
        };
      })(this));
    };

    VimCommandModeInputView.prototype.initialize = function(viewModel, opts) {
      var _ref;
      this.viewModel = viewModel;
      if (opts == null) {
        opts = {};
      }
      if (opts["class"] != null) {
        this.editorContainer.addClass(opts["class"]);
      }
      if (opts.hidden) {
        this.editorContainer.height(0);
      }
      this.editorElement = document.createElement("atom-text-editor");
      this.editorElement.classList.add('editor');
      this.editorElement.getModel().setMini(true);
      this.editorContainer.append(this.editorElement);
      this.singleChar = opts.singleChar;
      this.defaultText = (_ref = opts.defaultText) != null ? _ref : '';
      this.panel = atom.workspace.addBottomPanel({
        item: this,
        priority: 100
      });
      this.focus();
      return this.handleEvents();
    };

    VimCommandModeInputView.prototype.handleEvents = function() {
      if (this.singleChar != null) {
        this.editorElement.getModel().getBuffer().onDidChange((function(_this) {
          return function(e) {
            if (e.newText) {
              return _this.confirm();
            }
          };
        })(this));
      } else {
        atom.commands.add(this.editorElement, 'editor:newline', this.confirm);
      }
      atom.commands.add(this.editorElement, 'core:confirm', this.confirm);
      atom.commands.add(this.editorElement, 'core:cancel', this.cancel);
      return atom.commands.add(this.editorElement, 'blur', this.cancel);
    };

    VimCommandModeInputView.prototype.confirm = function() {
      this.value = this.editorElement.getModel().getText() || this.defaultText;
      this.viewModel.confirm(this);
      return this.remove();
    };

    VimCommandModeInputView.prototype.focus = function() {
      return this.editorElement.focus();
    };

    VimCommandModeInputView.prototype.cancel = function(e) {
      this.viewModel.cancel(this);
      return this.remove();
    };

    VimCommandModeInputView.prototype.remove = function() {
      atom.workspace.getActivePane().activate();
      return this.panel.destroy();
    };

    return VimCommandModeInputView;

  })(View);

}).call(this);
