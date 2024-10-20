import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
    res.status(400).json({ error: "All fields are required" });
  }

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
    const newUser = await db.insert(usersTable).values({
      username,
      password: hashedPassword,
      name,
      email,
    });

    // Optionally generate a token for the new user
    const token = jwt.sign({ id: newUser.oid }, process.env.JWT_SECRET as any, {
      expiresIn: "1h",
    });

    res.status(201).json({ message: "User registered successfully", token });
  }
};
