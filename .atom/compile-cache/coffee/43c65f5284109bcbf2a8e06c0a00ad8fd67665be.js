(function() {
  var map, plugin, qs, shell, _;

  _ = require('underscore-plus');

  qs = require('querystring');

  map = require('./map');

  shell = require('shell');

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
      return shell.openExternal(this.createLink(string, language));
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
      return link + 'query=' + encodeURIComponent(string);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlCQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFRLE9BQUEsQ0FBUSxpQkFBUixDQUFSLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQVEsT0FBQSxDQUFRLGFBQVIsQ0FEUixDQUFBOztBQUFBLEVBRUEsR0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSLENBRlIsQ0FBQTs7QUFBQSxFQUdBLEtBQUEsR0FBUSxPQUFBLENBQVEsT0FBUixDQUhSLENBQUE7O0FBQUEsRUFLQSxNQUFBLEdBQVMsTUFBTSxDQUFDLE9BQVAsR0FDUDtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUEsR0FBQTthQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7QUFBQSxRQUNsQyxlQUFBLEVBQWlCLElBQUMsQ0FBQSxRQURnQjtBQUFBLFFBRWxDLG1CQUFBLEVBQXFCLElBQUMsQ0FBQSxRQUFRLENBQUMsSUFBVixDQUFlLElBQWYsRUFBa0IsS0FBbEIsQ0FGYTtBQUFBLFFBR2xDLG1CQUFBLEVBQXFCLElBQUMsQ0FBQSxXQUhZO09BQXBDLEVBRFE7SUFBQSxDQUFWO0FBQUEsSUFPQSxRQUFBLEVBQVUsU0FBQyxTQUFELEdBQUE7QUFDUixVQUFBLG9EQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVksSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFmLENBQUEsQ0FBWixDQUFBO0FBQUEsTUFDQSxTQUFBLEdBQVksTUFBTSxDQUFDLFlBQVAsQ0FBQSxDQUFxQixDQUFDLE9BQXRCLENBQUEsQ0FEWixDQUFBO0FBR0EsTUFBQSxJQUE4QyxTQUE5QztBQUFBLGVBQU8sTUFBTSxDQUFDLE1BQVAsQ0FBYyxTQUFkLEVBQXlCLFNBQXpCLENBQVAsQ0FBQTtPQUhBO0FBQUEsTUFLQSxNQUFBLEdBQWUsTUFBTSxDQUFDLGVBQVAsQ0FBQSxDQUxmLENBQUE7QUFBQSxNQU1BLFlBQUEsR0FBZSxNQUFPLENBQUEsTUFBTSxDQUFDLE1BQVAsR0FBZ0IsQ0FBaEIsQ0FOdEIsQ0FBQTtBQVdBLE1BQUEsSUFBRyxNQUFNLENBQUMsTUFBUCxHQUFnQixDQUFoQixJQUFxQixDQUFBLHlDQUEwQyxDQUFDLElBQTFDLENBQStDLFlBQS9DLENBQXpCO0FBQ0UsUUFBQSxLQUFBLEdBQVEsTUFBTSxDQUFDLDJCQUFQLENBQW1DLFlBQW5DLENBQVIsQ0FBQTtBQUFBLFFBQ0EsSUFBQSxHQUFRLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixLQUE1QixDQURSLENBREY7T0FBQSxNQUFBO0FBSUUsUUFBQSxJQUFBLEdBQU8sTUFBTSxDQUFDLGtCQUFQLENBQUEsQ0FBUCxDQUpGO09BWEE7YUFpQkEsTUFBTSxDQUFDLE1BQVAsQ0FBYyxJQUFkLEVBQW9CLFNBQXBCLEVBbEJRO0lBQUEsQ0FQVjtBQUFBLElBMkJBLFdBQUEsRUFBYSxTQUFBLEdBQUE7YUFDWCxNQUFNLENBQUMsTUFBUCxDQUFjLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZixDQUFBLENBQWdDLENBQUMsa0JBQWpDLENBQUEsQ0FBZCxFQUFxRSxJQUFyRSxFQURXO0lBQUEsQ0EzQmI7QUFBQSxJQThCQSxNQUFBLEVBQVEsU0FBQyxNQUFELEVBQVMsU0FBVCxHQUFBO0FBQ04sVUFBQSxRQUFBO0FBQUEsTUFBQSxJQUFHLFNBQUg7QUFDRSxRQUFBLFFBQUEsR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWYsQ0FBQSxDQUFnQyxDQUFDLFVBQWpDLENBQUEsQ0FBNkMsQ0FBQyxJQUF6RCxDQURGO09BQUE7YUFHQSxLQUFLLENBQUMsWUFBTixDQUFtQixJQUFDLENBQUEsVUFBRCxDQUFZLE1BQVosRUFBb0IsUUFBcEIsQ0FBbkIsRUFKTTtJQUFBLENBOUJSO0FBQUEsSUFvQ0EsVUFBQSxFQUFZLFNBQUMsTUFBRCxFQUFTLFFBQVQsR0FBQTtBQUdWLFVBQUEsVUFBQTtBQUFBLE1BQUEsSUFBRyxRQUFIO0FBQ0UsUUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGdCQUFBLEdBQW1CLFFBQW5DLENBQVAsQ0FBQTtBQUNBLFFBQUEsSUFBd0IsQ0FBQSxJQUF4QjtBQUFBLFVBQUEsSUFBQSxHQUFPLEdBQUksQ0FBQSxRQUFBLENBQVgsQ0FBQTtTQUZGO09BQUE7QUFBQSxNQUlBLElBQUEsR0FBTyxnQkFKUCxDQUFBO0FBTUEsTUFBQSxtQkFBRyxJQUFJLENBQUUsZUFBVDtBQUNFLFFBQUEsSUFBQSxJQUFRLE9BQUEsR0FBVSxJQUFJLENBQUMsR0FBTCxDQUFTLGtCQUFULENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsR0FBbEMsQ0FBVixHQUFtRCxHQUEzRCxDQURGO09BTkE7YUFTQSxJQUFBLEdBQU8sUUFBUCxHQUFrQixrQkFBQSxDQUFtQixNQUFuQixFQVpSO0lBQUEsQ0FwQ1o7R0FORixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/dash/lib/dash.coffee