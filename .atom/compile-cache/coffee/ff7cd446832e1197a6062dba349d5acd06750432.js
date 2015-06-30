(function() {
  var BracketMatchingMotion, Find, Motions, MoveToMark, RepeatSearch, Search, SearchCurrentWord, Till, _ref, _ref1;

  Motions = require('./general-motions');

  _ref = require('./search-motion'), Search = _ref.Search, SearchCurrentWord = _ref.SearchCurrentWord, BracketMatchingMotion = _ref.BracketMatchingMotion, RepeatSearch = _ref.RepeatSearch;

  MoveToMark = require('./move-to-mark-motion');

  _ref1 = require('./find-motion'), Find = _ref1.Find, Till = _ref1.Till;

  Motions.Search = Search;

  Motions.SearchCurrentWord = SearchCurrentWord;

  Motions.BracketMatchingMotion = BracketMatchingMotion;

  Motions.RepeatSearch = RepeatSearch;

  Motions.MoveToMark = MoveToMark;

  Motions.Find = Find;

  Motions.Till = Till;

  module.exports = Motions;

}).call(this);
