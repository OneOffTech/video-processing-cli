'use strict';

const Executables = require('./executables');
const exec = require('child_process').exec;
const fs = require('fs');

/**
 * FFMPEG.
 * 
 * Wrapper around ffmpeg binary to process a video
 */
module.exports = function(file){
    
    var default_options = [
        '-i ' + file
    ];

    if(!fs.existsSync(file)){
        throw new Error(`File ${file} don't exists`);
    }

    return {

        /**
         * Generate a thumbnail.
         * 
         * By defuault tries to find the most representative frame of the video
         * 
         * @param {string} output the output path with filename and extension
         * @param {Object} options customize the thumbnail generation. The only supported option is `time`, which specifies the timstamp of the frame to use for the thumbnail
         * @return {Promise}
         */
        thumbnail: function (output, options) {

            var thumbnailOptions = [
                // if time is specified, use the time
                // otherwise let ffmpeg try to find the most representative frame
                // https://superuser.com/questions/538112/meaningful-thumbnails-for-a-video-using-ffmpeg
                options && options.time ? '-ss ' + options.time : '-vf  "thumbnail"',
                '-vframes 1',
                '-y',
            ]
            
            var command = '"' + Executables.ffmpeg() + '" ' + default_options.concat(thumbnailOptions, '"' + output + '"').join(' ');

            return new Promise(function (resolve, reject) {
        
                // using exec as the size of the output buffer should not be a problem for memory comsumption
                var ffmpeg = exec(command, (err, stdout, stderr) => {
                    if (err) {
                        // node couldn't execute the command
                        reject(err);
                        return;
                    }

                    resolve(stdout);
                });
            });
        }

    }
    
};

