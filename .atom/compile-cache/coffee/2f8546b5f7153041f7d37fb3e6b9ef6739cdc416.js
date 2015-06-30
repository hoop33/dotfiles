(function() {
  var helpers;

  helpers = require('./spec-helper');

  describe("Panes", function() {
    var editor, editorElement, keydown, vimState, _ref;
    _ref = [], editor = _ref[0], editorElement = _ref[1], vimState = _ref[2];
    beforeEach(function() {
      var vimMode;
      vimMode = atom.packages.loadPackage('vim-mode');
      vimMode.activateResources();
      return helpers.getEditorElement(function(element) {
        editorElement = element;
        editor = editorElement.getModel();
        vimState = editorElement.vimState;
        vimState.activateCommandMode();
        return vimState.resetCommandMode();
      });
    });
    keydown = function(key, options) {
      if (options == null) {
        options = {};
      }
      if (options.element == null) {
        options.element = editorElement;
      }
      return helpers.keydown(key, options);
    };
    return describe("switch panes", function() {
      var paneContainer;
      paneContainer = null;
      beforeEach(function() {
        paneContainer = atom.views.getView(atom.workspace.paneContainer);
        return editor.setText("abcde\n");
      });
      describe("the ctrl-w l keybinding", function() {
        beforeEach(function() {
          return spyOn(paneContainer, 'focusPaneViewOnRight');
        });
        return it("focuses the pane on the right", function() {
          keydown('w', {
            ctrl: true
          });
          keydown('l');
          return expect(paneContainer.focusPaneViewOnRight).toHaveBeenCalled();
        });
      });
      describe("the ctrl-w h keybinding", function() {
        beforeEach(function() {
          return spyOn(paneContainer, 'focusPaneViewOnLeft');
        });
        return it("focuses the pane on the left", function() {
          keydown('w', {
            ctrl: true
          });
          keydown('h');
          return expect(paneContainer.focusPaneViewOnLeft).toHaveBeenCalled();
        });
      });
      describe("the ctrl-w j keybinding", function() {
        beforeEach(function() {
          return spyOn(paneContainer, 'focusPaneViewBelow');
        });
        return it("focuses the pane on the below", function() {
          keydown('w', {
            ctrl: true
          });
          keydown('j');
          return expect(paneContainer.focusPaneViewBelow).toHaveBeenCalled();
        });
      });
      return describe("the ctrl-w k keybinding", function() {
        beforeEach(function() {
          return spyOn(paneContainer, 'focusPaneViewAbove');
        });
        return it("focuses the pane on the above", function() {
          keydown('w', {
            ctrl: true
          });
          keydown('k');
          return expect(paneContainer.focusPaneViewAbove).toHaveBeenCalled();
        });
      });
    });
  });

}).call(this);
