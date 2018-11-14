# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/0.3.0/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

### Fixed

- Await of metadata reading before scaling a video using a preset when using the `process` command

## [0.5.1] - 2018-08-27

### Fixed

- Chunck download of FFMpeg release

## [0.5.0] - 2018-08-23

### Added

- `transcode` command to transcode a video to a different format/resolution according to the selected preset.
- `pack` command to create a DASH manifest from video files

### Changed

- FFMPEG is always invoked with `-threads 1` to limit the CPU usage
- Update to FFMPEG 3.3.4

### Deprecated

- `process` command. The command can potentially use all system resources. The commands `transcode` and `pack` split the actions performed by `process` enabling the developer to better control the system resources
- `log.js` helper, use `src/output/consoleOutput.js` instead

## [0.4.0] - 2018-01-22

### Changed

- License from AGPL to MIT
- Move to Node 8

## [0.3.1] - 2017-11-20

### Changed

- Videos with a vertical resolution lower than 360px are not supported

### Fixed

- Processing also 360p videos to before generating DASH manifest

## [0.3.0] - 2017-10-14

## Added

- 1080p video conversion preset

## Changed

- Videos with height >= 1080 will now be re-encoded also with the 1080p preset
- The original video is not passed anymore to the shaka packager


## [0.2.0] - 2017-09-27

## Added

- JSON output for `details` command

### Fixed

- Handling video with no audio stream in the dash elaboration
- Handling of videos with height less then 360 pixels during dash elaboration

## [0.1.0] - 2017-09-19

### Added 

- Ability to extract details from a mp4 video file
- Thumbnail generation of a video file
- Processing of a video file for streaming purposes using DASH
- Command to download required dependencies
