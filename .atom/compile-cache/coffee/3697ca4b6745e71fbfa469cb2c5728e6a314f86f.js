(function() {
  describe("Clojure grammar", function() {
    var grammar;
    grammar = null;
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage("language-clojure");
      });
      return runs(function() {
        return grammar = atom.grammars.grammarForScopeName("source.clojure");
      });
    });
    return it("parses the grammar", function() {
      expect(grammar).toBeDefined();
      return expect(grammar.scopeName).toBe("source.clojure");
    });
  });

}).call(this);
