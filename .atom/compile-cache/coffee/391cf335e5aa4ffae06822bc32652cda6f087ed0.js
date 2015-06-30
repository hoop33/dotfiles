(function() {
  var _definitions, _globPatterns, _variablePatterns;

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
          _targetFragments = _targetPath.split('/');
          _bestMatch = null;
          _bestMatchHits = 0;
          for (_i = 0, _len = _results.length; _i < _len; _i++) {
            result = _results[_i];
            _thisMatchHits = 0;
            _pathFragments = result.filePath.split('/');
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBSVE7QUFBQSxNQUFBLDhDQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLEVBQWYsQ0FBQTs7QUFBQSxFQUtBLGlCQUFBLEdBQW9CO0FBQUEsSUFDaEIsZUFBQSxFQUFpQixnREFERDtBQUFBLElBRWhCLGVBQUEsRUFBaUIsZ0RBRkQ7R0FMcEIsQ0FBQTs7QUFBQSxFQWFBLGFBQUEsR0FBZ0I7QUFBQSxJQUNaLGVBQUEsRUFBaUIsQ0FBQyxXQUFELEVBQWMsV0FBZCxDQURMO0FBQUEsSUFFWixlQUFBLEVBQWlCLENBQUMsV0FBRCxDQUZMO0dBYmhCLENBQUE7O0FBQUEsRUFxQkEsTUFBTSxDQUFDLE9BQVAsR0FJSTtBQUFBLElBQUEsY0FBQSxFQUFnQixTQUFDLElBQUQsRUFBTyxJQUFQLEdBQUE7QUFDWixVQUFBLCtEQUFBO0FBQUEsTUFBQSxJQUFBLENBQUEsQ0FBYyxZQUFBLEdBQWUsaUJBQWtCLENBQUEsSUFBQSxDQUFqQyxDQUFkO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFBQSxNQUNBLE1BQUEsR0FBUyxNQUFBLENBQVEsWUFBWSxDQUFDLE9BQWIsQ0FBcUIsZ0JBQXJCLEVBQXVDLElBQXZDLENBQVIsQ0FEVCxDQUFBO0FBQUEsTUFHQSxRQUFBLEdBQVcsRUFIWCxDQUFBO0FBTUEsTUFBQSxJQUFHLFdBQUEsR0FBYyxZQUFhLENBQUEsSUFBQSxDQUE5QjtBQUNJLFFBQUEsUUFBQSxHQUFXLFdBQVcsQ0FBQyxPQUF2QixDQUFBO0FBRUEsZUFBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYixDQUEyQixRQUFRLENBQUMsUUFBcEMsQ0FBRCxDQUE4QyxDQUFDLElBQS9DLENBQW9ELENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxNQUFELEdBQUE7QUFDdkQsZ0JBQUEsYUFBQTtBQUFBLFlBQUEsS0FBQSxHQUFRLE1BQU0sQ0FBQyxjQUFQLENBQXNCLFFBQVEsQ0FBQyxLQUEvQixDQUFSLENBQUE7QUFBQSxZQUNBLE1BQUEsR0FBUyxLQUFLLENBQUMsS0FBTixDQUFZLE1BQVosQ0FEVCxDQUFBO0FBR0EsWUFBQSxJQUFBLENBQUEsTUFBQTtBQUNJLGNBQUEsWUFBYSxDQUFBLElBQUEsQ0FBYixHQUFxQixJQUFyQixDQUFBO0FBQ0EscUJBQU8sS0FBQyxDQUFBLGNBQUQsQ0FBZ0IsSUFBaEIsRUFBc0IsSUFBdEIsQ0FBUCxDQUZKO2FBSEE7QUFBQSxZQU9BLFdBQVcsQ0FBQyxVQUFaLEdBQXlCLE1BQU8sQ0FBQSxDQUFBLENBUGhDLENBQUE7QUFRQSxtQkFBTyxXQUFQLENBVHVEO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBcEQsQ0FBUCxDQUhKO09BTkE7QUFBQSxNQW9CQSxRQUFBLEdBQVcsQ0FBQSxhQUFxQixDQUFBLElBQUEsQ0FBckIsR0FBZ0MsSUFBaEMsR0FBMEM7QUFBQSxRQUNqRCxLQUFBLEVBQU8sYUFBYyxDQUFBLElBQUEsQ0FENEI7T0FwQnJELENBQUE7YUF5QkEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFiLENBQWtCLE1BQWxCLEVBQTBCLFFBQTFCLEVBQW9DLFNBQUMsTUFBRCxHQUFBO2VBQ2hDLFFBQVEsQ0FBQyxJQUFULENBQWMsTUFBZCxFQURnQztNQUFBLENBQXBDLENBRUEsQ0FBQyxJQUZELENBRU0sQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUdGLGNBQUEsK0lBQUE7QUFBQSxVQUFBLFdBQUEsR0FBYyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFmLENBQUEsQ0FBa0MsQ0FBQyxPQUFuQyxDQUFBLENBQWQsQ0FBQTtBQUFBLFVBQ0EsZ0JBQUEsR0FBbUIsV0FBVyxDQUFDLEtBQVosQ0FBa0IsR0FBbEIsQ0FEbkIsQ0FBQTtBQUFBLFVBR0EsVUFBQSxHQUFhLElBSGIsQ0FBQTtBQUFBLFVBSUEsY0FBQSxHQUFpQixDQUpqQixDQUFBO0FBTUEsZUFBQSwrQ0FBQTtrQ0FBQTtBQUNJLFlBQUEsY0FBQSxHQUFpQixDQUFqQixDQUFBO0FBQUEsWUFDQSxjQUFBLEdBQWlCLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBaEIsQ0FBc0IsR0FBdEIsQ0FEakIsQ0FBQTtBQUVBLGlCQUFBLCtEQUFBOytDQUFBO2tCQUE0RCxZQUFBLEtBQWdCLGdCQUFpQixDQUFBLENBQUE7QUFBN0YsZ0JBQUEsY0FBQSxFQUFBO2VBQUE7QUFBQSxhQUZBO0FBSUEsWUFBQSxJQUFHLGNBQUEsR0FBaUIsY0FBcEI7QUFDSSxjQUFBLFVBQUEsR0FBYSxNQUFiLENBQUE7QUFBQSxjQUNBLGNBQUEsR0FBaUIsY0FEakIsQ0FESjthQUxKO0FBQUEsV0FOQTtBQWNBLFVBQUEsSUFBQSxDQUFBLENBQW1CLFVBQUEsSUFBZSxDQUFBLE1BQUEsR0FBUyxVQUFVLENBQUMsT0FBUSxDQUFBLENBQUEsQ0FBNUIsQ0FBbEMsQ0FBQTtBQUFBLG1CQUFPLEtBQVAsQ0FBQTtXQWRBO0FBQUEsVUFnQkEsWUFBYSxDQUFBLElBQUEsQ0FBYixHQUFxQjtBQUFBLFlBQ2pCLElBQUEsRUFBTSxJQURXO0FBQUEsWUFFakIsSUFBQSxFQUFNLElBRlc7QUFBQSxZQUlqQixPQUFBLEVBQ0k7QUFBQSxjQUFBLFFBQUEsRUFBVSxVQUFVLENBQUMsUUFBckI7QUFBQSxjQUNBLEtBQUEsRUFBTyxNQUFNLENBQUMsS0FEZDthQUxhO1dBaEJyQixDQUFBO0FBeUJBLGlCQUFPLEtBQUMsQ0FBQSxjQUFELENBQWdCLElBQWhCLEVBQXNCLElBQXRCLENBQVAsQ0E1QkU7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUZOLEVBMUJZO0lBQUEsQ0FBaEI7R0F6QkosQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/color-picker/lib/variable-inspector.coffee