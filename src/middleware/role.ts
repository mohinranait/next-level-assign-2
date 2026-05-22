
import type { NextFunction, Request, Response } from "express";

export const role = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden access",
      });
    }

    next();
  };
};