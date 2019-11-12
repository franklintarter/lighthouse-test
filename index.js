#! /usr/bin/env node

const Mocha = require('mocha');
const fs = require('fs');
const path = require('path');

const mocha = new Mocha();

const testDir = path.join(__dirname, 'tests');

fs.readdirSync(testDir)
  .filter((file) => file.substr(-3) === '.js')
  .forEach((file) => {
    mocha.addFile(path.join(testDir, file));
  });

mocha.run((failures) => {
  process.exitCode = failures ? 1 : 0;
});
