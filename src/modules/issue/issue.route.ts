import { Router } from "express";
import { issueController } from "./issue.controller";
import { auth } from "../../middleware/auth";

const issueRoutes = Router();

issueRoutes.post('/', auth, issueController.createNewIssue )


export default issueRoutes;