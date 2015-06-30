(function() {
  var GistView;

  GistView = require('./gist-view');

  module.exports = {
    gistView: null,
    activate: function(state) {
      return this.gistView = new GistView(state.gistViewState);
    },
    deactivate: function() {
      return this.gistView.destroy();
    },
    serialize: function() {
      return {
        gistViewState: this.gistView.serialize()
      };
    },
    configDefaults: {
      userToken: "",
      newGistsDefaultToPrivate: false,
      gitHubEnterpriseHost: "",
      useHttp: false
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFFBQUE7O0FBQUEsRUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FBWCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLElBQVY7QUFBQSxJQUVBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTthQUNSLElBQUMsQ0FBQSxRQUFELEdBQWdCLElBQUEsUUFBQSxDQUFTLEtBQUssQ0FBQyxhQUFmLEVBRFI7SUFBQSxDQUZWO0FBQUEsSUFLQSxVQUFBLEVBQVksU0FBQSxHQUFBO2FBQ1YsSUFBQyxDQUFBLFFBQVEsQ0FBQyxPQUFWLENBQUEsRUFEVTtJQUFBLENBTFo7QUFBQSxJQVFBLFNBQUEsRUFBVyxTQUFBLEdBQUE7YUFDVDtBQUFBLFFBQUEsYUFBQSxFQUFlLElBQUMsQ0FBQSxRQUFRLENBQUMsU0FBVixDQUFBLENBQWY7UUFEUztJQUFBLENBUlg7QUFBQSxJQVdBLGNBQUEsRUFDRTtBQUFBLE1BQUEsU0FBQSxFQUFXLEVBQVg7QUFBQSxNQUNBLHdCQUFBLEVBQTBCLEtBRDFCO0FBQUEsTUFFQSxvQkFBQSxFQUFzQixFQUZ0QjtBQUFBLE1BR0EsT0FBQSxFQUFTLEtBSFQ7S0FaRjtHQUhGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/rwarner/Dropbox/config/.atom/packages/gist-it/lib/gist.coffee