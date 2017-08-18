# Video Processing CLI

A command line tool that hides the complexity of ffmpeg to produce a DASH/HLS playlist from a video source.

## Getting started

### Installation

**Requirements**

In order to use the video-processing-cli you need

- FFMPEG version 3.3.3 or above
- [Shaka Packager](https://github.com/google/shaka-packager/releases) version 1.9.6 or above

The binaries can be added to the shell/command line PATH or in a `/bin` folder. 
The `/bin` folder must be in the same working directory where the 
video-processing-cli will be executed.

**Grab the video-processing-cli binary**

Currently there are no pre-built binary that can be downloaded, therefore you need 
to clone/download the repository and follow the instruction in the 
[Development](#development) section.

### Usage

Once grabbed the binary file, you can run it on the shell/command prompt

```bash
$ video-processing-cli-linux <command>
```

where `<command>` is one of the [available commands](#available-commands).

To get the help message with all the available commands, use

```bash
$ video-processing-cli-linux --help
```

If you already know the `<command>`, but not its parameters you could use

```bash
$ video-processing-cli-linux <command> --help
# e.g. video-processing-cli-linux details --help
```

and the list of available arguments and options for the specified command will be listed

## Available commands

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

## Development

The development of the video-processing-cli is done in NodeJS. The dependencies are managed via Yarn.

Before adding some code pull in all the dependencies

```bash
$ yarn
```

(You can alternatively use `npm install`)


### Building

Distributable binary files are generated via PKG.

To generate an executable file for Windows, Linux and MacOS use

```bash
npm run production
```

This will generate three executables in the `/dist` folder. Each one will have a 
suffix based on the operating system it targets.

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

## License

_to be written_
