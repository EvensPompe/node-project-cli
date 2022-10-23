import { exec } from "child_process";
export default (path) =>
  new Promise((resolve, reject) => {
    exec(path, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout || stderr);
      }
    });
  });
