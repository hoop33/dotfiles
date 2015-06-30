(function() {
  var TextEditorView, View, VimCommandModeInputView, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), View = _ref.View, TextEditorView = _ref.TextEditorView;

  module.exports = VimCommandModeInputView = (function(_super) {
    __extends(VimCommandModeInputView, _super);

    function VimCommandModeInputView() {
      this.remove = __bind(this.remove, this);
      this.cancel = __bind(this.cancel, this);
      this.focus = __bind(this.focus, this);
      this.confirm = __bind(this.confirm, this);
      this.autosubmit = __bind(this.autosubmit, this);
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
          }, function() {
            return _this.subview('editor', new TextEditorView({
              mini: true
            }));
          });
        };
      })(this));
    };

    VimCommandModeInputView.prototype.initialize = function(viewModel, opts) {
      var _ref1;
      this.viewModel = viewModel;
      if (opts == null) {
        opts = {};
      }
      if (opts["class"] != null) {
        this.editorContainer.addClass(opts["class"]);
      }
      if (opts.hidden) {
        this.editorContainer.addClass('hidden-input');
      }
      this.singleChar = opts.singleChar;
      this.defaultText = (_ref1 = opts.defaultText) != null ? _ref1 : '';
      this.panel = atom.workspace.addBottomPanel({
        item: this,
        priority: 100
      });
      this.focus();
      return this.handleEvents();
    };

    VimCommandModeInputView.prototype.handleEvents = function() {
      if (this.singleChar != null) {
        this.editor.find('input').on('textInput', this.autosubmit);
      }
      this.editor.on('core:confirm', this.confirm);
      this.editor.on('core:cancel', this.cancel);
      return this.editor.find('input').on('blur', this.cancel);
    };

    VimCommandModeInputView.prototype.stopHandlingEvents = function() {
      if (this.singleChar != null) {
        this.editor.find('input').off('textInput', this.autosubmit);
      }
      this.editor.off('core:confirm', this.confirm);
      this.editor.off('core:cancel', this.cancel);
      return this.editor.find('input').off('blur', this.cancel);
    };

    VimCommandModeInputView.prototype.autosubmit = function(event) {
      this.editor.setText(event.originalEvent.data);
      return this.confirm();
    };

    VimCommandModeInputView.prototype.confirm = function() {
      this.value = this.editor.getText() || this.defaultText;
      this.viewModel.confirm(this);
      return this.remove();
    };

    VimCommandModeInputView.prototype.focus = function() {
      return this.editorContainer.find('.editor').focus();
    };

    VimCommandModeInputView.prototype.cancel = function(e) {
      this.viewModel.cancel(this);
      return this.remove();
    };

    VimCommandModeInputView.prototype.remove = function() {
      this.stopHandlingEvents();
      atom.workspace.getActivePane().activate();
      return this.panel.destroy();
    };

    return VimCommandModeInputView;

  })(View);

}).call(this);
