import dotenv from 'dotenv';
import path from "path";
dotenv.config({
  path: path.join(process.cwd(), '.env')
})


const config = {
  port : process.env.PORT ,
  db_url : process.env.DB_URL,
  bcrypt_round: process.env.BCRYPT_SALT_ROUNDS
}

export default config;