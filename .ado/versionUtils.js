// @ts-check
const fs = require("fs");
const path = require("path");
const semver = require("semver");

const pkgJsonPath = path.resolve(__dirname, "../package.json");
const publishBranchName = process.env.BUILD_SOURCEBRANCH.match(/refs\/heads\/(.*)/)[1];

function gatherVersionInfo() {
    let pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));

    let releaseVersion = pkgJson.version;
    const branchVersionSuffix = publishBranchName === 'master' ? '' : `-${publishBranchName}`;
    return {pkgJson, releaseVersion, branchVersionSuffix};
}

function updateVersionsInFiles() {

    let {pkgJson, releaseVersion, branchVersionSuffix} = gatherVersionInfo();

    if (branchVersionSuffix)  {
      releaseVersion = semver.inc(releaseVersion, 'prerelease', {includePrerelease: true}, publishBranchName);
    } else {
      releaseVersion = semver.inc(releaseVersion, 'patch');
    }
  
    pkgJson.version = releaseVersion;
    fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2));
    console.log(`Updating package.json to version ${releaseVersion}`);
    return {releaseVersion, branchVersionSuffix};
}

function updatePackageJsonForInternalForkRelease(name) {
    let pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
    pkgJson.name = 'react-native';
    pkgJson.version = `${pkgJson.version}-microsoft`;
    delete pkgJson.peerDependencies['react-native'];
    delete pkgJson.devDependencies['react-native'];
    console.log(`Updating package.json name to "react-native"`);
    console.log(`Updating package.json version to "${pkgJson.version}"`);
    console.log('Removing dev/peerDependency on react-native');
    fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2));
}

module.exports = {
    gatherVersionInfo,
    publishBranchName,
    pkgJsonPath,
    updateVersionsInFiles,
    updatePackageJsonForInternalForkRelease
}