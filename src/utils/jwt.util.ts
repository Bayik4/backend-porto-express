import jwt from "jsonwebtoken";

export const generateToken = <T>(payload: T) => {
  return jwt.sign({payload}, process.env.SECRET_KEY!, { expiresIn: '1h' });
}

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.SECRET_KEY!);
  } catch (error) {
    throw new Error("Invalid or expires token.");
  }
}