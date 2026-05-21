import {Router} from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/signup", authController.register);

export const authRoutes = router;