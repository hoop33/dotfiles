(function() {
  var $$$, CommandLoggerView, Disposable, ScrollView, d3, humanize, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  _ref = require('atom-space-pen-views'), $$$ = _ref.$$$, ScrollView = _ref.ScrollView;

  d3 = require('d3-browserify');

  humanize = require('humanize-plus');

  Disposable = require('atom').Disposable;

  module.exports = CommandLoggerView = (function(_super) {
    __extends(CommandLoggerView, _super);

    function CommandLoggerView() {
      return CommandLoggerView.__super__.constructor.apply(this, arguments);
    }

    CommandLoggerView.content = function() {
      return this.div({
        "class": 'pane-item padded command-logger',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'summary',
            outlet: 'summary'
          }, function() {
            _this.span({
              "class": 'text-highlight',
              outlet: 'categoryHeader'
            });
            _this.span({
              "class": 'text-info',
              outlet: 'categorySummary'
            });
            _this.div({
              "class": 'text-subtle'
            }, "Below is a treemap of all the commands you've run in Atom for the\ncurrent project.");
            return _this.div({
              "class": 'text-subtle'
            }, "Each colored area represents a different package and you can zoom in\nand out by clicking it.");
          });
          return _this.div({
            "class": 'tree-map',
            outlet: 'treeMap'
          });
        };
      })(this));
    };

    CommandLoggerView.prototype.ignoredEvents = ['core:backspace', 'core:cancel', 'core:confirm', 'core:delete', 'core:move-down', 'core:move-left', 'core:move-right', 'core:move-up', 'cursor:moved', 'editor:newline', 'editor:attached', 'editor:display-updated', 'tree-view:directory-modified'];

    CommandLoggerView.prototype.ignoredCategories = ['pane', 'pane-container'];

    CommandLoggerView.prototype.initialize = function(_arg) {
      this.uri = _arg.uri, this.eventLog = _arg.eventLog;
      return CommandLoggerView.__super__.initialize.apply(this, arguments);
    };

    CommandLoggerView.prototype.attached = function(onDom) {
      return this.addTreeMap();
    };

    CommandLoggerView.prototype.copy = function() {
      return new CommandLoggerView({
        uri: this.uri,
        eventLog: this.eventLog
      });
    };

    CommandLoggerView.prototype.getURI = function() {
      return this.uri;
    };

    CommandLoggerView.prototype.getTitle = function() {
      return 'Command Logger';
    };

    CommandLoggerView.prototype.onDidChangeTitle = function() {
      return new Disposable();
    };

    CommandLoggerView.prototype.onDidChangeModified = function() {
      return new Disposable();
    };

    CommandLoggerView.prototype.createNodes = function() {
      var categories, category, categoryName, categoryStart, details, eventName, _ref1;
      categories = {};
      _ref1 = this.eventLog;
      for (eventName in _ref1) {
        details = _ref1[eventName];
        if (_.contains(this.ignoredEvents, eventName)) {
          continue;
        }
        categoryStart = eventName.indexOf(':');
        if (categoryStart === -1) {
          categoryName = 'Uncategorized';
        } else {
          categoryName = eventName.substring(0, categoryStart);
          if (_.contains(this.ignoredCategories, categoryName)) {
            continue;
          }
          categoryName = _.humanizeEventName(categoryName);
        }
        category = categories[categoryName];
        if (!category) {
          category = {
            name: _.humanizeEventName(categoryName),
            children: []
          };
          categories[categoryName] = category;
        }
        category.children.push({
          name: "" + (_.humanizeEventName(eventName.substring(categoryStart + 1))) + " " + details.count,
          size: details.count
        });
      }
      return _.toArray(categories);
    };

    CommandLoggerView.prototype.createNodeContent = function(node) {
      return $$$(function() {
        return this.div({
          style: "height:" + (node.dy - 1) + "px;width:" + (node.dx - 1) + "px"
        }, (function(_this) {
          return function() {
            return _this.span(node.name);
          };
        })(this));
      });
    };

    CommandLoggerView.prototype.updateCategoryHeader = function(node) {
      var commandCount, commandText, invocationText, reduceCommandCount, reduceRunCount, runCount;
      this.categoryHeader.text("" + node.name + " Commands");
      reduceRunCount = function(previous, current) {
        var _ref1;
        if (current.size != null) {
          return previous + current.size;
        } else if (((_ref1 = current.children) != null ? _ref1.length : void 0) > 0) {
          return current.children.reduce(reduceRunCount, previous);
        } else {
          return previous;
        }
      };
      runCount = node.children.reduce(reduceRunCount, 0);
      reduceCommandCount = function(previous, current) {
        var _ref1;
        if (((_ref1 = current.children) != null ? _ref1.length : void 0) > 0) {
          return current.children.reduce(reduceCommandCount, previous);
        } else {
          return previous + 1;
        }
      };
      commandCount = node.children.reduce(reduceCommandCount, 0);
      commandText = "" + (humanize.intComma(commandCount)) + " " + (humanize.pluralize(commandCount, 'command'));
      invocationText = "" + (humanize.intComma(runCount)) + " " + (humanize.pluralize(runCount, 'invocation'));
      return this.categorySummary.text(" (" + commandText + ", " + invocationText + ")");
    };

    CommandLoggerView.prototype.updateTreeMapSize = function() {
      this.treeMap.width(this.width());
      return this.treeMap.height(this.height() - this.summary.outerHeight());
    };

    CommandLoggerView.prototype.addTreeMap = function() {
      var cell, color, h, node, nodes, root, svg, treemap, w, x, y, zoom;
      root = {
        name: 'All',
        children: this.createNodes()
      };
      node = root;
      this.treeMap.empty();
      this.updateCategoryHeader(root);
      this.updateTreeMapSize();
      w = this.treeMap.width();
      h = this.treeMap.height();
      x = d3.scale.linear().range([0, w]);
      y = d3.scale.linear().range([0, h]);
      color = d3.scale.category20();
      zoom = (function(_this) {
        return function(d) {
          var kx, ky, t;
          _this.updateCategoryHeader(d);
          kx = w / d.dx;
          ky = h / d.dy;
          x.domain([d.x, d.x + d.dx]);
          y.domain([d.y, d.y + d.dy]);
          t = svg.selectAll('g.node').transition().duration(750).attr('transform', function(d) {
            return "translate(" + (x(d.x)) + "," + (y(d.y)) + ")";
          });
          t.select('rect').attr('width', function(d) {
            return kx * d.dx - 1;
          }).attr('height', function(d) {
            return ky * d.dy - 1;
          });
          t.select('.foreign-object').attr('width', function(d) {
            return kx * d.dx - 1;
          }).attr('height', function(d) {
            return ky * d.dy - 1;
          });
          t.select('.command-logger-node-text div').attr('style', function(d) {
            return "height:" + (ky * d.dy - 1) + "px;width:" + (kx * d.dx - 1) + "px";
          });
          node = d;
          return d3.event.stopPropagation();
        };
      })(this);
      treemap = d3.layout.treemap().round(false).size([w, h]).sticky(true).value(function(d) {
        return d.size;
      });
      svg = d3.select(this.treeMap[0]).append('div').style('width', "" + w + "px").style('height', "" + h + "px").append('svg').attr('width', w).attr('height', h).append('g').attr('transform', 'translate(.5,.5)');
      nodes = treemap.nodes(root).filter(function(d) {
        return !d.children;
      });
      cell = svg.selectAll('g').data(nodes).enter().append('g').attr('class', 'node').attr('transform', function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      }).on('click', function(d) {
        if (node === d.parent) {
          return zoom(root);
        } else {
          return zoom(d.parent);
        }
      });
      cell.append('rect').attr('width', function(d) {
        return Math.max(0, d.dx - 1);
      }).attr('height', function(d) {
        return Math.max(0, d.dy - 1);
      }).style('fill', function(d) {
        return color(d.parent.name);
      });
      cell.append('foreignObject').attr('width', function(d) {
        return Math.max(0, d.dx - 1);
      }).attr('height', function(d) {
        return Math.max(0, d.dy - 1);
      }).attr('class', 'foreign-object').append('xhtml:body').attr('class', 'command-logger-node-text').html((function(_this) {
        return function(d) {
          return _this.createNodeContent(d);
        };
      })(this));
      return d3.select(this[0]).on('click', function() {
        return zoom(root);
      });
    };

    return CommandLoggerView;

  })(ScrollView);

}).call(this);
