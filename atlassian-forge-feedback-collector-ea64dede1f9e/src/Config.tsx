import ForgeUI, {
  MacroConfig,
  Option,
  Select,
  render,
  useState,
  UserPicker,
  RadioGroup,
  Radio,
} from "@forge/ui";

import { fetchIssueTypes, fetchProjects } from "./api";

const Config = () => {
  const [projects] = useState(fetchProjects);
  const [issueTypes] = useState(fetchIssueTypes);
  // Note it's possible to select a combination of issue/project type that doesn’t exist.
  // This could be addressed by validation after submitting the form.
  return (
    <MacroConfig>
      <Select label="Project" name="projectKey">
        {projects.map((project) => {
          return (
            <Option
              label={`${project.name} (${project.key})`}
              value={project.key}
            />
          );
        })}
      </Select>
      <Select label="Issue type" name="issueTypeId">
        {issueTypes.map((issueType) => {
          return <Option label={issueType.name} value={issueType.id} />;
        })}
      </Select>
      <UserPicker label="Assign to" name="assignee" />
      <RadioGroup label="Set reporter as" name="reporter">
        <Radio label="Feedback author" value="author" />
        <Radio label="Anonymous" value="anonymous" />
      </RadioGroup>
    </MacroConfig>
  );
};

export const run = render(<Config />);
