import { Request, Response } from "express";
import { db } from "../db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  // Check for required fields
  if (!username || !password) {
    res.status(400).json({ error: "username & password fields are required" });
    return;
  }

  try {
    // Check if user already exists in db
    const existingUser = await db.query.usersTable.findFirst({
      where: (users, { eq }) => eq(users.username, username),
    });

    if (!existingUser) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    // Compare provided password with stored hashed password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    // Optionally generate a token for the successfull login
    const token = jwt.sign(
      { id: existingUser.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    // Successful login (add your token generation or session logic here)
    res.status(200).json({
      message: "Login successful",
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
      },
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
