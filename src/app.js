/**
 * Video Processing CLI.
 * A wrapper around ffmpeg (and some other tools) to produce a DASH/HLS playlist 
 * of a given video file
 * 
 * @author Alessio Vertemati <alessio@oneofftech.xyz>
 */

"use strict";

const program = require("commander");
const Log = require("./output/consoleOutput");

// commands
const Command = require("./commands/command");
const DetailsCommand = require("./commands/details");
const ThumbnailCommand = require("./commands/thumbnail");
const ProcessCommand = require("./commands/process");
const EncodeCommand = require("./commands/encode");
const PackCommand = require("./commands/pack");
const FetchBinariesCommand = require("./commands/fetch-binaries");

program.version("0.5.2").on("--help", function() {
  // add the what's new section to the --help output
  Log.comment();
  Log.comment("  What's new in", program.version());
  Log.comment();
  Log.comment(
    "   - Fixed metadata reading before scaling a video when using the process command"
  );
  Log.comment("   - Fixed scaling output handling in the process command");
  Log.comment();
});

program
  .command("details <file>")
  .alias("info")
  .option("-j, --json", "Output the video details in a JSON object.")
  .description("Extract the details from the video <file>")
  .action(Command.wrap(DetailsCommand))
  .on("--help", function() {
    Log.text("  Arguments:");
    Log.text();
    Log.text("    <file> the video file to extract details from (required)");
    Log.text();
  });

program
  .command("thumbnail <file> <path>")
  .option(
    "-f, --format [type]",
    "The format in which the thumbnail will be saved (png|jpg) [png].",
    "png"
  )
  .option(
    "-o, --out [name]",
    "The name of the thumbnail file. By default is the same name of the video file."
  )
  .description(
    "Generate a thumbnail (or poster image) from a video <file> into <path>"
  )
  .action(Command.wrap(ThumbnailCommand))
  .on("--help", function() {
    Log.text("  Arguments:");
    Log.text();
    Log.text(
      "    <file> the video file to generate the thumbnail for (required)"
    );
    Log.text("    <path> where to save the thumbnail (required)");
    Log.text();
  });

program
  .command("process <file> <path>")
  .alias("streamify")
  .alias("stream")
  .description(
    "Generate a DASH/HLS manifest, with scaled video resolutions, from a video <file> into <path>"
  )
  .action(Command.wrap(ProcessCommand))
  .on("--help", function() {
    Log.text("  Arguments:");
    Log.text();
    Log.text(
      "    <file> the video file to generate the thumbnail for (required)"
    );
    Log.text("    <thumbnail_path> where to save the thumbnail (required)");
    Log.text();
  });

program
  .command("encode <file> [path]")
  .alias("transcode")
  .option(
    "-p, --preset [names]",
    "The presets to use for encoding (V1080|V720|V540|V480|V360|auto) [auto].",
    "auto"
  )
  .description("Transcode a video according to the specified preset")
  .action(Command.wrap(EncodeCommand))
  .on("--help", function() {
    Log.text("  Arguments:");
    Log.text();
    Log.text(
      "    <file> the video file to generate the thumbnail for (required)"
    );
    Log.text("    <thumbnail_path> where to save the thumbnail (required)");
    Log.text();
  });

program
  .command("pack <files...>")
  .option(
    "-o, --out [path]",
    "The path in which the output will be saved. Default the same folder as the first video."
  )
  .option("-n, --name [name]", "The filename of the DASH mpd file.")
  .description(
    "Pack different video resolutions into a DASH playlist for streaming"
  )
  .action(Command.wrap(PackCommand))
  .on("--help", function() {
    Log.text("  Arguments:");
    Log.text();
    Log.text("    <files> the videos file to pack into a Dash playlist");
    Log.text();
  });

program
  .command("fetch:binaries")
  .alias("fetch:dependencies")
  .alias("install")
  .description("Download the required FFMPEG and Shaka Packager binaries")
  .action(FetchBinariesCommand);

program.parse(process.argv);

// output the help if no command is specified
if (!program.args.length) program.help();
