(function() {
  var Clipboard, CompositeDisposable, Gist, GistView, TextEditorView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), TextEditorView = _ref.TextEditorView, View = _ref.View;

  Clipboard = require('clipboard');

  CompositeDisposable = require('atom').CompositeDisposable;

  Gist = require('./gist-model');

  module.exports = GistView = (function(_super) {
    __extends(GistView, _super);

    function GistView() {
      return GistView.__super__.constructor.apply(this, arguments);
    }

    GistView.content = function() {
      return this.div({
        "class": "gist overlay from-top padded"
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": "inset-panel"
          }, function() {
            _this.div({
              "class": "panel-heading"
            }, function() {
              _this.span({
                outlet: "title"
              });
              return _this.div({
                "class": "btn-toolbar pull-right",
                outlet: 'toolbar'
              }, function() {
                return _this.div({
                  "class": "btn-group"
                }, function() {
                  _this.button({
                    outlet: "privateButton",
                    "class": "btn"
                  }, "Secret");
                  return _this.button({
                    outlet: "publicButton",
                    "class": "btn"
                  }, "Public");
                });
              });
            });
            return _this.div({
              "class": "panel-body padded"
            }, function() {
              _this.div({
                outlet: 'gistForm',
                "class": 'gist-form'
              }, function() {
                _this.subview('descriptionEditor', new TextEditorView({
                  mini: true,
                  placeholder: 'Gist Description'
                }));
                _this.div({
                  "class": 'block pull-right'
                }, function() {
                  _this.button({
                    outlet: 'cancelButton',
                    "class": 'btn inline-block-tight'
                  }, "Cancel");
                  return _this.button({
                    outlet: 'gistButton',
                    "class": 'btn btn-primary inline-block-tight'
                  }, "Gist It");
                });
                return _this.div({
                  "class": 'clearfix'
                });
              });
              _this.div({
                outlet: 'progressIndicator'
              }, function() {
                return _this.span({
                  "class": 'loading loading-spinner-medium'
                });
              });
              return _this.div({
                outlet: 'urlDisplay'
              }, function() {
                return _this.span("All Done! the Gist's URL has been copied to your clipboard.");
              });
            });
          });
        };
      })(this));
    };

    GistView.prototype.initialize = function(serializeState) {
      this.handleEvents();
      this.gist = null;
      return atom.commands.add('atom-text-editor', {
        'gist-it:gist-current-file': (function(_this) {
          return function() {
            return _this.gistCurrentFile();
          };
        })(this),
        "gist-it:gist-selection": (function(_this) {
          return function() {
            return _this.gistSelection();
          };
        })(this),
        "gist-it:gist-open-buffers": (function(_this) {
          return function() {
            return _this.gistOpenBuffers();
          };
        })(this)
      });
    };

    GistView.prototype.serialize = function() {};

    GistView.prototype.destroy = function() {
      this.disposables.dispose();
      return this.detach();
    };

    GistView.prototype.handleEvents = function() {
      this.gistButton.on('click', (function(_this) {
        return function() {
          return _this.gistIt();
        };
      })(this));
      this.cancelButton.on('click', (function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this));
      this.publicButton.on('click', (function(_this) {
        return function() {
          return _this.makePublic();
        };
      })(this));
      this.privateButton.on('click', (function(_this) {
        return function() {
          return _this.makePrivate();
        };
      })(this));
      this.disposables = new CompositeDisposable;
      return this.disposables.add(atom.commands.add('.gist-form atom-text-editor', {
        'core:confirm': (function(_this) {
          return function() {
            return _this.gistIt();
          };
        })(this),
        'core:cancel': (function(_this) {
          return function() {
            return _this.destroy();
          };
        })(this)
      }));
    };

    GistView.prototype.gistCurrentFile = function() {
      var activeEditor;
      this.gist = new Gist();
      activeEditor = atom.workspace.getActiveTextEditor();
      this.gist.files[activeEditor.getTitle()] = {
        content: activeEditor.getText()
      };
      this.title.text("Gist Current File");
      return this.presentSelf();
    };

    GistView.prototype.gistSelection = function() {
      var activeEditor;
      this.gist = new Gist();
      activeEditor = atom.workspace.getActiveTextEditor();
      this.gist.files[activeEditor.getTitle()] = {
        content: activeEditor.getSelectedText()
      };
      this.title.text("Gist Selection");
      return this.presentSelf();
    };

    GistView.prototype.gistOpenBuffers = function() {
      var editor, _i, _len, _ref1;
      this.gist = new Gist();
      _ref1 = atom.workspace.getTextEditors();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        editor = _ref1[_i];
        this.gist.files[editor.getTitle()] = {
          content: editor.getText()
        };
      }
      this.title.text("Gist Open Buffers");
      return this.presentSelf();
    };

    GistView.prototype.presentSelf = function() {
      this.showGistForm();
      atom.workspace.addTopPanel({
        item: this
      });
      return this.descriptionEditor.focus();
    };

    GistView.prototype.gistIt = function() {
      this.showProgressIndicator();
      this.gist.description = this.descriptionEditor.getText();
      return this.gist.post((function(_this) {
        return function(response) {
          Clipboard.writeText(response.html_url);
          _this.showUrlDisplay();
          return setTimeout((function() {
            return _this.destroy();
          }), 1000);
        };
      })(this));
    };

    GistView.prototype.makePublic = function() {
      this.publicButton.addClass('selected');
      this.privateButton.removeClass('selected');
      return this.gist.isPublic = true;
    };

    GistView.prototype.makePrivate = function() {
      this.privateButton.addClass('selected');
      this.publicButton.removeClass('selected');
      return this.gist.isPublic = false;
    };

    GistView.prototype.showGistForm = function() {
      if (this.gist.isPublic) {
        this.makePublic();
      } else {
        this.makePrivate();
      }
      this.descriptionEditor.setText(this.gist.description);
      this.toolbar.show();
      this.gistForm.show();
      this.urlDisplay.hide();
      return this.progressIndicator.hide();
    };

    GistView.prototype.showProgressIndicator = function() {
      this.toolbar.hide();
      this.gistForm.hide();
      this.urlDisplay.hide();
      return this.progressIndicator.show();
    };

    GistView.prototype.showUrlDisplay = function() {
      this.toolbar.hide();
      this.gistForm.hide();
      this.urlDisplay.show();
      return this.progressIndicator.hide();
    };

    return GistView;

  })(View);

}).call(this);
