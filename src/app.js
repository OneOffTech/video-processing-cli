/**
 * Video Processing CLI.
 * A wrapper around ffmpeg (and some other tools) to produce a DASH/HLS playlist 
 * of a given video file
 * 
 * @author Alessio Vertemati (alessio@oneofftech.xyz)
 */

'use strict';

const program = require('commander');
const Log = require('./helpers/log');

// commands
const DetailsCommand = require('./commands/details');
const ThumbnailCommand = require('./commands/thumbnail');
const ProcessCommand = require('./commands/process');

program.version('0.0.0')
    .on('--help', function() {
        // add the what's new section to the --help output
        Log.comment('  What\'s new in', program.version(), ':');
        Log.comment();
        Log.comment('   - First iteration of the Video Processing CLI');
        Log.comment();
    });

program
    .command('details <file>')
    .alias('info')
    .description('Extract the details from the video <file>')
    .action(DetailsCommand)
    .on('--help', function() {
        Log.text('  Arguments:');
        Log.text();
        Log.text('    <file> the video file to extract details from (required)');
        Log.text();
    });

program
    .command('thumbnail <file> <thumbnail_path>')
    .option('-f, --format [type]', 'The format in which the thumbnail will be saved (png|jpg) [png].', 'png')
    .option('-o, --out [name]', 'The name of the thumbnail file. By default is the same name of the video file.')
    .description('Generate a thumbnail (or poster image) from a video <file> into <thumbnail_path>')
    .action(ThumbnailCommand)
    .on('--help', function() {
        Log.text('  Arguments:');
        Log.text();
        Log.text('    <file> the video file to generate the thumbnail for (required)');
        Log.text('    <thumbnail_path> where to save the thumbnail (required)');
        Log.text();
    });

program
    .command('process <file> <path>')
    .alias('streamify')
    .alias('stream')
    .description('Generate a DASH/HLS manifest, with scaled video resolutions, from a video <file> into <path>')
    .action(ProcessCommand)
    .on('--help', function() {
        Log.text('  Arguments:');
        Log.text();
        Log.text('    <file> the video file to generate the thumbnail for (required)');
        Log.text('    <thumbnail_path> where to save the thumbnail (required)');
        Log.text();
    });


program.parse(process.argv);

// output the help if no command is specified
if (!program.args.length) program.help();
