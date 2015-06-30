(function() {
  var helpers;

  helpers = require('./spec-helper');

  describe("Scrolling", function() {
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
    describe("scrolling keybindings", function() {
      beforeEach(function() {
        editor.setText("1\n2\n3\n4\n5\n6\n7\n8\n9\n10");
        spyOn(editor, 'getFirstVisibleScreenRow').andReturn(2);
        spyOn(editor, 'getLastVisibleScreenRow').andReturn(8);
        return spyOn(editor, 'scrollToScreenPosition');
      });
      describe("the ctrl-e keybinding", function() {
        beforeEach(function() {
          spyOn(editor, 'getCursorScreenPosition').andReturn({
            row: 4,
            column: 0
          });
          return spyOn(editor, 'setCursorScreenPosition');
        });
        return it("moves the screen down by one and keeps cursor onscreen", function() {
          keydown('e', {
            ctrl: true
          });
          expect(editor.scrollToScreenPosition).toHaveBeenCalledWith([7, 0]);
          return expect(editor.setCursorScreenPosition).toHaveBeenCalledWith([6, 0]);
        });
      });
      return describe("the ctrl-y keybinding", function() {
        beforeEach(function() {
          spyOn(editor, 'getCursorScreenPosition').andReturn({
            row: 6,
            column: 0
          });
          return spyOn(editor, 'setCursorScreenPosition');
        });
        return it("moves the screen up by one and keeps the cursor onscreen", function() {
          keydown('y', {
            ctrl: true
          });
          expect(editor.scrollToScreenPosition).toHaveBeenCalledWith([3, 0]);
          return expect(editor.setCursorScreenPosition).toHaveBeenCalledWith([4, 0]);
        });
      });
    });
    describe("scroll cursor keybindings", function() {
      beforeEach(function() {
        var i, text, _i;
        text = "";
        for (i = _i = 1; _i <= 200; i = ++_i) {
          text += "" + i + "\n";
        }
        editor.setText(text);
        spyOn(editor, 'moveToFirstCharacterOfLine');
        spyOn(editor, 'getLineHeightInPixels').andReturn(20);
        spyOn(editor, 'setScrollTop');
        spyOn(editor, 'getHeight').andReturn(200);
        spyOn(editor, 'getFirstVisibleScreenRow').andReturn(90);
        return spyOn(editor, 'getLastVisibleScreenRow').andReturn(110);
      });
      describe("the z<CR> keybinding", function() {
        var keydownCodeForEnter;
        keydownCodeForEnter = '\r';
        beforeEach(function() {
          return spyOn(editor, 'pixelPositionForScreenPosition').andReturn({
            top: 1000,
            left: 0
          });
        });
        return it("moves the screen to position cursor at the top of the window and moves cursor to first non-blank in the line", function() {
          keydown('z');
          keydown(keydownCodeForEnter);
          expect(editor.setScrollTop).toHaveBeenCalledWith(960);
          return expect(editor.moveToFirstCharacterOfLine).toHaveBeenCalled();
        });
      });
      describe("the zt keybinding", function() {
        beforeEach(function() {
          return spyOn(editor, 'pixelPositionForScreenPosition').andReturn({
            top: 1000,
            left: 0
          });
        });
        return it("moves the screen to position cursor at the top of the window and leave cursor in the same column", function() {
          keydown('z');
          keydown('t');
          expect(editor.setScrollTop).toHaveBeenCalledWith(960);
          return expect(editor.moveToFirstCharacterOfLine).not.toHaveBeenCalled();
        });
      });
      describe("the z. keybinding", function() {
        beforeEach(function() {
          return spyOn(editor, 'pixelPositionForScreenPosition').andReturn({
            top: 1000,
            left: 0
          });
        });
        return it("moves the screen to position cursor at the center of the window and moves cursor to first non-blank in the line", function() {
          keydown('z');
          keydown('.');
          expect(editor.setScrollTop).toHaveBeenCalledWith(900);
          return expect(editor.moveToFirstCharacterOfLine).toHaveBeenCalled();
        });
      });
      describe("the zz keybinding", function() {
        beforeEach(function() {
          return spyOn(editor, 'pixelPositionForScreenPosition').andReturn({
            top: 1000,
            left: 0
          });
        });
        return it("moves the screen to position cursor at the center of the window and leave cursor in the same column", function() {
          keydown('z');
          keydown('z');
          expect(editor.setScrollTop).toHaveBeenCalledWith(900);
          return expect(editor.moveToFirstCharacterOfLine).not.toHaveBeenCalled();
        });
      });
      describe("the z- keybinding", function() {
        beforeEach(function() {
          return spyOn(editor, 'pixelPositionForScreenPosition').andReturn({
            top: 1000,
            left: 0
          });
        });
        return it("moves the screen to position cursor at the bottom of the window and moves cursor to first non-blank in the line", function() {
          keydown('z');
          keydown('-');
          expect(editor.setScrollTop).toHaveBeenCalledWith(860);
          return expect(editor.moveToFirstCharacterOfLine).toHaveBeenCalled();
        });
      });
      return describe("the zb keybinding", function() {
        beforeEach(function() {
          return spyOn(editor, 'pixelPositionForScreenPosition').andReturn({
            top: 1000,
            left: 0
          });
        });
        return it("moves the screen to position cursor at the bottom of the window and leave cursor in the same column", function() {
          keydown('z');
          keydown('b');
          expect(editor.setScrollTop).toHaveBeenCalledWith(860);
          return expect(editor.moveToFirstCharacterOfLine).not.toHaveBeenCalled();
        });
      });
    });
    return describe("scrolling half screen keybindings", function() {
      beforeEach(function() {
        var i, text, _i;
        text = "";
        for (i = _i = 1; _i <= 80; i = ++_i) {
          text += "" + i + "\n";
        }
        editor.setText(text);
        spyOn(editor, 'setScrollTop');
        spyOn(editor, 'getFirstVisibleScreenRow').andReturn(40);
        spyOn(editor, 'getLastVisibleScreenRow').andReturn(60);
        spyOn(editor, 'getHeight').andReturn(400);
        return spyOn(editor, 'getScrollTop').andReturn(600);
      });
      describe("the ctrl-u keybinding", function() {
        beforeEach(function() {
          return spyOn(editor, 'setCursorScreenPosition');
        });
        return it("moves the screen down by half screen size and keeps cursor onscreen", function() {
          keydown('u', {
            ctrl: true
          });
          return expect(editor.setScrollTop).toHaveBeenCalledWith(400);
        });
      });
      return describe("the ctrl-d keybinding", function() {
        beforeEach(function() {
          return spyOn(editor, 'setCursorScreenPosition');
        });
        return it("moves the screen down by half screen size and keeps cursor onscreen", function() {
          keydown('d', {
            ctrl: true
          });
          return expect(editor.setScrollTop).toHaveBeenCalledWith(800);
        });
      });
    });
  });

}).call(this);
