import { create } from 'zustand';

const CATEGORIES = [
  { id: 'personal', label: 'Personal', color: '#8b5cf6', gradient: 'linear-gradient(135deg,#8b5cf6,#a78bfa)', emoji: '👤' },
  { id: 'work',     label: 'Work',     color: '#3b82f6', gradient: 'linear-gradient(135deg,#3b82f6,#60a5fa)', emoji: '💼' },
  { id: 'study',    label: 'Study',    color: '#06b6d4', gradient: 'linear-gradient(135deg,#06b6d4,#22d3ee)', emoji: '📚' },
  { id: 'fitness',  label: 'Fitness',  color: '#10b981', gradient: 'linear-gradient(135deg,#10b981,#34d399)', emoji: '💪' },
  { id: 'shopping', label: 'Shopping', color: '#f97316', gradient: 'linear-gradient(135deg,#f97316,#fb923c)', emoji: '🛒' },
];

const PRIORITIES = [
  { id: 'high',   label: 'High',   color: '#ef4444', bg: 'rgba(239,68,68,0.15)'  },
  { id: 'medium', label: 'Medium', color: '#f97316', bg: 'rgba(249,115,22,0.15)' },
  { id: 'low',    label: 'Low',    color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
];

const load = () => {
  try { return JSON.parse(localStorage.getItem('premium-tasks') || '[]'); } catch { return []; }
};

const save = (tasks) => {
  localStorage.setItem('premium-tasks', JSON.stringify(tasks));
};

export const useTaskStore = create((set, get) => ({
  tasks: load(),
  CATEGORIES,
  PRIORITIES,
  filter: { category: 'all', priority: 'all', status: 'all', search: '' },

  setFilter: (key, val) => set(s => ({ filter: { ...s.filter, [key]: val } })),

  addTask: (task) => {
    const newTask = {
      id: Date.now().toString(),
      title: task.title,
      summary: task.summary || '',
      category: task.category || 'personal',
      priority: task.priority || 'medium',
      status: 'todo',
      dueDate: task.dueDate || null,
      color: task.color || '#8b5cf6',
      createdAt: new Date().toISOString(),
    };
    const tasks = [newTask, ...get().tasks];
    save(tasks);
    set({ tasks });
  },

  deleteTask: (id) => {
    const tasks = get().tasks.filter(t => t.id !== id);
    save(tasks);
    set({ tasks });
  },

  updateStatus: (id, status) => {
    const tasks = get().tasks.map(t => t.id === id ? { ...t, status } : t);
    save(tasks);
    set({ tasks });
  },

  reorderTasks: (tasks) => {
    save(tasks);
    set({ tasks });
  },

  filteredTasks: () => {
    const { tasks, filter } = get();
    return tasks.filter(t => {
      if (filter.category !== 'all' && t.category !== filter.category) return false;
      if (filter.priority !== 'all' && t.priority !== filter.priority) return false;
      if (filter.status !== 'all' && t.status !== filter.status) return false;
      if (filter.search && !t.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
      return true;
    });
  },

  getStats: () => {
    const tasks = get().tasks;
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'done').length;
    const inProgress = tasks.filter(t => t.status === 'inprogress').length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, inProgress, todo, percent };
  },
}));

export { CATEGORIES, PRIORITIES };
