const ffmpeg = require('../src/helpers/ffmpeg.js');

jest.mock('fs');

describe('initialization with not existing files', () => {
    
    // Applies only to tests in this describe block
    beforeEach(() => {
        require('fs').__setMockFileExistsReturn(false);
    });

    test('ffmpeg refuses non-existing file', () => {
        
        var path = './video.mp4';
        
        expect(() => { new ffmpeg(path) }).toThrow();
    });

    test('ffmpeg refuses file with concatenated command', () => {
        
        var path = './video.mp4; rm -rf ~';
        
        expect(() => { new ffmpeg(path) }).toThrow();
    });
});

describe('initialization with existing files', () => {
    
    // Applies only to tests in this describe block
    beforeEach(() => {
        require('fs').__setMockFileExistsReturn(true);
    });
  
    test('ffmpeg api is returned if file exists', () => {

        var path = './video.mp4';
        var instance = new ffmpeg(path);
        
        expect(instance.thumbnail).not.toBeUndefined();
    });
});

