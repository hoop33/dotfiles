(function() {
  var helpers;

  helpers = require('./spec-helper');

  describe("Prefixes", function() {
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
    describe("Repeat", function() {
      describe("with operations", function() {
        beforeEach(function() {
          editor.setText("123456789abc");
          return editor.setCursorScreenPosition([0, 0]);
        });
        it("repeats N times", function() {
          keydown('3');
          keydown('x');
          return expect(editor.getText()).toBe('456789abc');
        });
        return it("repeats NN times", function() {
          keydown('1');
          keydown('0');
          keydown('x');
          return expect(editor.getText()).toBe('bc');
        });
      });
      describe("with motions", function() {
        beforeEach(function() {
          editor.setText('one two three');
          return editor.setCursorScreenPosition([0, 0]);
        });
        return it("repeats N times", function() {
          keydown('d');
          keydown('2');
          keydown('w');
          return expect(editor.getText()).toBe('three');
        });
      });
      return describe("in visual mode", function() {
        beforeEach(function() {
          editor.setText('one two three');
          return editor.setCursorScreenPosition([0, 0]);
        });
        return it("repeats movements in visual mode", function() {
          keydown("v");
          keydown("2");
          keydown("w");
          return expect(editor.getCursorScreenPosition()).toEqual([0, 9]);
        });
      });
    });
    return describe("Register", function() {
      describe("the a register", function() {
        it("saves a value for future reading", function() {
          vimState.setRegister('a', {
            text: 'new content'
          });
          return expect(vimState.getRegister("a").text).toEqual('new content');
        });
        return it("overwrites a value previously in the register", function() {
          vimState.setRegister('a', {
            text: 'content'
          });
          vimState.setRegister('a', {
            text: 'new content'
          });
          return expect(vimState.getRegister("a").text).toEqual('new content');
        });
      });
      describe("the B register", function() {
        it("saves a value for future reading", function() {
          vimState.setRegister('B', {
            text: 'new content'
          });
          expect(vimState.getRegister("b").text).toEqual('new content');
          return expect(vimState.getRegister("B").text).toEqual('new content');
        });
        it("appends to a value previously in the register", function() {
          vimState.setRegister('b', {
            text: 'content'
          });
          vimState.setRegister('B', {
            text: 'new content'
          });
          return expect(vimState.getRegister("b").text).toEqual('contentnew content');
        });
        it("appends linewise to a linewise value previously in the register", function() {
          vimState.setRegister('b', {
            type: 'linewise',
            text: 'content\n'
          });
          vimState.setRegister('B', {
            text: 'new content'
          });
          return expect(vimState.getRegister("b").text).toEqual('content\nnew content\n');
        });
        return it("appends linewise to a character value previously in the register", function() {
          vimState.setRegister('b', {
            text: 'content'
          });
          vimState.setRegister('B', {
            type: 'linewise',
            text: 'new content\n'
          });
          return expect(vimState.getRegister("b").text).toEqual('content\nnew content\n');
        });
      });
      describe("the * register", function() {
        describe("reading", function() {
          return it("is the same the system clipboard", function() {
            expect(vimState.getRegister('*').text).toEqual('initial clipboard content');
            return expect(vimState.getRegister('*').type).toEqual('character');
          });
        });
        return describe("writing", function() {
          beforeEach(function() {
            return vimState.setRegister('*', {
              text: 'new content'
            });
          });
          return it("overwrites the contents of the system clipboard", function() {
            return expect(atom.clipboard.read()).toEqual('new content');
          });
        });
      });
      describe("the + register", function() {
        describe("reading", function() {
          return it("is the same the system clipboard", function() {
            expect(vimState.getRegister('*').text).toEqual('initial clipboard content');
            return expect(vimState.getRegister('*').type).toEqual('character');
          });
        });
        return describe("writing", function() {
          beforeEach(function() {
            return vimState.setRegister('*', {
              text: 'new content'
            });
          });
          return it("overwrites the contents of the system clipboard", function() {
            return expect(atom.clipboard.read()).toEqual('new content');
          });
        });
      });
      describe("the _ register", function() {
        describe("reading", function() {
          return it("is always the empty string", function() {
            return expect(vimState.getRegister("_").text).toEqual('');
          });
        });
        return describe("writing", function() {
          return it("throws away anything written to it", function() {
            vimState.setRegister('_', {
              text: 'new content'
            });
            return expect(vimState.getRegister("_").text).toEqual('');
          });
        });
      });
      return describe("the % register", function() {
        beforeEach(function() {
          return spyOn(editor, 'getURI').andReturn('/Users/atom/known_value.txt');
        });
        describe("reading", function() {
          return it("returns the filename of the current editor", function() {
            return expect(vimState.getRegister('%').text).toEqual('/Users/atom/known_value.txt');
          });
        });
        return describe("writing", function() {
          return it("throws away anything written to it", function() {
            vimState.setRegister('%', "new content");
            return expect(vimState.getRegister('%').text).toEqual('/Users/atom/known_value.txt');
          });
        });
      });
    });
  });

}).call(this);
