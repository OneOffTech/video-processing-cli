"use strict";

const Log = require("../helpers/log.js");
const DetailsExtractor = require("../helpers/details.js");

/**
 * Get the metadata of a video file
 * 
 * @param {string} file the video file to inspect
 * @param {Object} command the command being executed (e.g. to get options)
 * @return {Promise}
 */
module.exports = async function(file, command) {
  var jsonOutput = command.json || false;

  try {
    var details = await DetailsExtractor.get(file);

    if (!jsonOutput) {
      Log.success(details.format.filename, "details");

      Log.info(
        details.format.format_long_name,
        "(" + details.format.format_name + ")"
      );
      Log.info("duration", details.format.duration);
      Log.info("size", details.format.size);
      Log.info("bitrate", details.format.bit_rate);

      details.streams.forEach(function(value) {
        if (value.codec_type === "video") {
          Log.info(
            value.codec_type,
            value.codec_name,
            value.width + "x" + value.height
          );
        } else if (value.codec_type === "audio") {
          Log.info(value.codec_type, value.codec_name, value.sample_rate);
        }
      });
    } else {
      var video_stream = null;
      var audio_stream = null;

      details.streams.forEach(function(value) {
        if (value.codec_type === "video" && !video_stream) {
          video_stream = {
            codec: value.codec_name,
            resolution: value.width + "x" + value.height
          };
        } else if (value.codec_type === "audio" && !audio_stream) {
          audio_stream = {
            codec: value.codec_name,
            sample_rate: value.sample_rate
          };
        }
      });

      Log.info(
        JSON.stringify({
          format: details.format.format_name,
          format_long: details.format.format_long_name,
          duration: details.format.duration,
          bitrate: details.format.bit_rate,
          video: video_stream,
          audio: audio_stream
        })
      );
    }
  } catch (error) {
    Log.error(`Not able to retrieve details from ${file}`);
    Log.error(error.message);
  }
};
