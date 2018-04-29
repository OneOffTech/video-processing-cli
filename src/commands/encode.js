"use strict";
/* eslint no-unused-vars: "warn", block-scoped-var: "warn" */

const Ffmpeg = require("../helpers/ffmpeg.js");
const Details = require("../helpers/details.js");
const Presets = require("../helpers/presets.js");
const Path = require("path");
const fs = require("fs");

/**
 * transcode: transcodes an input video into another video with different format (able to change resolution, crop, change bitrate, convert containers/codecs)
 * 
 * @param {string} input.arguments.file the video file
 * @param {string} input.arguments.path the location where the output will be saved
 * @param {*} input.options.preset
 * @return {Promise}
 */
module.exports = async function(input, output) {
  try {
    var file = input.arguments.file;
    var path = input.arguments.path;

    output.comment("Encoding", file);

    var outname = Path.basename(file, Path.extname(file)) + "-%resolution%.mp4";

    var filePath = Path.dirname(file);

    if (path && !fs.existsSync(path)) {
      throw new Error(`Output path ${path} must exists and be a directory.`);
    }

    var outfile = Path.join(path || filePath, outname);

    var presetName = input.options.preset || "auto";

    var supportedPresets = Object.keys(Presets.SCALE_PRESETS);

    if (!Presets.SCALE_PRESETS.exists(presetName)) {
      throw new Error(
        `Unknown preset ${presetName}. Expected one of ${supportedPresets}`
      );
    }

    var ffmpegProcess = new Ffmpeg(file);

    // get details of the video file, required to make some decisions later
    var details = await Details.get(file);

    output.comment("Selected preset", presetName);

    var videoStream = null;

    details.streams.forEach(function(s) {
      // get the first video stream to grab resolution information
      if (s.codec_type === "video" && !videoStream) {
        videoStream = s;
      }
    });

    if (videoStream === null) {
      throw new Error("No video stream found");
    }

    var scalingSetting = null;

    if (presetName === "auto") {
      scalingSetting = Presets.SCALE_PRESETS.auto(videoStream.height);
    } else {
      scalingSetting = Presets.SCALE_PRESETS[presetName];
    }
    return ffmpegProcess
      .scale(outfile, scalingSetting)
      .then(function(result) {
        output.success(
          "Scaling of video completed using",
          scalingSetting.name,
          "to",
          result.output
        );
        return result.output;
      })
      .catch(function(err) {
        output.error(`Not able to process ${file}`, err.message);
      });
  } catch (error) {
    output.error(error.message);
    throw error;
  }
};
