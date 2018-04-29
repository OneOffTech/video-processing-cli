"use strict";

const DetailsExtractor = require("../helpers/details.js");

/**
 * Get the metadata of a video file
 * 
 * @param {Object} input the inputs of the command
 * @param {String} input.arguments.file the file to extract the metadata
 * @param {Boolean} input.options.json if to output a JSON serialized object
 * @param {Object} output the command being executed (e.g. to get options)
 * @return {Promise}
 */
module.exports = async function(input, output) {
  var file = input.arguments.file;
  var jsonOutput = input.options.json || false;

  try {
    var details = await DetailsExtractor.get(file);

    if (!jsonOutput) {
      output.success(details.format.filename, "details");

      output.info(
        details.format.format_long_name,
        "(" + details.format.format_name + ")"
      );
      output.info("duration", details.format.duration);
      output.info("size", details.format.size);
      output.info("bitrate", details.format.bit_rate);

      details.streams.forEach(function(value) {
        if (value.codec_type === "video") {
          output.info(
            value.codec_type,
            value.codec_name,
            value.width + "x" + value.height
          );
        } else if (value.codec_type === "audio") {
          output.info(value.codec_type, value.codec_name, value.sample_rate);
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

      output.info(
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
    output.error(`Not able to retrieve details from ${file}`);
    output.error(error.message);
  }
};
