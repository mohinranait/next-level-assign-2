
import type { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { issueService } from "./issue.service"

const createNewIssue = async (req: Request, res: Response) => {
  try {
    const reportedId = req?.user?.id;
    const result = await issueService.createIssueIntoDB(req.body, reportedId);
    sendResponse(res, 201, {
      success: true,
      message: "Issue created successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, 500, {
      success: false,
      message: "Failed to create issue",
      errors: error,
    });
  }
}


const getAllIssues = async (req: Request, res: Response) => {
  try {
    const sort = (req.query.sort as string) || "newest";
    const type = req.query.type as string;
    const status = req.query.status as string;

    const result = await issueService.getAllIssuesFromDB(
      sort,
      type,
      status
    );

    sendResponse(res, 200, {
      success: true,
      data: result,
    });
  } catch (error) {
    sendResponse(res, 500, {
      success: false,
      message: "Failed to retrieve issues",
      errors: error,
    });
  }
}

// get single issue by Id
const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await issueService.getSingleIssueFromDB(Number(id));

    sendResponse(res, 200, {
      success: true,
      data: result,
    });
  } catch (error) {
 sendResponse(res, 500, {
      success: false,
      message: "Failed to retrieve issue",
      errors: error,
    });
  }
}



 



export const issueController = {
  createNewIssue,
  getAllIssues,
  getSingleIssue
}