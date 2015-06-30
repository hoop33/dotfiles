(function() {
  var $, CommandLoggerView, commandLoggerUri, createView;

  $ = require('atom').$;

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
      var registerTriggeredEvent, trigger;
      this.eventLog = (_arg != null ? _arg : {}).eventLog;
      if (this.eventLog == null) {
        this.eventLog = {};
      }
      atom.workspaceView.command('command-logger:clear-data', (function(_this) {
        return function() {
          return _this.eventLog = {};
        };
      })(this));
      atom.workspace.registerOpener((function(_this) {
        return function(filePath) {
          if (filePath === commandLoggerUri) {
            return createView(_this.eventLog);
          }
        };
      })(this));
      atom.workspaceView.command('command-logger:open', function() {
        return atom.workspaceView.open(commandLoggerUri);
      });
      registerTriggeredEvent = (function(_this) {
        return function(eventName) {
          var eventNameLog;
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
      trigger = $.fn.trigger;
      this.originalTrigger = trigger;
      $.fn.trigger = function(event) {
        var eventName, _ref;
        eventName = (_ref = event.type) != null ? _ref : event;
        if ($(this).events()[eventName]) {
          registerTriggeredEvent(eventName);
        }
        return trigger.apply(this, arguments);
      };
      return this.keymapMatchedSubscription = atom.keymap.on('matched', (function(_this) {
        return function(_arg1) {
          var binding;
          binding = _arg1.binding;
          return registerTriggeredEvent(binding.command);
        };
      })(this));
    },
    deactivate: function() {
      var _ref;
      if (this.originalTrigger != null) {
        $.fn.trigger = this.originalTrigger;
      }
      if ((_ref = this.keymapMatchedSubscription) != null) {
        _ref.off();
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtEQUFBOztBQUFBLEVBQUMsSUFBSyxPQUFBLENBQVEsTUFBUixFQUFMLENBQUQsQ0FBQTs7QUFBQSxFQUNBLGlCQUFBLEdBQW9CLElBRHBCLENBQUE7O0FBQUEsRUFHQSxnQkFBQSxHQUFtQix1QkFIbkIsQ0FBQTs7QUFBQSxFQUtBLFVBQUEsR0FBYSxTQUFDLFFBQUQsR0FBQTs7TUFDWCxvQkFBcUIsT0FBQSxDQUFRLHVCQUFSO0tBQXJCO1dBQ0ksSUFBQSxpQkFBQSxDQUFrQjtBQUFBLE1BQUMsR0FBQSxFQUFLLGdCQUFOO0FBQUEsTUFBd0IsVUFBQSxRQUF4QjtLQUFsQixFQUZPO0VBQUEsQ0FMYixDQUFBOztBQUFBLEVBU0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUMsSUFBRCxHQUFBO0FBQ1IsVUFBQSwrQkFBQTtBQUFBLE1BRFUsSUFBQyxDQUFBLDJCQUFGLE9BQVksSUFBVixRQUNYLENBQUE7O1FBQUEsSUFBQyxDQUFBLFdBQVk7T0FBYjtBQUFBLE1BQ0EsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQiwyQkFBM0IsRUFBd0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsUUFBRCxHQUFZLEdBQWY7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4RCxDQURBLENBQUE7QUFBQSxNQUdBLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBZixDQUE4QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxRQUFELEdBQUE7QUFDNUIsVUFBQSxJQUF5QixRQUFBLEtBQVksZ0JBQXJDO21CQUFBLFVBQUEsQ0FBVyxLQUFDLENBQUEsUUFBWixFQUFBO1dBRDRCO1FBQUEs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
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/command-logger/lib/main.coffee