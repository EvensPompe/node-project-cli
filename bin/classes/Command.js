import execPromise from "../../functions/execPromise.js";
import { mkdir, writeFile, readFile } from "fs/promises";
import chalk from "chalk";
import { existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default class Command {
  frameworks = ["express", "vanilla"];
  async create(name, framework = "express") {
    try {
      if (!this.frameworks.includes(framework))
        throw "no framework or unknown framework";
      const startCreate = chalk.blue(`Create new node project: ${name}`);
      const projectExists = existsSync(`${process.cwd()}/${name}`);
      if (projectExists) throw new Error(`${name} already exists`);
      const gitLog = chalk.blue(`Initialisation of git's repository`);
      const packageLog = chalk.yellow(`Generation of package.json`);
      const gitIgnoreLog = chalk.yellow(`Generation of .gitignore`);
      const installLog = chalk.magenta(`Installation of dependencies`);
      const endCreate = chalk.green(`Project ${name} finished`);
      console.log(startCreate);
      await mkdir(`${process.cwd()}/${name}`);
      console.log(gitLog);
      await execPromise(`cd ${name} && git init`);
      let dataAppReaded = null;
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

        default:
          break;
      }

      const gitIgnoreData = `node_modules`;
      const stringDataPackage = JSON.stringify(dataPackage, null, 2);
      await writeFile(
        `${process.cwd()}/${name}/package.json`,
        stringDataPackage
      );
      console.log(gitIgnoreLog);
      await writeFile(`${process.cwd()}/${name}/.gitignore`, gitIgnoreData);
      dataAppReaded = await readFile(
        join(__dirname, `../create/${framework}/index.js`)
      );
      await writeFile(
        `${process.cwd()}/${name}/server.js`,
        dataAppReaded.toString()
      );
      console.log(installLog);
      await execPromise(`cd ${name} && npm i`);
      console.log(endCreate);
    } catch (error) {
      if (typeof error === "string") {
        throw new Error(error);
      } else {
        throw error;
      }
    }
  }
}
