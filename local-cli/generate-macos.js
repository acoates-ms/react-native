'use strict';

const fs = require('fs');
const path = require('path');
const {
  copyProjectTemplateAndReplace,
 } = require('./generator-macos');

/**
 * Simple utility for running the MacOS generator.
 *
 * @param  {String} projectDir root project directory (i.e. contains index.js)
 * @param  {String} name       name of the root JS module for this app
 * @param  {String} ns         namespace for the project
 * @param  {Object} options    command line options container
 */
function generateMacOS (projectDir, name, ns, options) {
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir);
  }
  copyProjectTemplateAndReplace(
    path.join(__dirname, 'template'),
    projectDir,
    name,
    { ns, overwrite: options.overwrite, language: options.language }
  );
}

module.exports = generateMacOS;
