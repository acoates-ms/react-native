# RNPM Plugin for MacOS

To bootstrap the creation of MacOS projects for React Native, we've published `rnpm-plugin-macos`. The purpose of this plugin is to provide project init functionality comparable to `react-native init` and `react-native android`, and to allow users to build and run React MacOS applications from the command line.

## Project Initialization

To start, make sure you have the react-native CLI installed globally.

```
npm install -g react-native-cli
```

Once the CLI is installed, install rnpm-plugin-windows and initialize your project. Note: if you have Yarn installed, the react-native-cli will prefer to use that instead of npm, so use yarn to install `rnpm-plugin-windows`.

```
npx react-native init MyProject
cs MyProject
npm install --save-dev rnpm-plugin-macos
react-native macos
```

The `macos` command will do the following:
- Install `react-native-macos` from [NPM](https://www.npmjs.com/package/react-native-macos)
- Read the name of your project from `package.json`  
- Generate the MacOS project files.

### Usage

```
react-native macos [name] [--namespace <namespace>] [--macosVersion <version>]
```

The `macos` command takes an optional command line argument.
- `name` - The name of the project, which will be used for both file names and the name of the component that is registered in the React Native [AppRegistry](https://facebook.github.io/react-native/docs/appregistry.html). Default value is the name given in the root-level `package.json`.

The `macos` command accepts two optional flags.
- `--namepace` - The namespace that will be used in the generated native C# code. Default value is `name`.
- `--macosVersion` - The version of `react-native-macos` that will be used. Default value is matches the major and minor version of `react-native` if installed, otherwise the latest version.

## Running React MacOS Applications

Once `react-native-macos` is installed in your project, an additional command for running MacOS apps is exposed to `react-native`.  To deploy your app to Desktop, execute:
```
react-native run-macos
```
For more information on the kinds of options and flags available use the `--help` flag to get the command usage information.
