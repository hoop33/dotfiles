describe "CommandLogger", ->
  [commandLogger, editor] = []

  beforeEach ->
    waitsForPromise ->
      atom.workspace.open('sample.js')

    runs ->
      editor = atom.workspace.getActiveTextEditor()

    waitsForPromise ->
      atom.packages.activatePackage('command-logger')

    runs ->
      commandLogger = atom.packages.getActivePackage('command-logger').mainModule
      commandLogger.eventLog = {}

  describe "when a command is triggered on a view", ->
    it "records the number of times the command is triggered", ->
      expect(commandLogger.eventLog['core:backspace']).toBeUndefined()
      atom.commands.dispatch atom.views.getView(editor),  'core:backspace'
      expect(commandLogger.eventLog['core:backspace'].count).toBe 1
      atom.commands.dispatch atom.views.getView(editor),  'core:backspace'
      expect(commandLogger.eventLog['core:backspace'].count).toBe 2

    it "records the date the command was last triggered", ->
      expect(commandLogger.eventLog['core:backspace']).toBeUndefined()
      atom.commands.dispatch atom.views.getView(editor),  'core:backspace'
      lastRun = commandLogger.eventLog['core:backspace'].lastRun
      expect(lastRun).toBeGreaterThan 0
      start = Date.now()
      waitsFor ->
        Date.now() > start

      runs ->
        atom.commands.dispatch atom.views.getView(editor),  'core:backspace'
        expect(commandLogger.eventLog['core:backspace'].lastRun).toBeGreaterThan lastRun

  describe "when a command is triggered via a keybinding", ->
    it "records the event", ->
      expect(commandLogger.eventLog['core:backspace']).toBeUndefined()
      atom.keymaps.emitter.emit 'did-match-binding', binding: command: 'core:backspace'
      expect(commandLogger.eventLog['core:backspace'].count).toBe 1
      atom.keymaps.emitter.emit 'did-match-binding', binding: command: 'core:backspace'
      expect(commandLogger.eventLog['core:backspace'].count).toBe 2

  describe "when the data is cleared", ->
    it "removes all triggered events from the log", ->
      expect(commandLogger.eventLog['core:backspace']).toBeUndefined()
      atom.commands.dispatch atom.views.getView(editor),  'core:backspace'
      expect(commandLogger.eventLog['core:backspace'].count).toBe 1
      atom.commands.dispatch atom.views.getView(atom.workspace), 'command-logger:clear-data'
      expect(commandLogger.eventLog['core:backspace']).toBeUndefined()

  describe "when an event is ignored", ->
    it "does not create a node for that event", ->
      atom.commands.dispatch atom.views.getView(atom.workspace), 'command-logger:open'

      waitsFor ->
        atom.workspace.getActivePaneItem().treeMap?

      runs ->
        commandLoggerView = atom.workspace.getActivePaneItem()
        commandLoggerView.ignoredEvents.push 'editor:delete-line'
        atom.commands.dispatch atom.views.getView(editor),  'editor:delete-line'
        commandLoggerView.eventLog = commandLogger.eventLog
        nodes = commandLoggerView.createNodes()
        for {name, children} in nodes when name is 'Editor'
          for child in children
            expect(child.name.indexOf('Delete Line')).toBe -1

  describe "command-logger:open", ->
    it "opens the command logger in a pane", ->
      jasmine.attachToDOM(atom.views.getView(atom.workspace))
      atom.commands.dispatch atom.views.getView(atom.workspace), 'command-logger:open'

      waitsFor ->
        atom.workspace.getActivePaneItem().treeMap?

      runs ->
        commandLoggerView = atom.workspace.getActivePaneItem()
        expect(commandLoggerView.categoryHeader.text()).toBe 'All Commands'
        expect(commandLoggerView.categorySummary.text()).toBe ' (1 command, 1 invocation)'
        expect(commandLoggerView.treeMap.find('svg').length).toBe 1
