export type ThemeMode = 'light' | 'dark' | 'system';

export type IdeaStatus = 'raw';

export type Idea = {
  id: string;
  text: string;
  createdAt: string;
  status: IdeaStatus;
};

export type TaskStatus =
  | 'pending'
  | 'completed'
  | 'ordered'
  | 'arrived'
  | 'archived';

export type Category = {
  id: string;
  name: string;
  icon?: string;
  accentColor: string;
};

export type Task = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  categoryId: string;
  status: TaskStatus;
  deadline: string | null;
  hasCustomToggle: boolean;
  customToggleLabel: string;
  isCustomToggleChecked: boolean;
  externalLink?: string;
  createdAt: string;
  isArchived: boolean;
};

export type ConvertIdeaPayload = {
  categoryId: string;
  subtitle?: string;
  description?: string;
  deadline?: string | null;
  externalLink?: string;
  hasCustomToggle?: boolean;
  customToggleLabel?: string;
  isCustomToggleChecked?: boolean;
  status?: TaskStatus;
};

export type TaskUpdate = Partial<
  Omit<Task, 'id' | 'createdAt'>
>;
