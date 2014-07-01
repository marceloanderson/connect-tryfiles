// Generated by CoffeeScript 1.7.1
(function() {
  var glob, httpProxy, path, _;

  glob = require('glob');

  path = require('path');

  _ = require('underscore');

  httpProxy = require('http-proxy');

  require('colors');

  module.exports = function(match, target, options) {
    var globOptions, proxy, proxyOptions;
    if (options == null) {
      options = {};
    }
    console.verbose = function() {
      if (options.verbose) {
        return console.log.apply(console, arguments);
      }
    };
    if (options.index === void 0) {
      options.index = 'index.html';
    }
    globOptions = {
      nosort: true,
      mark: true
    };
    proxyOptions = typeof target === 'string' ? {
      target: target
    } : target;
    proxy = httpProxy.createProxyServer(proxyOptions);
    return function(req, res, next) {
      return glob(match, _.extend(globOptions, options), function(err, files) {
        var cleanUrl, foundDirectories, foundFiles, index, indexPath;
        if (files == null) {
          files = [];
        }
        if (err) {
          next(err);
        }
        cleanUrl = req.url.replace(/\?.*/, '').replace(/^\//, '').replace(/\/$/, '');
        foundFiles = files.filter(function(f) {
          return f.charAt(f.length - 1) !== '/';
        }).filter(function(f) {
          return f === cleanUrl;
        });
        foundDirectories = files.filter(function(f) {
          return f.charAt(f.length - 1) === '/';
        }).map(function(f) {
          return f.replace(/^\//, '').replace(/\/$/, '');
        }).filter(function(f) {
          return f === cleanUrl;
        });
        if (foundFiles.length > 0) {
          console.verbose("Found file:", foundFiles.toString().green);
          return next();
        }
        if (options.index && foundDirectories.length > 0) {
          indexPath = path.join(foundDirectories[0], options.index);
          index = glob.sync(path.join(indexPath), _.extend(globOptions, options));
          if (index.length > 0) {
            console.verbose("Found file:", index.toString().green);
            return next();
          }
        }
        console.verbose("Proxying:", req.url.cyan);
        return proxy.web(req, res, function(err) {
          if (err) {
            return next(err);
          }
        });
      });
    };
  };

}).call(this);
