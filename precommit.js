#!/usr/bin/env node
var fs = require('fs');
var path = require("path");
var JSLINT = require('./jslint.js');

var config = require('./config.json');

// merge `process.cwd()/jslint_config.json`
var configPath = path.join(process.cwd(), 'jslint_config.json');
if (path.existsSync(configPath)) {
  var customConfig = require(configPath);
  var k;
  for (k in customConfig) {
    if (customConfig.hasOwnProperty(k)) {
      config[k] = customConfig[k];
    }
  }
}

var argv = process.argv;
var recursion = argv[3] === "-r";
var ignores = ["node_modules", "build", "bin", "test", "public"];

if (!argv[2]) {
  console.log("Usage: node precommit.js file.js");
  console.log("Usage: node precommit.js folder [-r]");
  process.exit(1);
}

function removeFirstComment(s) {
  if (s.substring(0, 2) === '#!') {
    s = s.substring(s.indexOf('\n'));
  }
  return s;
}

var processFolder = function (folder) {
  fs.stat(folder, function (err, stats) {
    if (err) {
      console.log(folder);
      console.log(err.stack);
      return;
    }
    if (stats.isDirectory()) {
      fs.readdir(folder, function (err, files) {
        var scripts = files.filter(function (val, index) {
          return path.extname(val) === ".js";
        });

        scripts.forEach(function (filename, index) {
          var input = fs.readFileSync(folder + "/" + filename, "utf8");
          input = removeFirstComment(input);
          if (!JSLINT(input, config)) {
            console.log("File: " + folder + "/" + filename);
            var i;
            for (i = 0; i < JSLINT.errors.length; i += 1) {
              var e = JSLINT.errors[i];
              if (e) {
                console.log('Lint at line ' + e.line + ' character ' +
                        e.character + ': ' + e.reason);
                console.log((e.evidence || '').
                        replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1"));
                console.log('');
              }
            }
          } else {
            console.log("jslint: No problems found in " + folder + "/" + filename);
          }
        });

        if (recursion) {
          var folders = files.filter(function (val, index) {
            if (path.extname(val) !== "") {
              return false;
            }
            var i, len;
            for (i = 0, len = ignores.length; i < len; i++) {
              if (val === ignores[i]) {
                return false;
              }
            }
            return true;
          });
          folders.forEach(function (dict, index) {
            processFolder(folder + "/" + dict);
          });
        }
      });
    }
  });
};

fs.stat(argv[2], function (err, stats) {
  if (stats.isFile()) {
    var input = fs.readFileSync(argv[2], "utf-8");
    if (!input) {
      console.log("jslint: Couldn't open file '" + argv[2] + "'.");
      process.exit(1);
    }
    input = removeFirstComment(input);
    if (!JSLINT(input, config)) {
      var i;
      for (i = 0; i < JSLINT.errors.length; i += 1) {
        var e = JSLINT.errors[i];
        if (e) {
          console.log('Lint at line ' + e.line + ' character ' +
                  e.character + ': ' + e.reason);
          console.log((e.evidence || '').
                  replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1"));
          console.log('');
        }
      }
      process.exit(2);
    } else {
      console.log("jslint: No problems found in " + argv[2]);
      process.exit();
    }
  } else if (stats.isDirectory()) {
    processFolder(argv[2]);
  } else {
    process.exit();
  }
});