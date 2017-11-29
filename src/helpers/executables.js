"use strict";

const which = require("which");
const fs = require("fs");
const isWindows = require("os")
  .platform()
  .match(/win(32|64)/);

const FFPROBE_BINARY = isWindows ? "ffprobe.exe" : "ffprobe";
const FFMPEG_BINARY = isWindows ? "ffmpeg.exe" : "ffmpeg";
const SHAKA_PACKAGER_BINARY = isWindows ? "packager-win.exe" : "packager-linux";
const BINARY_FOLDER = "./bin/";

/**
 * Executables.
 * 
 * Find the specified executable in the PATH or in the specified folders.
 * 
 * A utility to grab the executable name and path according to the OS 
 * and the folder structure. If the executable is not find in the 
 * PATH, the ./bin directory is checked
 * 
 * @author Alessio Vertemati
 */
module.exports = {
  /**
     * The FFPROBE executable path
     * 
     * @return {string}
     */
  ffprobe: function() {
    try {
      return which.sync(FFPROBE_BINARY);
    } catch (error) {
      var alternatePath = BINARY_FOLDER + FFPROBE_BINARY;

      if (fs.existsSync(alternatePath)) {
        return alternatePath;
      } else {
        throw new Error("ffprobe not found in path or in bin folder");
      }
    }
  },

  /**
     * The FFMPEG executable path
     * 
     * @return {string}
     */
  ffmpeg: function() {
    try {
      return which.sync(FFMPEG_BINARY);
    } catch (error) {
      var alternatePath = BINARY_FOLDER + FFMPEG_BINARY;

      if (fs.existsSync(alternatePath)) {
        return alternatePath;
      } else {
        throw new Error("ffprobe not found in path or in bin folder");
      }
    }
  },

  /**
     * The Shaka Packager executable path
     * 
     * @return {string}
     */
  shakaPackager: function() {
    try {
      return which.sync(SHAKA_PACKAGER_BINARY);
    } catch (error) {
      var alternatePath = BINARY_FOLDER + SHAKA_PACKAGER_BINARY;

      if (fs.existsSync(alternatePath)) {
        return alternatePath;
      } else {
        throw new Error(
          `Shaka Packager ${SHAKA_PACKAGER_BINARY} not found in path or in bin folder`
        );
      }
    }
  }
};
