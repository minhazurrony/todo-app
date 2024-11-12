import { Request, Response } from "express";
import { db } from "../db";
import { todosTable } from "../db/schema";

export const addTodo = async (req: Request, res: Response): Promise<void> => {
  const { user_id, todo } = req.body;

  if (!user_id || !todo) {
    res
      .status(400)
      .json({ error: "userId, title & todos fields are required" });
  }

  try {
    const newTodo = await db
      .insert(todosTable)
      .values({
        todo,
        user_id,
      })
      .returning({
        id: todosTable.id,
      });

    if (newTodo.length) {
      res.status(201).json({ message: "Todo added successfully" });
    }
  } catch (error) {
    console.error("Error during add todo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
