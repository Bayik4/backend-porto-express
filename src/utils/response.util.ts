import { Response } from "express"

export const sendSuccessResponse = <T>(
  res: Response,
  data: T, 
  message?: string, 
  statusCode: number = 200, 
) => {
  return res.status(statusCode).json({
    message,
    data,
  });
}

export const sendFailedResponse = (
  res: Response,
  message?: string, 
  statusCode: number = 422, 
  errors: string[] = []
) => {
  return res.status(statusCode).json({
    message,
    errors
  });
}