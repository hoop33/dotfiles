(function() {
  var CommandLoggerView, CompositeDisposable, commandLoggerUri, createView;

  CompositeDisposable = require('atom').CompositeDisposable;

  CommandLoggerView = null;

  commandLoggerUri = 'atom://command-logger';

  createView = function(eventLog) {
    if (CommandLoggerView == null) {
      CommandLoggerView = require('./command-logger-view');
    }
    return new CommandLoggerView({
      uri: commandLoggerUri,
      eventLog: eventLog
    });
  };

  module.exports = {
    activate: function(_arg) {
      var registerTriggeredEvent;
      this.eventLog = (_arg != null ? _arg : {}).eventLog;
      this.disposables = new CompositeDisposable();
      if (this.eventLog == null) {
        this.eventLog = {};
      }
      atom.commands.add('atom-workspace', {
        'command-logger:clear-data': (function(_this) {
          return function() {
            return _this.eventLog = {};
          };
        })(this),
        'command-logger:open': function() {
          return atom.workspace.open(commandLoggerUri);
        }
      });
      atom.workspace.addOpener((function(_this) {
        return function(filePath) {
          if (filePath === commandLoggerUri) {
            return createView(_this.eventLog);
          }
        };
      })(this));
      registerTriggeredEvent = (function(_this) {
        return function(eventName) {
          var eventNameLog;
          if (eventName.indexOf(':') < 1) {
            return;
          }
          eventNameLog = _this.eventLog[eventName];
          if (!eventNameLog) {
            eventNameLog = {
              count: 0,
              name: eventName
            };
            _this.eventLog[eventName] = eventNameLog;
          }
          eventNameLog.count++;
          return eventNameLog.lastRun = Date.now();
        };
      })(this);
      this.disposables.add(atom.commands.onWillDispatch(function(_arg1) {
        var type;
        type = _arg1.type;
        return registerTriggeredEvent(type);
      }));
      return this.disposables.add(atom.keymaps.onDidMatchBinding((function(_this) {
        return function(_arg1) {
          var binding;
          binding = _arg1.binding;
          return registerTriggeredEvent(binding.command);
        };
      })(this)));
    },
    deactivate: function() {
      var _ref;
      if ((_ref = this.disposables) != null) {
        _ref.dispose();
      }
      return this.eventLog = {};
    },
    serialize: function() {
      return {
        eventLog: this.eventLog
      };
    }
  };

}).call(this);
