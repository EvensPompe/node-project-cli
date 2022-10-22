#!/usr/bin/env node
import { mkdir, writeFile, readFile } from "fs/promises";
import { existsSync } from "fs";
import { createRequire } from "module";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);
import chalk from "chalk";
const pkg = require("../package");
const [, , ...args] = process.argv;
const execPromise = (path) =>
  new Promise((resolve, reject) => {
    exec(path, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout || stderr);
      }
    });
  });
try {
  if (args.length > 0) {
    if (args.length === 1) {
      const [arg] = args;
      switch (arg) {
        case "--version":
        case "-v":
          const versionColored = chalk.white(pkg.version);
          console.log(versionColored);
          break;
        case "--help":
        case "-h":
          const helpLog = chalk.white(`npc <command>

Usage:
npc --version -v     get current version
npc --help -h        get help about usage and commands
npc create <name>    create new node project (by default, a web app with express.js) with name

All commands:
create,--help,-h,-version,-v`);
          console.log(helpLog);
          break;
        default:
          throw new Error("Unknown command");
      }
    } else {
      if (args.length === 2) {
        const [arg1, arg2] = args;
        switch (arg1) {
          case "create":
            const startCreate = chalk.blue(`Create new node project: ${arg2}`);
            const projectExists = existsSync(`${process.cwd()}/${arg2}`);
            if (projectExists) throw new Error(`${arg2} already exists`);
            const gitLog = chalk.blue(`Initialisation of git's repository`);
            const packageLog = chalk.yellow(`Generation of package.json`);
            const installLog = chalk.magenta(`Installation of dependencies`);
            const endCreate = chalk.green(`Project ${arg2} finished`);
            console.log(startCreate);
            await mkdir(`${process.cwd()}/${arg2}`);
            console.log(gitLog);
            await execPromise(`cd ${arg2} && git init`);
            console.log(packageLog);
            const dataPackage = {
              name: arg2,
              version: "1.0.0",
              description: arg2,
              main: "server.js",
              scripts: {
                dev: "nodemon",
              },
              keywords: [],
              author: "",
              license: "ISC",
              dependencies: {
                express: "^4.18.1",
              },
              devDependencies: {
                nodemon: "^2.0.16",
              },
            };
            const stringDataPackage = JSON.stringify(dataPackage, null, 2);
            await writeFile(
              `${process.cwd()}/${arg2}/package.json`,
              stringDataPackage
            );
            const dataAppReaded = await readFile(
              join(__dirname, "./create/dataApp.js")
            );
            await writeFile(
              `${process.cwd()}/${arg2}/server.js`,
              dataAppReaded.toString()
            );
            console.log(installLog);
            await execPromise(`cd ${arg2} && npm i`);
            console.log(endCreate);
            break;
          default:
            throw new Error("Unknown command");
        }
      }
    }
  }
  process.exit(0);
} catch (error) {
  const errorProcess = chalk.red(error.message);
  console.log(errorProcess);
  process.exit(1);
}
