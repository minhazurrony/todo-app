import { Request, Response } from "express";
import { db } from "../db";
import { todosTable } from "../db/schema";
import { eq } from "drizzle-orm";

export const deleteTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req;
    const { id } = req.body;

    if (!id) {
      res.status(400).json({ error: "Todo ID is required." });
    }

    if (!userId) {
      res
        .status(400)
        .json({ error: "User ID is missing or not authenticated." });
    }

    const deletedTodo = await db
      .delete(todosTable)
      .where(eq(todosTable.id, id))
      .returning();

    if (deletedTodo) {
      res.json({
        message: "Todo deleted successfully",
        data: deletedTodo,
      });
    }
  } catch (error) {
    console.error("Error during deleting todo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
