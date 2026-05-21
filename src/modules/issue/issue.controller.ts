
import type { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { issueService } from "./issue.service"

const createNewIssue = async (req:Request, res: Response) => {
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


export const issueController = {
  createNewIssue
}