(function() {
  var GistView, WorkspaceView;

  GistView = require('../lib/gist-view');

  WorkspaceView = require('atom').WorkspaceView;

  describe("GistView", function() {
    return it("has one valid test", function() {
      return expect("life").toBe("easy");
    });
  });

}).call(this);
