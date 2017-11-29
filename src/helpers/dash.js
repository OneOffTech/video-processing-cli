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
         * @param {string} mdpOutput the MDP manifest to output
         * @param {Object} options customize the thumbnail generation. The only supported option is `time`, which specifies the timstamp of the frame to use for the thumbnail
         * @return {Promise}
         */
    generate: function(files, mdpOutput, options) {
      var packager_options = [];

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
        `--mpd_output ${mdpOutput}.mpd`
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

      // # Full to 720p
      // ffmpeg -y -i /src/sample.mp4 -c:a aac -ac 2 -ab 256k -ar 48000 -c:v libx264 -x264opts 'keyint=24:min-keyint=24:no-scenecut' -b:v 1500k -maxrate 1500k -bufsize 1000k -vf "scale=-1:720" /src/sample720.mp4

      // # Full to 540p
      // ffmpeg -y -i /src/sample.mp4 -c:a aac -ac 2 -ab 128k -ar 44100 -c:v libx264 -x264opts 'keyint=24:min-keyint=24:no-scenecut' -b:v 800k -maxrate 800k -bufsize 500k -vf "scale=-1:540" /src/sample540.mp4

      // # Full to 360p
      // ffmpeg -y -i /src/sample.mp4 -c:a aac -ac 2 -ab 128k -ar 22050 -c:v libx264 -x264opts 'keyint=24:min-keyint=24:no-scenecut' -b:v 400k -maxrate 400k -bufsize 400k -vf "scale=-1:360" /src/sample360.mp4

      Log.info("Scaling started for " + options.name);

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
      var default_options = [];

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

          Log.text("Scaling finished for ", options.name, outputfile);

          resolve(outputfile);
        });

        ffmpeg.stdout.on("data", function(data) {
          Log.text(options.name + ": " + data);
        });
        ffmpeg.stderr.on("data", function(data) {
          Log.text(options.name + ": " + data);
        });
        ffmpeg.on("close", function(code) {
          Log.text(options.name + ": closing code = " + code);
        });
      });
    }
  };
};
