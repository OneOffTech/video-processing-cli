"use strict";

const Ffmpeg = require("../helpers/ffmpeg.js");
const Path = require("path");

/**
 * Generate a thumbnail (or poster image) of a video file
 * 
 * @param {string} input.arguments.file the video file
 * @param {string} input.arguments.path the location where the thumbnail file will be saved
 * @param {*} input.options.out
 * @param {*} input.options.format
 * @param {Object} command the command being executed (e.g. to get options)
 * @return {Promise}
 */
module.exports = function(input, output) {
  try {
    // file output path and format
    var file = input.arguments.file;
    var path = input.arguments.path;

    var format = input.options.format || Path.extname(outname);
    var outname =
      input.options.out ||
      Path.basename(file, Path.extname(file)) + `.${format}`;

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
        output.success("Thumbnail saved in", outfile);
      })
      .catch(function(err) {
        output.error(`Not able to generate the thumbnail of ${file}`);
        output.error(err.message);
      });
  } catch (error) {
    output.error(error.message);
    throw error;
  }
};
