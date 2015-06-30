(function() {
  var CompositeDisposable, Disposable, GlobalVimState, StatusBarManager, VimState, _ref;

  _ref = require('event-kit'), Disposable = _ref.Disposable, CompositeDisposable = _ref.CompositeDisposable;

  StatusBarManager = require('./status-bar-manager');

  GlobalVimState = require('./global-vim-state');

  VimState = require('./vim-state');

  module.exports = {
    config: {
      startInInsertMode: {
        type: 'boolean',
        "default": false
      },
      useSmartcaseForSearch: {
        type: 'boolean',
        "default": false
      }
    },
    activate: function(state) {
      var globalVimState, statusBarManager, vimStates;
      this.disposables = new CompositeDisposable;
      globalVimState = new GlobalVimState;
      statusBarManager = new StatusBarManager;
      vimStates = new WeakMap;
      this.disposables.add(statusBarManager.initialize());
      return this.disposables.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var element, vimState;
          if (editor.mini) {
            return;
          }
          element = atom.views.getView(editor);
          if (!vimStates.get(editor)) {
            vimState = new VimState(element, statusBarManager, globalVimState);
            vimStates.set(editor, vimState);
            return _this.disposables.add(new Disposable(function() {
              return vimState.destroy();
            }));
          }
        };
      })(this)));
    },
    deactivate: function() {
      return this.disposables.dispose();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlGQUFBOztBQUFBLEVBQUEsT0FBb0MsT0FBQSxDQUFRLFdBQVIsQ0FBcEMsRUFBQyxrQkFBQSxVQUFELEVBQWEsMkJBQUEsbUJBQWIsQ0FBQTs7QUFBQSxFQUNBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxzQkFBUixDQURuQixDQUFBOztBQUFBLEVBRUEsY0FBQSxHQUFpQixPQUFBLENBQVEsb0JBQVIsQ0FGakIsQ0FBQTs7QUFBQSxFQUdBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQUhYLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLGlCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtPQURGO0FBQUEsTUFHQSxxQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7T0FKRjtLQURGO0FBQUEsSUFRQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixVQUFBLDJDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsV0FBRCxHQUFlLEdBQUEsQ0FBQSxtQkFBZixDQUFBO0FBQUEsTUFDQSxjQUFBLEdBQWlCLEdBQUEsQ0FBQSxjQURqQixDQUFBO0FBQUEsTUFFQSxnQkFBQSxHQUFtQixHQUFBLENBQUEsZ0JBRm5CLENBQUE7QUFBQSxNQUdBLFNBQUEsR0FBWSxHQUFBLENBQUEsT0FIWixDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsZ0JBQWdCLENBQUMsVUFBakIsQ0FBQSxDQUFqQixDQUxBLENBQUE7YUFNQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxNQUFELEdBQUE7QUFDakQsY0FBQSxpQkFBQTtBQUFBLFVBQUEsSUFBVSxNQUFNLENBQUMsSUFBakI7QUFBQSxrQkFBQSxDQUFBO1dBQUE7QUFBQSxVQUVBLE9BQUEsR0FBVSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsTUFBbkIsQ0FGVixDQUFBO0FBSUEsVUFBQSxJQUFHLENBQUEsU0FBYSxDQUFDLEdBQVYsQ0FBYyxNQUFkLENBQVA7QUFDRSxZQUFBLFFBQUEsR0FBZSxJQUFBLFFBQUEsQ0FDYixPQURhLEVBRWIsZ0JBRmEsRUFHYixjQUhhLENBQWYsQ0FBQTtBQUFBLFlBTUEsU0FBUyxDQUFDLEdBQVYsQ0FBYyxNQUFkLEVBQXNCLFFBQXRCLENBTkEsQ0FBQTttQkFRQSxLQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBcUIsSUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO3FCQUM5QixRQUFRLENBQUMsT0FBVCxDQUFBLEVBRDhCO1lBQUEsQ0FBWCxDQUFyQixFQVRGO1dBTGlEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEMsQ0FBakIsRUFQUTtJQUFBLENBUlY7QUFBQSxJQWdDQSxVQUFBLEVBQVksU0FBQSxHQUFBO2FBQ1YsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUEsRUFEVTtJQUFBLENBaENaO0dBTkYsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/vim-mode/lib/vim-mode.coffee