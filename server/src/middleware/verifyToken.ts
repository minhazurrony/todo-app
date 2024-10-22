import { Request, Response, NextFunction } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";

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
      async (err: VerifyErrors | null, decoded: any) => {
        if (err) {
          return res
            .status(401)
            .json({ message: "This session has expired. Please login" });
        }

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
