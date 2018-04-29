"use strict";
/* eslint no-unused-vars: "warn", block-scoped-var: "warn" */

const Ffmpeg = require("../helpers/ffmpeg.js");
const Dash = require("../helpers/dash.js");
const Details = require("../helpers/details.js");
const Presets = require("../helpers/presets.js");
const Path = require("path");
const fs = require("fs");

/**
 * Generate DASH/HLS manifest for streaming a video file
 * 
 * @param {string} input.arguments.file the video file
 * @param {string} input.arguments.path the location where the outputs will be saved
 * @return {Promise}
 * @deprecated Deprecated in favor of the more controllable encode plus dash chain
 */
module.exports = function(input, output) {
  try {
    // file output path and format
    var file = input.arguments.file;
    var path = input.arguments.path;

    var outname = Path.basename(file, Path.extname(file)) + "-%resolution%.mp4";

    var outfile = Path.join(path, outname);

    var ffmpegProcess = new Ffmpeg(file);
    var details = Details.get(file);

    output.comment("Grabbed video source details. Start scaling down");

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

    var scalingSettings = null;

    if (videoStream.height >= 1080) {
      scalingSettings = [
        Presets.SCALE_PRESETS.V1080,
        Presets.SCALE_PRESETS.V720,
        Presets.SCALE_PRESETS.V540,
        Presets.SCALE_PRESETS.V360
      ];
    } else if (videoStream.height >= 720) {
      scalingSettings = [
        Presets.SCALE_PRESETS.V540,
        Presets.SCALE_PRESETS.V360
      ];
    } else if (videoStream.height >= 540) {
      scalingSettings = [Presets.SCALE_PRESETS.V360];
    } else if (videoStream.height >= 360) {
      scalingSettings = [Presets.SCALE_PRESETS.V360];
    } else {
      // resolution too low, no scaling
      scalingSettings = [];
      output.comment(
        `Vertical resolution ${videoStream.height} is below 360, so no scaling preset is selected.`
      );
    }
    // if video is Full HD, use all presets
    // if video is 720 use only 540p and 360p... and so on
    // grab the video resolution before and then enqueue the
    // various scale options based on the video resolution (only downscale)

    return Promise.all(
      scalingSettings.map(function(v) {
        return ffmpegProcess.scale(outfile, v);
      })
    )
      .then(function(values) {
        output.success("Scaling of video completed", values.join(", "));

        output.info("Generating DASH manifest");

        var mdpOutput = Path.join(
          path,
          Path.basename(file, Path.extname(file))
        );

        var dashOptions = Presets.DASH_DEFAULT;

        dashOptions.noAudio = !hasAudioStream;

        if (values.length === 0) {
          output.warning("No files to process for dash manifest generation");
          throw new Error(
            "DASH manifest cannot be generated with no video input."
          );
        }

        // now is the packager turn
        return new Dash()
          .generate(values, mdpOutput, dashOptions)
          .then(function() {
            output.success("MDP manifest generated");
            values.forEach(function(f) {
              fs.unlinkSync(f);
            });
          });
      })
      .catch(function(err) {
        output.error(`Not able to process ${file}`, err.message);
      });
  } catch (error) {
    output.error(error.message);
    // process.exit(1);
  }
};
