(function() {
  var map, plugin, qs, shell, _;

  _ = require('underscore-plus');

  qs = require('querystring');

  map = require('./map');

  shell = require('shell');

  plugin = module.exports = {
    activate: function() {
      atom.workspaceView.command('dash:shortcut', this.shortcut);
      atom.workspaceView.command('dash:shortcut-alt', this.shortcut.bind(this, false));
      return atom.workspaceView.command('dash:context-menu', this.contextMenu);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlCQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFRLE9BQUEsQ0FBUSxpQkFBUixDQUFSLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQVEsT0FBQSxDQUFRLGFBQVIsQ0FEUixDQUFBOztBQUFBLEVBRUEsR0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSLENBRlIsQ0FBQTs7QUFBQSxFQUdBLEtBQUEsR0FBUSxPQUFBLENBQVEsT0FBUixDQUhSLENBQUE7O0FBQUEsRUFLQSxNQUFBLEdBQVMsTUFBTSxDQUFDLE9BQVAsR0FDUDtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQixlQUEzQixFQUE0QyxJQUFDLENBQUEsUUFBN0MsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLG1CQUEzQixFQUFnRCxJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxJQUFmLEVBQWtCLEtBQWxCLENBQWhELENBREEsQ0FBQTthQUVBLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBMkIsbUJBQTNCLEVBQWdELElBQUMsQ0FBQSxXQUFqRCxFQUhRO0lBQUEsQ0FBVjtBQUFBLElBS0EsUUFBQSxFQUFVLFNBQUMsU0FBRCxHQUFBO0FBQ1IsVUFBQSxvREFBQTtBQUFBLE1BQUEsTUFBQSxHQUFZLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZixDQUFBLENBQVosQ0FBQTtBQUFBLE1BQ0EsU0FBQSxHQUFZLE1BQU0sQ0FBQyxZQUFQLENBQUEsQ0FBcUIsQ0FBQyxPQUF0QixDQUFBLENBRFosQ0FBQTtBQUdBLE1BQUEsSUFBOEMsU0FBOUM7QUFBQSxlQUFPLE1BQU0sQ0FBQyxNQUFQLENBQWMsU0FBZCxFQUF5QixTQUF6QixDQUFQLENBQUE7T0FIQTtBQUFBLE1BS0EsTUFBQSxHQUFlLE1BQU0sQ0FBQyxlQUFQLENBQUEsQ0FMZixDQUFBO0FBQUEsTUFNQSxZQUFBLEdBQWUsTUFBTyxDQUFBLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLENBQWhCLENBTnRCLENBQUE7QUFXQSxNQUFBLElBQUcsTUFBTSxDQUFDLE1BQVAsR0FBZ0IsQ0FBaEIsSUFBcUIsQ0FBQSx5Q0FBMEMsQ0FBQyxJQUExQyxDQUErQyxZQUEvQyxDQUF6QjtBQUNFLFFBQUEsS0FBQSxHQUFRLE1BQU0sQ0FBQywyQkFBUCxDQUFtQyxZQUFuQyxDQUFSLENBQUE7QUFBQSxRQUNBLElBQUEsR0FBUSxNQUFNLENBQUMsb0JBQVAsQ0FBNEIsS0FBNUIsQ0FEUixDQURGO09BQUEsTUFBQTtBQUlFLFFBQUEsSUFBQSxHQUFPLE1BQU0sQ0FBQyxrQkFBUCxDQUFBLENBQVAsQ0FKRjtPQVhBO2FBaUJBLE1BQU0sQ0FBQyxNQUFQLENBQWMsSUFBZCxFQUFvQixTQUFwQixFQWxCUTtJQUFBLENBTFY7QUFBQSxJQXlCQSxXQUFBLEVBQWEsU0FBQSxHQUFBO2FBQ1gsTUFBTSxDQUFDLE1BQVAsQ0FBYyxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWYsQ0FBQSxDQUFnQyxDQUFDLGtCQUFqQyxDQUFBLENBQWQsRUFBcUUsSUFBckUsRUFEVztJQUFBLENBekJiO0FBQUEsSUE0QkEsTUFBQSxFQUFRLFNBQUMsTUFBRCxFQUFTLFNBQVQsR0FBQTtBQUNOLFVBQUEsUUFBQTtBQUFBLE1BQUEsSUFBRyxTQUFIO0FBQ0UsUUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFmLENBQUEsQ0FBZ0MsQ0FBQyxVQUFqQyxDQUFBLENBQTZDLENBQUMsSUFBekQsQ0FERjtPQUFBO2FBR0EsS0FBSyxDQUFDLFlBQU4sQ0FBbUIsSUFBQyxDQUFBLFVBQUQsQ0FBWSxNQUFaLEVBQW9CLFFBQXBCLENBQW5CLEVBSk07SUFBQSxDQTVCUjtBQUFBLElBa0NBLFVBQUEsRUFBWSxTQUFDLE1BQUQsRUFBUyxRQUFULEdBQUE7QUFHVixVQUFBLFVBQUE7QUFBQSxNQUFBLElBQUcsUUFBSDtBQUNFLFFBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQkFBQSxHQUFtQixRQUFuQyxDQUFQLENBQUE7QUFDQSxRQUFBLElBQXdCLENBQUEsSUFBeEI7QUFBQSxVQUFBLElBQUEsR0FBTyxHQUFJLENBQUEsUUFBQSxDQUFYLENBQUE7U0FGRjtPQUFBO0FBQUEsTUFJQSxJQUFBLEdBQU8sZ0JBSlAsQ0FBQTtBQU1BLE1BQUEsbUJBQUcsSUFBSSxDQUFFLGVBQVQ7QUFDRSxRQUFBLElBQUEsSUFBUSxPQUFBLEdBQVUsSUFBSSxDQUFDLEdBQUwsQ0FBUyxrQkFBVCxDQUE0QixDQUFDLElBQTdCLENBQWtDLEdBQWxDLENBQVYsR0FBbUQsR0FBM0QsQ0FERjtPQU5BO2FBU0EsSUFBQSxHQUFPLFFBQVAsR0FBa0Isa0JBQUEsQ0FBbUIsTUFBbkIsRUFaUjtJQUFBLENBbENaO0dBTkYsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/dash/lib/dash.coffee