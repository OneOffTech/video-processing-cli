"use strict";
/* eslint no-unused-vars: "warn" */

const Log = require("../helpers/log.js");
const Ffmpeg = require("../helpers/ffmpeg.js");
const Path = require("path");

/**
 * Generate a thumbnail (or poster image) of a video file
 * 
 * @param {string} file the video file
 * @param {string} path the location where the thumbnail file will be saved
 * @param {Object} command the command being executed (e.g. to get options)
 * @return {Promise}
 */
module.exports = function(file, path, command) {
  try {
    // file output path and format

    var outname =
      command.out || Path.basename(file, Path.extname(file)) + ".png";
    var format = command.format || Path.extname(outname);

    if (
      format !== "png" &&
      format !== "jpg" &&
      format !== ".png" &&
      format !== ".jpg"
    ) {
      throw new Error(
        `Specified format (${format}) is not supported. Acceptable formats are: png, jpg`
      );
    }

    var outfile = Path.join(path, outname);

    if (format === "png" && Path.extname(outname) !== ".png") {
      throw new Error(
        `Output filename (${outname}) does not have ${format} extension`
      );
    } else if (format === "jpg" && Path.extname(outname) !== ".jpg") {
      throw new Error(
        `Output filename (${outname}) does not have ${format} extension`
      );
    }

    return new Ffmpeg(file)
      .thumbnail(outfile)
      .then(function(output) {
        Log.success("Thumbnail saved in", outfile);
      })
      .catch(function(err) {
        Log.error(`Not able to generate the thumbnail of ${file}`);
        Log.error(err.message);
      });
  } catch (error) {
    Log.error(error.message);
    process.exit(1);
  }
};
