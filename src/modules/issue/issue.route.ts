import { Router } from "express";
import { issueController } from "./issue.controller";
import { auth } from "../../middleware/auth";

const issueRoutes = Router();

issueRoutes.post('/', auth, issueController.createNewIssue )
issueRoutes.get("/", issueController.getAllIssues);
issueRoutes.get("/:id", issueController.getSingleIssue);


export default issueRoutes;