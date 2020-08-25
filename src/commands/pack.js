"use strict";
/* eslint no-unused-vars: "warn", block-scoped-var: "warn" */

const Dash = require("../helpers/dash.js");
const Details = require("../helpers/details.js");
const Presets = require("../helpers/presets.js");
const Path = require("path");
const fs = require("fs");

/**
 * Pack a set of videos in a DASH manifest for streaming
 * 
 * If a video do not have an audio track, the final output will not have audio
 * 
 * @param {string} input.arguments.files the video files to pack
 * @param {string} input.options.out the location where the outputs will be saved
 * @param {string} input.options.filename the manifest filename
 * @param {Object} command the command being executed (e.g. to get options)
 * @return {Promise}
 */
module.exports = async function(input, output) {
  try {
    var files = input.arguments.files;

    if (files.length === 0) {
      throw new Error("Please specify at least one video file.");
    }

    var path = input.options.out || Path.dirname(files[0]);
    var mpdName =
      input.options.filename || Path.basename(files[0], Path.extname(files[0]));

    // file output path and format
    output.comment("Packing for DASH playback", files.join(","));

    var details = await Promise.all(
      files.map(async function(file) {
        return await Details.get(file);
      })
    );

    // if one input file do not have audio, disabled audio for the final output
    var hasAudioStream =
      details.map(function(d) {
        return d.streams.filter(s => s.codec_type === "audio");
      }).length > 0;

    var dashOptions = Presets.DASH_DEFAULT;
    dashOptions.noAudio = !hasAudioStream;

    var mpdOutput = Path.join(path, mpdName);

    return new Dash().generate(files, mpdOutput, dashOptions).then(function() {
      output.success(`Dash (mpd) manifest generated ${mpdOutput}.mpd `);
    }).catch(function(err){ throw err; });
  } catch (error) {
    output.error(error.message);
    throw error;
  }
};
