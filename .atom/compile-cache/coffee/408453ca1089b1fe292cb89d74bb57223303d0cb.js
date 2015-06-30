(function() {
  var CompositeDisposable, ContentsByMode, Disposable, StatusBarManager, _ref;

  _ref = require('event-kit'), Disposable = _ref.Disposable, CompositeDisposable = _ref.CompositeDisposable;

  ContentsByMode = {
    insert: ["status-bar-vim-mode-insert", "Insert"],
    command: ["status-bar-vim-mode-command", "Command"],
    visual: ["status-bar-vim-mode-visual", "Visual"]
  };

  module.exports = StatusBarManager = (function() {
    function StatusBarManager() {
      this.element = document.createElement("div");
      this.element.id = "status-bar-vim-mode";
      this.element.classList.add("inline-block");
    }

    StatusBarManager.prototype.initialize = function() {
      this.disposables = new CompositeDisposable;
      if (!this.attach()) {
        this.disposables.add(atom.packages.onDidActivateAll((function(_this) {
          return function() {
            return _this.attach();
          };
        })(this)));
      }
      return this.disposables;
    };

    StatusBarManager.prototype.update = function(currentMode) {
      var html, klass, mode, _ref1, _results;
      _results = [];
      for (mode in ContentsByMode) {
        _ref1 = ContentsByMode[mode], klass = _ref1[0], html = _ref1[1];
        if (mode === currentMode) {
          this.element.classList.add(klass);
          _results.push(this.element.innerHTML = html);
        } else {
          _results.push(this.element.classList.remove(klass));
        }
      }
      return _results;
    };

    StatusBarManager.prototype.attach = function() {
      var statusBar, _ref1;
      statusBar = (_ref1 = atom.workspaceView) != null ? _ref1.statusBar : void 0;
      if (statusBar != null) {
        statusBar.prependRight(this.element);
        this.disposables.add(new Disposable((function(_this) {
          return function() {
            var _ref2;
            return (_ref2 = _this.element.parentNode) != null ? _ref2.removeChild(_this.element) : void 0;
          };
        })(this)));
        return true;
      } else {
        return false;
      }
    };

    return StatusBarManager;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVFQUFBOztBQUFBLEVBQUEsT0FBb0MsT0FBQSxDQUFRLFdBQVIsQ0FBcEMsRUFBQyxrQkFBQSxVQUFELEVBQWEsMkJBQUEsbUJBQWIsQ0FBQTs7QUFBQSxFQUVBLGNBQUEsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUFTLENBQUMsNEJBQUQsRUFBK0IsUUFBL0IsQ0FBVDtBQUFBLElBQ0EsT0FBQSxFQUFTLENBQUMsNkJBQUQsRUFBZ0MsU0FBaEMsQ0FEVDtBQUFBLElBRUEsTUFBQSxFQUFTLENBQUMsNEJBQUQsRUFBK0IsUUFBL0IsQ0FGVDtHQUhGLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSwwQkFBQSxHQUFBO0FBQ1gsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBQVgsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULEdBQWMscUJBRGQsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbkIsQ0FBdUIsY0FBdkIsQ0FGQSxDQURXO0lBQUEsQ0FBYjs7QUFBQSwrQkFLQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxJQUFDLENBQUEsV0FBRCxHQUFlLEdBQUEsQ0FBQSxtQkFBZixDQUFBO0FBQ0EsTUFBQSxJQUFBLENBQUEsSUFBUSxDQUFBLE1BQUQsQ0FBQSxDQUFQO0FBQ0UsUUFBQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZCxDQUErQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsTUFBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEvQixDQUFqQixDQUFBLENBREY7T0FEQTthQUdBLElBQUMsQ0FBQSxZQUpTO0lBQUEsQ0FMWixDQUFBOztBQUFBLCtCQVdBLE1BQUEsR0FBUSxTQUFDLFdBQUQsR0FBQTtBQUNOLFVBQUEsa0NBQUE7QUFBQTtXQUFBLHNCQUFBLEdBQUE7QUFDRSxzQ0FEUyxrQkFBTyxlQUNoQixDQUFBO0FBQUEsUUFBQSxJQUFHLElBQUEsS0FBUSxXQUFYO0FBQ0UsVUFBQSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFuQixDQUF1QixLQUF2QixDQUFBLENBQUE7QUFBQSx3QkFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVQsR0FBcUIsS0FEckIsQ0FERjtTQUFBLE1BQUE7d0JBSUUsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBbkIsQ0FBMEIsS0FBMUIsR0FKRjtTQURGO0FBQUE7c0JBRE07SUFBQSxDQVhSLENBQUE7O0FBQUEsK0JBcUJBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixVQUFBLGdCQUFBO0FBQUEsTUFBQSxTQUFBLCtDQUE4QixDQUFFLGtCQUFoQyxDQUFBO0FBQ0EsTUFBQSxJQUFHLGlCQUFIO0FBQ0UsUUFBQSxTQUFTLENBQUMsWUFBVixDQUF1QixJQUFDLENBQUEsT0FBeEIsQ0FBQSxDQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBcUIsSUFBQSxVQUFBLENBQVcsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7QUFDOUIsZ0JBQUEsS0FBQTtxRUFBbUIsQ0FBRSxXQUFyQixDQUFpQyxLQUFDLENBQUEsT0FBbEMsV0FEOEI7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFYLENBQXJCLENBREEsQ0FBQTtlQUdBLEtBSkY7T0FBQSxNQUFBO2VBTUUsTUFORjtPQUZNO0lBQUEsQ0FyQlIsQ0FBQTs7NEJBQUE7O01BVEYsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/vim-mode/lib/status-bar-manager.coffee