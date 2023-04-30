import express from "express";
import { listDirectoryContents } from "./listDirectoryContents.js";

const app = express();
const directoryPath1 = "C:\\";

app.get("/list-directory-contents", async (req, res) => {
  const directoryPath = req.query.directoryPath || ".";

  try {
    const result = await listDirectoryContents(directoryPath);
    res.send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
