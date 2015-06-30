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

    StatusBarManager.prototype.initialize = function(statusBar) {
      this.statusBar = statusBar;
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
      return this.tile = this.statusBar.addRightTile({
        item: this.element,
        priority: 20
      });
    };

    StatusBarManager.prototype.detach = function() {
      return this.tile.destroy();
    };

    return StatusBarManager;

  })();

}).call(this);
