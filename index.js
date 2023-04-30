import express from "express";
import { runNgspice } from "./runNgspice.js";
import { parseNgspiceOutput } from "./parseNgspiceOutput.js";
import fs from "fs";

const app = express();

app.use(express.json()); // Enable JSON request bodies

// Run ngspice with a file
app.get("/run-ngspice", async (req, res) => {
  const file = req.query.file;
  if (!file) {
    res.status(400).send("Missing file parameter");
    return;
  }

  try {
    const result = await runNgspice(file);
    parseNgspiceOutput(result);
    res.send(result);
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
