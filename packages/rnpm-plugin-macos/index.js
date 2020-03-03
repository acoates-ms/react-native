module.exports = [{
  func: require('./src/macos'),
  description: 'Generate React Native MacOS template project',
  name: 'macos [name]',
  options: [{
    command: '--macosVersion [version]',
    description: 'The version of react-native-macos to use.',
  }, {
    command: '--namespace [namespace]',
    description: 'The native project namespace.',
  }, {
    command: '--verbose',
    description: 'Enables logging.',
    default: false,
  }, {
    command: '--overwrite',
    description: 'Overwrite any existing files without prompting',
    default: false,
  }],
},
];
