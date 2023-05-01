import express from "express";
import fs from "fs";
import { spawn } from "child_process";

const app = express();

// Define a route to run ngspice and save the output data locally
app.get("/run-ngspice", (req, res) => {
  // Define the ngspice command to execute
  const ngspice = spawn("ngspice", ["-b", "-o", "output.txt", "circuit.cir"]);

  // Handle stdout and stderr data
  ngspice.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  ngspice.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  // Handle ngspice process exit event
  ngspice.on("exit", (code) => {
    console.log(`Ngspice process exited with code ${code}`);

    // Check if output file exists
    if (fs.existsSync("output.txt")) {
      // Read the output data from the file
      const outputData = fs.readFileSync("output.txt", "utf8");

      // Send the output data as a response
      res.send(outputData);
    } else {
      res.status(500).send("Output file not found");
    }
  });
});

// Start the server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
