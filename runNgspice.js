import { spawn } from "child_process";

export function runNgspice(file) {
  return new Promise((resolve, reject) => {
    const child = spawn("ngspice", [file]);

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed with code ${code}\n${stderr}`));
      } else {
        resolve(stdout);
      }
    });
  });
}
