(function() {
  var GlobalVimState;

  module.exports = GlobalVimState = (function() {
    function GlobalVimState() {}

    GlobalVimState.prototype.registers = {};

    GlobalVimState.prototype.searchHistory = [];

    GlobalVimState.prototype.currentSearch = {};

    return GlobalVimState;

  })();

}).call(this);
