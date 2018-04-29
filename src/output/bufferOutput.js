"use strict";

let stdOut = [];
let stdErr = [];

/**
 * Output to buffer for further inspection
 * 
 */
module.exports = {
  comment: function() {
    var args = Array.from(arguments);

    stdOut.push(args.join(" "));
  },

  warning: function() {
    var args = Array.from(arguments);

    stdErr.push(args.join(" "));
  },

  /**
         * ...
         */
  info: function() {
    var args = Array.from(arguments);

    stdOut.push(args.join(" "));
  },

  /**
         * ...
         */
  text: function() {
    var args = Array.from(arguments);

    stdOut.push(args.join(" "));
  },

  /**
         * ...
         */
  error: function() {
    var args = Array.from(arguments);

    stdErr.push(args.join(" "));
  },

  /**
         * ...
         */
  success: function() {
    var args = Array.from(arguments);

    stdOut.push(args.join(" "));
  },

  getOutput: function() {
    return stdOut.join("\n");
  },

  getErrorOutput: function() {
    return stdErr.join("\n");
  }
};
