[![Build Status](https://travis-ci.org/OneOffTech/video-processing-cli.svg?branch=master)](https://travis-ci.org/OneOffTech/video-processing-cli)

# Video Processing CLI

A command line tool that hides the complexity of ffmpeg to produce a [Dynamic Adaptive Streaming over HTTP (DASH)](https://en.wikipedia.org/wiki/Dynamic_Adaptive_Streaming_over_HTTP) playlist from a video source.

**features**

* [x] Extract video metadata
* [x] Generate thumbnail (or cover image) from a video file
* [x] Generate low resolution version of a video file
* [x] Generate a DASH manifest for video streaming
* [ ] Generate a HLS playlist for video streaming

**supported Operating Systems**

- Windows
- Debian based Linux distributions, e.g. Debian, Ubuntu
- MacOS (on Intel)

The binaries are generated for 64 bit version of the OS

## Getting started

### Installation

**Requirements**

In order to use the video-processing-cli you need

- [FFMPEG](https://ffmpeg.org/) version 3.3.3 or above
- [Shaka Packager](https://github.com/google/shaka-packager/releases) version 1.6.2 or above

The binaries can be added to the shell/command line PATH or in a `bin` folder. 
The `bin` folder must be in the same working directory where the 
video-processing-cli will be executed.

**Grab the video-processing-cli binary**

Prebuilt binaries are available for Windows, MacOS and Linux. All binaries are for 64bit architecture.

Binaries are automatically built for each tagged release. 
[Download the latest `master` binaries](https://github.com/OneOffTech/video-processing-cli/releases)

Alternatively a docker image is available, see [Usage via Docker](#via-docker-image).

**Fetching the requirements**

If you don't have already FFMPEG and Shaka Packager on your system, you can run

```bash
$ video-processing-cli fetch:binaries
```

This will download the standalone, statically linked, binaries. 
The downloaded version is based on your Operating System and architecture (32 or 64 bit).

> A note for **MacOS** users: we currently don't support the automated download of FFMPEG. Pull requests are accepted.

### Usage

#### via Executable file

Once grabbed the binary file, and saved as `video-processing-cli`, you can run it on the shell/command prompt

```bash
$ video-processing-cli <command>
```

where `<command>` is one of the [available commands](#available-commands).

To get the help message with all the available commands, use

```bash
$ video-processing-cli --help
```

If you already know the `<command>`, but not its parameters you could use

```bash
$ video-processing-cli <command> --help
# e.g. video-processing-cli details --help
```

and the list of available arguments and options for the specified command will be listed

#### via Docker image

A packaged version, in the form of a Docker image, is available. 
The image is hosted at `docker.klink.asia`

```bash
docker pull docker.klink.asia/images/video-processing-cli:latest
```

The image is configured with the `video-processing-cli` executable as the entry point. 
The working directory is `/video-processing-cli`.

Running

```bash
docker run --rm docker.klink.asia/images/video-processing-cli:latest
```

will output the help message.

To execute the other commands mount a volume with your videos and use one of the [available commands](#available-commands)

```bash
docker run --rm -v "./source:/video-processing-cli/videos" \ 
                   docker.klink.asia/images/video-processing-cli:latest <command>
```

## Available commands

- [`details` (or `info`)](#details-or-info)
- [`thumbnail`](#thumbnail)
- [`process`](#process)
- [`fetch:binaries`](#fetchbinaries)
- [`transcode`](#transcode)
- [`pack`](#pack)

### `details` (or `info`)

Extract information about a video file. Extracted information includes codecs, resolution, duration,...

```bash
details <file>
```

The command is also available with the alias `info`.

**Arguments**

- `file` the path of the video file

**Output**

The output will be written on the standard output in a multi-line fashion

**Errors**

In case of processing error a message will be written on standard error. 

A typical error might be "File not found" if the specified file path contains an error.

**Example**

```bash
$ video-processing-cli details video.mp4
```

The output is similar to

```
video.mp4
QuickTime / MOV (mov,mp4,m4a,3gp,3g2,mj2)
duration 0:00:28.148300
size 60.267055 Mibyte
bitrate 17.960469 Mbit/s
video h264 1920x1080
audio aac 48 KHz
```

### `thumbnail`

Extract information about a video file. Extracted information includes codecs, resolution, duration,...

```bash
thumbnail <file> <output_path>
```

**Arguments**

- `file` the video file path
- `output_path` the existing folder in which the thumbnail will be saved

**Options**

- `--format <format>` the format of the thumbnail, available formats are `png` and `jpg`
- `--out <name>` the name (with extension) of the file thumbnail

**Output**

The output will be written, by default, in a file named with the original video name and with extension `png`.

**Errors**

In case of processing error a message will be written on standard error. 

**Example**

```bash
$ video-processing-cli thumbnail ./videos/video.mp4 ./videos/covers/
```

The output is a file called `video.png` in the `./videos/covers/` folder.

### `process`

Generates a DASH manifest for "streaming" a video file. 

While generating the playlist it also generates different downscaled versions of the original video files. This downscaled versions will be used by the player to select the appropriate stream to play. More information on the processing can be found in the [Video Processing](#video-processing) section.

The original video file will not be touched or moved.

```bash
process <file> <output_path>
```

**Arguments**

- `file` the video file path
- `output_path` the existing folder in which the artifacts will be saved

**Output**

The output is a set of video files whose name is the same of the original video, but suffixed with the frame height and a `mpd` file named the same as the source video.

**Errors**

In case of processing error a message will be written on standard error. 

**Example**

```bash
$ video-processing-cli process ./videos/video.mp4 ./videos/
```

### `fetch:binaries`

Download the statically linked binaries for FFMPEG and Shaka Packager.

**Output**

Binary files will be saved in `./bin`

**Errors**

In case of processing error a message will be written on standard error. 

**Example**

```bash
$ video-processing-cli fetch:binaries
```
### `transcode`

Transcode a video to a different format/resolution according to the selected preset. 

The original video file will not be touched or moved.

```bash
transcode [--preset auto] <file> [output_path]
```

**Arguments**

- `file` the video file path
- `output_path` the existing folder in which the transcoded video will be saved

**Options**

- `-p, --preset [name]` the [preset](./src/helpers/presets.js) to use, default `auto`

**Output**

The output is a video file, whose name is the same of the original video suffixed with the name of the preset, e.g. `./videos/video-720.mp4`.

**Errors**

In case of processing error a message will be written on standard error. 

**Example**

```bash
$ video-processing-cli transcode -p V720 ./videos/video.mp4 ./videos/
```

### `pack`

Pack different video resolutions into a DASH playlist for streaming.


```bash
pack [--name mpd_name] [--out folder] <files>
```

**Arguments**

- `files` the video files to use for playback

**Options**

- `-o, --out [path]` the folder in which the playlist and elaborated videos should be saved
- `-n, --name [name]` the name to use for the MPD playlist file

**Output**

The output is a MPD file, followed by a variant numbers of mp4 files containing the splitted video and audio tracks, that are referenced for streaming.
The original video files will not be touched or moved.

**Errors**

In case of processing error a message will be written on standard error. 

**Example**

```bash
$ video-processing-cli pack --name video ./videos/video-360.mp4 ./videos/video-540.mp4
```

## Video Processing

The main aim of the processing pipeline is to generate a manifest for a video player, respecting the DASH and HLS specifications, to enable the playback of the video file on different devices and according to the available bandwidth.

The first part of the pipeline take the video file and produce downscaled versions of it. The number of downscaled versions depends on the original resolution of the video source.

In general the output are 1080p (Full HD), 720p (HD Ready), 540p and 360p for mobile with constrained bandwidth. In case the video source is not Full HD, it will not be upscaled and the maximum resolution for the video will be the same of the closest preset, e.g. if the video has a 840px height, the final height will be 720px. The aspect ratio is respected.

After the conversion the DASH playlist manifest is generated with a 3 seconds segment duration, so the player can switch the video from one resolution to the other every 3 seconds.

In the DASH playlist audio and video streams are separated.

## Development

The development of the video-processing-cli is done in NodeJS. The dependencies are managed via NPM.

Before adding some code pull in all the dependencies

```bash
$ npm install
```

### Building

#### the cross platform binary

Distributable binary files are generated via [PKG](https://github.com/zeit/pkg).

To generate an executable file for Windows, Linux and MacOS use

```bash
npm run production
```

This will generate three executables in the `/dist` folder. Each one will have a 
suffix based on the operating system it targets.

#### the Docker image

You can build the Docker image via

```bash
docker build -t video-processing-cli .
```

The image is built via a [multi-stage build](https://docs.docker.com/engine/userguide/eng-image/multistage-build/), therefore Docker `>= 17.05` is required.

### Running unit tests

To prevent regressions in some areas of the code, we use unit tests based 
on [Jest](https://facebook.github.io/jest/). Everytime you change something is 
encouraged to execute (and complement) the unit tests.

You can run unit tests in two ways: all the test suite or in watch mode based on 
changed files.

To run all the unit tests execute

```bash
npm run test
```

To continuously run the unit tests based on changed files execute

```bash
npm run test:watch
```

## Contributing

Thank you for considering contributing to the Video Processing CLI!

The contribution guide is not available yet, but in the meantime you can still submit Pull Requests.

## License

This project is licensed under the MIT license, see [LICENSE.txt](./LICENSE.txt).

## Credits

The video used in the tests is [Aerial shot of mountain and ocean](https://videos.pexels.com/videos/aerial-shot-of-mountain-and-ocean-1469)
