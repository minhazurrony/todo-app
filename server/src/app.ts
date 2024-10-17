import express from "express";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`todo-app listening on port ${port}`);
});
