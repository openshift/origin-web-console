// Latest Firefox is not compatible with old selenium versions

var pconfig = require('protractor/config.json');

pconfig.webdriverVersions.selenium = '2.53.0';

require('fs').writeFile(
  'node_modules/protractor/config.json', JSON.stringify(pconfig)
); 