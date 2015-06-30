(function() {
  var helpers;

  helpers = require('./spec-helper');

  describe("TextObjects", function() {
    var commandModeInputKeydown, editor, editorElement, keydown, vimState, _ref;
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
    commandModeInputKeydown = function(key, opts) {
      if (opts == null) {
        opts = {};
      }
      opts.element = editor.commandModeInputView.editor.find('input').get(0);
      opts.raw = true;
      return keydown(key, opts);
    };
    describe("the 'iw' text object", function() {
      beforeEach(function() {
        editor.setText("12345 abcde ABCDE");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators inside the current word in operator-pending mode", function() {
        keydown('d');
        keydown('i');
        keydown('w');
        expect(editor.getText()).toBe("12345  ABCDE");
        expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
        expect(vimState.getRegister('"').text).toBe("abcde");
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('command-mode')).toBe(true);
      });
      it("selects inside the current word in visual mode", function() {
        keydown('v');
        keydown('i');
        keydown('w');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 6], [0, 11]]);
      });
      return it("works with multiple cursors", function() {
        editor.addCursorAtBufferPosition([0, 1]);
        keydown("v");
        keydown("i");
        keydown("w");
        return expect(editor.getSelectedBufferRanges()).toEqual([[[0, 6], [0, 11]], [[0, 0], [0, 5]]]);
      });
    });
    describe("the 'i(' text object", function() {
      beforeEach(function() {
        editor.setText("( something in here and in (here) )");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators inside the current word in operator-pending mode", function() {
        keydown('d');
        keydown('i');
        keydown('(');
        expect(editor.getText()).toBe("()");
        expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('command-mode')).toBe(true);
      });
      it("applies operators inside the current word in operator-pending mode (second test)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('i');
        keydown('(');
        expect(editor.getText()).toBe("( something in here and in () )");
        expect(editor.getCursorScreenPosition()).toEqual([0, 28]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('command-mode')).toBe(true);
      });
      return it("works with multiple cursors", function() {
        editor.setText("( a b ) cde ( f g h ) ijk");
        editor.setCursorBufferPosition([0, 2]);
        editor.addCursorAtBufferPosition([0, 18]);
        keydown("v");
        keydown("i");
        keydown("(");
        return expect(editor.getSelectedBufferRanges()).toEqual([[[0, 1], [0, 6]], [[0, 13], [0, 20]]]);
      });
    });
    describe("the 'i{' text object", function() {
      beforeEach(function() {
        editor.setText("{ something in here and in {here} }");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators inside the current word in operator-pending mode", function() {
        keydown('d');
        keydown('i');
        keydown('{');
        expect(editor.getText()).toBe("{}");
        expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('command-mode')).toBe(true);
      });
      return it("applies operators inside the current word in operator-pending mode (second test)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('i');
        keydown('{');
        expect(editor.getText()).toBe("{ something in here and in {} }");
        expect(editor.getCursorScreenPosition()).toEqual([0, 28]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('command-mode')).toBe(true);
      });
    });
    describe("the 'i<' text object", function() {
      beforeEach(function() {
        editor.setText("< something in here and in <here> >");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators inside the current word in operator-pending mode", function() {
        keydown('d');
        keydown('i');
        keydown('<');
        expect(editor.getText()).toBe("<>");
        expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('command-mode')).toBe(true);
      });
      return it("applies operators inside the current word in operator-pending mode (second test)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('i');
        keydown('<');
        expect(editor.getText()).toBe("< something in here and in <> >");
        expect(editor.getCursorScreenPosition()).toEqual([0, 28]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('command-mode')).toBe(true);
      });
    });
    describe("the 'it' text object", function() {
      beforeEach(function() {
        editor.setText("<something>here</something><again>");
        return editor.setCursorScreenPosition([0, 5]);
      });
      it("applies only if in the value of a tag", function() {
        keydown('d');
        keydown('i');
        keydown('t');
        expect(editor.getText()).toBe("<something>here</something><again>");
        expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('command-mode')).toBe(true);
      });
      return it("applies operators inside the current word in operator-pending mode", function() {
        editor.setCursorScreenPosition([0, 13]);
        keydown('d');
        keydown('i');
        keydown('t');
        expect(editor.getText()).toBe("<something></something><again>");
        expect(editor.getCursorScreenPosition()).toEqual([0, 11]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('command-mode')).toBe(true);
      });
    });
    describe("the 'i[' text object", function() {
      beforeEach(function() {
        editor.setText("[ something in here and in [here] ]");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators inside the current word in operator-pending mode", function() {
        keydown('d');
        keydown('i');
        keydown('[');
        expect(editor.getText()).toBe("[]");
        expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('command-mode')).toBe(true);
      });
      return it("applies operators inside the current word in operator-pending mode (second test)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('i');
        keydown('[');
        expect(editor.getText()).toBe("[ something in here and in [] ]");
        expect(editor.getCursorScreenPosition()).toEqual([0, 28]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('command-mode')).toBe(true);
      });
    });
    describe("the 'i\'' text object", function() {
      beforeEach(function() {
        editor.setText("' something in here and in 'here' ' and over here");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators inside the current string in operator-pending mode", function() {
        keydown('d');
        keydown('i');
        keydown('\'');
        expect(editor.getText()).toBe("''here' ' and over here");
        expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('command-mode')).toBe(true);
      });
      it("applies operators inside the next string in operator-pending mode (if not in a string)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('i');
        keydown('\'');
        expect(editor.getText()).toBe("' something in here and in 'here'' and over here");
        expect(editor.getCursorScreenPosition()).toEqual([0, 33]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('command-mode')).toBe(true);
      });
      return it("makes no change if past the last string on a line", function() {
        editor.setCursorScreenPosition([0, 39]);
        keydown('d');
        keydown('i');
        keydown('\'');
        expect(editor.getText()).toBe("' something in here and in 'here' ' and over here");
        expect(editor.getCursorScreenPosition()).toEqual([0, 39]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('command-mode')).toBe(true);
      });
    });
    describe("the 'i\"' text object", function() {
      beforeEach(function() {
        editor.setText("\" something in here and in \"here\" \" and over here");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators inside the current string in operator-pending mode", function() {
        keydown('d');
        keydown('i');
        keydown('"');
        expect(editor.getText()).toBe("\"\"here\" \" and over here");
        expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('command-mode')).toBe(true);
      });
      it("applies operators inside the next string in operator-pending mode (if not in a string)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('i');
        keydown('"');
        expect(editor.getText()).toBe("\" something in here and in \"here\"\" and over here");
        expect(editor.getCursorScreenPosition()).toEqual([0, 33]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('command-mode')).toBe(true);
      });
      return it("makes no change if past the last string on a line", function() {
        editor.setCursorScreenPosition([0, 39]);
        keydown('d');
        keydown('i');
        keydown('"');
        expect(editor.getText()).toBe("\" something in here and in \"here\" \" and over here");
        expect(editor.getCursorScreenPosition()).toEqual([0, 39]);
        return expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
      });
    });
    describe("the 'aw' text object", function() {
      beforeEach(function() {
        editor.setText("12345 abcde ABCDE");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators from the start of the current word to the start of the next word in operator-pending mode", function() {
        keydown('d');
        keydown('a');
        keydown('w');
        expect(editor.getText()).toBe("12345 ABCDE");
        expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
        expect(vimState.getRegister('"').text).toBe("abcde ");
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('command-mode')).toBe(true);
      });
      it("selects from the start of the current word to the start of the next word in visual mode", function() {
        keydown('v');
        keydown('a');
        keydown('w');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 6], [0, 12]]);
      });
      return it("doesn't span newlines", function() {
        editor.setText("12345\nabcde ABCDE");
        editor.setCursorBufferPosition([0, 3]);
        keydown("v");
        keydown("a");
        keydown("w");
        return expect(editor.getSelectedBufferRanges()).toEqual([[[0, 0], [0, 5]]]);
      });
    });
    describe("the 'a(' text object", function() {
      beforeEach(function() {
        editor.setText("( something in here and in (here) )");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators around the current parentheses in operator-pending mode", function() {
        keydown('d');
        keydown('a');
        keydown('(');
        expect(editor.getText()).toBe("");
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('command-mode')).toBe(true);
      });
      return it("applies operators around the current parentheses in operator-pending mode (second test)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('a');
        keydown('(');
        expect(editor.getText()).toBe("( something in here and in  )");
        expect(editor.getCursorScreenPosition()).toEqual([0, 27]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('command-mode')).toBe(true);
      });
    });
    describe("the 'a{' text object", function() {
      beforeEach(function() {
        editor.setText("{ something in here and in {here} }");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators around the current curly brackets in operator-pending mode", function() {
        keydown('d');
        keydown('a');
        keydown('{');
        expect(editor.getText()).toBe("");
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('command-mode')).toBe(true);
      });
      return it("applies operators around the current curly brackets in operator-pending mode (second test)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('a');
        keydown('{');
        expect(editor.getText()).toBe("{ something in here and in  }");
        expect(editor.getCursorScreenPosition()).toEqual([0, 27]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('command-mode')).toBe(true);
      });
    });
    describe("the 'a<' text object", function() {
      beforeEach(function() {
        editor.setText("< something in here and in <here> >");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators around the current angle brackets in operator-pending mode", function() {
        keydown('d');
        keydown('a');
        keydown('<');
        expect(editor.getText()).toBe("");
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('command-mode')).toBe(true);
      });
      return it("applies operators around the current angle brackets in operator-pending mode (second test)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('a');
        keydown('<');
        expect(editor.getText()).toBe("< something in here and in  >");
        expect(editor.getCursorScreenPosition()).toEqual([0, 27]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('command-mode')).toBe(true);
      });
    });
    describe("the 'a[' text object", function() {
      beforeEach(function() {
        editor.setText("[ something in here and in [here] ]");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators around the current square brackets in operator-pending mode", function() {
        keydown('d');
        keydown('a');
        keydown('[');
        expect(editor.getText()).toBe("");
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('command-mode')).toBe(true);
      });
      return it("applies operators around the current square brackets in operator-pending mode (second test)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('a');
        keydown('[');
        expect(editor.getText()).toBe("[ something in here and in  ]");
        expect(editor.getCursorScreenPosition()).toEqual([0, 27]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('command-mode')).toBe(true);
      });
    });
    describe("the 'a\'' text object", function() {
      beforeEach(function() {
        editor.setText("' something in here and in 'here' '");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators around the current single quotes in operator-pending mode", function() {
        keydown('d');
        keydown('a');
        keydown('\'');
        expect(editor.getText()).toBe("here' '");
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('command-mode')).toBe(true);
      });
      return it("applies operators around the current single quotes in operator-pending mode (second test)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('a');
        keydown('\'');
        expect(editor.getText()).toBe("' something in here and in 'here");
        expect(editor.getCursorScreenPosition()).toEqual([0, 31]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('command-mode')).toBe(true);
      });
    });
    return describe("the 'a\"' text object", function() {
      beforeEach(function() {
        editor.setText("\" something in here and in \"here\" \"");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators around the current double quotes in operator-pending mode", function() {
        keydown('d');
        keydown('a');
        keydown('""');
        expect(editor.getText()).toBe('here" "');
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('command-mode')).toBe(true);
      });
      return it("applies operators around the current double quotes in operator-pending mode (second test)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('a');
        keydown('"');
        expect(editor.getText()).toBe("\" something in here and in \"here");
        expect(editor.getCursorScreenPosition()).toEqual([0, 31]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('command-mode')).toBe(true);
      });
    });
  });

}).call(this);
