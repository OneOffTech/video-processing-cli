const ffmpeg = require('../src/helpers/ffmpeg.js');

test('ffmpeg refuses non-existing file', () => {
    
    var path = './video.mp4';

    expect(() => { new ffmpeg(path) }).toThrow();
});

test('ffmpeg refuses file with concatenated command', () => {
    
    var path = './video.mp4; rm -rf ~';

    expect(() => { new ffmpeg(path) }).toThrow();
});

