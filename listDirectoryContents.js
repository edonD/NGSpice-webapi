import { spawn } from "child_process";

export function listDirectoryContents(directoryPath) {
  return new Promise((resolve, reject) => {
    const child = spawn("ls", ["-l", directoryPath]);

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
