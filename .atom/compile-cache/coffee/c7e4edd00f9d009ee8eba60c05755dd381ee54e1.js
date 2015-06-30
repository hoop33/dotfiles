(function() {
  var Gist, fs, path, protocol;

  fs = require('fs');

  if (atom.config.get('gist-it.gitHubEnterpriseHost') && atom.config.get('gist-it.useHttp')) {
    protocol = require('http');
  } else {
    protocol = require('https');
  }

  path = require('path');

  module.exports = Gist = (function() {
    function Gist() {
      this.isPublic = !atom.config.get('gist-it.newGistsDefaultToPrivate');
      this.files = {};
      this.description = "";
      if (atom.config.get('gist-it.gitHubEnterpriseHost')) {
        this.hostname = atom.config.get('gist-it.gitHubEnterpriseHost');
        this.path = '/api/v3/gists';
      } else {
        this.hostname = 'api.github.com';
        this.path = '/gists';
      }
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
        hostname: this.hostname,
        path: this.path,
        method: 'POST',
        headers: {
          "User-Agent": "Atom"
        }
      };
      if (this.getToken() != null) {
        options.headers["Authorization"] = "token " + (this.getToken());
      }
      request = protocol.request(options, function(res) {
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
