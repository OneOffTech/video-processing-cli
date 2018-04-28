"use strict";
/* eslint no-unused-vars: "warn" */

const Executables = require("./executables");
const exec = require("child_process").exec;
const fs = require("fs");
const Future = require("posterus");
const os = require("os");

/**
 * FFMPEG.
 * 
 * Wrapper around ffmpeg binary to process a video
 */
module.exports = function(file, options) {
  var default_options = [
    "-hide_banner", // do not output ffmpeg welcome banner
    "-nostats", // reduce the output when processing a video
    "-threads 1", // let ffmpeg automatically manage the cpu usage
    "-i " + file,
    "-y" // Overwrite output files without asking.
    // "-n", // Do not overwrite output files, and exit immediately if a specified output file already exists.
  ];

  if (!fs.existsSync(file)) {
    throw new Error(`File ${file} don't exists`);
  }

  return {
    /**
         * Generate a thumbnail.
         * 
         * By defuault tries to find the most representative frame of the video
         * 
         * @param {string} output the output path with filename and extension
         * @param {Object} options customize the thumbnail generation. The only supported option is `time`, which specifies the timstamp of the frame to use for the thumbnail
         * @return {Promise}
         */
    thumbnail: function(output, options) {
      var thumbnailOptions = [
        // if time is specified, use the time
        // otherwise let ffmpeg try to find the most representative frame
        // https://superuser.com/questions/538112/meaningful-thumbnails-for-a-video-using-ffmpeg
        options && options.time ? "-ss " + options.time : '-vf  "thumbnail"',
        "-vframes 1"
      ];

      var command =
        '"' +
        Executables.ffmpeg() +
        '" ' +
        default_options.concat(thumbnailOptions, '"' + output + '"').join(" ");

      return new Promise(function(resolve, reject) {
        // using exec as the size of the output buffer should not be a problem for memory comsumption
        var ffmpeg = exec(command, (err, stdout, stderr) => {
          if (err) {
            // node couldn't execute the command
            reject(err);
            return;
          }

          resolve(stdout);
        });
      });
    },

    /**
         * Create a MP4/H264 scaled video from the original input.
         * For example from 1080p to 720p
         * 
         * @param {string} output the output path with filename and extension
         * @param {Object} options the output options, like bitrate, resolution, audio frequency (see SCALE_PRESETS)
         * @return {Promise}
         */
    scale: function(output, options) {
      // -b:v 1500k set the video bitrate
      // -maxrate 1500k -bufsize 1000k
      // -maxrate <int> E..VA. Set maximum bitrate tolerance (in bits/s). Requires bufsize to be set. (from INT_MIN to INT_MAX)
      // -bufsize <int> E..VA. set ratecontrol buffer size (in bits) (from INT_MIN to INT_MAX)
      // -ar audio sampling frequency KHz
      // -ac set the number of audio channels
      // -c:a set the audio codec
      // -ab (o -b:a) is still obscure

      var scaleOptions = [
        "-c:a " + options.audioCodec,
        "-ac " + options.audioChannels,
        "-ab " + options.audioBitrate,
        "-ar " + options.audioFrequency,
        "-c:v libx264",
        '-x264opts "keyint=24:min-keyint=24:no-scenecut"',
        "-b:v " + options.videoBitrate,
        "-maxrate " + options.videoMaximumBitrate,
        "-bufsize " + options.videoBufferSize,
        '-vf "scale=' + options.videoScale + '"'
      ];

      var outputfile = output.replace("%resolution%", options.name);
      var command =
        '"' +
        Executables.ffmpeg() +
        '" ' +
        default_options.concat(scaleOptions, '"' + outputfile + '"').join(" ");

      const future = new Future.Future();

      var ffmpeg = exec(command, (err, stdout, stderr) => {
        // our operation completes
        future.settle(err, {
          stderr: stderr,
          stdout: stdout,
          output: outputfile,
          scale: options.name
        });
      });

      return future
        .finally(function finalize() {
          if (ffmpeg.connected) {
            ffmpeg.kill();
          }
          ffmpeg = null;
        })
        .map((error, result) => {
          // the work is finished, and the finalizer cleaned the unnecessary objects
          // so we can throw errors, if the ffmpeg returned an error, or just return
          // an elaboration of the result

          if (error) {
            // here the error should be transformed to something else to not expose directly ffmpeg error text
            // add the detail in the linked exception
            throw error;
          }

          return result;
        });
    }
  };
};
