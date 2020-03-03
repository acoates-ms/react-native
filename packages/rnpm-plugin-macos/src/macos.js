/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
'use strict';

const Common = require('./common');
const chalk = require('chalk');
const execSync = require('child_process').execSync;
const path = require('path');

const REACT_NATIVE_MACOS_GENERATE_PATH = function() {
  return path.resolve(
    process.cwd(),
    'node_modules',
    'react-native-macos',
    'local-cli',
    'generate-macos.js'
  );
};

module.exports = async function (config, args, options) {
  try {
    const name = args[0] ? args[0] : Common.getReactNativeAppName();
    const ns = options.namespace ? options.namespace : name;
    let version = options.macosVersion ? options.macosVersion : Common.getReactNativeVersion();

    let template = options.template;

    let rnmPackage = await Common.getInstallPackage(version, template, !!template);

    console.log(`Installing ${rnmPackage}...`);
    const pkgmgr = Common.isGlobalCliUsingYarn(process.cwd()) ? 'yarn add' : 'npm install --save';

    const execOptions = options.verbose ? { stdio: 'inherit' } : {};
    execSync(`${pkgmgr} ${rnmPackage}`, execOptions);
    console.log(chalk.green(`${rnmPackage} successfully installed.`));

    const generateWindows = require(REACT_NATIVE_MACOS_GENERATE_PATH());
    generateWindows(process.cwd(), name, ns, options);
  } catch (error) {
    console.error(chalk.red(error.message));
    console.error(error);
  }
};
