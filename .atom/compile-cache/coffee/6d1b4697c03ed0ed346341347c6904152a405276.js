(function() {
  var CSON, actions, caniuse, editorProxy, emmet, fs, path, resources;

  CSON = require('season');

  fs = require('fs');

  path = require('path');

  emmet = require('../vendor/emmet-app').emmet;

  actions = emmet.require('action/main');

  resources = emmet.require('assets/resources');

  caniuse = emmet.require('assets/caniuse');

  emmet.define('file', require('./file'));

  editorProxy = require('./editor-proxy');

  module.exports = {
    editorSubscription: null,
    activate: function(state) {
      var action, bindings, emmet_action, key, selector, _ref;
      this.state = state;
      if (!this.actionTranslation) {
        this.actionTranslation = {};
        _ref = CSON.readFileSync(path.join(__dirname, "../keymaps/emmet.cson"));
        for (selector in _ref) {
          bindings = _ref[selector];
          for (key in bindings) {
            action = bindings[key];
            emmet_action = action.split(":")[1].replace(/\-/g, "_");
            this.actionTranslation[action] = emmet_action;
          }
        }
      }
      this.setupSnippets();
      return this.editorViewSubscription = atom.workspaceView.eachEditorView((function(_this) {
        return function(editorView) {
          var emmetAction, _ref1, _results;
          if (editorView.attached && !editorView.mini) {
            _ref1 = _this.actionTranslation;
            _results = [];
            for (action in _ref1) {
              emmetAction = _ref1[action];
              _results.push((function(action) {
                return editorView.command(action, function(e) {
                  var syntax;
                  editorProxy.setupContext(editorView);
                  syntax = editorProxy.getSyntax();
                  if (syntax) {
                    emmetAction = _this.actionTranslation[action];
                    if (emmetAction === "expand_abbreviation_with_tab" && !editorView.getEditor().getSelection().isEmpty()) {
                      e.abortKeyBinding();
                    } else {
                      return actions.run(emmetAction, editorProxy);
                    }
                  } else {
                    e.abortKeyBinding();
                  }
                });
              })(action));
            }
            return _results;
          }
        };
      })(this));
    },
    deactivate: function() {
      var _ref;
      if ((_ref = this.editorViewSubscription) != null) {
        _ref.off();
      }
      return this.editorViewSubscription = null;
    },
    setupSnippets: function() {
      var db, defaultSnippets;
      defaultSnippets = fs.readFileSync(path.join(__dirname, '../vendor/snippets.json'), {
        encoding: 'utf8'
      });
      resources.setVocabulary(JSON.parse(defaultSnippets), 'system');
      db = fs.readFileSync(path.join(__dirname, '../vendor/caniuse.json'), {
        encoding: 'utf8'
      });
      return caniuse.load(db);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtEQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBSUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxxQkFBUixDQUE4QixDQUFDLEtBSnZDLENBQUE7O0FBQUEsRUFLQSxPQUFBLEdBQVUsS0FBSyxDQUFDLE9BQU4sQ0FBYyxhQUFkLENBTFYsQ0FBQTs7QUFBQSxFQU1BLFNBQUEsR0FBWSxLQUFLLENBQUMsT0FBTixDQUFjLGtCQUFkLENBTlosQ0FBQTs7QUFBQSxFQU9BLE9BQUEsR0FBVSxLQUFLLENBQUMsT0FBTixDQUFjLGdCQUFkLENBUFYsQ0FBQTs7QUFBQSxFQVNBLEtBQUssQ0FBQyxNQUFOLENBQWEsTUFBYixFQUFxQixPQUFBLENBQVEsUUFBUixDQUFyQixDQVRBLENBQUE7O0FBQUEsRUFXQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBWGQsQ0FBQTs7QUFBQSxFQWFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLGtCQUFBLEVBQW9CLElBQXBCO0FBQUEsSUFFQSxRQUFBLEVBQVUsU0FBRSxLQUFGLEdBQUE7QUFDUixVQUFBLG1EQUFBO0FBQUEsTUFEUyxJQUFDLENBQUEsUUFBQSxLQUNWLENBQUE7QUFBQSxNQUFBLElBQUEsQ0FBQSxJQUFRLENBQUEsaUJBQVI7QUFDRSxRQUFBLElBQUMsQ0FBQSxpQkFBRCxHQUFxQixFQUFyQixDQUFBO0FBQ0E7QUFBQSxhQUFBLGdCQUFBO29DQUFBO0FBQ0UsZUFBQSxlQUFBO21DQUFBO0FBRUUsWUFBQSxZ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
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/emmet/lib/emmet.coffee