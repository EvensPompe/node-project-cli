#!/usr/bin/env node
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFile } from "fs/promises";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);
import chalk from "chalk";
import Command from "./classes/Command.js";
const pkg = require("../package");
const [, , ...args] = process.argv;
try {
  const helpData = await readFile(join(__dirname, `../help.txt`));
  if (args.length <= 0) {
    const helpLog = chalk.white(helpData.toString("utf8"));
    console.log(helpLog);
    process.exit(0);
  }
  const [arg] = args;
  switch (arg) {
    case "--version":
    case "-v":
      const versionColored = chalk.white(pkg.version);
      console.log(versionColored);
      break;
    case "--help":
    case "-h":
      const helpLog = chalk.white(helpData.toString("utf8"));
      console.log(helpLog);
      break;
    case "create":
      if (args.length === 2) {
        const [, arg2] = args;
        const command = new Command();
        await command.create(arg2);
      }
      if (args.length === 3) {
        const [, arg2, arg3] = args;
        if (arg3.startsWith("--framework=")) {
          const [, framework] = arg3.split("=");
          const command = new Command();
          await command.create(arg2, framework);
        }
      }
      break;
    default:
      throw new Error("Unknown command");
  }
  process.exit(0);
} catch (error) {
  const errorProcess = chalk.red(error.message);
  console.log(errorProcess);
  process.exit(1);
}
