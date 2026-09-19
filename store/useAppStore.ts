import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Idea, Task, TaskStatus, TaskType } from '@/types/models';

type AppState = {
  ideas: Idea[];
  tasks: Task[];
  addIdea: (text: string) => void;
  deleteIdea: (id: string) => void;
  convertIdea: (id: string, type: TaskType, externalLink?: string) => void;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  archiveTask: (id: string) => void;
};

const createId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const SEED_CREATED_AT = Date.parse('2026-09-12T10:00:00.000Z');

const SEED_IDEAS: Idea[] = [
  {
    id: 'seed-idea-1',
    text: 'Try to implement local maxima removal algorithm in a new way',
    createdAt: SEED_CREATED_AT,
    status: 'raw',
  },
];

const SEED_TASKS: Task[] = [
  {
    id: 'seed-task-study',
    title: 'Update Notion notes with OS memory page fault handling logic',
    type: 'study',
    status: 'pending',
    externalLink: undefined,
    createdAt: SEED_CREATED_AT - 36e5,
  },
  {
    id: 'seed-task-package',
    title: 'Pick up ESP32-S3 and PCM5102A from the post office',
    type: 'package',
    status: 'arrived',
    createdAt: SEED_CREATED_AT - 72e5,
  },
  {
    id: 'seed-task-general',
    title: 'Buy new fishing lures for the weekend',
    type: 'general',
    status: 'pending',
    createdAt: SEED_CREATED_AT - 18e5,
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ideas: SEED_IDEAS,
      tasks: SEED_TASKS,
      addIdea: (text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        set({
          ideas: [
            {
              id: createId(),
              text: trimmed,
              createdAt: Date.now(),
              status: 'raw',
            },
            ...get().ideas,
          ],
        });
      },
      deleteIdea: (id) =>
        set({ ideas: get().ideas.filter((idea) => idea.id !== id) }),
      convertIdea: (id, type, externalLink) => {
        const idea = get().ideas.find((item) => item.id === id);
        if (!idea) return;
        const link = externalLink?.trim();
        const task: Task = {
          id: createId(),
          title: idea.text,
          type,
          status: type === 'package' ? 'ordered' : 'pending',
          externalLink: type === 'study' && link ? link : undefined,
          createdAt: Date.now(),
        };
        set({
          ideas: get().ideas.filter((item) => item.id !== id),
          tasks: [task, ...get().tasks],
        });
      },
      setTaskStatus: (id, status) =>
        set({
          tasks: get().tasks.map((task) =>
            task.id === id ? { ...task, status } : task,
          ),
        }),
      archiveTask: (id) =>
        set({ tasks: get().tasks.filter((task) => task.id !== id) }),
    }),
    {
      name: 'inbox-capture-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ ideas: state.ideas, tasks: state.tasks }),
    },
  ),
);
