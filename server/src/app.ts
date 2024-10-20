import express from "express";
import "dotenv/config";
import { registerController } from "./controller";

const app = express();
const port = process.env.PORT || 3001;

// Middleware for parsing JSON bodies
app.use(express.json());

app.post("/api/register", registerController);

app.listen(port, () => {
  console.log(`todo-app listening on port ${port}`);
});
