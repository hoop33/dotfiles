(function() {
  var Gist, fs, https, path;

  fs = require('fs');

  https = require('https');

  path = require('path');

  module.exports = Gist = (function() {
    function Gist() {
      this.isPublic = !atom.config.get('gist-it.newGistsDefaultToPrivate');
      this.files = {};
      this.description = "";
    }

    Gist.prototype.getSecretTokenPath = function() {
      return path.join(atom.getConfigDirPath(), "gist-it.token");
    };

    Gist.prototype.getToken = function() {
      var config;
      if (this.token == null) {
        config = atom.config.get("gist-it.userToken");
        this.token = (config != null) && config.toString().length > 0 ? config : fs.existsSync(this.getSecretTokenPath()) ? fs.readFileSync(this.getSecretTokenPath()) : void 0;
      }
      return this.token;
    };

    Gist.prototype.post = function(callback) {
      var options, request;
      options = {
        hostname: 'api.github.com',
        path: '/gists',
        method: 'POST',
        headers: {
          "User-Agent": "Atom"
        }
      };
      if (this.getToken() != null) {
        options.headers["Authorization"] = "token " + (this.getToken());
      }
      request = https.request(options, function(res) {
        var body;
        res.setEncoding("utf8");
        body = '';
        res.on("data", function(chunk) {
          return body += chunk;
        });
        return res.on("end", function() {
          var response;
          response = JSON.parse(body);
          return callback(response);
        });
      });
      request.write(JSON.stringify(this.toParams()));
      return request.end();
    };

    Gist.prototype.toParams = function() {
      return {
        description: this.description,
        files: this.files,
        "public": this.isPublic
      };
    };

    return Gist;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFCQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLEtBQUEsR0FBUSxPQUFBLENBQVEsT0FBUixDQURSLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsY0FBQSxHQUFBO0FBQ1QsTUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZLENBQUEsSUFBSyxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGtDQUFoQixDQUFiLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxLQUFELEdBQVMsRUFEVCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsV0FBRCxHQUFlLEVBRmYsQ0FEUztJQUFBLENBQWI7O0FBQUEsbUJBS0Esa0JBQUEsR0FBb0IsU0FBQSxHQUFBO2FBQ2xCLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLGdCQUFMLENBQUEsQ0FBVixFQUFtQyxlQUFuQyxFQURrQjtJQUFBLENBTHBCLENBQUE7O0FBQUEsbUJBUUEsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLFVBQUEsTUFBQTtBQUFBLE1BQUEsSUFBTyxrQkFBUDtBQUNFLFFBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixtQkFBaEIsQ0FBVCxDQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsS0FBRCxHQUFZLGdCQUFBLElBQVksTUFBTSxDQUFDLFFBQVAsQ0FBQSxDQUFpQixDQUFDLE1BQWxCLEdBQTJCLENBQTFDLEdBQ0UsTUFERixHQUVRLEVBQUUsQ0FBQyxVQUFILENBQWMsSUFBQyxDQUFBLGtCQUFELENBQUEsQ0FBZCxDQUFILEdBQ0gsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsSUFBQyxDQUFBLGtCQUFELENBQUEsQ0FBaEIsQ0FERyxHQUFBLE1BSGQsQ0FERjtPQUFBO2FBTUEsSUFBQyxDQUFBLE1BUE87SUFBQSxDQVJWLENBQUE7O0FBQUEsbUJBaUJBLElBQUEsR0FBTSxTQUFDLFFBQUQsR0FBQTtBQUNKLFVBQUEsZ0JBQUE7QUFBQSxNQUFBLE9BQUEsR0FDRTtBQUFBLFFBQUEsUUFBQSxFQUFVLGdCQUFWO0FBQUEsUUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLFFBRUEsTUFBQSxFQUFRLE1BRlI7QUFBQSxRQUdBLE9BQUEsRUFDRTtBQUFBLFVBQUEsWUFBQSxFQUFjLE1BQWQ7U0FKRjtPQURGLENBQUE7QUFRQSxNQUFBLElBQUcsdUJBQUg7QUFDRSxRQUFBLE9BQU8sQ0FBQyxPQUFRLENBQUEsZUFBQSxDQUFoQixHQUFvQyxRQUFBLEdBQU8sQ0FBQSxJQUFDLENBQUEsUUFBRCxDQUFBLENBQUEsQ0FBM0MsQ0FERjtPQVJBO0FBQUEsTUFXQSxPQUFBLEdBQVUsS0FBSyxDQUFDLE9BQU4sQ0FBYyxPQUFkLEVBQXVCLFNBQUMsR0FBRCxHQUFBO0FBQy9CLFlBQUEsSUFBQTtBQUFBLFFBQUEsR0FBRyxDQUFDLFdBQUosQ0FBZ0IsTUFBaEIsQ0FBQSxDQUFBO0FBQUEsUUFDQSxJQUFBLEdBQU8sRUFEUCxDQUFBO0FBQUEsUUFFQSxHQUFHLENBQUMsRUFBSixDQUFPLE1BQVAsRUFBZSxTQUFDLEtBQUQsR0FBQTtpQkFDYixJQUFBLElBQVEsTUFESztRQUFBLENBQWYsQ0FGQSxDQUFBO2VBSUEsR0FBRyxDQUFDLEVBQUosQ0FBTyxLQUFQLEVBQWMsU0FBQSxHQUFBO0FBQ1osY0FBQSxRQUFBO0FBQUEsVUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYLENBQVgsQ0FBQTtpQkFDQSxRQUFBLENBQVMsUUFBVCxFQUZZO1FBQUEsQ0FBZCxFQUwrQjtNQUFBLENBQXZCLENBWFYsQ0FBQTtBQUFBLE1Bb0JBLE9BQU8sQ0FBQyxLQUFSLENBQWMsSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFDLENBQUEsUUFBRCxDQUFBLENBQWYsQ0FBZCxDQXBCQSxDQUFBO2FBc0JBLE9BQU8sQ0FBQyxHQUFSLENBQUEsRUF2Qkk7SUFBQSxDQWpCTixDQUFBOztBQUFBLG1CQTBDQSxRQUFBLEdBQVUsU0FBQSxHQUFBO2FBQ1I7QUFBQSxRQUFBLFdBQUEsRUFBYSxJQUFDLENBQUEsV0FBZDtBQUFBLFFBQ0EsS0FBQSxFQUFPLElBQUMsQ0FBQSxLQURSO0FBQUEsUUFFQSxRQUFBLEVBQVEsSUFBQyxDQUFBLFFBRlQ7UUFEUTtJQUFBLENBMUNWLENBQUE7O2dCQUFBOztNQU5GLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/gist-it/lib/gist-model.coffee