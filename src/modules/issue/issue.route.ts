import { Router } from "express";
import { issueController } from "./issue.controller";
import { auth } from "../../middleware/auth";
import { role } from "../../middleware/role";

const issueRoutes = Router();

issueRoutes.post('/', auth, issueController.createNewIssue )
issueRoutes.get("/", issueController.getAllIssues);
issueRoutes.get("/:id", issueController.getSingleIssue);
issueRoutes.patch("/:id", auth, issueController.updateIssue);
issueRoutes.delete("/:id", auth,  role("maintainer"), issueController.deleteIssue);


export default issueRoutes;