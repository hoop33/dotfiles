(function() {
  var Prefix, Register, Repeat,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Prefix = (function() {
    function Prefix() {}

    Prefix.prototype.complete = null;

    Prefix.prototype.composedObject = null;

    Prefix.prototype.isComplete = function() {
      return this.complete;
    };

    Prefix.prototype.isRecordable = function() {
      return this.composedObject.isRecordable();
    };

    Prefix.prototype.compose = function(composedObject) {
      this.composedObject = composedObject;
      return this.complete = true;
    };

    Prefix.prototype.execute = function() {
      var _base;
      return typeof (_base = this.composedObject).execute === "function" ? _base.execute(this.count) : void 0;
    };

    Prefix.prototype.select = function() {
      var _base;
      return typeof (_base = this.composedObject).select === "function" ? _base.select(this.count) : void 0;
    };

    Prefix.prototype.isLinewise = function() {
      return this.composedObject.isLinewise();
    };

    return Prefix;

  })();

  Repeat = (function(_super) {
    __extends(Repeat, _super);

    Repeat.prototype.count = null;

    function Repeat(count) {
      this.count = count;
      this.complete = false;
    }

    Repeat.prototype.addDigit = function(digit) {
      return this.count = this.count * 10 + digit;
    };

    return Repeat;

  })(Prefix);

  Register = (function(_super) {
    __extends(Register, _super);

    Register.prototype.name = null;

    function Register(name) {
      this.name = name;
      this.complete = false;
    }

    Register.prototype.compose = function(composedObject) {
      Register.__super__.compose.call(this, composedObject);
      if (composedObject.register != null) {
        return composedObject.register = this.name;
      }
    };

    return Register;

  })(Prefix);

  module.exports = {
    Repeat: Repeat,
    Register: Register
  };

}).call(this);
