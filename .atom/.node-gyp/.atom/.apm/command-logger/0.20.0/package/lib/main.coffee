{$} = require 'atom'
CommandLoggerView = null

commandLoggerUri = 'atom://command-logger'

createView = (eventLog) ->
  CommandLoggerView ?= require './command-logger-view'
  new CommandLoggerView({uri: commandLoggerUri, eventLog})

module.exports =
  activate: ({@eventLog}={}) ->
    @eventLog ?= {}
    atom.workspaceView.command 'command-logger:clear-data', => @eventLog = {}

    atom.workspace.registerOpener (filePath) =>
      createView(@eventLog) if filePath is commandLoggerUri

    atom.workspaceView.command 'command-logger:open', ->
      atom.workspaceView.open(commandLoggerUri)

    registerTriggeredEvent = (eventName) =>
      eventNameLog = @eventLog[eventName]
      unless eventNameLog
        eventNameLog =
          count: 0
          name: eventName
        @eventLog[eventName] = eventNameLog
      eventNameLog.count++
      eventNameLog.lastRun = Date.now()
    trigger = $.fn.trigger
    @originalTrigger = trigger
    $.fn.trigger = (event) ->
      eventName = event.type ? event
      registerTriggeredEvent(eventName) if $(this).events()[eventName]
      trigger.apply(this, arguments)

    @keymapMatchedSubscription = atom.keymap.on 'matched', ({binding}) =>
      registerTriggeredEvent(binding.command)

  deactivate: ->
    $.fn.trigger = @originalTrigger if @originalTrigger?
    @keymapMatchedSubscription?.off()
    @eventLog = {}

  serialize: ->
    {@eventLog}
