#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const execSync = require("child_process").execSync;

function getProjectDirectoryName() {
  return process.argv[2];
}

function addDependentLibraries(projectDirectoryName) {
  console.log("adding library dependencies");
  const bs = "npm install brighterscript --save-dev";
  const rr = "npm install rooibos-roku --save-dev";
  const cmd = "cd " + projectDirectoryName + "; " + bs + "; " + rr
  const output = execSync(cmd, { encoding: "utf-8" }); // the default is 'buffer'
}

function setProjectName(projectDirectoryName) {
  console.log("configuring project name");

  const packageFile = path.join(projectDirectoryName, "package.json");
  replaceAction = function (data) {
    return data.replace(/myproject/g, projectDirectoryName);
  };
  replaceTextInFile(packageFile, replaceAction);

  const manifestFile = path.join(projectDirectoryName, "src/manifest");
  replaceAction = function (data) {
    return data.replace(/myproject/g, projectDirectoryName);
  };
  replaceTextInFile(manifestFile, replaceAction);

  const readmeFile = path.join(projectDirectoryName, "readme");
  const replacementText = "brighterscript project " + projectDirectoryName;
  replaceAction = function (data) {
    return replacementText;
  };
  replaceTextInFile(readmeFile, replaceAction);
}

function replaceTextInFile(filename, replaceAction) {
  fs.readFile(filename, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }
    var result = replaceAction(data);
    fs.writeFile(filename, result, "utf8", function (err) {
      if (err) return console.log(err);
    });
  });
}

function copyFiles(projectDirectoryName) {
  console.log("copying files");
  const fse = require("fs-extra");
  const srcDir = path.join(__dirname, "project_source");

  try {
    fse.copySync(srcDir, projectDirectoryName, { overwrite: false });
  } catch (err) {
    console.error(err);
  }
}

function main() {
  projectDirectoryName = getProjectDirectoryName();
  copyFiles(projectDirectoryName);
  setProjectName(projectDirectoryName);
  addDependentLibraries(projectDirectoryName);
  console.log("success!");
}

// start main
main();
