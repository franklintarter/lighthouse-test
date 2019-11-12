/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
/* global after, it, describe, before */
const { assert } = require('chai');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const Table = require('cli-table');
const config = require('./config');

const table = new Table();

const LIGHTHOUSE_MIN_SCORE = (Number(process.argv[3]) || 90) / 100;
const LIGHTHOUSE_URL = process.argv[2] || 'http://localhost:9000';

function launchChromeAndRunLighthouse(url, opts, conf = null) {
  return chromeLauncher
    .launch({ chromeFlags: opts.chromeFlags })
    .then((chrome) => {
      opts.port = chrome.port;
      return lighthouse(url, opts, conf).then((res) => chrome.kill().then(() => res.lhr));
    });
}

const opts = {
  chromeFlags: [
    '--disable-extensions',
    '--disable-background-networking',
    '--disable-sync',
    '--disable-default-apps',
  ],
};

describe('Lighthouse PWA Testing', function () {
  this.timeout(50000);
  let results;
  before('run base test', (done) => {
    launchChromeAndRunLighthouse(LIGHTHOUSE_URL, opts, config.lighthouse).then(
      (res) => {
        results = Object.keys(res.categories).reduce((merged, category) => {
          merged[category] = res.categories[category].score;
          return merged;
        }, {});
        done();
      },
    );
  });

  it(`should have performance score greater than ${LIGHTHOUSE_MIN_SCORE}`, (done) => {
    assert.equal(results.performance > LIGHTHOUSE_MIN_SCORE, true);
    done();
  });
  it(`should have accessibility score greater than ${LIGHTHOUSE_MIN_SCORE}`, (done) => {
    assert.equal(results.accessibility > LIGHTHOUSE_MIN_SCORE, true);
    done();
  });
  it(`should have best practices score greater than ${LIGHTHOUSE_MIN_SCORE}`, (done) => {
    assert.equal(results['best-practices'] > LIGHTHOUSE_MIN_SCORE, true);
    done();
  });
  it(`should have seo score greater than ${LIGHTHOUSE_MIN_SCORE}`, (done) => {
    assert.equal(results.seo > LIGHTHOUSE_MIN_SCORE, true);
    done();
  });
  it(`should have pwa score greater than ${LIGHTHOUSE_MIN_SCORE}`, (done) => {
    assert.equal(results.pwa > LIGHTHOUSE_MIN_SCORE, true);
    done();
  });

  after(() => {
    Object.keys(results).forEach((category) => {
      table.push([category, Math.round(results[category] * 100)]);
    });
    // eslint-disable-next-line no-console
    console.log(table.toString());
  });
});
