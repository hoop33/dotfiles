(function() {
  var map, plugin, spawn;

  map = require('./map');

  spawn = require('child_process').spawn;

  plugin = module.exports = {
    activate: function() {
      return atom.commands.add('atom-workspace', {
        'dash:shortcut': this.shortcut,
        'dash:shortcut-alt': this.shortcut.bind(this, false),
        'dash:context-menu': this.contextMenu
      });
    },
    shortcut: function(sensitive) {
      var currentScope, editor, range, scopes, selection, text;
      editor = atom.workspace.getActiveEditor();
      if (!editor) {
        return;
      }
      selection = editor.getSelection().getText();
      if (selection) {
        return plugin.search(selection, sensitive);
      }
      scopes = editor.getCursorScopes();
      currentScope = scopes[scopes.length - 1];
      if (scopes.length > 1 && !/^(?:comment|string|meta|markup)(?:\.|$)/.test(currentScope)) {
        range = editor.bufferRangeForScopeAtCursor(currentScope);
        text = editor.getTextInBufferRange(range);
      } else {
        text = editor.getWordUnderCursor();
      }
      return plugin.search(text, sensitive);
    },
    contextMenu: function() {
      return plugin.search(atom.workspace.getActiveEditor().getWordUnderCursor(), true);
    },
    search: function(string, sensitive) {
      var language;
      if (sensitive) {
        language = atom.workspace.getActiveEditor().getGrammar().name;
      }
      return spawn('open', ['-g', this.createLink(string, language)]);
    },
    createLink: function(string, language) {
      var keys, link;
      if (language) {
        keys = atom.config.get('dash.grammars.' + language);
        if (!keys) {
          keys = map[language];
        }
      }
      link = 'dash-plugin://';
      if (keys != null ? keys.length : void 0) {
        link += 'keys=' + keys.map(encodeURIComponent).join(',') + '&';
      }
      return link += 'query=' + encodeURIComponent(string);
    }
  };

}).call(this);
