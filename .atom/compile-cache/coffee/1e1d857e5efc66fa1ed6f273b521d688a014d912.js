(function() {
  var Gist;

  Gist = require('../lib/gist');

  describe("Gist", function() {
    var activationPromise;
    activationPromise = null;
    beforeEach(function() {
      atom.workspaceView = new WorkspaceView;
      return activationPromise = atom.packages.activatePackage('gist');
    });
    return describe("when the gist:toggle event is triggered", function() {
      return it("attaches and then detaches the view", function() {
        expect(atom.workspaceView.find('.gist')).not.toExist();
        atom.workspaceView.trigger('gist:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          expect(atom.workspaceView.find('.gist')).toExist();
          atom.workspaceView.trigger('gist:toggle');
          return expect(atom.workspaceView.find('.gist')).not.toExist();
        });
      });
    });
  });

}).call(this);
