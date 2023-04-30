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

    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext("2d");

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.time,
        datasets: [
          {
            label: "Voltage (V)",
            data: data.voltage,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: false,
        plugins: {
          title: {
            display: true,
            text: "Ngspice simulation results",
          },
          legend: {
            position: "bottom",
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Time (s)",
            },
          },
          y: {
            title: {
              display: true,
              text: "Voltage (V)",
            },
            suggestedMin: 0,
            suggestedMax: 5,
          },
        },
      },
    });

    const imageData = canvas.toBuffer("image/png");
    res.set("Content-Type", "image/png");
    res.send(imageData);
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
