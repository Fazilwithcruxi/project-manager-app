export type Id = string | number;

export type Column = {
  id: Id;
  title: string;
};

export type Task = {
  id: Id;
  columnId: Id;
  content: string;
  tags: string[];
  comments: number;
  attachments: number;
  date: string;
  assignees: string[]; // urls for avatars
};
