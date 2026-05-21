import type { Request, Response } from "express";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";

const register = async (req: Request, res: Response) => {
  try {
    const result = await authService.signupUser(req.body);

    sendResponse(res, 201, {
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);

    sendResponse(res, 400, {
      success: false,
      message: "Failed to register user",
      errors: error,
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
    sendResponse(res, 400, {
      success: false,
      message: "Failed to login user",
      errors: error,
    });
  }
};


export const authController = {
  register,
  login
}