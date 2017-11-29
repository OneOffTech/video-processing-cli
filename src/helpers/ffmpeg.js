"use strict";
/* eslint no-unused-vars: "warn" */

const Executables = require("./executables");
const exec = require("child_process").exec;
const fs = require("fs");

/**
 * FFMPEG.
 * 
 * Wrapper around ffmpeg binary to process a video
 */
module.exports = function(file) {
  var default_options = ["-i " + file];

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
        "-vframes 1",
        "-y"
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
        "-y",
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

      return new Promise(function(resolve, reject) {
        // using exec as the size of the output buffer should not be a problem for memory comsumption
        var ffmpeg = exec(command, (err, stdout, stderr) => {
          if (err) {
            // node couldn't execute the command
            reject(err);
            return;
          }

          // console.log('Scaling finished for ', options.name, outputfile);

          resolve(outputfile);
        });

        // ffmpeg.stdout.on('data', function(data) {
        //     console.log(options.name+': ' + data);
        // });
        // ffmpeg.stderr.on('data', function(data) {
        //     console.log(options.name+': ' + data);
        // });
        // ffmpeg.on('close', function(code) {
        //     console.log(options.name+': closing code = ' + code);
        // });
      });
    }
  };
};
