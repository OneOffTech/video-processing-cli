"use strict";
/* eslint no-unused-vars: "warn", no-nested-ternary: "warn" */

const Log = require("../helpers/log.js");
const Downloader = require("../helpers/download.js");
const Package = require("../../package.json");
const Path = require("path");
const fs = require("fs");
const fse = require("fs-extra");
const crypto = require("crypto");


/**
 * Downloads the Shaka Packager binary
 * 
 * @param {string} platform the platform, supported values are "win", "macos", "linux"
 * @return {Promise}
 */
function downloadShakaPackager(platform) {
  var url = Package.binaries.packager[platform] || null;
  var checksum = Package.binaries.packager_checksum[platform] || null;
  var name = Path.basename(url);

  return getBinary(name, url, checksum, platform);
}

/**
 * Downloads the FFMPEG binary
 * 
 * @param {string} platform the platform, supported values are "win", "macos" "linux"
 * @return {Promise}
 */
function downloadFfmpeg(platform) {

  var ffmpegUrl = Package.binaries.ffmpeg[platform] || null;
  var ffmpegChecksum = Package.binaries.ffmpeg_checksum[platform] || null;
  var ffmpegBinName = "ffmpeg" + (platform === "win" ? ".exe" : "");

  return getBinary(ffmpegBinName, ffmpegUrl, ffmpegChecksum, platform);
}

/**
 * Downloads the FFPROBE binary
 * 
 * @param {string} platform the platform, supported values are "win", "macos" "linux"
 * @return {Promise}
 */
function downloadFfprobe(platform) {

  var url = Package.binaries.ffprobe[platform] || null;
  var checksum = Package.binaries.ffprobe_checksum[platform] || null;
  var name = "ffprobe" + (platform === "win" ? ".exe" : "");

  return getBinary(name, url, checksum, platform);
}

/**
 * Downloads a binary
 * 
 * @param {string} name binary name
 * @param {string} url the url from which download the binary
 * @param {string} checksum the sha256 checksum of the expected binary
 * @return {Promise}
 */
function getBinary(name, url, checksum, platform) {

  var path = "./bin/" + name;

  if (! url) {
    Log.error(
      name + " download aborted: platform not supported or url not provided"
    );
    return Promise.resolve(null);
  }

  return checkFile(path).then(function(calculatedChecksum){

    if(calculatedChecksum === checksum){
      Log.info(name + " already existing");
      return Promise.resolve(null);
    }

    Log.warning("Downloading " + name + "...");

    if(calculatedChecksum){
      fse.renameSync(path, path + ".old");
    }

    return new Downloader(url, path)
      .then(function(f) {
        
        if(platform === 'linux'){
          try{
            fs.chmodSync(f, 644);
            Log.info("Execution permission set for ", f);
          }
          catch(err){
            Log.error("Failed to set execution permission for ", err);
          }
        }
        Log.success(name + " downloaded in", f);
      })
      .catch(function(err) {
        Log.error(name + " not downloaded,", err);
        throw new Error(name + " not downloaded");
      });
  });
}


/**
 * Calculate the SHA-256 checksum of a file
 * @param {string} path 
 * @return {Promise}
 */
function checkFile(path) {

  return new Promise((resolve, reject) => {

    if(! fse.existsSync(path)){
      resolve(null)
    }

    fs.createReadStream(path)
      .on('error', reject)
      .pipe(crypto.createHash('sha256')
        .setEncoding('hex'))
      .once('finish', function () {
        resolve(this.read())
      })
  })
}



/**
 * Fetches the required FFMPEG and Shaka Packager binaries
 * 
 * @param {Object} command the command being executed (e.g. to get options)
 * @return {Promise}
 */
module.exports = function(command) {
  try {
    const platformNormalized = process.platform.match(/win(32|64)/)
      ? "win"
      : process.platform.match(/darwin/) ? "macos" : "linux";

    if (!fs.existsSync("./bin")) {
      fs.mkdirSync("./bin");
    }

    Log.comment(
      "Downloading binaries",
      "(" + platformNormalized + ")..."
    );

    return Promise.all([
      downloadShakaPackager(platformNormalized),
      downloadFfmpeg(platformNormalized),
      downloadFfprobe(platformNormalized)
    ]);
  } catch (error) {
    Log.error(error.message);
    process.exit(1);
  }
};
