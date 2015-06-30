(function() {
  var Gist, https;

  https = require('https');

  module.exports = Gist = (function() {
    function Gist() {
      this.isPublic = !atom.config.get('gist-it.newGistsDefaultToPrivate');
      this.files = {};
      this.description = "";
    }

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
      if (atom.config.get("gist-it.userToken")) {
        options.headers["Authorization"] = "token " + (atom.config.get('gist-it.userToken'));
      }
      request = https.request(options, function(res) {
        var body;
        res.setEncoding("utf8");
        body = '';
        res.on("data", function(chunk) {
          return body += chunk;
        });
        return res.on("end", function() {
          debugger;
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFdBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVIsQ0FBUixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsY0FBQSxHQUFBO0FBQ1QsTUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZLENBQUEsSUFBSyxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGtDQUFoQixDQUFiLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxLQUFELEdBQVMsRUFEVCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsV0FBRCxHQUFlLEVBRmYsQ0FEUztJQUFBLENBQWI7O0FBQUEsbUJBS0EsSUFBQSxHQUFNLFNBQUMsUUFBRCxHQUFBO0FBQ0osVUFBQSxnQkFBQTtBQUFBLE1BQUEsT0FBQSxHQUNFO0FBQUEsUUFBQSxRQUFBLEVBQVUsZ0JBQVY7QUFBQSxRQUNBLElBQUEsRUFBTSxRQUROO0FBQUEsUUFFQSxNQUFBLEVBQVEsTUFGUjtBQUFBLFFBR0EsT0FBQSxFQUNFO0FBQUEsVUFBQSxZQUFBLEVBQWMsTUFBZDtTQUpGO09BREYsQ0FBQTtBQVFBLE1BQUEsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsbUJBQWhCLENBQUo7QUFDRSxRQUFBLE9BQU8sQ0FBQyxPQUFRLENBQUEsZUFBQSxDQUFoQixHQUFvQyxRQUFBLEdBQU8sQ0FBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsbUJBQWhCLENBQUEsQ0FBM0MsQ0FERjtPQVJBO0FBQUEsTUFXQSxPQUFBLEdBQVUsS0FBSyxDQUFDLE9BQU4sQ0FBYyxPQUFkLEVBQXVCLFNBQUMsR0FBRCxHQUFBO0FBQy9CLFlBQUEsSUFBQTtBQUFBLFFBQUEsR0FBRyxDQUFDLFdBQUosQ0FBZ0IsTUFBaEIsQ0FBQSxDQUFBO0FBQUEsUUFDQSxJQUFBLEdBQU8sRUFEUCxDQUFBO0FBQUEsUUFFQSxHQUFHLENBQUMsRUFBSixDQUFPLE1BQVAsRUFBZSxTQUFDLEtBQUQsR0FBQTtpQkFDYixJQUFBLElBQVEsTUFESztRQUFBLENBQWYsQ0FGQSxDQUFBO2VBSUEsR0FBRyxDQUFDLEVBQUosQ0FBTyxLQUFQLEVBQWMsU0FBQSxHQUFBO0FBQ1osbUJBQUE7QUFBQSxjQUFBLFFBQUE7QUFBQSxVQUNBLFFBQUEsR0FBVyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQVgsQ0FEWCxDQUFBO2lCQUVBLFFBQUEsQ0FBUyxRQUFULEVBSFk7UUFBQSxDQUFkLEVBTCtCO01BQUEsQ0FBdkIsQ0FYVixDQUFBO0FBQUEsTUFxQkEsT0FBTyxDQUFDLEtBQVIsQ0FBYyxJQUFJLENBQUMsU0FBTCxDQUFlLElBQUMsQ0FBQSxRQUFELENBQUEsQ0FBZixDQUFkLENBckJBLENBQUE7YUF1QkEsT0FBTyxDQUFDLEdBQVIsQ0FBQSxFQXhCSTtJQUFBLENBTE4sQ0FBQTs7QUFBQSxtQkErQkEsUUFBQSxHQUFVLFNBQUEsR0FBQTthQUNSO0FBQUEsUUFBQSxXQUFBLEVBQWEsSUFBQyxDQUFBLFdBQWQ7QUFBQSxRQUNBLEtBQUEsRUFBTyxJQUFDLENBQUEsS0FEUjtBQUFBLFFBRUEsUUFBQSxFQUFRLElBQUMsQ0FBQSxRQUZUO1FBRFE7SUFBQSxDQS9CVixDQUFBOztnQkFBQTs7TUFKRixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/gist-it/lib/gist-model.coffee