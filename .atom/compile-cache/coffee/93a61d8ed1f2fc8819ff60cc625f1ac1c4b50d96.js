(function() {
  var GlobalVimState;

  module.exports = GlobalVimState = (function() {
    function GlobalVimState() {}

    GlobalVimState.prototype.registers = {};

    GlobalVimState.prototype.searchHistory = [];

    return GlobalVimState;

  })();

}).call(this);
