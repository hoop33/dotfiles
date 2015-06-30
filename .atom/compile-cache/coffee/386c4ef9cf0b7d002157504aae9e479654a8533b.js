(function() {
  var basename, filenameMap, grammarMap, plugin, spawn;

  basename = require('path').basename;

  spawn = require('child_process').spawn;

  grammarMap = require('./grammar-map');

  filenameMap = require('./filename-map');

  plugin = module.exports = {
    config: {
      grammars: {
        type: 'object',
        properties: {}
      },
      filenames: {
        type: 'object',
        properties: {}
      }
    },
    activate: function() {
      return atom.commands.add('atom-text-editor', {
        'dash:shortcut': (function(_this) {
          return function() {
            return _this.shortcut(true);
          };
        })(this),
        'dash:shortcut-alt': (function(_this) {
          return function() {
            return _this.shortcut(false);
          };
        })(this),
        'dash:context-menu': (function(_this) {
          return function() {
            return _this.shortcut(true);
          };
        })(this)
      });
    },
    shortcut: function(sensitive) {
      var currentScope, editor, range, scopes, selection, text;
      editor = atom.workspace.getActiveTextEditor();
      if (!editor) {
        return;
      }
      selection = editor.getLastSelection().getText();
      if (selection) {
        return plugin.search(selection, sensitive);
      }
      scopes = editor.getLastCursor().getScopeDescriptor().getScopesArray();
      currentScope = scopes[scopes.length - 1];
      if (scopes.length < 2 || /^(?:comment|string|meta|markup)(?:\.|$)/.test(currentScope)) {
        return plugin.search(editor.getWordUnderCursor(), sensitive);
      }
      range = editor.bufferRangeForScopeAtCursor(currentScope);
      if (range != null) {
        text = editor.getTextInBufferRange(range);
      } else {
        text = editor.getWordUnderCursor();
      }
      return plugin.search(text, sensitive);
    },
    search: function(string, sensitive) {
      var activeEditor, language, path;
      activeEditor = atom.workspace.getActiveTextEditor();
      if (sensitive && activeEditor) {
        path = activeEditor.getPath();
        language = activeEditor.getGrammar().name;
      }
      return spawn('open', ['-g', this.createLink(string, path, language)]);
    },
    createLink: function(string, path, language) {
      var filename, filenameConfig, grammarConfig, keys, link;
      keys = [];
      if (path) {
        filename = basename(path).toLowerCase();
        filenameConfig = atom.config.get('dash.filenames') || {};
        keys = keys.concat(filenameConfig[filename] || filenameMap[filename] || []);
      }
      if (language) {
        grammarConfig = atom.config.get('dash.grammars') || {};
        keys = keys.concat(grammarConfig[language] || grammarMap[language] || []);
      }
      link = 'dash-plugin://';
      if (keys.length) {
        link += 'keys=' + keys.map(encodeURIComponent).join(',') + '&';
      }
      return link += 'query=' + encodeURIComponent(string);
    }
  };

}).call(this);
