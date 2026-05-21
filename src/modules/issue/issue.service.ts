import { pool } from "../../db";
import type { ICreateIssuePayload, IIssueUpdateReporter, IUpdateIssuePayload } from "./issue.interface";

export const createIssueIntoDB = async (
  payload: ICreateIssuePayload,
  reporterId: number
) => {
  const { title, description, type } = payload;
  const result = await pool.query(
    `INSERT INTO issues(title,description,type,reporter_id)
     VALUES($1,$2,$3,$4)
     RETURNING *`,
    [title, description, type, reporterId]
  );

  return result.rows[0];
};


/// get all issues with filter and sorting
const getAllIssuesFromDB = async (sort: string, type: string, status: string) => {
  let query = "SELECT * FROM issues";
  const conditions: string[] = [];
  const values: string[] = [];

  if (type) {
    values.push(type);
    conditions.push(`type = $${values.length}`);
  }

  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  query +=
    sort === "oldest"
      ? " ORDER BY created_at ASC"
      : " ORDER BY created_at DESC";

  const issuesResult = await pool.query(query, values);

  const issues = issuesResult.rows;

  const reporterIds = [...new Set(issues.map((i) => i.reporter_id))];

  const usersResult = await pool.query(
    `SELECT id,name,role FROM users WHERE id = ANY($1)`,
    [reporterIds]
  );

  const users = usersResult.rows;

  const formattedIssues = issues.map((issue) => {
    const reporter = users.find((u) => u.id === issue.reporter_id);

    return {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,
      reporter,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
    };
  });

  return formattedIssues;
}


// get single issue by Id from DB
const getSingleIssueFromDB = async (id: number) => {
  const issueResult = await pool.query(
    "SELECT * FROM issues WHERE id = $1",
    [id]
  );

  const issue = issueResult.rows[0];

  if (issueResult.rows.length === 0) {
    throw new Error("Issue not found");
  }

  const userResult = await pool.query(
    "SELECT id,name,role FROM users WHERE id = $1",
    [issue.reporter_id]
  );

  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: userResult.rows[0],
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
};


// update issue by Id into DB
const updateIssueIntoDB = async (
  id: number,
  payload: IUpdateIssuePayload,
  user: IIssueUpdateReporter
) => {
  // Find issue
  const issueResult = await pool.query(
    "SELECT * FROM issues WHERE id = $1",
    [id]
  );

  const issue = issueResult.rows[0];

  if (!issue) {
    throw new Error("Issue not found");
  }


  if (user.role === "contributor") {
    // Own issue check
    if (issue.reporter_id !== user.id) {
      throw new Error("You cannot update this issue");
    }

    // Open status check
    if (issue.status !== "open") {
      throw new Error("You can only update open issues");
    }

    // Contributor cannot change status
    if (payload.status) {
      throw new Error(
        "Contributors cannot update issue status"
      );
    }
  }



  const fields: string[] = [];
  const values: unknown[] = [];

  // title
  if (payload.title !== undefined) {
    values.push(payload.title);
    fields.push(`title = $${values.length}`);
  }

  // description
  if (payload.description !== undefined) {
    values.push(payload.description);
    fields.push(`description = $${values.length}`);
  }

  // type
  if (payload.type !== undefined) {
    values.push(payload.type);
    fields.push(`type = $${values.length}`);
  }

  // status
  if (payload.status !== undefined) {
    values.push(payload.status);
    fields.push(`status = $${values.length}`);
  }

  // updated_at
  fields.push(`updated_at = CURRENT_TIMESTAMP`);

  // No fields check
  if (values.length === 0) {
    throw new Error("No update fields provided");
  }

  // Final ID
  values.push(id);

  // Dynamic query
  const query = `
    UPDATE issues
    SET ${fields.join(", ")}
    WHERE id = $${values.length}
    RETURNING *
  `;

  const result = await pool.query(query, values);

  return result.rows[0];
};



export const issueService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueIntoDB
}