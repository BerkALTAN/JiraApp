import api, { route } from "@forge/api";

export const fetchProjects = async () => {
  const response = await api.asApp().requestJira(route`/rest/api/3/project`);
  return response.json();
};

export const fetchIssueTypes = async () => {
  const response = await api.asApp().requestJira(route`/rest/api/3/issuetype`);
  const issueTypes = await response.json();
  return issueTypes.filter((issueType) => !issueType.subtask);
};
