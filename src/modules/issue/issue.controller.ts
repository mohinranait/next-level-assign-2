
import type { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { issueService } from "./issue.service"
import type { IIssueUpdateReporter } from "./issue.interface";

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
    const errMessage = error instanceof Error ? error.message : "Failed to create issue";
    sendResponse(res, 500, {
      success: false,
      message: errMessage,
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
    const errMessage = error instanceof Error ? error.message : "Failed to retrieve issues";

    sendResponse(res, 500, {
      success: false,
      message: errMessage,
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
    const errMessage = error instanceof Error ? error.message : "Failed to retrieve issue";
    sendResponse(res, 500, {
      success: false,
      message: errMessage,
      errors: error,
    });
  }
}



// udpate issue by id
const updateIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await issueService.updateIssueIntoDB(Number(id), req.body, req.user as IIssueUpdateReporter);
    sendResponse(res, 200, {
      success: true,
      message: "Issue updated successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);

    const errMessage = error instanceof Error ? error.message : "Failed to update issue";

    sendResponse(res, 500, {
      success: false,
      message: errMessage,
      errors: error,
    });
  }
}







export const issueController = {
  createNewIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue
}