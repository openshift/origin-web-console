'use strict';

const fs = require('fs');

// for debugging only
exports.take = (savePath) => {
  return browser.takeScreenshot().then((png) => {
    let stream = fs.createWriteStream(savePath || '/tmp/origin-web-console-e2e-screenshot.png');
    stream.write(new Buffer(png, 'base64'));
    stream.end();
  });
};
