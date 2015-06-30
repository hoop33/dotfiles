(function() {
  describe("VimMode", function() {
    var editor, editorElement, workspaceElement, _ref;
    _ref = [], editor = _ref[0], editorElement = _ref[1], workspaceElement = _ref[2];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      waitsForPromise(function() {
        return atom.workspace.open();
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('vim-mode');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('status-bar');
      });
      return runs(function() {
        editor = atom.workspace.getActiveTextEditor();
        return editorElement = atom.views.getView(editor);
      });
    });
    describe(".activate", function() {
      it("puts the editor in command-mode initially by default", function() {
        expect(editorElement.classList.contains('vim-mode')).toBe(true);
        return expect(editorElement.classList.contains('command-mode')).toBe(true);
      });
      it("shows the current vim mode in the status bar", function() {
        var statusBarTile;
        statusBarTile = workspaceElement.querySelector("#status-bar-vim-mode");
        expect(statusBarTile.textContent).toBe("Command");
        atom.commands.dispatch(editorElement, "vim-mode:activate-insert-mode");
        return expect(statusBarTile.textContent).toBe("Insert");
      });
      return it("doesn't register duplicate command listeners for editors", function() {
        var newPane, pane;
        editor.setText("12345");
        editor.setCursorBufferPosition([0, 0]);
        pane = atom.workspace.getActivePane();
        newPane = pane.splitRight();
        pane.removeItem(editor);
        newPane.addItem(editor);
        atom.commands.dispatch(editorElement, "vim-mode:move-right");
        return expect(editor.getCursorBufferPosition()).toEqual([0, 1]);
      });
    });
    return describe(".deactivate", function() {
      it("removes the vim classes from the editor", function() {
        atom.packages.deactivatePackage('vim-mode');
        expect(editorElement.classList.contains("vim-mode")).toBe(false);
        return expect(editorElement.classList.contains("command-mode")).toBe(false);
      });
      return it("removes the vim commands from the editor element", function() {
        var vimCommands;
        vimCommands = function() {
          return atom.commands.findCommands({
            target: editorElement
          }).filter(function(cmd) {
            return cmd.name.startsWith("vim-mode:");
          });
        };
        expect(vimCommands().length).toBeGreaterThan(0);
        atom.packages.deactivatePackage('vim-mode');
        return expect(vimCommands().length).toBe(0);
      });
    });
  });

}).call(this);
