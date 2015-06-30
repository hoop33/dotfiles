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
      return this.disposables.add(atom.keymap.onDidMatchBinding((function(_this) {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9FQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFFQSxpQkFBQSxHQUFvQixJQUZwQixDQUFBOztBQUFBLEVBR0EsZ0JBQUEsR0FBbUIsdUJBSG5CLENBQUE7O0FBQUEsRUFLQSxVQUFBLEdBQWEsU0FBQyxRQUFELEdBQUE7O01BQ1gsb0JBQXFCLE9BQUEsQ0FBUSx1QkFBUjtLQUFyQjtXQUNJLElBQUEsaUJBQUEsQ0FBa0I7QUFBQSxNQUFDLEdBQUEsRUFBSyxnQkFBTjtBQUFBLE1BQXdCLFVBQUEsUUFBeEI7S0FBbEIsRUFGTztFQUFBLENBTGIsQ0FBQTs7QUFBQSxFQVNBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFBVSxTQUFDLElBQUQsR0FBQTtBQUNSLFVBQUEsc0JBQUE7QUFBQSxNQURVLElBQUMsQ0FBQSwyQkFBRixPQUFZLElBQVYsUUFDWCxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsV0FBRCxHQUFtQixJQUFBLG1CQUFBLENBQUEsQ0FBbkIsQ0FBQTs7UUFDQSxJQUFDLENBQUEsV0FBWTtPQURiO0FBQUEsTUFFQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ0U7QUFBQSxRQUFBLDJCQUFBLEVBQTZCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUMzQixLQUFDLENBQUEsUUFBRCxHQUFZLEdBRGU7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE3QjtBQUFBLFFBRUEscUJBQUEsRUFBdUIsU0FBQSxHQUFBO2lCQUNyQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsZ0JBQXBCLEVBRHFCO1FBQUEsQ0FGdkI7T0FERixDQUZBLENBQUE7QUFBQSxNQVFBLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBZixDQUF5QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxRQUFELEdBQUE7QUFDdkIsVUFBQSxJQUF5QixRQUFBLEtBQVksZ0JBQXJDO21CQUFBLFVBQUEsQ0FBVyxLQUFDLENBQUEsUUFBWixFQUFBO1dBRHVCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekIsQ0FSQSxDQUFBO0FBQUEsTUFXQSxzQkFBQSxHQUF5QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxTQUFELEdBQUE7QUFDdkIsY0FBQSxZQUFBO0FBQUEsVUFBQSxJQUFVLFNBQVMsQ0FBQyxPQUFWLENBQWtCLEdBQWxCLENBQUEsR0FBeUIsQ0FBbkM7QUFBQSxrQkFBQSxDQUFBO1dBQUE7QUFBQSxVQUVBLFlBQUEsR0FBZSxLQUFDLENBQUEsUUFBUyxDQUFBLFNBQUEsQ0FGekIsQ0FBQTtBQUdBLFVBQUEsSUFBQSxDQUFBLFlBQUE7QUFDRSxZQUFBLFlBQUEsR0FDRTtBQUFBLGNBQUEsS0FBQSxFQUFPLENBQVA7QUFBQSxjQUNBLElBQUEsRUFBTSxTQUROO2FBREYsQ0FBQTtBQUFBLFlBR0EsS0FBQyxDQUFBLFFBQVMsQ0FBQSxTQUFBLENBQVYsR0FBdUIsWUFIdkIsQ0FERjtXQUhBO0FBQUEsVUFRQSxZQUFZLENBQUMsS0FBYixFQVJBLENBQUE7aUJBU0EsWUFBWSxDQUFDLE9BQWIsR0FBdUIsSUFBSSxDQUFDLEdBQUwsQ0FBQSxFQVZBO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FYekIsQ0FBQTtBQUFBLE1BdUJBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWQsQ0FBNkIsU0FBQyxLQUFELEdBQUE7QUFDNUMsWUFBQSxJQUFBO0FBQUEsUUFEOEMsT0FBRCxNQUFDLElBQzlDLENBQUE7ZUFBQSxzQkFBQSxDQUF1QixJQUF2QixFQUQ0QztNQUFBLENBQTdCLENBQWpCLENBdkJBLENBQUE7YUEwQkEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQVosQ0FBOEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsS0FBRCxHQUFBO0FBQzdDLGNBQUEsT0FBQTtBQUFBLFVBRCtDLFVBQUQsTUFBQyxPQUMvQyxDQUFBO2lCQUFBLHNCQUFBLENBQXVCLE9BQU8sQ0FBQyxPQUEvQixFQUQ2QztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTlCLENBQWpCLEVBM0JRO0lBQUEsQ0FBVjtBQUFBLElBOEJBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixVQUFBLElBQUE7O1lBQVksQ0FBRSxPQUFkLENBQUE7T0FBQTthQUNBLElBQUMsQ0FBQSxRQUFELEdBQVksR0FGRjtJQUFBLENBOUJaO0FBQUEsSUFrQ0EsU0FBQSxFQUFXLFNBQUEsR0FBQTthQUNUO0FBQUEsUUFBRSxVQUFELElBQUMsQ0FBQSxRQUFGO1FBRFM7SUFBQSxDQWxDWDtHQVZGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/command-logger/lib/main.coffee