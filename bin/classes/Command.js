import { exec } from "node:child_process";
import { promisify } from "node:util"
import { mkdir } from "fs/promises";
import { createReadStream, createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import chalk from "chalk";
import { existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const execPromise = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default class Command {
  frameworks = ["express", "vanilla", "koa"];
  async create(name, framework = "express") {
    try {
      if (!this.frameworks.includes(framework))
        throw new Error("no framework or unknown framework");
      const startCreate = chalk.blue(`Create new node project: ${name}`);
      const projectExists = existsSync(`${process.cwd()}/${name}`);
      if (projectExists) throw new Error(`${name} already exists`);
      const gitLog = chalk.blue(`Initialisation of git's repository`);
      const packageLog = chalk.yellow(`Generation of package.json`);
      const packageLogFinished = chalk.yellow(`package.json is done`);
      const gitIgnoreLog = chalk.yellow(`Generation of .gitignore`);
      const gitIgnoreLogFinished = chalk.yellow(`.gitignore is done`);
      const installLog = chalk.magenta(`Installation of dependencies`);
      const endCreate = chalk.green(`Project ${name} finished`);
      console.log(startCreate);
      await mkdir(`${process.cwd()}/${name}`);
      console.log(gitLog);
      await execPromise(`cd ${name} && git init`);
      console.log(packageLog);
      const dataPackage = {
        name: name,
        version: "1.0.0",
        description: name,
        main: "server.js",
        scripts: {
          dev: "nodemon",
        },
        keywords: [],
        author: "",
        license: "ISC",
        devDependencies: {
          nodemon: "^2.0.16",
        },
      };
      switch (framework) {
        case "express":
          dataPackage["dependencies"] = {
            express: "^4.18.1",
          };
          break;
        case "koa":
          dataPackage["dependencies"] = {
            koa: "^2.14.1",
          };
        default:
          break;
      }

      const gitIgnoreData = `node_modules`;
      const stringDataPackage = JSON.stringify(dataPackage, null, 2);
      const packageStream = createWriteStream(
        `${process.cwd()}/${name}/package.json`
      );
      console.log(gitIgnoreLog);
      packageStream.write(stringDataPackage);
      packageStream.on("finish", () => {
        console.log(packageLogFinished);
      });
      packageStream.end();
      const gitignoreStream = createWriteStream(
        `${process.cwd()}/${name}/.gitignore`
      );
      gitignoreStream.write(gitIgnoreData);
      gitignoreStream.on("finish", () => {
        console.log(gitIgnoreLogFinished);
      });
      gitignoreStream.end();
      await pipeline(
        createReadStream(join(__dirname, `../create/${framework}/index.js`)),
        createWriteStream(`${process.cwd()}/${name}/server.js`)
      );
      console.log(installLog);
      await execPromise(`cd ${name} && npm i`);
      console.log(endCreate);
    } catch (error) {
      throw error;
    }
  }
}
