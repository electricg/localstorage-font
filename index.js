const fs = require('fs');
const fontStore = require('font-store/lib/fontStore');

const utils = require('./src/utils');

const {
  ff,
  generateGoogleUrls,
  generateMd5,
  generateLocals,
  addDisplayGoogleFonts
} = utils;

const googleOptions = { format: 'woff' };
const googleUrl = 'https://fonts.googleapis.com/css?family=';
const config = require('./config');
const inputFolder = 'input/';
const outputFolder = 'output/';

const doIt = (config, googleOptions, googleUrl, inputFolder) => {
  const { google = [], local = [] } = config;
  const url = generateGoogleUrls(google, googleUrl);
  const localFonts = generateLocals(local, inputFolder);

  fontStore(url, googleOptions, (err, fileName, json) => {
    if (err) {
      console.log('Oops. An error occurred:', err.message);
      process.exit(1);
    }

    const { value } = json;
    const valueWithDisplay = addDisplayGoogleFonts(value, google);

    const newValue = `${valueWithDisplay}${localFonts}`;
    const newMd5 = generateMd5(newValue);
    const newJson = { md5: newMd5, value: ff(newValue) };
    const newFilename = ['ff-fonts', newMd5, 'json'].join('.');

    fs.unlinkSync(fileName);
    fs.writeFileSync(`${outputFolder}${newFilename}`, JSON.stringify(newJson));

    console.log(newMd5);
  });
};

doIt(config, googleOptions, googleUrl, inputFolder);
