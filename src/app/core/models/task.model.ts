export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  status: TaskStatus;
  comments: Comment[];
  category?: string;
  assignees?: string[];
  progress?: number;
}

export enum TaskStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Completed = 'Completed'
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
  replies: Comment[];
}