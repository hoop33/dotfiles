(function() {
  var $, VimState, commands, motions, operators, prefixes, utils, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('underscore-plus');

  $ = require('atom').$;

  operators = require('./operators');

  prefixes = require('./prefixes');

  commands = require('./commands');

  motions = require('./motions');

  utils = require('./utils');

  module.exports = VimState = (function() {
    VimState.prototype.editor = null;

    VimState.prototype.opStack = null;

    VimState.prototype.mode = null;

    VimState.prototype.submode = null;

    VimState.prototype.registers = null;

    function VimState(editorView) {
      this.editorView = editorView;
      this.moveCursorBeforeNewline = __bind(this.moveCursorBeforeNewline, this);
      this.editor = this.editorView.editor;
      this.opStack = [];
      this.history = [];
      this.registers = {};
      this.mode = 'command';
      this.setupCommandMode();
      this.registerInsertIntercept();
      this.activateCommandMode();
      atom.project.eachBuffer((function(_this) {
        return function(buffer) {
          return _this.registerChangeHandler(buffer);
        };
      })(this));
    }

    VimState.prototype.registerInsertIntercept = function() {
      return this.editorView.preempt('textInput', (function(_this) {
        return function(e) {
          if ($(e.currentTarget).hasClass('mini')) {
            return;
          }
          if (_this.mode === 'insert') {
            return true;
          } else {
            _this.clearOpStack();
            return false;
          }
        };
      })(this));
    };

    VimState.prototype.registerChangeHandler = function(buffer) {
      return buffer.on('changed', (function(_this) {
        return function(_arg) {
          var newRange, newText, oldRange, oldText;
          newRange = _arg.newRange, newText = _arg.newText, oldRange = _arg.oldRange, oldText = _arg.oldText;
          if (_this.setRegister == null) {
            return;
          }
          if (newText === '') {
            return _this.setRegister('"', {
              text: oldText,
              type: utils.copyType(oldText)
            });
          }
        };
      })(this));
    };

    VimState.prototype.setupCommandMode = function() {
      return this.handleCommands({
        'activate-command-mode': (function(_this) {
          return function() {
            return _this.activateCommandMode();
          };
        })(this),
        'activate-insert-mode': (function(_this) {
          return function() {
            return _this.activateInsertMode();
          };
        })(this),
        'activate-linewise-visual-mode': (function(_this) {
          return function() {
            return _this.activateVisualMode('linewise');
          };
        })(this),
        'activate-characterwise-visual-mode': (function(_this) {
          return function() {
            return _this.activateVisualMode('characterwise');
          };
        })(this),
        'activate-blockwise-visual-mode': (function(_this) {
          return function() {
            return _this.activateVisualMode('blockwise');
          };
        })(this),
        'reset-command-mode': (function(_this) {
          return function() {
            return _this.resetCommandMode();
          };
        })(this),
        'substitute': (function(_this) {
          return function() {
            return new commands.Substitute(_this.editor, _this);
          };
        })(this),
        'substitute-line': (function(_this) {
          return function() {
            return new commands.SubstituteLine(_this.editor, _this);
          };
        })(this),
        'insert-after': (function(_this) {
          return function() {
            return new commands.InsertAfter(_this.editor, _this);
          };
        })(this),
        'insert-after-eol': (function(_this) {
          return function() {
            return [new motions.MoveToLastCharacterOfLine(_this.editor), new commands.InsertAfter(_this.editor, _this)];
          };
        })(this),
        'insert-at-bol': (function(_this) {
          return function() {
            return [new motions.MoveToFirstCharacterOfLine(_this.editor), new commands.Insert(_this.editor, _this)];
          };
        })(this),
        'insert-above-with-newline': (function(_this) {
          return function() {
            return new commands.InsertAboveWithNewline(_this.editor, _this);
          };
        })(this),
        'insert-below-with-newline': (function(_this) {
          return function() {
            return new commands.InsertBelowWithNewline(_this.editor, _this);
          };
        })(this),
        'delete': (function(_this) {
          return function() {
            return _this.linewiseAliasedOperator(operators.Delete);
          };
        })(this),
        'change': (function(_this) {
          return function() {
            return _this.linewiseAliasedOperator(operators.Change);
          };
        })(this),
        'change-to-last-character-of-line': (function(_this) {
          return function() {
            return [new operators.Change(_this.editor, _this), new motions.MoveToLastCharacterOfLine(_this.editor)];
          };
        })(this),
        'delete-right': (function(_this) {
          return function() {
            return [new operators.Delete(_this.editor), new motions.MoveRight(_this.editor)];
          };
        })(this),
        'delete-to-last-character-of-line': (function(_this) {
          return function() {
            return [new operators.Delete(_this.editor), new motions.MoveToLastCharacterOfLine(_this.editor)];
          };
        })(this),
        'yank': (function(_this) {
          return function() {
            return _this.linewiseAliasedOperator(operators.Yank);
          };
        })(this),
        'yank-line': (function(_this) {
          return function() {
            return [new operators.Yank(_this.editor, _this), new motions.MoveToLine(_this.editor)];
          };
        })(this),
        'put-before': (function(_this) {
          return function() {
            return new operators.Put(_this.editor, _this, {
              location: 'before'
            });
          };
        })(this),
        'put-after': (function(_this) {
          return function() {
            return new operators.Put(_this.editor, _this, {
              location: 'after'
            });
          };
        })(this),
        'join': (function(_this) {
          return function() {
            return new operators.Join(_this.editor);
          };
        })(this),
        'indent': (function(_this) {
          return function() {
            return _this.linewiseAliasedOperator(operators.Indent);
          };
        })(this),
        'outdent': (function(_this) {
          return function() {
            return _this.linewiseAliasedOperator(operators.Outdent);
          };
        })(this),
        'select-left': (function(_this) {
          return function() {
            return new motions.SelectLeft(_this.editor);
          };
        })(this),
        'select-right': (function(_this) {
          return function() {
            return new motions.SelectRight(_this.editor);
          };
        })(this),
        'move-left': (function(_this) {
          return function() {
            return new motions.MoveLeft(_this.editor);
          };
        })(this),
        'move-up': (function(_this) {
          return function() {
            return new motions.MoveUp(_this.editor);
          };
        })(this),
        'move-down': (function(_this) {
          return function() {
            return new motions.MoveDown(_this.editor);
          };
        })(this),
        'move-right': (function(_this) {
          return function() {
            return new motions.MoveRight(_this.editor);
          };
        })(this),
        'move-to-next-word': (function(_this) {
          return function() {
            return new motions.MoveToNextWord(_this.editor);
          };
        })(this),
        'move-to-end-of-word': (function(_this) {
          return function() {
            return new motions.MoveToEndOfWord(_this.editor);
          };
        })(this),
        'move-to-previous-word': (function(_this) {
          return function() {
            return new motions.MoveToPreviousWord(_this.editor);
          };
        })(this),
        'move-to-next-paragraph': (function(_this) {
          return function() {
            return new motions.MoveToNextParagraph(_this.editor);
          };
        })(this),
        'move-to-previous-paragraph': (function(_this) {
          return function() {
            return new motions.MoveToPreviousParagraph(_this.editor);
          };
        })(this),
        'move-to-first-character-of-line': (function(_this) {
          return function() {
            return new motions.MoveToFirstCharacterOfLine(_this.editor);
          };
        })(this),
        'move-to-last-character-of-line': (function(_this) {
          return function() {
            return new motions.MoveToLastCharacterOfLine(_this.editor);
          };
        })(this),
        'move-to-beginning-of-line': (function(_this) {
          return function(e) {
            return _this.moveOrRepeat(e);
          };
        })(this),
        'move-to-start-of-file': (function(_this) {
          return function() {
            return new motions.MoveToStartOfFile(_this.editor);
          };
        })(this),
        'move-to-line': (function(_this) {
          return function() {
            return new motions.MoveToLine(_this.editor);
          };
        })(this),
        'register-prefix': (function(_this) {
          return function(e) {
            return _this.registerPrefix(e);
          };
        })(this),
        'repeat-prefix': (function(_this) {
          return function(e) {
            return _this.repeatPrefix(e);
          };
        })(this),
        'repeat': (function(_this) {
          return function(e) {
            return new operators.Repeat(_this.editor, _this);
          };
        })(this)
      });
    };

    VimState.prototype.handleCommands = function(commands) {
      return _.each(commands, (function(_this) {
        return function(fn, commandName) {
          var eventName;
          eventName = "vim-mode:" + commandName;
          return _this.editorView.command(eventName, function(e) {
            var possibleOperator, possibleOperators, _i, _len, _results;
            possibleOperators = fn(e);
            possibleOperators = _.isArray(possibleOperators) ? possibleOperators : [possibleOperators];
            _results = [];
            for (_i = 0, _len = possibleOperators.length; _i < _len; _i++) {
              possibleOperator = possibleOperators[_i];
              if (_this.mode === 'visual' && possibleOperator instanceof motions.Motion) {
                possibleOperator.origExecute = possibleOperator.execute;
                possibleOperator.execute = possibleOperator.select;
              }
              if (possibleOperator != null ? possibleOperator.execute : void 0) {
                _this.pushOperator(possibleOperator);
              }
              if (_this.mode === 'visual' && possibleOperator instanceof operators.Operator) {
                _this.pushOperator(new motions.CurrentSelection(_this));
                if (_this.mode === 'visual') {
                  _results.push(_this.activateCommandMode());
                } else {
                  _results.push(void 0);
                }
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          });
        };
      })(this));
    };

    VimState.prototype.moveCursorBeforeNewline = function() {
      if (!this.editor.getSelection().modifyingSelection && this.editor.cursor.isOnEOL() && this.editor.getCurrentBufferLine().length > 0) {
        return this.editor.setCursorBufferColumn(this.editor.getCurrentBufferLine().length - 1);
      }
    };

    VimState.prototype.pushOperator = function(operation) {
      this.opStack.push(operation);
      return this.processOpStack();
    };

    VimState.prototype.clearOpStack = function() {
      return this.opStack = [];
    };

    VimState.prototype.processOpStack = function() {
      var e, poppedOperator;
      if (!this.topOperator().isComplete()) {
        return;
      }
      poppedOperator = this.opStack.pop();
      if (this.opStack.length) {
        try {
          this.topOperator().compose(poppedOperator);
          return this.processOpStack();
        } catch (_error) {
          e = _error;
          return (e instanceof operators.OperatorError) && this.resetCommandMode() || (function() {
            throw e;
          })();
        }
      } else {
        if (poppedOperator.isRecordable()) {
          this.history.unshift(poppedOperator);
        }
        return poppedOperator.execute();
      }
    };

    VimState.prototype.topOperator = function() {
      return _.last(this.opStack);
    };

    VimState.prototype.getRegister = function(name) {
      var text, type;
      if (name === '*') {
        text = atom.clipboard.read();
        type = utils.copyType(text);
        return {
          text: text,
          type: type
        };
      } else {
        return this.registers[name];
      }
    };

    VimState.prototype.setRegister = function(name, value) {
      if (name === '*') {
        return atom.clipboard.write(value.text);
      } else {
        return this.registers[name] = value;
      }
    };

    VimState.prototype.activateCommandMode = function() {
      this.mode = 'command';
      this.submode = null;
      if (this.editorView.is(".insert-mode")) {
        this.editor.getCursor().moveLeft();
      }
      this.editorView.removeClass('insert-mode visual-mode');
      this.editorView.addClass('command-mode');
      this.editor.clearSelections();
      return this.editorView.on('cursor:position-changed', this.moveCursorBeforeNewline);
    };

    VimState.prototype.activateInsertMode = function() {
      this.mode = 'insert';
      this.submode = null;
      this.editorView.removeClass('command-mode visual-mode');
      this.editorView.addClass('insert-mode');
      return this.editorView.off('cursor:position-changed', this.moveCursorBeforeNewline);
    };

    VimState.prototype.activateVisualMode = function(type) {
      this.mode = 'visual';
      this.submode = type;
      this.editorView.removeClass('command-mode insert-mode');
      this.editorView.addClass('visual-mode');
      this.editor.off('cursor:position-changed', this.moveCursorBeforeNewline);
      if (this.submode === 'linewise') {
        return this.editor.selectLine();
      }
    };

    VimState.prototype.resetCommandMode = function() {
      return this.clearOpStack();
    };

    VimState.prototype.registerPrefix = function(e) {
      var name;
      name = atom.keymap.keystrokeStringForEvent(e.originalEvent);
      return this.pushOperator(new prefixes.Register(name));
    };

    VimState.prototype.repeatPrefix = function(e) {
      var num;
      num = parseInt(atom.keymap.keystrokeStringForEvent(e.originalEvent));
      if (this.topOperator() instanceof prefixes.Repeat) {
        return this.topOperator().addDigit(num);
      } else {
        return this.pushOperator(new prefixes.Repeat(num));
      }
    };

    VimState.prototype.moveOrRepeat = function(e) {
      if (this.topOperator() instanceof prefixes.Repeat) {
        return this.repeatPrefix(e);
      } else {
        return new motions.MoveToBeginningOfLine(this.editor);
      }
    };

    VimState.prototype.linewiseAliasedOperator = function(constructor) {
      if (this.isOperatorPending(constructor)) {
        return new motions.MoveToLine(this.editor);
      } else {
        return new constructor(this.editor, this);
      }
    };

    VimState.prototype.isOperatorPending = function(constructor) {
      var op, _i, _len, _ref;
      _ref = this.opStack;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        op = _ref[_i];
        if (op instanceof constructor) {
          return op;
        }
      }
      return false;
    };

    return VimState;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZEQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNDLElBQUssT0FBQSxDQUFRLE1BQVIsRUFBTCxDQURELENBQUE7O0FBQUEsRUFHQSxTQUFBLEdBQVksT0FBQSxDQUFRLGFBQVIsQ0FIWixDQUFBOztBQUFBLEVBSUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSLENBSlgsQ0FBQTs7QUFBQSxFQUtBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUixDQUxYLENBQUE7O0FBQUEsRUFNQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVIsQ0FOVixDQUFBOztBQUFBLEVBT0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSLENBUFIsQ0FBQTs7QUFBQSxFQVNBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSix1QkFBQSxNQUFBLEdBQVEsSUFBUixDQUFBOztBQUFBLHVCQUNBLE9BQUEsR0FBUyxJQURULENBQUE7O0FBQUEsdUJBRUEsSUFBQSxHQUFNLElBRk4sQ0FBQTs7QUFBQSx1QkFHQSxPQUFBLEdBQVMsSUFIVCxDQUFBOztBQUFBLHVCQUlBLFNBQUEsR0FBVyxJQUpYLENBQUE7O0FBTWEsSUFBQSxrQkFBRSxVQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxhQUFBLFVBQ2IsQ0FBQTtBQUFBLCtFQUFBLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLFVBQVUsQ0FBQyxNQUF0QixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXLEVBRFgsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxFQUZYLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxTQUFELEdB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
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/vim-mode/lib/vim-state.coffee