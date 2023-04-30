import express from "express";
import { runNgspice } from "./runNgspice.js";

const app = express();

app.get("/run-ngspice", async (req, res) => {
  const file = req.query.file;
  if (!file) {
    res.status(400).send("Missing file parameter");
    return;
  }

  try {
    const result = await runNgspice(file);
    res.send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
