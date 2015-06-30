(function() {
  var Fs, Path;

  Path = require('path');

  Fs = require('fs');

  module.exports = {
    locateFile: function(editorFile, imgPath) {
      return Path.join(Path.dirname(editorFile), imgPath);
    },
    read: function(realImgPath, callback) {
      return Fs.readFile(realImgPath, 'binary', callback);
    },
    getExt: function(realImgPath) {
      return Path.extname(realImgPath);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBRUE7QUFBQSxNQUFBLFFBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFVBQUEsRUFBWSxTQUFDLFVBQUQsRUFBYSxPQUFiLEdBQUE7YUFFVixJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFMLENBQWEsVUFBYixDQUFWLEVBQW9DLE9BQXBDLEVBRlU7SUFBQSxDQUFaO0FBQUEsSUFJQSxJQUFBLEVBQU0sU0FBQyxXQUFELEVBQWMsUUFBZCxHQUFBO2FBQ0osRUFBRSxDQUFDLFFBQUgsQ0FBWSxXQUFaLEVBQXlCLFFBQXpCLEVBQW1DLFFBQW5DLEVBREk7SUFBQSxDQUpOO0FBQUEsSUFPQSxNQUFBLEVBQVEsU0FBQyxXQUFELEdBQUE7YUFDTixJQUFJLENBQUMsT0FBTCxDQUFhLFdBQWIsRUFETTtJQUFBLENBUFI7R0FKRixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/emmet/lib/file.coffee