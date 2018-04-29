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
  comment: function(...inputs) {
    var args = Array.from(inputs);

    var txt = args.map(function(el) {
      return clc.yellowBright(el);
    });

    console.log(txt.join(" "));
  },

  warning: function(...inputs) {
    var args = Array.from(inputs);

    var txt = args.map(function(el) {
      return clc.yellowBright(el);
    });

    console.log(txt.join(" "));
  },

  /**
     * ...
     */
  info: function(...inputs) {
    var args = Array.from(inputs);

    console.log(args.join(" "));
  },

  /**
     * ...
     */
  text: function(...inputs) {
    var args = Array.from(inputs);

    console.log(args.join(" "));
  },

  /**
     * ...
     */
  error: function(...inputs) {
    var args = Array.from(inputs);

    var txt = args.map(function(el) {
      return clc.red(el);
    });

    console.error(txt.join(" "));
  },

  /**
     * ...
     */
  success: function(...inputs) {
    var args = Array.from(inputs);

    var txt = args.map(function(el) {
      return clc.green(el);
    });

    console.log(txt.join(" "));
  },

  colors: clc
};
