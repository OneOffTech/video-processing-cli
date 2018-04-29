"use strict";
/* eslint no-console: "off" */

const clc = require("cli-color");

/**
 * Log module
 * 
 * For a coherent output.
 */
module.exports = {
  /**
     * ...
     */
  comment: function() {
    var args = Array.from(arguments);

    var txt = args.map(function(el) {
      return clc.yellowBright(el);
    });

    console.log(txt.join(" "));
  },

  warning: function() {
    var args = Array.from(arguments);

    var txt = args.map(function(el) {
      return clc.yellowBright(el);
    });

    console.log(txt.join(" "));
  },

  /**
     * ...
     */
  info: function() {
    var args = Array.from(arguments);

    console.log(args.join(" "));
  },

  /**
     * ...
     */
  text: function() {
    var args = Array.from(arguments);

    console.log(args.join(" "));
  },

  /**
     * ...
     */
  error: function() {
    var args = Array.from(arguments);

    var txt = args.map(function(el) {
      return clc.red(el);
    });

    console.error(txt.join(" "));
  },

  /**
     * ...
     */
  success: function() {
    var args = Array.from(arguments);

    var txt = args.map(function(el) {
      return clc.green(el);
    });

    console.log(txt.join(" "));
  },

  colors: clc
};
