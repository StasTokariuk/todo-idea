export type IdeaStatus = 'raw';

export type Idea = {
  id: string;
  text: string;
  createdAt: number;
  status: IdeaStatus;
};

export type TaskType = 'general' | 'study' | 'package';

export type TaskStatus = 'pending' | 'completed' | 'ordered' | 'arrived';

export type Task = {
  id: string;
  title: string;
  type: TaskType;
  status: TaskStatus;
  externalLink?: string;
  createdAt: number;
};
