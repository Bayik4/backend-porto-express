import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.util";

export default function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.get("Authorization");
  if(!authHeader) res.status(403).json({ message: "Auth token is required to make this request." })
  if(!authHeader?.startsWith("Bearer ")) res.status(403).json({ message: "Invalid token." })

  const token = authHeader?.split(" ")[1] || '';

  try {
    const verifiedToken = verifyToken(token);
    (req as any).user = verifiedToken;
    next();
  } catch (error) {
    const e = error as Error;
    res.status(500).json({ error: e.message })
  }
}