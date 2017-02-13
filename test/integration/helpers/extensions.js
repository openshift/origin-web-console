'use strict';

const fs = require('fs');
const path = require('path');

// unfortunately we have to modify the file stored in .tmp/extensions.js
// since our tests run after grunt does its its copy/build step.
let filePath = path.join(__dirname, '../../../.tmp', 'scripts');
let fileName = path.join(filePath, 'extensions.js');
// a cache of the first read so we can reset easily
let cacheFileContents;

let read = (fileName, cb) => {
  return fs.readFile(fileName, 'utf-8', cb);
};

let write = (fileName, contents, cb) => {
  return fs.writeFile(fileName, contents, 'utf-8', cb);
};

// creates a cache of the .tmp/extensions.js file.
// NOTE: addExtension() will also cache the first file read if it has never yet been cached.
exports.cacheCurrentExtensions = () => {
  read(fileName, (readErr, fileContents) => {
    cacheFileContents = fileContents;
    if(readErr) {
      console.log('cacheCurrentExtensions() read error:', readErr);
      return;
    }
  });
};

// to use: a template literal is probably the easiest way to provide JS to inject into the
// extensions.js file.  Please wrap in IIFE as addExtension() may be called multiple times &
// the file contents will be concatenated:
//    var jsToWrite = `
//    (function() {
//      // createFromURL test file ${testTime} // (can use interpolation))
//      window.OPENSHIFT_CONSTANTS.CREATE_FROM_URL_WHITELIST = ['openshift', 'template-dumpster'];
//    })();
//    `;
// adding to the extension.js file:
//    addExtension(jsToWrite)
exports.addExtension = (fileContents) => {
  read(fileName, (readErr, originalFile) => {
    if(!cacheFileContents) {
      cacheFileContents = originalFile;
    }
    if(readErr) {
      console.log('addExtension() read error:', readErr);
      return;
    }
    write(fileName, originalFile + fileContents, (writeErr) => {
      if(writeErr) {
        console.log('addExtension() write error:', writeErr);
        return;
      }
    });
  });
};

// sets the .tmp/extensions.js file either back to the original contents, or wipes it clean.
exports.resetExtensions = () => {
  write(fileName, cacheFileContents || '', (writeErr) => {
    if(writeErr) {
      console.log('resetExtensions() write error:', writeErr);
    }
  });
};
