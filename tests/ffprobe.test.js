const Ffprobe = require('../src/helpers/ffprobe.js');

test('ffprobe refuses non-existing file', () => {
    
    var path = './video.mp4';

    expect(() => { new Ffprobe(path) }).toThrow();
});

test('ffprobe refuses file with concatenated command', () => {
    
    var path = './video.mp4; rm -rf ~';

    expect(() => { new Ffprobe(path) }).toThrow();
});

