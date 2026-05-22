
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import config from "../config";
import { sendResponse } from "../utils/sendResponse";

export const auth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization;

    if (!token) {

      sendResponse(res, 401, {
        success: false,
        message: "Unauthorized access",
      })
      return;
    }

    const decoded = jwt.verify(
      token,
      config.jwt_secret as string
    );


    req.user = decoded as JwtPayload;

    next();
  } catch (error) {
    sendResponse(res, 401, {
      success: false,
      message: "Invalid authorization request",
      errors: error,
    })
  }
};