'use strict';
const path = require('path');
const uuid = require('uuid');
const {
  createDir,
  copyAndReplaceAll,
  copyAndReplaceWithChangedCallback,
} = require('./generator-common');

const macosDir = 'macos';

function copyProjectTemplateAndReplace(
  srcRootPath,
  destPath,
  newProjectName,
  options = {}
) {
  if (!srcRootPath) {
    throw new Error('Need a path to copy from');
  }

  if (!destPath) {
    throw new Error('Need a path to copy to');
  }

  if (!newProjectName) {
    throw new Error('Need a project name');
  }

  createDir(path.join(destPath, macosDir));
  createDir(path.join(destPath, macosDir, `${newProjectName}-macOS`));

  const ns = options.ns || newProjectName;
  const projectGuid = uuid.v4();
  const packageGuid = uuid.v4();

  const templateVars = {
    '// clang-format off': '',
    '// clang-format on': '',
    '<%=ns%>': ns,
    '<%=name%>': newProjectName,
    '<%=projectGuid%>': projectGuid,
    '<%=projectGuidUpper%>': projectGuid.toUpperCase(),
    '<%=packageGuid%>': packageGuid,
  };

  [
    { from: path.join(srcRootPath, 'react-native.config.js'), to: 'react-native.config.js' },
    { from: path.join(srcRootPath, 'metro.config.macos.js'), to: 'metro.config.macos.js' },
  ].forEach((mapping) => copyAndReplaceWithChangedCallback(mapping.from, destPath, mapping.to, templateVars, options.overwrite));

  copyAndReplaceAll(path.join(srcRootPath, macosDir, 'HelloWorld-macOS'),destPath, path.join(macosDir, `${newProjectName}-macOS`), templateVars, options.overwrite);
}

module.exports = {
  copyProjectTemplateAndReplace,
};
