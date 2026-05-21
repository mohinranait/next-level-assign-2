import type { Response } from "express";


interface TResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: unknown;
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  payload: TResponse<T>
) => {
  res.status(statusCode).json(payload);
};