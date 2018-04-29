"use strict";

const stdOut = [];
const stdErr = [];

/**
 * Output to buffer for further inspection
 * 
 */
module.exports = {
  comment: function(...inputs) {
    var args = Array.from(inputs);

    stdOut.push(args.join(" "));
  },

  warning: function(...inputs) {
    var args = Array.from(inputs);

    stdErr.push(args.join(" "));
  },

  /**
         * ...
         */
  info: function(...inputs) {
    var args = Array.from(inputs);

    stdOut.push(args.join(" "));
  },

  /**
         * ...
         */
  text: function(...inputs) {
    var args = Array.from(inputs);

    stdOut.push(args.join(" "));
  },

  /**
         * ...
         */
  error: function(...inputs) {
    var args = Array.from(inputs);

    stdErr.push(args.join(" "));
  },

  /**
         * ...
         */
  success: function(...inputs) {
    var args = Array.from(inputs);

    stdOut.push(args.join(" "));
  },

  getOutput: function() {
    return stdOut.join("\n");
  },

  getErrorOutput: function() {
    return stdErr.join("\n");
  }
};
