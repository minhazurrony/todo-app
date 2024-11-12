import { Request, Response, NextFunction } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string; // Add the userId to the Request object
    }
  }
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers["cookie"];

    if (!authHeader) {
      res.sendStatus(401);
    }

    const cookie: any = authHeader;

    jwt.verify(
      cookie,
      process.env.JWT_SECRET as jwt.Secret,
      (err: VerifyErrors | null, decoded: any) => {
        if (err) {
          return res
            .status(401)
            .json({ message: "This session has expired. Please login." });
        }

        // Attach userId to req object so it can be used in route handlers
        req.userId = decoded.id;

        // Move to the next middleware or route handler
        next();
      }
    );
  } catch (error) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: "Internal Server Error",
    });
  }
};
