import express from "express";
import "dotenv";
import { loginController, registerController } from "./controller";
import { verifyToken } from "./middleware";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 3001;

// Middleware for parsing JSON bodies
app.use(express.json());

// Middleware for parsing cookie
app.use(cookieParser());

app.post("/api/auth/register", registerController);
app.post("/api/auth/login", loginController);

app.get("/api/users", verifyToken, (req, res) => {
  res.send(200);
});

app.listen(port, () => {
  console.log(`todo-app listening on port ${port}`);
});
