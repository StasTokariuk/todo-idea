import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { CATEGORY_ACCENTS } from '@/constants/theme';
import { uk } from '@/constants/uk';
import type {
  Category,
  ConvertIdeaPayload,
  Idea,
  Task,
  TaskUpdate,
  ThemeMode,
} from '@/types/models';

type BoardFilter = 'active' | 'archive';

type AppState = {
  ideas: Idea[];
  tasks: Task[];
  categories: Category[];
  themeMode: ThemeMode;
  boardFilter: BoardFilter;
  setThemeMode: (mode: ThemeMode) => void;
  setBoardFilter: (filter: BoardFilter) => void;
  addIdea: (text: string) => void;
  deleteIdea: (id: string) => void;
  convertIdea: (id: string, payload: ConvertIdeaPayload) => void;
  updateTask: (id: string, patch: TaskUpdate) => void;
  archiveTask: (id: string) => void;
  unarchiveTask: (id: string) => void;
  deleteTask: (id: string) => void;
  setCustomToggle: (id: string, checked: boolean) => void;
  addCategory: (input: {
    name: string;
    accentColor?: string;
    icon?: string;
  }) => string;
  updateCategory: (
    id: string,
    patch: Partial<Pick<Category, 'name' | 'accentColor' | 'icon'>>,
  ) => void;
  deleteCategory: (id: string) => void;
};

export const createId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const CATEGORY_GENERAL = 'cat-general';
export const CATEGORY_STUDY = 'cat-study';
export const CATEGORY_PACKAGES = 'cat-packages';

const SEED_CREATED_AT = '2026-09-12T10:00:00.000Z';

export const SEED_CATEGORIES: Category[] = [
  {
    id: CATEGORY_GENERAL,
    name: uk.defaults.general,
    icon: 'circle',
    accentColor: CATEGORY_ACCENTS[0],
  },
  {
    id: CATEGORY_STUDY,
    name: uk.defaults.study,
    icon: 'book-open',
    accentColor: CATEGORY_ACCENTS[1],
  },
  {
    id: CATEGORY_PACKAGES,
    name: uk.defaults.packages,
    icon: 'package',
    accentColor: CATEGORY_ACCENTS[2],
  },
];

const SEED_IDEAS: Idea[] = [
  {
    id: 'seed-idea-1',
    text: uk.defaults.idea1,
    createdAt: SEED_CREATED_AT,
    status: 'raw',
  },
];

const SEED_TASKS: Task[] = [
  {
    id: 'seed-task-study',
    title: uk.defaults.taskStudy,
    subtitle: '',
    description: '',
    categoryId: CATEGORY_STUDY,
    status: 'pending',
    deadline: null,
    hasCustomToggle: false,
    customToggleLabel: '',
    isCustomToggleChecked: false,
    externalLink: undefined,
    createdAt: '2026-09-12T09:00:00.000Z',
    isArchived: false,
  },
  {
    id: 'seed-task-package',
    title: uk.defaults.taskPackage,
    subtitle: '',
    description: '',
    categoryId: CATEGORY_PACKAGES,
    status: 'arrived',
    deadline: null,
    hasCustomToggle: true,
    customToggleLabel: uk.defaults.arrivedToggle,
    isCustomToggleChecked: true,
    createdAt: '2026-09-12T08:00:00.000Z',
    isArchived: false,
  },
  {
    id: 'seed-task-general',
    title: uk.defaults.taskGeneral,
    subtitle: '',
    description: '',
    categoryId: CATEGORY_GENERAL,
    status: 'pending',
    deadline: null,
    hasCustomToggle: false,
    customToggleLabel: '',
    isCustomToggleChecked: false,
    createdAt: '2026-09-12T09:30:00.000Z',
    isArchived: false,
  },
];

function normalizeTask(raw: Partial<Task> & { type?: string }): Task | null {
  if (!raw?.id || !raw.title) return null;

  let categoryId = raw.categoryId;
  if (!categoryId && raw.type) {
    if (raw.type === 'study') categoryId = CATEGORY_STUDY;
    else if (raw.type === 'package') categoryId = CATEGORY_PACKAGES;
    else categoryId = CATEGORY_GENERAL;
  }

  const createdAt =
    typeof raw.createdAt === 'number'
      ? new Date(raw.createdAt).toISOString()
      : raw.createdAt || new Date().toISOString();

  const isArchived =
    raw.isArchived === true || raw.status === 'archived';

  return {
    id: raw.id,
    title: raw.title,
    subtitle: raw.subtitle ?? '',
    description: raw.description ?? '',
    categoryId: categoryId || '',
    status: isArchived ? 'archived' : (raw.status as Task['status']) || 'pending',
    deadline: raw.deadline ?? null,
    hasCustomToggle: raw.hasCustomToggle ?? false,
    customToggleLabel: raw.customToggleLabel ?? '',
    isCustomToggleChecked: raw.isCustomToggleChecked ?? false,
    externalLink: raw.externalLink,
    createdAt,
    isArchived,
  };
}

function normalizeIdea(raw: Partial<Idea>): Idea | null {
  if (!raw?.id || !raw.text) return null;
  const createdAt =
    typeof raw.createdAt === 'number'
      ? new Date(raw.createdAt).toISOString()
      : raw.createdAt || new Date().toISOString();
  return {
    id: raw.id,
    text: raw.text,
    createdAt,
    status: 'raw',
  };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ideas: SEED_IDEAS,
      tasks: SEED_TASKS,
      categories: SEED_CATEGORIES,
      themeMode: 'dark',
      boardFilter: 'active',
      setThemeMode: (mode) => set({ themeMode: mode }),
      setBoardFilter: (filter) => set({ boardFilter: filter }),
      addIdea: (text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        set({
          ideas: [
            {
              id: createId(),
              text: trimmed,
              createdAt: new Date().toISOString(),
              status: 'raw',
            },
            ...get().ideas,
          ],
        });
      },
      deleteIdea: (id) =>
        set({ ideas: get().ideas.filter((idea) => idea.id !== id) }),
      convertIdea: (id, payload) => {
        const idea = get().ideas.find((item) => item.id === id);
        if (!idea) return;
        const category = get().categories.find((c) => c.id === payload.categoryId);
        const isPackages = payload.categoryId === CATEGORY_PACKAGES;
        const hasToggle =
          payload.hasCustomToggle ?? (isPackages ? true : false);
        const toggleLabel =
          payload.customToggleLabel?.trim() ||
          (isPackages ? uk.defaults.arrivedToggle : '');
        const checked = payload.isCustomToggleChecked ?? false;
        const status =
          payload.status ??
          (isPackages ? (checked ? 'arrived' : 'ordered') : 'pending');

        const task: Task = {
          id: createId(),
          title: idea.text,
          subtitle: payload.subtitle?.trim() || '',
          description: payload.description?.trim() || '',
          categoryId: payload.categoryId || '',
          status,
          deadline: payload.deadline ?? null,
          hasCustomToggle: hasToggle,
          customToggleLabel: hasToggle ? toggleLabel : '',
          isCustomToggleChecked: hasToggle ? checked : false,
          externalLink: payload.externalLink?.trim() || undefined,
          createdAt: new Date().toISOString(),
          isArchived: false,
        };

        void category;
        set({
          ideas: get().ideas.filter((item) => item.id !== id),
          tasks: [task, ...get().tasks],
        });
      },
      updateTask: (id, patch) =>
        set({
          tasks: get().tasks.map((task) => {
            if (task.id !== id) return task;
            const next = { ...task, ...patch };
            if (patch.isArchived === true) {
              next.status = 'archived';
              next.isArchived = true;
            }
            if (patch.isArchived === false && task.isArchived) {
              next.isArchived = false;
              if (next.status === 'archived') next.status = 'pending';
            }
            return next;
          }),
        }),
      archiveTask: (id) =>
        set({
          tasks: get().tasks.map((task) =>
            task.id === id
              ? { ...task, isArchived: true, status: 'archived' as const }
              : task,
          ),
        }),
      unarchiveTask: (id) =>
        set({
          tasks: get().tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  isArchived: false,
                  status:
                    task.hasCustomToggle && task.isCustomToggleChecked
                      ? ('arrived' as const)
                      : task.hasCustomToggle
                        ? ('ordered' as const)
                        : ('pending' as const),
                }
              : task,
          ),
        }),
      deleteTask: (id) => {
        const next = get().tasks.filter((task) => task.id !== id);
        set({ tasks: next });
      },
      setCustomToggle: (id, checked) =>
        set({
          tasks: get().tasks.map((task) => {
            if (task.id !== id) return task;
            const category = get().categories.find((c) => c.id === task.categoryId);
            const isPackages =
              task.categoryId === CATEGORY_PACKAGES ||
              category?.name === uk.defaults.packages;
            return {
              ...task,
              isCustomToggleChecked: checked,
              status: isPackages
                ? checked
                  ? ('arrived' as const)
                  : ('ordered' as const)
                : task.status,
            };
          }),
        }),
      addCategory: ({ name, accentColor, icon }) => {
        const id = createId();
        const color =
          accentColor ||
          CATEGORY_ACCENTS[get().categories.length % CATEGORY_ACCENTS.length];
        set({
          categories: [
            ...get().categories,
            {
              id,
              name: name.trim(),
              accentColor: color,
              icon: icon || 'tag',
            },
          ],
        });
        return id;
      },
      updateCategory: (id, patch) =>
        set({
          categories: get().categories.map((cat) =>
            cat.id === id
              ? {
                  ...cat,
                  ...patch,
                  name: patch.name?.trim() || cat.name,
                }
              : cat,
          ),
        }),
      deleteCategory: (id) => {
        const remaining = get().categories.filter((c) => c.id !== id);
        // Prefer first remaining category; otherwise leave tasks uncategorized.
        const fallbackId = remaining[0]?.id ?? '';
        set({
          categories: remaining,
          tasks: get().tasks.map((task) =>
            task.categoryId === id
              ? { ...task, categoryId: fallbackId }
              : task,
          ),
        });
      },
    }),
    {
      name: 'inbox-capture-store-v2',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        ideas: state.ideas,
        tasks: state.tasks,
        categories: state.categories,
        themeMode: state.themeMode,
      }),
      merge: (persisted, current) => {
        const p = (persisted || {}) as Partial<AppState>;

        const ideas = Array.isArray(p.ideas)
          ? ((p.ideas as Partial<Idea>[])
              .map((idea) => normalizeIdea(idea))
              .filter(Boolean) as Idea[])
          : current.ideas;

        const tasks = Array.isArray(p.tasks)
          ? ((p.tasks as (Partial<Task> & { type?: string })[])
              .map((task) => normalizeTask(task))
              .filter(Boolean) as Task[])
          : current.tasks;

        const categories = Array.isArray(p.categories)
          ? (p.categories as Category[]).map((cat) => ({
              id: cat.id,
              name: cat.name,
              icon: cat.icon,
              accentColor: cat.accentColor || CATEGORY_ACCENTS[0],
            }))
          : current.categories;

        return {
          ...current,
          ideas,
          tasks,
          categories: categories.length ? categories : current.categories,
          themeMode: p.themeMode || current.themeMode,
        };
      },
    },
  ),
);
