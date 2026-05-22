import type { Request, Response } from "express";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";

// Register new users
const register = async (req: Request, res: Response) => {
  try {
    const result = await authService.signupUser(req.body);

    sendResponse(res, 201, {
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {

    const message = "Failed to register user"
    const errMessage = error instanceof Error ? error.message : message;

    sendResponse(res, 400, {
      success: false,
      message: message,
      errors: errMessage || error,
    });

  }

};


// Login user
const login = async (req: Request, res: Response) => {

  try {
    const result = await authService.loginUser(req.body);
    sendResponse(res, 200, {
      success: true,
      message: "User logged in successfully",
      data: result,
    });
  } catch (error) {

    const message = "Failed to login user"
    const errMessage = error instanceof Error ? error.message : message;

    sendResponse(res, 400, {
      success: false,
      message: message,
      errors: errMessage || error,
    });

  }
};


export const authController = {
  register,
  login
}