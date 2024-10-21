import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "../db";
import "dotenv/config";
import { usersTable } from "../db/schema";

export const registerController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, password, name, email } = req.body;

  // Check for required fields
  if (!username || !password || !name || !email) {
    res
      .status(400)
      .json({ error: "name, email, username & password fields are required" });
  }

  try {
    // Check if user already exists in db
    const existingUser = await db.query.usersTable.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
    } else {
      // You might want to hash the password and save the user
      const hashedPassword = await bcrypt.hash(password, 10);

      // Assuming you have a method to create a user
      const newUser = await db
        .insert(usersTable)
        .values({
          username,
          password: hashedPassword,
          name,
          email,
        })
        .returning({
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
          username: usersTable.username,
        });

      res
        .status(201)
        .json({ message: "User registered successfully", user: newUser });
    }
  } catch (error) {
    console.error("Error during register:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
