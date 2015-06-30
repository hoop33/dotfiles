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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBSVE7QUFBQSxNQUFBLG9EQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLFlBQUEsR0FBZSxFQURmLENBQUE7O0FBQUEsRUFNQSxpQkFBQSxHQUFvQjtBQUFBLElBQ2hCLGVBQUEsRUFBaUIsZ0RBREQ7QUFBQSxJQUVoQixlQUFBLEVBQWlCLGdEQUZEO0dBTnBCLENBQUE7O0FBQUEsRUFjQSxhQUFBLEdBQWdCO0FBQUEsSUFDWixlQUFBLEVBQWlCLENBQUMsV0FBRCxFQUFjLFdBQWQsQ0FETDtBQUFBLElBRVosZUFBQSxFQUFpQixDQUFDLFdBQUQsQ0FGTDtHQWRoQixDQUFBOztBQUFBLEVBc0JBLE1BQU0sQ0FBQyxPQUFQLEdBT0k7QUFBQSxJQUFBLGNBQUEsRUFBZ0IsU0FBQyxJQUFELEVBQU8sSUFBUCxHQUFBO0FBQ1osVUFBQSwrREFBQTtBQUFBLE1BQUEsSUFBQSxDQUFBLENBQWMsWUFBQSxHQUFlLGlCQUFrQixDQUFBLElBQUEsQ0FBakMsQ0FBZDtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFDQSxNQUFBLEdBQVMsTUFBQSxDQUFRLFlBQVksQ0FBQyxPQUFiLENBQXFCLGdCQUFyQixFQUF1QyxJQUF2QyxDQUFSLENBRFQsQ0FBQTtBQUFBLE1BR0EsUUFBQSxHQUFXLEVBSFgsQ0FBQTtBQU1BLE1BQUEsSUFBRyxXQUFBLEdBQWMsWUFBYSxDQUFBLElBQUEsQ0FBOUI7QUFDSSxRQUFBLFFBQUEsR0FBVyxXQUFXLENBQUMsT0FBdkIsQ0FBQTtBQUVBLGVBQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWIsQ0FBMkIsUUFBUSxDQUFDLFFBQXBDLENBQUQsQ0FBOEMsQ0FBQyxJQUEvQyxDQUFvRCxDQUFBLFNBQUEsS0FBQSxHQUFB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
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/color-picker/lib/variable-inspector.coffee