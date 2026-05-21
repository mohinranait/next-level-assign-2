import { pool } from "../../db";

export const createIssueIntoDB = async (
  payload: {
    title: string;
    description: string;
    type: string;
  },
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


export const issueService = {
  createIssueIntoDB,
  getAllIssuesFromDB
}