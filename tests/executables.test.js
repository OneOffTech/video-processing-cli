const Executables = require('../src/helpers/executables.js');
const isWindows = require('os').platform().match(/win(32|64)/);
const path = require('path');
const fs = require('fs');

var cwd = process.cwd().match(/tests/) ? path.dirname(process.cwd()) : process.cwd();

beforeEach(() => {
    // change the current directory to the original root location
    // as some tests change it to simulate different execution 
    // scenarios
    return new Promise(function (resolve, reject) {
        process.chdir(cwd);
        resolve();
    })
});

// module definition 

test('ffprobe functions is defined', () => {
    expect(Executables.ffprobe).not.toBeUndefined();
});

test('ffmpeg functions is defined', () => {
    expect(Executables.ffmpeg).not.toBeUndefined();
});

// ffprobe function

test('ffprobe is found in bin folder', () => {

    var filePath = isWindows ? './bin/ffprobe.exe' : './bin/ffprobe';
    
    // generate a file that matches the expected binary name
    // but only if is not existing yet
    if(!fs.existsSync(filePath)){
        fs.closeSync(fs.openSync(filePath, 'w'));
    }

    expect(Executables.ffprobe()).toBe(filePath);

});

test('ffprobe is not found', () => {
    
    // changing directory to simulate a location without the bin sub-folder
    process.chdir('./tests');

    expect(() => { Executables.ffprobe() }).toThrow();
});

// ffmpeg function

test('ffmpeg is found in bin folder', () => {
    
    var filePath = isWindows ? './bin/ffmpeg.exe' : './bin/ffmpeg';
    
    // generate a file that matches the expected binary name
    // but only if is not existing yet
    if(!fs.existsSync(filePath)){
        fs.closeSync(fs.openSync(filePath, 'w'));
    }

    expect(Executables.ffmpeg()).toBe(filePath);

});

test('ffmpeg is not found', () => {
    
    // changing directory to simulate a location without the bin sub-folder
    process.chdir('./tests');

    expect(() => { Executables.ffmpeg() }).toThrow();
});

