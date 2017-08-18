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


program.parse(process.argv);
