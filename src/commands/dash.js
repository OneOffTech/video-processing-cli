"use strict";
/* eslint no-unused-vars: "warn", block-scoped-var: "warn" */

const Log = require("../helpers/log.js");
const Ffmpeg = require("../helpers/ffmpeg.js");
const Dash = require("../helpers/dash.js");
const Ffprobe = require("../helpers/ffprobe.js");
const Presets = require("../helpers/presets.js");
const Path = require("path");
const fs = require("fs");

/**
 * Generate DASH/HLS manifest for streaming a video file
 * 
 * @param {string} file the video file
 * @param {string} path the location where the outputs will be saved
 * @param {Object} command the command being executed (e.g. to get options)
 * @return {Promise}
 */
module.exports = function(files, path, command) {
  try {
    // file output path and format
    Log.comment("Encoding", file);

    var outname = Path.basename(file, Path.extname(file)) + "-%resolution%.mp4";

    var outfile = Path.join(path, outname);

    var presetName = command.preset || "fast";

    var process = new Ffmpeg(file);
    var probe = new Ffprobe(file);

    return probe
      .then(function(details) {
        Log.comment("Selected preset", presetName);

        var videoStream = null;
        var hasAudioStream = false;

        details.streams.forEach(function(s) {
          if (s.codec_type === "video" && !videoStream) {
            videoStream = s;
          }
          if (s.codec_type === "audio" && !hasAudioStream) {
            hasAudioStream = true;
          }
        });

        if (videoStream === null) {
          throw new Error("No video stream found");
        }

        // keep in mind that one scaling might fail, hence the promise will fail, but
        // the ffmpeg execution of the others is still in progress and will not be tracked
        var mdpOutput = Path.join(
          path,
          Path.basename(file, Path.extname(file))
        );
        var dashOptions = Presets.DASH_DEFAULT;

        dashOptions.noAudio = !hasAudioStream;

        return new Dash()
          .generate(values, mdpOutput, dashOptions)
          .then(function() {
            Log.success("MDP manifest generated");
            // values.forEach(function(f) {
            //   fs.unlinkSync(f);
            // });
          });
      })
      .catch(function(err) {
        Log.error(`Not able to process ${file}`, err.message);
      });
  } catch (error) {
    Log.error(error.message);
    process.exit(1);
  }
};
