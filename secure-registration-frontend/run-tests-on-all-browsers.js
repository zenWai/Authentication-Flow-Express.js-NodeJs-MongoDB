// run-tests-on-all-browsers.js
import { exec as execCallback } from 'child_process';
import { promisify } from 'util';

const exec = promisify(execCallback);

function parseBrowsers(output) {
  const browserLines = output.split('\n').filter((line) => line.trim().startsWith('- Name:'));
  return browserLines.map((line) => line.split(': ')[1]);
}

async function runCypressTests(browser) {
  console.log(`Running tests on ${browser}...`);
  try {
    const { stdout } = await exec(`npx cypress run --browser ${browser}`);
    console.log(`Tests completed on ${browser}:\n`, stdout);
  } catch (error) {
    console.error(`Error running tests on ${browser}:`, error.stderr);
  }
}

async function getCypressInfo() {
  try {
    const { stdout } = await exec('npx cypress info');
    return stdout;
  } catch (error) {
    console.error('Error getting Cypress info:', error.stderr);
    throw error;
  }
}

async function runTestsOnAllBrowsers() {
  try {
    const cypressInfoOutput = await getCypressInfo();
    const browsers = parseBrowsers(cypressInfoOutput);
    console.log('Detected browsers:', browsers);
    browsers.push('electron');
    console.log('Starting tests on:', browsers);

    for (const browser of browsers) {
      await runCypressTests(browser);
    }
  } catch (error) {
    console.error('Failed to run tests on all browsers:', error);
  }
}

runTestsOnAllBrowsers();
