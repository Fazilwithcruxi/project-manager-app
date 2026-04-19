import type { Column, Task } from "./types";

export const initialColumns: Column[] = [
  {
    id: "todo",
    title: "To Do",
  },
  {
    id: "in-progress",
    title: "In Progress",
  },
  {
    id: "review",
    title: "In Review",
  },
  {
    id: "done",
    title: "Done",
  },
];

export const initialTasks: Task[] = [
  {
    id: "1",
    columnId: "todo",
    content: "Design new landing page structure and hero section",
    tags: ["design"],
    comments: 3,
    attachments: 2,
    date: "Oct 24",
    assignees: ["https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"],
  },
  {
    id: "2",
    columnId: "todo",
    content: "Integrate payment gateway API endpoints",
    tags: ["dev"],
    comments: 8,
    attachments: 0,
    date: "Oct 25",
    assignees: ["https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka", "https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi"],
  },
  {
    id: "3",
    columnId: "in-progress",
    content: "Conduct user research for dashboard layout",
    tags: ["research"],
    comments: 1,
    attachments: 4,
    date: "Oct 26",
    assignees: ["https://api.dicebear.com/7.x/avataaars/svg?seed=Max"],
  },
  {
    id: "4",
    columnId: "review",
    content: "Refactor authentication module using TypeScript",
    tags: ["dev"],
    comments: 5,
    attachments: 1,
    date: "Oct 22",
    assignees: ["https://api.dicebear.com/7.x/avataaars/svg?seed=Bella"],
  },
  {
    id: "5",
    columnId: "done",
    content: "Set up project repository and CI/CD pipelines",
    tags: ["dev"],
    comments: 0,
    attachments: 0,
    date: "Oct 20",
    assignees: ["https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas", "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam"],
  },
];
