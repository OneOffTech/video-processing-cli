'use strict';

const Log = require('../helpers/log.js');
const Ffprobe = require('../helpers/ffprobe.js');


/**
 * Get the details of a video file
 * 
 * @param {string} file the video file to inspect
 * @param {Object} command the command being executed (e.g. to get options)
 * @return {Promise}
 */
module.exports = function(file, command){

    try {
        return new Ffprobe(file)
            .then(function(details){ 
                // details is a JSON with all the ffprobe output
                Log.success(details.format.filename, "details");

                Log.info(details.format.format_long_name, "(" + details.format.format_name + ")");
                Log.info("duration", details.format.duration);
                Log.info("size", details.format.size);
                Log.info("bitrate", details.format.bit_rate);
                
                details.streams.forEach(function (value) {
                    if(value.codec_type==='video'){
                        Log.info(value.codec_type, value.codec_name, value.width+'x'+value.height);
                    }
                    else if(value.codec_type==='audio'){
                        Log.info(value.codec_type, value.codec_name, value.sample_rate);
                    }
                    
                });
                process.exit(0);
            })
            .catch(function(err){ 
                Log.error(`Not able to retrieve details from ${file}`);
                Log.error(err.message);
                process.exit(1);
            });
            
    } catch (error) {
        Log.error(error.message);
        process.exit(1);
    }

}
