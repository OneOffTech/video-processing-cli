'use strict';

/**
 * Video and Audio output presets
 */
module.exports = {

    /**
     * Preset for video scaling to a different resolution
     */
    SCALE_PRESETS : {

        /**
         * 1080p video, Full HD
         * 
         * fixed bitrate of 1500k, audio 2 channels 256k at 48KHz
         */
        V1080 : {
            name: "1080",
            videoBitrate: "3000k",
            videoMaximumBitrate: "5000k",
            videoBufferSize: "3000k",
            videoScale: "-1:1080",
            audioFrequency: 96000,
            audioCodec: "aac",
            audioChannels: 2,
            audioBitrate: "384k"
        },

        /**
         * 720p video, HD Ready
         * 
         * fixed bitrate of 1500k, audio 2 channels 256k at 48KHz
         */
        V720 : {
            name: "720",
            videoBitrate: "1500k",
            videoMaximumBitrate: "1500k",
            videoBufferSize: "1000k",
            videoScale: "-1:720",
            audioFrequency: 48000,
            audioCodec: "aac",
            audioChannels: 2,
            audioBitrate: "256k"
        },
        
        /**
         * 540p video, Mobile Medium Bandwith
         * 
         * fixed bitrate of 800k, audio 2 channels 128k at 44.1KHz
         */
        V540 : {
            name: "540",
            videoBitrate: "800k",
            videoMaximumBitrate: "800k",
            videoBufferSize: "500k",
            videoScale: "-1:540",
            audioFrequency: 44100,
            audioCodec: "aac",
            audioChannels: 2,
            audioBitrate: "128k"
        },
        
        /**
         * 360p video, Mobile Low Bandwith
         * 
         * fixed bitrate of 400k, audio 2 channels 128k at 22.05KHz
         * */
        V360 : {
            name: "360",
            videoBitrate: "400k",
            videoMaximumBitrate: "400k",
            videoBufferSize: "400k",
            videoScale: "-1:360",
            audioFrequency: 22050,
            audioCodec: "aac",
            audioChannels: 2,
            audioBitrate: "128k"
        }
    },

    /**
     * Default DASH streaming configuration
     * 
     * uses a 3 seconds window
     */
    DASH_DEFAULT: {
        minBufferTime: 3, // seconds
        segmentDuration: 3, // seconds
        noAudio: false
    } 
    
};

