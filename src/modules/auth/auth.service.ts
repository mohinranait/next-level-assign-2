import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { IUser } from "./user.interface";
import config from "../../config";
import { generateToken } from "../../utils/generate-token";

// REgister user
export const signupUser = async (payload: IUser) => {
  const { name, email, password, role } = payload;
  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  // user already exists error
  if (existingUser.rows.length > 0) {
    throw new Error("Email already exists");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(
    password,
    10
  );

  // Create new user
  const result = await pool.query(
    `INSERT INTO users(name,email,password,role)
     VALUES($1,$2,$3,$4)
     RETURNING *`,
    [ name, email,  hashedPassword, role || "contributor" ]
  );

  delete result.rows[0].password;

  return result.rows[0];
};



// Login user
const loginUser = async (payload: {
  email: string;
  password: string;
}) => {
  const {email, password} = payload;
  const userResult = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  const user = userResult.rows[0];

  if (userResult.rows.length === 0) {
    throw new Error("Invalid credentials");
  }

  // Match the password
  const isMatched = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatched) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken({
    id: user.id,
    name: user.name,
    role: user.role,
  });

  delete user.password;

  return {
    token,
    user,
  };
};

export const authService = {
  signupUser,
  loginUser,
};