#!/usr/bin/env node
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);
import chalk from "chalk";
import Command from "./classes/Command.js";
const pkg = require("../package");
const [, , ...args] = process.argv;
try {
  if (args.length <= 0) {
    const helpLog = chalk.white(`npc <command>

    Usage:
    npc --version -v     get current version
    npc --help -h        get help about usage and commands
    npc create <name>    create new node project (by default, a web app with express.js) with name
    
    All commands:
    create,--help,-h,-version,-v`);
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
      const helpLog = chalk.white(`npc <command>

Usage:
npc --version -v     get current version
npc --help -h        get help about usage and commands
npc create <name>    create new node project (by default, a web app with express.js) with name

All commands:
create,--help,-h,-version,-v`);
      console.log(helpLog);
      break;
    case "create":
      if (args.length === 2) {
        const [, arg2] = args;
        const command = new Command();
        await command.create(arg2);
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
