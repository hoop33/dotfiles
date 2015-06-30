(function() {
  var CompositeDisposable, actionDecorator, atomActionName, editorProxy, emmet, emmetActions, fs, getUserHome, loadExtensions, multiSelectionActionDecorator, path, registerInteractiveActions, resources, runAction, singleSelectionActions, toggleCommentSyntaxes;

  path = require('path');

  fs = require('fs');

  CompositeDisposable = require('atom').CompositeDisposable;

  emmet = require('emmet');

  emmetActions = require('emmet/lib/action/main');

  resources = require('emmet/lib/assets/resources');

  editorProxy = require('./editor-proxy');

  singleSelectionActions = ['prev_edit_point', 'next_edit_point', 'merge_lines', 'reflect_css_value', 'select_next_item', 'select_previous_item', 'wrap_with_abbreviation', 'update_tag'];

  toggleCommentSyntaxes = ['html', 'css', 'less', 'scss'];

  getUserHome = function() {
    if (process.platform === 'win32') {
      return process.env.USERPROFILE;
    }
    return process.env.HOME;
  };

  actionDecorator = function(action) {
    return function(evt) {
      editorProxy.setup(this.getModel());
      return editorProxy.editor.transact((function(_this) {
        return function() {
          return runAction(action, evt);
        };
      })(this));
    };
  };

  multiSelectionActionDecorator = function(action) {
    return function(evt) {
      editorProxy.setup(this.getModel());
      return editorProxy.editor.transact((function(_this) {
        return function() {
          return editorProxy.exec(function(i) {
            runAction(action, evt);
            if (evt.keyBindingAborted) {
              return false;
            }
          });
        };
      })(this));
    };
  };

  runAction = function(action, evt) {
    var activeEditor, result, se, syntax;
    syntax = editorProxy.getSyntax();
    if (action === 'expand_abbreviation_with_tab') {
      activeEditor = editorProxy.editor;
      if (!activeEditor.getSelection().isEmpty()) {
        return evt.abortKeyBinding();
      }
      if (activeEditor.snippetExpansion) {
        se = activeEditor.snippetExpansion;
        if (se.tabStopIndex + 1 >= se.tabStopMarkers.length) {
          se.destroy();
        } else {
          return evt.abortKeyBinding();
        }
      }
    }
    if (action === 'toggle_comment' && toggleCommentSyntaxes.indexOf(syntax) === -1) {
      return evt.abortKeyBinding();
    }
    if (action === 'insert_formatted_line_break_only') {
      if (syntax !== 'html' || !atom.config.get('emmet.formatLineBreaks')) {
        return evt.abortKeyBinding();
      }
      result = emmet.run(action, editorProxy);
      if (!result) {
        return evt.abortKeyBinding();
      } else {
        return true;
      }
    }
    return emmet.run(action, editorProxy);
  };

  atomActionName = function(name) {
    return 'emmet:' + name.replace(/_/g, '-');
  };

  registerInteractiveActions = function(actions) {
    var name, _i, _len, _ref, _results;
    _ref = ['wrap_with_abbreviation', 'update_tag', 'interactive_expand_abbreviation'];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      name = _ref[_i];
      _results.push((function(name) {
        var atomAction;
        atomAction = atomActionName(name);
        return actions[atomAction] = function(evt) {
          var interactive;
          editorProxy.setup(this.getModel());
          interactive = require('./interactive');
          return interactive.run(name, editorProxy);
        };
      })(name));
    }
    return _results;
  };

  loadExtensions = function() {
    var extPath, files;
    extPath = atom.config.get('emmet.extensionsPath');
    console.log('Loading Emmet extensions from', extPath);
    if (!extPath) {
      return;
    }
    if (extPath[0] === '~') {
      extPath = getUserHome() + extPath.substr(1);
    }
    if (fs.existsSync(extPath)) {
      emmet.resetUserData();
      files = fs.readdirSync(extPath);
      files = files.map(function(item) {
        return path.join(extPath, item);
      }).filter(function(file) {
        return !fs.statSync(file).isDirectory();
      });
      return emmet.loadExtensions(files);
    } else {
      return console.warn('Emmet: no such extension folder:', extPath);
    }
  };

  module.exports = {
    configDefaults: {
      extensionsPath: '~/emmet',
      formatLineBreaks: true
    },
    activate: function(state) {
      var action, atomAction, cmd, _i, _len, _ref;
      this.state = state;
      this.subscriptions = new CompositeDisposable;
      if (!this.actions) {
        this.subscriptions.add(atom.config.observe('emmet.extensionsPath', loadExtensions));
        this.actions = {};
        registerInteractiveActions(this.actions);
        _ref = emmetActions.getList();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          action = _ref[_i];
          atomAction = atomActionName(action.name);
          if (this.actions[atomAction] != null) {
            continue;
          }
          cmd = singleSelectionActions.indexOf(action.name) !== -1 ? actionDecorator(action.name) : multiSelectionActionDecorator(action.name);
          this.actions[atomAction] = cmd;
        }
      }
      return this.subscriptions.add(atom.commands.add('atom-text-editor', this.actions));
    },
    deactivate: function() {
      return atom.config.transact((function(_this) {
        return function() {
          return _this.subscriptions.dispose();
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZQQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQURMLENBQUE7O0FBQUEsRUFFQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBRkQsQ0FBQTs7QUFBQSxFQUlBLEtBQUEsR0FBUSxPQUFBLENBQVEsT0FBUixDQUpSLENBQUE7O0FBQUEsRUFLQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHVCQUFSLENBTGYsQ0FBQTs7QUFBQSxFQU1BLFNBQUEsR0FBWSxPQUFBLENBQVEsNEJBQVIsQ0FOWixDQUFBOztBQUFBLEVBUUEsV0FBQSxHQUFlLE9BQUEsQ0FBUSxnQkFBUixDQVJmLENBQUE7O0FBQUEsRUFXQSxzQkFBQSxHQUF5QixDQUN2QixpQkFEdUIsRUFDSixpQkFESSxFQUNlLGFBRGYsRUFFdkIsbUJBRnVCLEVBRUYsa0JBRkUsRUFFa0Isc0JBRmxCLEVBR3ZCLHdCQUh1QixFQUdHLFlBSEgsQ0FYekIsQ0FBQTs7QUFBQSxFQWlCQSxxQkFBQSxHQUF3QixDQUFDLE1BQUQsRUFBUyxLQUFULEVBQWdCLE1BQWhCLEVBQXdCLE1BQXhCLENBakJ4QixDQUFBOztBQUFBLEVBbUJBLFdBQUEsR0FBYyxTQUFBLEdBQUE7QUFDWixJQUFBLElBQUcsT0FBTyxDQUFDLFFBQVIsS0FBb0IsT0FBdkI7QUFDRSxhQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBbkIsQ0FERjtLQUFBO1dBR0EsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUpBO0VBQUEsQ0FuQmQsQ0FBQTs7QUFBQSxFQThCQSxlQUFBLEdBQWtCLFNBQUMsTUFBRCxHQUFBO1dBQ2hCLFNBQUMsR0FBRCxHQUFBO0FBQ0UsTUFB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
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/emmet/lib/emmet.coffee