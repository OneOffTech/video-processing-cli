"use strict";
/* eslint no-unused-vars: "warn", no-nested-ternary: "warn" */

const Log = require("../helpers/log.js");
const Downloader = require("../helpers/download.js");
const Package = require("../../package.json");
const Path = require("path");
const fs = require("fs");
const fse = require("fs-extra");
const { unzip } = require("cross-unzip");
const exec = require("child_process").exec;

const FFMPEG_DOWNLOAD_URL = {
  win:
    "https://ffmpeg.zeranoe.com/builds/win{architecture}/static/ffmpeg-{version}-win{architecture}-static.zip",
  // "macos": ["https://evermeet.cx/ffmpeg/ffmpeg-{version}.7z", "https://evermeet.cx/ffmpeg/ffprobe-{version}.7z"],
  linux:
    "https://johnvansickle.com/ffmpeg/releases/ffmpeg-{version}-{architecture}bit-static.tar.xz"
};

const SHAKA_PACKAGER_DOWNLOAD_URL = {
  win:
    "https://github.com/google/shaka-packager/releases/download/v{version}/packager-win.exe",
  macos:
    "https://github.com/google/shaka-packager/releases/download/v{version}/packager-osx",
  linux:
    "https://github.com/google/shaka-packager/releases/download/v{version}/packager-linux"
};

/**
 * Downloads the Shaka Packager binary
 * 
 * @param {string} platform the platform, supported values are "win", "macos", "linux"
 * @return {Promise}
 */
function downloadShakaPackager(platform) {
  var packagerUrl = SHAKA_PACKAGER_DOWNLOAD_URL[platform].replace(
    /\{version\}/g,
    Package.binaries.packager
  );

  return new Downloader(packagerUrl, "./bin/" + Path.basename(packagerUrl))
    .then(function(f) {
      Log.success("Shaka Packager downloaded in", f);
    })
    .catch(function(err) {
      Log.error("Shaka Packager not downloaded,", err);
    });
}

/**
 * Downloads the FFMPEG and FFPROBE binaries
 * 
 * @param {string} platform the platform, supported values are "win", "linux"
 * @param {string} architecture the architecture, supported values as "64" or "32"
 * @return {Promise}
 */
function downloadFfmpeg(platform, architecture) {
  if (!FFMPEG_DOWNLOAD_URL[platform]) {
    Log.error(
      "FFMPEG download aborted: platform not supported",
      "(" + platform + ")"
    );
    return Promise.resolve(null);
  }

  var ffmpegUrl = FFMPEG_DOWNLOAD_URL[platform]
    .replace(/\{architecture\}/g, architecture)
    .replace(/\{version\}/g, Package.binaries.ffmpeg);

  return new Downloader(ffmpegUrl, "./bin/" + Path.basename(ffmpegUrl))
    .then(function(f) {
      Log.success("FFMPEG downloaded in", f);

      // extract the compressed archive content
      Log.comment("Extracting ffmpeg binaries...");

      return platform === "win"
        ? extractFfmpegWindows("./bin/" + Path.basename(ffmpegUrl), "./bin/")
        : extractFfmpegLinux(
            Path.join(process.cwd(), "bin", Path.basename(ffmpegUrl)),
            Path.join(process.cwd(), "bin")
          );
    })
    .catch(function(err) {
      Log.error("FFMPEG not downloaded,", err);
    });
}

function extractFfmpegWindows(file, path) {
  return new Promise(function(resolve, reject) {
    unzip(file, path, function(err) {
      if (err) {
        reject(err);
      }

      fse.copySync(
        Path.join(
          path,
          Path.basename(file).replace(Path.extname(file), ""),
          "bin",
          "ffmpeg.exe"
        ),
        Path.join(path, "ffmpeg.exe"),
        { overwrite: true }
      );
      fse.copySync(
        Path.join(
          path,
          Path.basename(file).replace(Path.extname(file), ""),
          "bin",
          "ffprobe.exe"
        ),
        Path.join(path, "ffprobe.exe"),
        { overwrite: true }
      );

      fse.removeSync(
        Path.join(path, Path.basename(file).replace(Path.extname(file), ""))
      );
      fse.removeSync(file);
      resolve(null);
    });
  })
    .then(function() {
      Log.success("FFMPEG binaries extracted from archive");
    })
    .catch(function(err) {
      Log.error("Failed to extract FFMPEG binaries:", err.message);
    });
}

function extractFfmpegLinux(file, path) {
  return new Promise(function(resolve, reject) {
    var command = `tar -xvJf "${file}" -C "${path}"`;

    var untar = exec(command, (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        reject(err);
        return;
      }

      fse.copySync(
        Path.join(path, Path.basename(file).replace(".tar.xz", ""), "ffmpeg"),
        Path.join(path, "ffmpeg"),
        { overwrite: true }
      );
      fse.copySync(
        Path.join(path, Path.basename(file).replace(".tar.xz", ""), "ffprobe"),
        Path.join(path, "ffprobe"),
        { overwrite: true }
      );

      fse.removeSync(
        Path.join(path, Path.basename(file).replace(".tar.xz", ""))
      );
      fse.removeSync(file);
      resolve(null);
    });
  })
    .then(function() {
      Log.success("FFMPEG binaries extracted from archive");
    })
    .catch(function(err) {
      Log.error("Failed to extract FFMPEG binaries:", err);
    });
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
    const architectureNormalized = process.arch.replace("x", "");

    if (!fs.existsSync("./bin")) {
      fs.mkdirSync("./bin");
    }

    Log.comment(
      "Downloading binaries",
      "(" + platformNormalized + ", " + architectureNormalized + " bit)..."
    );

    return Promise.all([
      downloadShakaPackager(platformNormalized),

      downloadFfmpeg(platformNormalized, architectureNormalized)
    ]);
  } catch (error) {
    Log.error(error.message);
    process.exit(1);
  }
};
