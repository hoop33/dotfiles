(function() {
  var path, _definitions, _globPatterns, _variablePatterns;

  path = require('path');

  _definitions = {};

  _variablePatterns = {
    'variable:sass': '\\${{ VARIABLE }}[\\s]*\\:[\\s]*(.+)[\\;|\\n]?',
    'variable:less': '\\@{{ VARIABLE }}[\\s]*\\:[\\s]*(.+)[\\;|\\n]?'
  };

  _globPatterns = {
    'variable:sass': ['**/*.scss', '**/*.sass'],
    'variable:less': ['**/*.less']
  };

  module.exports = {
    findDefinition: function(name, type) {
      var _definition, _options, _pointer, _regex, _regexString, _results;
      if (!(_regexString = _variablePatterns[type])) {
        return;
      }
      _regex = RegExp(_regexString.replace('{{ VARIABLE }}', name));
      _results = [];
      if (_definition = _definitions[name]) {
        _pointer = _definition.pointer;
        return (atom.project.bufferForPath(_pointer.filePath)).then((function(_this) {
          return function(buffer) {
            var _match, _text;
            _text = buffer.getTextInRange(_pointer.range);
            _match = _text.match(_regex);
            if (!_match) {
              _definitions[name] = null;
              return _this.findDefinition(name, type);
            }
            _definition.definition = _match[1];
            return _definition;
          };
        })(this));
      }
      _options = !_globPatterns[type] ? null : {
        paths: _globPatterns[type]
      };
      return atom.project.scan(_regex, _options, function(result) {
        return _results.push(result);
      }).then((function(_this) {
        return function() {
          var i, pathFragment, result, _bestMatch, _bestMatchHits, _i, _j, _len, _len1, _match, _pathFragments, _targetFragments, _targetPath, _thisMatchHits;
          _targetPath = atom.workspace.getActivePaneItem().getPath();
          _targetFragments = _targetPath.split(path.sep);
          _bestMatch = null;
          _bestMatchHits = 0;
          for (_i = 0, _len = _results.length; _i < _len; _i++) {
            result = _results[_i];
            _thisMatchHits = 0;
            _pathFragments = result.filePath.split(path.sep);
            for (i = _j = 0, _len1 = _pathFragments.length; _j < _len1; i = ++_j) {
              pathFragment = _pathFragments[i];
              if (pathFragment === _targetFragments[i]) {
                _thisMatchHits++;
              }
            }
            if (_thisMatchHits > _bestMatchHits) {
              _bestMatch = result;
              _bestMatchHits = _thisMatchHits;
            }
          }
          if (!(_bestMatch && (_match = _bestMatch.matches[0]))) {
            return _this;
          }
          _definitions[name] = {
            name: name,
            type: type,
            pointer: {
              filePath: _bestMatch.filePath,
              range: _match.range
            }
          };
          return _this.findDefinition(name, type);
        };
      })(this));
    }
  };

}).call(this);
