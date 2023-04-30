import express from "express";
import { runNgspice } from "./runNgspice.js";
import { parseNgspiceOutput } from "./parseNgspiceOutput.js";
import fs from "fs";
import { Chart } from "chart.js";

import { createCanvas } from "canvas";

const app = express();

app.use(express.json()); // Enable JSON request bodies

// Run ngspice with a file and plot the results
app.get("/run-ngspice", async (req, res) => {
  const file = req.query.file;
  if (!file) {
    res.status(400).send("Missing file parameter");
    return;
  }

  try {
    const stdout = await runNgspice(file);
    const data = parseNgspiceOutput(stdout);

    // Write the simulation data to a file
    const filename = "simulation-data.txt";
    fs.writeFile(filename, stdout, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error writing file");
      } else {
        // Send the file as a response with the appropriate content type
        res.set("Content-Type", "text/plain");
        res.attachment(filename);
        res.sendFile(filename, { root: __dirname });
      }
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Create a .cir file
app.post("/create-cir-file", (req, res) => {
  const content = req.body.content;
  if (!content) {
    res.status(400).send("Missing content parameter");
    return;
  }

  // Write the content to a file
  const filename = "new-file.cir";
  fs.writeFile(filename, content, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error writing file");
    } else {
      res.send(`File '${filename}' created successfully`);
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
