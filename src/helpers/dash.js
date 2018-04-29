"use strict";
/* eslint no-unused-vars: "warn" */

const Executables = require("./executables");
const exec = require("child_process").exec;
const Path = require("path");
const Log = require("../helpers/log.js");

/**
 * Shaka Packager for DASH files.
 * 
 * Wrapper around shaka-packager binary to generate a DASH manifest
 */
module.exports = function() {
  return {
    /**
     * Generate a DASH manifest.
     * 
     * 
     * @param {Array} files the input files that will be used for the playlist
     * @param {string} mpdOutput the mpd manifest to output
     * @param {Object} options customize the thumbnail generation. The only supported option is `time`, which specifies the timstamp of the frame to use for the thumbnail
     * @return {Promise}
     */
    generate: function(files, mpdOutput, options) {
      var packager_options = [];

      if (!Array.isArray(files)) {
        files = [files];
      }

      files.forEach(function(file) {
        var filename = Path.join(
          Path.dirname(file),
          Path.basename(file, Path.extname(file))
        );
        packager_options.push(
          options.noAudio
            ? `input=${filename}.mp4,stream=video,output=${filename}_video.mp4`
            : `input=${filename}.mp4,stream=audio,output=${filename}_audio.mp4 input=${filename}.mp4,stream=video,output=${filename}_video.mp4`
        );
      });

      var _options = [
        options && options.minBufferTime
          ? "--min_buffer_time " + options.minBufferTime
          : "--min_buffer_time 3",
        options && options.segmentDuration
          ? "--segment_duration " + options.segmentDuration
          : "--segment_duration 3",
        `--mpd_output ${mpdOutput}.mpd`
      ];

      var command =
        '"' +
        Executables.shakaPackager() +
        '" ' +
        packager_options.concat(_options).join(" ");

      return new Promise(function(resolve, reject) {
        // using exec as the size of the output buffer should not be a problem for memory comsumption
        var packager = exec(command, (err, stdout, stderr) => {
          if (err) {
            // node couldn't execute the command
            reject(err);
            return;
          }

          resolve(stdout);
        });
      });
    }
  };
};
