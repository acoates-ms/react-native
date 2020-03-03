# React Native macOS

Build macOS desktop applications using React Native.

See the official [React Native website](https://facebook.github.io/react-native/) for an introduction to React Native

## Documentation
[React Native already has great documentation](https://facebook.github.io/react-native/docs/getting-started.html), and we're working to ensure the React Native MacOS is part of that documentation story. Check out the [React documentation](http://facebook.github.io/react/) for further details about the React API in general.

Coming soon - we will be publishing more documentation shortly.

## Getting Started

```
npx react-native init <project name> --version ^0.60.0
cd <project name>
yarn add rnpm-plugin-macos
npx react-native macos
```

## Opening issues
If you encounter a bug with React Native MacOS or have a feature request, we would like to hear about it. Search the [existing issues](https://github.com/microsoft/react-native-macos/issues?q=is%3Aissue+is%3Aopen) and try to make sure your problem doesn’t already exist before opening a new issue. It’s helpful if you include the version of MacOS, React Native, and React Native MacOS plugin you’re using. Please include a stack trace and reduced repro case when appropriate, too.

# Why are there Android / iOS changes in this repository?

The reasons for this fork to exist currently are 3 fold.

1. An implementation of react-native for macOS. -- The eventual plan is to refactor a bunch of code within facebook/react-native to allow the macOS code to be implemented as an out of tree platform that works with the core react-native package.  But currently the implementation shares so much logic with the iOS platform that it would involve a lot of code duplication to move it out.  This process will take a while to work through but is the eventual goal.
1. Provide a staging ground for changes that Microsoft is submitting back to the main Facebook repo, such that our internal apps can share and validate these changes while the PRs go through the standard merge process with Facebook.
1. Hold various changes that we have made internally to support our apps, which we hope to revert as we update our internal code.  But we are putting it all out here since other projects require this changes exist for now.
