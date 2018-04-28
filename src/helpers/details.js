"use strict";

const Ffprobe = require("../helpers/ffprobe.js");

/**
 * Details Helper.
 * 
 * Extract metadata from a file using ffprobe
 */
module.exports = {
  /**
     * Get file metadata. 
     * 
     * @param {String} file the path of the video file to get details from
     * @return {Object} the file details
     */
  get: async function(file) {
    var probe = await new Ffprobe(file);

    return probe;
  }
};
