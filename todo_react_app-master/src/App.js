import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiList, FiBarChart2, FiGrid, FiCheckSquare } from 'react-icons/fi';

import ParticleBackground from './components/ParticleBackground';
import Header from './components/Header';
import StatsDashboard from './components/StatsDashboard';
import KanbanBoard from './components/KanbanBoard';
import FilterBar from './components/FilterBar';
import TaskModal from './components/TaskModal';
import ProductivityWidgets from './components/ProductivityWidgets';
import CompletionBoard from './components/CompletionBoard';
import GlassCard from './components/GlassCard';
import { useTaskStore } from './store/useTaskStore';
import './index.css';

const TABS = [
  { id: 'dashboard',  label: 'Dashboard',  icon: FiBarChart2    },
  { id: 'kanban',     label: 'Kanban',     icon: FiGrid         },
  { id: 'list',       label: 'List',       icon: FiList         },
  { id: 'completion', label: 'Completion', icon: FiCheckSquare  },
];

function TaskListView({ onNewTask }) {
  const filteredTasks = useTaskStore(s => s.filteredTasks)();
  const deleteTask = useTaskStore(s => s.deleteTask);
  const updateStatus = useTaskStore(s => s.updateStatus);
  const CATEGORIES = useTaskStore(s => s.CATEGORIES);
  const PRIORITIES = useTaskStore(s => s.PRIORITIES);

  if (filteredTasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', padding: '80px 20px' }}
      >
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
        <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 22, margin: '0 0 8px' }}>You're all caught up!</h3>
        <p style={{ color: 'rgba(255,255,255,0.4)', margin: '0 0 24px' }}>Create your first task to get started.</p>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(139,92,246,0.4)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onNewTask}
          style={{
            padding: '12px 28px', borderRadius: 14, fontSize: 14, fontWeight: 700,
            background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', border: 'none',
            color: '#fff', cursor: 'pointer',
          }}
        >
          + Create Task
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <AnimatePresence>
        {filteredTasks.map((task, i) => {
          const cat = CATEGORIES.find(c => c.id === task.category) || CATEGORIES[0];
          const pri = PRIORITIES.find(p => p.id === task.priority) || PRIORITIES[1];
          const isDone = task.status === 'done';
          return (
            <motion.div
              key={task.id} layout
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ x: 4 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px',
                background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)',
                border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 14,
                borderLeft: `3px solid ${task.color}`,
              }}
            >
              {/* Checkbox */}
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => updateStatus(task.id, isDone ? 'todo' : 'done')}
                style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  background: isDone ? '#10b981' : 'transparent',
                  border: `2px solid ${isDone ? '#10b981' : 'rgba(255,255,255,0.3)'}`,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {isDone && <span style={{ color: '#fff', fontSize: 12 }}>✓</span>}
              </motion.button>

              {/* Title & summary */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: isDone ? 'rgba(255,255,255,0.4)' : '#fff',
                  textDecoration: isDone ? 'line-through' : 'none',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {task.title}
                </div>
                {task.summary && (
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {task.summary}
                  </div>
                )}
              </div>

              {/* Badges */}
              <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 8,
                background: `${cat.color}20`, color: cat.color, flexShrink: 0 }}>
                {cat.emoji} {cat.label}
              </span>
              <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 8,
                background: pri.bg, color: pri.color, flexShrink: 0 }}>
                {pri.label}
              </span>

              {/* Delete */}
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => deleteTask(task.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(255,255,255,0.25)', padding: 4, flexShrink: 0 }}
              >
                ✕
              </motion.button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const [dark, setDark] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [modalOpen, setModalOpen] = useState(false);
  const completedCount = useTaskStore(s => s.tasks).filter(t => t.status === 'done').length;

  return (
    <div style={{ minHeight: '100vh', position: 'relative', color: '#e2e8f0' }}>
      <ParticleBackground />

      {/* Main content above bg */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Header dark={dark} toggleDark={() => setDark(d => !d)} />

        <main style={{ maxWidth: 1400, margin: '0 auto', padding: '28px 24px 60px' }}>

          {/* Tab navigation */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}
          >
            <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: 4 }}>
              {TABS.map(tab => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    padding: '8px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                    background: activeTab === tab.id
                      ? tab.id === 'completion'
                        ? 'linear-gradient(135deg,#10b981,#06b6d4)'
                        : 'linear-gradient(135deg,#8b5cf6,#ec4899)'
                      : 'transparent',
                    border: 'none', color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.45)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
                    boxShadow: activeTab === tab.id
                      ? tab.id === 'completion'
                        ? '0 4px 16px rgba(16,185,129,0.3)'
                        : '0 4px 16px rgba(139,92,246,0.3)'
                      : 'none',
                    transition: 'all 0.2s', position: 'relative',
                  }}
                >
                  <tab.icon size={14} />
                  {tab.label}
                  {tab.id === 'completion' && completedCount > 0 && (
                    <span style={{
                      background: '#10b981', color: '#fff', borderRadius: 99,
                      fontSize: 10, fontWeight: 800, padding: '1px 6px', lineHeight: 1.6,
                      minWidth: 18, textAlign: 'center',
                    }}>
                      {completedCount}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>

            {/* New task CTA */}
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(139,92,246,0.5)' }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setModalOpen(true)}
              style={{
                padding: '10px 22px', borderRadius: 14, fontSize: 14, fontWeight: 700,
                background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', border: 'none',
                color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: '0 4px 20px rgba(139,92,246,0.35)',
              }}
            >
              <FiPlus size={16} />
              New Task
            </motion.button>
          </motion.div>

          {/* Filter bar — shown on kanban & list */}
          <AnimatePresence>
            {(activeTab === 'kanban' || activeTab === 'list') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                style={{ marginBottom: 20, overflow: 'hidden' }}
              >
                <FilterBar />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <StatsDashboard />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
                      Productivity Widgets
                    </div>
                    <ProductivityWidgets />
                  </div>

                  {/* Quick tasks preview */}
                  <GlassCard hover={false} style={{ padding: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                      <div style={{ fontWeight: 700, fontSize: 16, color: '#fff' }}>Recent Tasks</div>
                      <motion.button
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        onClick={() => setActiveTab('kanban')}
                        style={{ fontSize: 12, fontWeight: 600, color: '#8b5cf6', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        View All →
                      </motion.button>
                    </div>
                    <TaskListView onNewTask={() => setModalOpen(true)} />
                  </GlassCard>
                </div>
              </motion.div>
            )}

            {activeTab === 'kanban' && (
              <motion.div
                key="kanban"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <KanbanBoard onNewTask={() => setModalOpen(true)} />
              </motion.div>
            )}

            {activeTab === 'list' && (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard hover={false} style={{ padding: 24 }}>
                  <TaskListView onNewTask={() => setModalOpen(true)} />
                </GlassCard>
              </motion.div>
            )}

            {activeTab === 'completion' && (
              <motion.div
                key="completion"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CompletionBoard />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Task creation modal */}
      <TaskModal opened={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Floating action button (mobile) */}
      <motion.button
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        onClick={() => setModalOpen(true)}
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 200,
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg,#8b5cf6,#ec4899)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(139,92,246,0.5)',
          color: '#fff',
        }}
        animate={{ boxShadow: ['0 8px 32px rgba(139,92,246,0.4)', '0 8px 40px rgba(236,72,153,0.5)', '0 8px 32px rgba(139,92,246,0.4)'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <FiPlus size={24} />
      </motion.button>
    </div>
  );
}
