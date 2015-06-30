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
      var globalVimState, statusBarManager;
      this.disposables = new CompositeDisposable;
      globalVimState = new GlobalVimState;
      statusBarManager = new StatusBarManager;
      this.disposables.add(statusBarManager.initialize());
      return this.disposables.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var element, vimState;
          if (editor.mini) {
            return;
          }
          element = atom.views.getView(editor);
          vimState = new VimState(element, statusBarManager, globalVimState);
          return _this.disposables.add(new Disposable(function() {
            return vimState.destroy();
          }));
        };
      })(this)));
    },
    deactivate: function() {
      return this.disposables.dispose();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlGQUFBOztBQUFBLEVBQUEsT0FBb0MsT0FBQSxDQUFRLFdBQVIsQ0FBcEMsRUFBQyxrQkFBQSxVQUFELEVBQWEsMkJBQUEsbUJBQWIsQ0FBQTs7QUFBQSxFQUNBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxzQkFBUixDQURuQixDQUFBOztBQUFBLEVBRUEsY0FBQSxHQUFpQixPQUFBLENBQVEsb0JBQVIsQ0FGakIsQ0FBQTs7QUFBQSxFQUdBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQUhYLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLGlCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtPQURGO0FBQUEsTUFHQSxxQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7T0FKRjtLQURGO0FBQUEsSUFRQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixVQUFBLGdDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsV0FBRCxHQUFlLEdBQUEsQ0FBQSxtQkFBZixDQUFBO0FBQUEsTUFDQSxjQUFBLEdBQWlCLEdBQUEsQ0FBQSxjQURqQixDQUFBO0FBQUEsTUFFQSxnQkFBQSxHQUFtQixHQUFBLENBQUEsZ0JBRm5CLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixnQkFBZ0IsQ0FBQyxVQUFqQixDQUFBLENBQWpCLENBSkEsQ0FBQTthQUtBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFmLENBQWtDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE1BQUQsR0FBQTtBQUNqRCxjQUFBLGlCQUFBO0FBQUEsVUFBQSxJQUFVLE1BQU0sQ0FBQyxJQUFqQjtBQUFBLGtCQUFBLENBQUE7V0FBQTtBQUFBLFVBRUEsT0FBQSxHQUFVLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixNQUFuQixDQUZWLENBQUE7QUFBQSxVQUlBLFFBQUEsR0FBZSxJQUFBLFFBQUEsQ0FDYixPQURhLEVBRWIsZ0JBRmEsRUFHYixjQUhhLENBSmYsQ0FBQTtpQkFVQSxLQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBcUIsSUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO21CQUM5QixRQUFRLENBQUMsT0FBVCxDQUFBLEVBRDhCO1VBQUEsQ0FBWCxDQUFyQixFQVhpRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLENBQWpCLEVBTlE7SUFBQSxDQVJWO0FBQUEsSUE0QkEsVUFBQSxFQUFZLFNBQUEsR0FBQTthQUNWLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBLEVBRFU7SUFBQSxDQTVCWjtHQU5GLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/vim-mode/lib/vim-mode.coffee