(function() {
  describe("CommandLogger", function() {
    var commandLogger, editor, _ref;
    _ref = [], commandLogger = _ref[0], editor = _ref[1];
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open('sample.js');
      });
      runs(function() {
        return editor = atom.workspace.getActiveTextEditor();
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('command-logger');
      });
      return runs(function() {
        commandLogger = atom.packages.getActivePackage('command-logger').mainModule;
        return commandLogger.eventLog = {};
      });
    });
    describe("when a command is triggered on a view", function() {
      it("records the number of times the command is triggered", function() {
        expect(commandLogger.eventLog['core:backspace']).toBeUndefined();
        atom.commands.dispatch(atom.views.getView(editor), 'core:backspace');
        expect(commandLogger.eventLog['core:backspace'].count).toBe(1);
        atom.commands.dispatch(atom.views.getView(editor), 'core:backspace');
        return expect(commandLogger.eventLog['core:backspace'].count).toBe(2);
      });
      return it("records the date the command was last triggered", function() {
        var lastRun, start;
        expect(commandLogger.eventLog['core:backspace']).toBeUndefined();
        atom.commands.dispatch(atom.views.getView(editor), 'core:backspace');
        lastRun = commandLogger.eventLog['core:backspace'].lastRun;
        expect(lastRun).toBeGreaterThan(0);
        start = Date.now();
        waitsFor(function() {
          return Date.now() > start;
        });
        return runs(function() {
          atom.commands.dispatch(atom.views.getView(editor), 'core:backspace');
          return expect(commandLogger.eventLog['core:backspace'].lastRun).toBeGreaterThan(lastRun);
        });
      });
    });
    describe("when a command is triggered via a keybinding", function() {
      return it("records the event", function() {
        expect(commandLogger.eventLog['core:backspace']).toBeUndefined();
        atom.keymaps.emitter.emit('did-match-binding', {
          binding: {
            command: 'core:backspace'
          }
        });
        expect(commandLogger.eventLog['core:backspace'].count).toBe(1);
        atom.keymaps.emitter.emit('did-match-binding', {
          binding: {
            command: 'core:backspace'
          }
        });
        return expect(commandLogger.eventLog['core:backspace'].count).toBe(2);
      });
    });
    describe("when the data is cleared", function() {
      return it("removes all triggered events from the log", function() {
        expect(commandLogger.eventLog['core:backspace']).toBeUndefined();
        atom.commands.dispatch(atom.views.getView(editor), 'core:backspace');
        expect(commandLogger.eventLog['core:backspace'].count).toBe(1);
        atom.commands.dispatch(atom.views.getView(atom.workspace), 'command-logger:clear-data');
        return expect(commandLogger.eventLog['core:backspace']).toBeUndefined();
      });
    });
    describe("when an event is ignored", function() {
      return it("does not create a node for that event", function() {
        atom.commands.dispatch(atom.views.getView(atom.workspace), 'command-logger:open');
        waitsFor(function() {
          return atom.workspace.getActivePaneItem().treeMap != null;
        });
        return runs(function() {
          var child, children, commandLoggerView, name, nodes, _i, _len, _ref1, _results;
          commandLoggerView = atom.workspace.getActivePaneItem();
          commandLoggerView.ignoredEvents.push('editor:delete-line');
          atom.commands.dispatch(atom.views.getView(editor), 'editor:delete-line');
          commandLoggerView.eventLog = commandLogger.eventLog;
          nodes = commandLoggerView.createNodes();
          _results = [];
          for (_i = 0, _len = nodes.length; _i < _len; _i++) {
            _ref1 = nodes[_i], name = _ref1.name, children = _ref1.children;
            if (name === 'Editor') {
              _results.push((function() {
                var _j, _len1, _results1;
                _results1 = [];
                for (_j = 0, _len1 = children.length; _j < _len1; _j++) {
                  child = children[_j];
                  _results1.push(expect(child.name.indexOf('Delete Line')).toBe(-1));
                }
                return _results1;
              })());
            }
          }
          return _results;
        });
      });
    });
    return describe("command-logger:open", function() {
      return it("opens the command logger in a pane", function() {
        jasmine.attachToDOM(atom.views.getView(atom.workspace));
        atom.commands.dispatch(atom.views.getView(atom.workspace), 'command-logger:open');
        waitsFor(function() {
          return atom.workspace.getActivePaneItem().treeMap != null;
        });
        return runs(function() {
          var commandLoggerView;
          commandLoggerView = atom.workspace.getActivePaneItem();
          expect(commandLoggerView.categoryHeader.text()).toBe('All Commands');
          expect(commandLoggerView.categorySummary.text()).toBe(' (1 command, 1 invocation)');
          return expect(commandLoggerView.treeMap.find('svg').length).toBe(1);
        });
      });
    });
  });

}).call(this);
