#!/usr/bin/env node

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { promises } from 'fs'

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Parse command-line arguments
const args = process.argv.slice(2);

const filePath = args[0] 

const outputPath = args[1] || filePath + '.png'

// Path to your front-end code (e.g., an HTML file or JavaScript file)
const frontendCodePath = path.resolve(__dirname, '../index-min.html');

console.log(frontendCodePath);

(async () => {
  try {
    const comic = await promises.readFile(filePath, { encoding: 'utf8' })
    // Launch a headless browser
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-web-security', '--disable-features=IsolateOrigins,site-per-process'],
      //devtools: true,
    });
    const page = await browser.newPage();

    // Load your front-end code into the browser
    await page.goto('file://' + frontendCodePath, { waitUntil: 'networkidle0' });

    // Execute your front-end code to generate the SVG
    const svgContent = await page.evaluate((comic) => {
      document.body.replaceChildren(window.comicWebRender(comic))
    }, comic);


    const fileElement = await page.waitForSelector('body > :first-child');
    await fileElement.screenshot({ path: outputPath, type: 'png' });

    console.log(`Successfully saved ${outputPath}`);

    // Close the browser
    await browser.close();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
})();
