import { Request, Response } from "express";
import { db } from "../db";
import { todosTable } from "../db/schema";
import { eq } from "drizzle-orm";

export const todos = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res
        .status(400)
        .json({ error: "User ID is missing or not authenticated." });
    }

    const userTodos = await db.query.todosTable.findMany({
      where: eq(todosTable.user_id, userId as any),
    });

    res.json(userTodos);
  } catch (error) {
    console.error("Error during fetching todos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
