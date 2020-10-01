#!/usr/bin/env node
const puppeteer = require('puppeteer');
const fs = require('fs');
const ora = require('ora');

const website = process.argv[2];

async function getResources(website) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const resourcesSpinner = ora(`Getting resources for ${website}`).start();
  await page.goto(website, { waitUntil: 'networkidle2' });
  // get resources
  //console.log("\n==== performance.getEntriesByType('resource') ====\n");
  const resources = await page.evaluate(() => JSON.stringify(performance.getEntriesByType('resource'), null, "  "));
  // console.log('RESOURCES', JSON.parse(resources));
  browser.close();
  resourcesSpinner.succeed(`Got resources for ${website}`);
  const writingSpinner = ora('Writing resources to results.json...').start()
  // write resources to resources.json
  fs.writeFile('resources.json', resources, function (err) {
    if (err) {
      writingSpinner.fail('Resources could not be written');
      console.log(err);
    }
    writingSpinner.succeed(`Resources for ${website} saved to resources.json`);
  });
}

getResources(website);
