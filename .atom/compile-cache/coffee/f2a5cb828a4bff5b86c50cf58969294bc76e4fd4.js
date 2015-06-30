(function() {
  var Convert, VariableInspector, _regexes;

  Convert = require('./ColorPicker-convert');

  VariableInspector = require('./variable-inspector');

  _regexes = require('./ColorPicker-regexes');

  module.exports = {
    view: null,
    match: null,
    activate: function() {
      atom.commands.add('atom-text-editor', {
        'color-picker:open': (function(_this) {
          return function() {
            return _this.open(true);
          };
        })(this)
      });
      atom.contextMenu.add({
        '.editor': [
          {
            label: 'Color picker',
            command: 'color-picker:open',
            shouldDisplay: (function(_this) {
              return function() {
                if (_this.match = _this.getMatchAtCursor()) {
                  return true;
                }
              };
            })(this)
          }
        ]
      });
      return this.view = new (require('./ColorPicker-view'));
    },
    deactivate: function() {
      return this.view.destroy();
    },
    getMatchAtCursor: function() {
      var _cursorBuffer, _cursorColumn, _cursorRow, _editor, _line;
      if (!(_editor = atom.workspace.getActiveTextEditor())) {
        return;
      }
      _line = _editor.getLastCursor().getCurrentBufferLine();
      _cursorBuffer = _editor.getCursorBufferPosition();
      _cursorRow = _cursorBuffer.row;
      _cursorColumn = _cursorBuffer.column;
      return this.matchAtPosition(_cursorColumn, this.matchesOnLine(_line, _cursorRow));
    },
    matchesOnLine: function(line, cursorRow) {
      var match, regex, type, _filteredMatches, _i, _index, _j, _len, _len1, _matches, _ref;
      if (!(line && typeof cursorRow === 'number')) {
        return;
      }
      _filteredMatches = [];
      for (_i = 0, _len = _regexes.length; _i < _len; _i++) {
        _ref = _regexes[_i], type = _ref.type, regex = _ref.regex;
        if (!(_matches = line.match(regex))) {
          continue;
        }
        for (_j = 0, _len1 = _matches.length; _j < _len1; _j++) {
          match = _matches[_j];
          if ((_index = line.indexOf(match)) === -1) {
            continue;
          }
          _filteredMatches.push({
            match: match,
            regexMatch: match.match(RegExp(regex.source, 'i')),
            type: type,
            index: _index,
            end: _index + match.length,
            row: cursorRow
          });
          line = line.replace(match, (Array(match.length + 1)).join(' '));
        }
      }
      if (!(_filteredMatches.length > 0)) {
        return;
      }
      return _filteredMatches;
    },
    matchAtPosition: function(column, matches) {
      var _match;
      if (!(column && matches)) {
        return;
      }
      _match = (function() {
        var match, _i, _len;
        for (_i = 0, _len = matches.length; _i < _len; _i++) {
          match = matches[_i];
          if (match.index <= column && match.end >= column) {
            return match;
          }
        }
      })();
      return _match;
    },
    open: function(getMatch) {
      var randomRGBFragment, _cursorBuffer, _cursorColumn, _cursorRow, _editor, _line, _match;
      if (getMatch == null) {
        getMatch = false;
      }
      if (!(_editor = atom.workspace.getActiveTextEditor())) {
        return;
      }
      if (getMatch) {
        this.match = this.getMatchAtCursor();
      }
      if (!this.match) {
        randomRGBFragment = function() {
          return (Math.random() * 255) << 0;
        };
        _line = '#' + Convert.rgbToHex([randomRGBFragment(), randomRGBFragment(), randomRGBFragment()]);
        _cursorBuffer = _editor.getCursorBufferPosition();
        _cursorRow = _cursorBuffer.row;
        _cursorColumn = _cursorBuffer.column;
        _match = (this.matchesOnLine(_line, _cursorRow))[0];
        _match.index = _cursorColumn;
        _match.end = _cursorColumn;
        this.match = _match;
      }
      if (!this.match) {
        return;
      }
      this.view.reset();
      this.setMatchColor();
      return this.view.open();
    },
    setMatchColor: function() {
      var _callback;
      if (!this.match) {
        return;
      }
      this.view.storage.selectedColor = null;
      if (this.match.hasOwnProperty('color')) {
        this.view.storage.selectedColor = this.match;
        this.view.inputColor(this.match);
        return;
      }
      _callback = (function(_this) {
        return function() {
          return _this.setMatchColor();
        };
      })(this);
      switch (this.match.type) {
        case 'variable:sass':
          this.setVariableDefinitionColor(this.match, _callback);
          break;
        case 'variable:less':
          this.setVariableDefinitionColor(this.match, _callback);
          break;
        default:
          (function(_this) {
            return (function() {
              _this.match.color = _this.match.match;
              return _callback(_this.match);
            });
          })(this)();
      }
    },
    setVariableDefinitionColor: function(match, callback) {
      var regex, type, _i, _len, _matchRegex, _ref, _variableName;
      if (!(match && callback)) {
        return;
      }
      for (_i = 0, _len = _regexes.length; _i < _len; _i++) {
        _ref = _regexes[_i], type = _ref.type, regex = _ref.regex;
        if (type === match.type) {
          _matchRegex = regex;
        }
      }
      _variableName = (match.match.match(RegExp(_matchRegex.source, 'i')))[2];
      (this.findVariableDefinition(_variableName, match.type)).then(function(_arg) {
        var color, pointer;
        color = _arg.color, pointer = _arg.pointer;
        match.color = color.match;
        match.type = color.type;
        match.pointer = pointer;
        return callback(match);
      });
    },
    findVariableDefinition: function(name, type, pointer) {
      return (VariableInspector.findDefinition(name, type)).then((function(_this) {
        return function(definition) {
          var _color, _matches;
          if (pointer == null) {
            pointer = definition.pointer;
          }
          _matches = _this.matchesOnLine(definition.definition, 1);
          if (!(_matches && (_color = _matches[0]))) {
            return _this.view.error();
          }
          if ((_color.type.split(':'))[0] === 'variable') {
            return _this.findVariableDefinition(_color.regexMatch[2], _color.type, pointer);
          }
          return {
            color: _color,
            pointer: pointer
          };
        };
      })(this));
    }
  };

}).call(this);
