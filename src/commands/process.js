'use strict';

const Log = require('../helpers/log.js');
const Ffmpeg = require('../helpers/ffmpeg.js');
const Dash = require('../helpers/dash.js');
const Ffprobe = require('../helpers/ffprobe.js');
const Presets = require('../helpers/presets.js');
const Path = require('path');
const fs = require('fs');


/**
 * Generate DASH/HLS manifest for streaming a video file
 * 
 * @param {string} file the video file
 * @param {string} path the location where the outputs will be saved
 * @param {Object} command the command being executed (e.g. to get options)
 * @return {Promise}
 */
module.exports = function(file, path, command){
    
    try {

        // file output path and format
        
        var outname = Path.basename(file, Path.extname(file)) + '-%resolution%.mp4';
        
        var outfile = Path.join(path, outname);

        var process = new Ffmpeg(file);
        var probe = new Ffprobe(file);

        
        

        // if video is Full HD, use all presets
        // if video is 720 use only 540p and 360p... and so on
        // grab the video resolution before and then enqueue the 
        // various scale options based on the video resolutio (only downscale)

        return probe.then(function(details){

            Log.comment('Grabbed video source details. Start scaling down');

            var videoStream = null;
            var hasAudioStream = false;

            details.streams.forEach(function(s){
                if(s.codec_type==='video' && !videoStream){
                    videoStream = s;
                }
                if(s.codec_type==='audio' && !hasAudioStream){
                    hasAudioStream = true;
                }
            });

            if(videoStream==null){
                throw new Error('No video stream found');
            }

            var scalingSettings = null;

            if(videoStream.height >= 1080){
                scalingSettings = [
                    Presets.SCALE_PRESETS.V720,
                    Presets.SCALE_PRESETS.V540,
                    Presets.SCALE_PRESETS.V360
                ];
            }
            else if(videoStream.height >= 720){
                scalingSettings = [
                    Presets.SCALE_PRESETS.V540,
                    Presets.SCALE_PRESETS.V360
                ];
            }
            else if(videoStream.height >= 540){
                scalingSettings = [
                    Presets.SCALE_PRESETS.V360
                ];
            }
            else {
                // resolution too low, no scaling
                scalingSettings = [];
                Log.comment(`Vertical resolution ${videoStream.height} is below 540, so no scaling preset is selected.`);
            }
            
            // TODO: keep in mind that one scaling might fail, hence the promise will fail, but 
            //       the ffmpeg execution of the others is still in progress and will not be tracked


            return Promise.all(scalingSettings.map(function(v){
                    return process.scale(outfile, v);   
                }))
                .then(function(values){
                    // console.log(values);
                    Log.success("Scaling of video completed", values.join(', '));

                    Log.info('Generating DASH manifest');

                    var mdpOutput = Path.join(path, Path.basename(file, Path.extname(file)));


                    var dashOptions = Presets.DASH_DEFAULT;

                    dashOptions.noAudio = !hasAudioStream;

                    // now is the packager turn
                    return new Dash().generate([file].concat(values), mdpOutput, dashOptions)
                        .then(function(){
                            Log.success('MDP manifest generated');
                            values.forEach(function(f){
                                fs.unlinkSync(f);
                            });
                        });
                });

        })
        .catch(function(err){ 
            Log.error(`Not able to process ${file}`, err.message);
            console.error(err);
        });
            
    } catch (error) {
        Log.error(error.message);
        process.exit(1);
    }

}
