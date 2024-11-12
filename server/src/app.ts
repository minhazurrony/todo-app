import express from "express";
import "dotenv";
import {
  login,
  register,
  addTodo,
  todos,
  updateTodo,
  deleteTodo,
} from "./controller";
import { verifyToken } from "./middleware";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 3001;

// Middleware for parsing JSON bodies
app.use(express.json());

// Middleware for parsing cookie
app.use(cookieParser());

// auth routes
app.post("/api/auth/register", register);
app.post("/api/auth/login", login);

// todo routes
app.post("/api/add-todo", verifyToken, addTodo);
app.get("/api/todos", verifyToken, todos);
app.put("/api/update-todo", verifyToken, updateTodo);
app.delete("/api/delete-todo", verifyToken, deleteTodo);

app.listen(port, () => {
  console.log(`todo-app listening on port ${port}`);
});
