import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
//type
interface jwtPayload {
  id: string;
}

export const authHeader = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};
