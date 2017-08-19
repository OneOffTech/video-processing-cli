'use strict';

const path = require('path');

const fs = jest.genMockFromModule('fs');

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
let mockReturn = Object.create(null);

function __setMockFileExistsReturn(value) {
  mockReturn = value;
}

// A custom version of `existsSync` that reads from the special mocked out
// return value set via __setMockFileExistsReturn
function existsSync(file) {
  return mockReturn !== null ? mockReturn : true;
}

fs.__setMockFileExistsReturn = __setMockFileExistsReturn;
fs.existsSync = existsSync;

module.exports = fs;