"use strict";
/* eslint no-unused-vars: "warn" */

const Executables = require("./executables");
const exec = require("child_process").exec;
const fs = require("fs");

/**
 * FFPROBE. 
 * 
 * Wrapper around ffprobe binary to extract video information
 * 
 */
module.exports = function(file) {
  var default_options = [
    "-show_streams",
    "-show_format",
    "-hide_banner",
    "-print_format json",
    "-pretty",
    "-unit"
  ];

  if (!fs.existsSync(file)) {
    throw new Error(`File ${file} don't exists`);
  }

  var command =
    '"' +
    Executables.ffprobe() +
    '" ' +
    default_options.concat('"' + file + '"').join(" ");

  return new Promise(function(resolve, reject) {
    // using exec as the size of the output buffer should not be a problem for memory comsumption
    var ffprobe = exec(command, (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        reject(err);
        return;
      }

      // the *entire* stdout and stderr (buffered)
      resolve(JSON.parse(stdout));
    });
  });
};
