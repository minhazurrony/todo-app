import express from "express";
import "dotenv";
import { loginController, registerController } from "./controller";

const app = express();
const port = process.env.PORT || 3001;

// Middleware for parsing JSON bodies
app.use(express.json());

app.post("/api/auth/register", registerController);
app.post("/api/auth/login", loginController);

app.listen(port, () => {
  console.log(`todo-app listening on port ${port}`);
});
