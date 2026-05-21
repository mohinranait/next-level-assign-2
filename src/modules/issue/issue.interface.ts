
export interface IIssueUpdateReporter {
  id: number;
  role: "contributor" | "maintainer";
}

type IIssueType = "bug" | "feature_request";
type IIssueStatus = "open" | "in_progress" | "resolved";

export interface ICreateIssuePayload {
  title: string;
  description: string;
  type: IIssueType;
}

export interface IUpdateIssuePayload extends Partial<ICreateIssuePayload> {
  status?: IIssueStatus;
}

export interface IIssue extends ICreateIssuePayload {
  id: number;
  status: IIssueStatus;
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
}