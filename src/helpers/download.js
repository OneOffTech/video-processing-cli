'use strict';

const url = require('url');
const https = require('follow-redirects').https;
const fs = require('fs');

/**
 * Download a file from HTTP into a local file.
 * 
 * @param {string} fileUrl the url of the file to download
 * @param {string} path the absolute path, with filename and extension, where the file will be downloaded
 * @return {Promise}
 * 
 * @author Andrey Tkachenko https://gist.github.com/falkolab
 * @author Alessio Vertemati
 * @link https://gist.github.com/falkolab/f160f446d0bda8a69172
 */
module.exports = function download(fileUrl, path) {
    var p = url.parse(fileUrl),           
        timeout = 10000; 

    if(fs.existsSync(path)){
        return Promise.resolve(path, true);
    }
    
    var file = fs.createWriteStream(path);

    return new Promise(function(resolve, reject){
        
        var timeout_wrapper = function( req ) {
            return function() {
                req.abort();
                reject("File transfer timeout!");
            };
        };
        
        var request = https.get(fileUrl).on('response', function(res) { 
            var len = res.headers['content-length'] ? parseInt(res.headers['content-length'], 10) : -1;
            var downloaded = 0;
            
            res.on('data', function(chunk) {
                file.write(chunk);
                downloaded += chunk.length;
                clearTimeout( timeoutId );
                timeoutId = setTimeout( fn, timeout );
            }).on('end', function () {
                // clear timeout
                clearTimeout( timeoutId );
                file.end();
                resolve(path);
            }).on('error', function (err) {
                // clear timeout
                clearTimeout( timeoutId );                
                reject(err.message);
            });           
        });
        
        // generate timeout handler
        var fn = timeout_wrapper( request );
        
        // set initial timeout
        var timeoutId = setTimeout( fn, timeout );
    });
};

