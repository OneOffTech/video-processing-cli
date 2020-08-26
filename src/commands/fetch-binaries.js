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

const FFMPEG_DOWNLOAD_PATH = {
  win:
    "builds/win{architecture}/static/ffmpeg-{version}-win{architecture}-static.zip",
  macos: 
    "builds/macos{architecture}/static/ffmpeg-{version}-macos{architecture}-static.zip",
  linux:
    "old-releases/ffmpeg-{version}-{architecture}bit-static.tar.xz"
};

const FFMPEG_DOWNLOAD_DOMAINS = {
  win:
    "https://ffmpeg.zeranoe.com/",
  macos: 
    "https://ffmpeg.zeranoe.com/",
  linux:
    "http://johnvansickle.com/"
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

  if(fse.existsSync("./bin/" + Path.basename(packagerUrl))){
    Log.info("Shaka Packager already existing");
    return Promise.resolve(null);
  }  

  return new Downloader(packagerUrl, "./bin/" + Path.basename(packagerUrl))
    .then(function(f) {
      
      if(platform === 'linux'){
        try{

          fs.chmodSync(f, 777);
          Log.info("Shaka Packager execution permission set for ", f);
        }
        catch(err){
          Log.error("Failed to set execution permission for Shaka Packager", err);
        }
      }
      Log.success("Shaka Packager downloaded in", f);
    })
    .catch(function(err) {
      Log.error("Shaka Packager not downloaded,", err);
    });
}

/**
 * Downloads the FFMPEG and FFPROBE binaries
 * 
 * @param {string} platform the platform, supported values are "win", "macos" "linux"
 * @param {string} architecture the architecture, supported values are "64" (for 64bit architecture)
 * @return {Promise}
 */
function downloadFfmpeg(platform, architecture) {
  if (!FFMPEG_DOWNLOAD_DOMAINS[platform] && !FFMPEG_DOWNLOAD_PATH[platform] ) {
    Log.error(
      "FFMPEG download aborted: platform not supported",
      "(" + platform + ")"
    );
    return Promise.resolve(null);
  }

  var domain = process.env.CI_CACHE_DOMAIN || FFMPEG_DOWNLOAD_DOMAINS[platform];

  var ffmpegUrl = domain + FFMPEG_DOWNLOAD_PATH[platform]
    .replace(/\{architecture\}/g, architecture)
    .replace(/\{version\}/g, Package.binaries.ffmpeg);

  Log.info(domain);

  if(fse.existsSync("./bin/ffmpeg" + (platform === "win" ? ".exe" : "")) && 
      fse.existsSync("./bin/ffprobe" + (platform === "win" ? ".exe" : "")) ){
    Log.info("FFMPEG already existing");
    return Promise.resolve(null);
  }

  return new Downloader(ffmpegUrl, "./bin/" + Path.basename(ffmpegUrl))
    .then(function(f) {
      Log.success("FFMPEG downloaded in", f);

      // extract the compressed archive content
      Log.comment("Extracting ffmpeg binaries...");

      if(platform === "win"){
        return extractFfmpegWindows("./bin/" + Path.basename(ffmpegUrl), "./bin/");
      }
      
      if(platform === "macos"){
        return extractFfmpegMacos("./bin/" + Path.basename(ffmpegUrl), "./bin/");
      }

      return extractFfmpegLinux(
            Path.join(process.cwd(), "bin", Path.basename(ffmpegUrl)),
            Path.join(process.cwd(), "bin")
          );
    })
    .catch(function(err) {
      Log.error("FFMPEG not downloaded,", err);
      throw new Error("FFMPEG not downloaded");
    });
}

function extractFfmpegWindows(file, path) {
  return new Promise(function(resolve, reject) {
    unzip(file, path, function(err) {
      if (err) {
        Log.error("unzip error", err.message);
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
      throw new Error("Failed to extract FFMPEG binaries:", err.message);
    });
}

function extractFfmpegMacos(file, path) {
  return new Promise(function(resolve, reject) {
    unzip(file, path, function(err) {
      if (err) {
        Log.error("unzip error", err.message);
        reject(err);
      }

      fse.copySync(
        Path.join(
          path,
          Path.basename(file).replace(Path.extname(file), ""),
          "bin",
          "ffmpeg"
        ),
        Path.join(path, "ffmpeg"),
        { overwrite: true }
      );
      fse.copySync(
        Path.join(
          path,
          Path.basename(file).replace(Path.extname(file), ""),
          "bin",
          "ffprobe"
        ),
        Path.join(path, "ffprobe"),
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
      throw new Error("Failed to extract FFMPEG binaries:", err.message);
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
      throw new Error("Failed to extract FFMPEG binaries:", err.message);
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
