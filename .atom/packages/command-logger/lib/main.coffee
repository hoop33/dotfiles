{CompositeDisposable} = require 'atom'

CommandLoggerView = null
commandLoggerUri = 'atom://command-logger'

createView = (eventLog) ->
  CommandLoggerView ?= require './command-logger-view'
  new CommandLoggerView({uri: commandLoggerUri, eventLog})

module.exports =
  activate: ({@eventLog}={}) ->
    @disposables = new CompositeDisposable()
    @eventLog ?= {}
    atom.commands.add 'atom-workspace',
      'command-logger:clear-data': =>
        @eventLog = {}
      'command-logger:open': ->
        atom.workspace.open(commandLoggerUri)

    atom.workspace.addOpener (filePath) =>
      createView(@eventLog) if filePath is commandLoggerUri

    registerTriggeredEvent = (eventName) =>
      return if eventName.indexOf(':') < 1

      eventNameLog = @eventLog[eventName]
      unless eventNameLog
        eventNameLog =
          count: 0
          name: eventName
        @eventLog[eventName] = eventNameLog
      eventNameLog.count++
      eventNameLog.lastRun = Date.now()

    @disposables.add atom.commands.onWillDispatch ({type}) ->
      registerTriggeredEvent(type)

    @disposables.add atom.keymaps.onDidMatchBinding ({binding}) =>
      registerTriggeredEvent(binding.command)

  deactivate: ->
    @disposables?.dispose()
    @eventLog = {}

  serialize: ->
    {@eventLog}
