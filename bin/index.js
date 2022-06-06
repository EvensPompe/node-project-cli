#!/usr/bin/env node
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import chalk from "chalk";
const pkg = require("../package");
const [, , ...args] = process.argv;
if (args.length > 0) {
  if (args.length === 1) {
    const [arg] = args;
    switch (arg) {
      case "--version":
      case "-v":
        const versionColored = chalk.white(pkg.version);
        console.log(versionColored);
        break;
      default:
        const errorMessage = chalk.red("Unknown command");
        console.log(errorMessage);
        break;
    }
    process.exit(0);
  }
}
