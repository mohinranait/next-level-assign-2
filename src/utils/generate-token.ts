import jwt from "jsonwebtoken";
import config from "../config";
export const generateToken = (payload: {
  id: number;
  name: string;
  role: string;
}) => {
  return jwt.sign(payload, config.jwt_secret as string, {
    expiresIn: "1d",
  });
};