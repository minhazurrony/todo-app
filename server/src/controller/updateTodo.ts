import { Request, Response } from "express";
import { db } from "../db";
import { todosTable } from "../db/schema";
import { eq } from "drizzle-orm";

export const updateTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req;
    const { id, completed } = req.body;

    if (!id) {
      res.status(400).json({ error: "Todo ID is required." });
    }

    if (!userId) {
      res
        .status(400)
        .json({ error: "User ID is missing or not authenticated." });
    }

    if (typeof completed !== "boolean") {
      res.status(400).json({ error: "Completed must be a boolean value." });
    }

    const updatedTodo = await db
      .update(todosTable)
      .set({ completed, updated_at: new Date() })
      .where(eq(todosTable.id, id))
      .returning();

    if (updatedTodo.length === 0) {
      res.status(404).json({ error: "Todo not found" });
    } else {
      res.json({
        message: "Todo updated successfully.",
        data: updatedTodo,
      });
    }
  } catch (error) {
    console.error("Error during updating todo:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
