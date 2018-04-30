"use strict";

/**
 * Video and Audio output presets
 */
module.exports = {
  /**
     * Preset for video scaling to a different resolution
     */
  SCALE_PRESETS: {
    /**
     * 1080p video, Full HD
     * 
     * fixed bitrate of 1500k, audio 2 channels 256k at 48KHz
     */
    V1080: {
      name: "1080",
      videoBitrate: "3000k",
      videoMaximumBitrate: "5000k",
      videoBufferSize: "3000k",
      videoScale: "-2:1080",
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
    V720: {
      name: "720",
      videoBitrate: "1500k",
      videoMaximumBitrate: "1500k",
      videoBufferSize: "1000k",
      videoScale: "-2:720",
      audioFrequency: 48000,
      audioCodec: "aac",
      audioChannels: 2,
      audioBitrate: "256k"
    },

    /**
     * 540p video, Mobile Medium+ Bandwith
     * 
     * fixed bitrate of 800k, audio 2 channels 128k at 44.1KHz
     */
    V540: {
      name: "540",
      videoBitrate: "800k",
      videoMaximumBitrate: "800k",
      videoBufferSize: "500k",
      videoScale: "-2:540",
      audioFrequency: 44100,
      audioCodec: "aac",
      audioChannels: 2,
      audioBitrate: "128k"
    },

    /**
     * 480p video, Mobile Medium- Bandwith
     * 
     * fixed bitrate of 600k, audio 2 channels 128k at 44.1KHz
     */
    V480: {
      name: "480",
      videoBitrate: "600k",
      videoMaximumBitrate: "800k",
      videoBufferSize: "500k",
      videoScale: "-2:480",
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
    V360: {
      name: "360",
      videoBitrate: "400k",
      videoMaximumBitrate: "400k",
      videoBufferSize: "400k",
      videoScale: "-2:360",
      audioFrequency: 22050,
      audioCodec: "aac",
      audioChannels: 2,
      audioBitrate: "128k"
    },

    /**
     * Select the preset to use according to
     * - video vertical resolution 
     * - medium resolution
     * In case the video height is less or equal to 360px, the V360 preset is returned
     */
    auto: function(videoHeight) {
      if (videoHeight >= 720) {
        return this.V540;
      } else if (videoHeight >= 540) {
        return this.V480;
      }
      return this.V360;
    },

    exists: function(key) {
      return this[key] !== undefined;
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
