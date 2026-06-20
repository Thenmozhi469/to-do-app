import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import TaskCard from './TaskCard';
import { useTaskStore } from '../store/useTaskStore';

const COLUMNS = [
  { id: 'todo',       label: 'To Do',       color: '#3b82f6', emoji: '📋', glow: 'rgba(59,130,246,0.2)' },
  { id: 'inprogress', label: 'In Progress', color: '#f97316', emoji: '⚡', glow: 'rgba(249,115,22,0.2)' },
  { id: 'done',       label: 'Completed',   color: '#10b981', emoji: '✅', glow: 'rgba(16,185,129,0.2)' },
];

export default function KanbanBoard({ onNewTask }) {
  const filteredTasks = useTaskStore(s => s.filteredTasks)();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
      {COLUMNS.map((col, ci) => {
        const colTasks = filteredTasks.filter(t => t.status === col.id);
        return (
          <motion.div
            key={col.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ci * 0.1 + 0.2 }}
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${col.color}28`,
              borderRadius: 20, padding: 16,
              minHeight: 400,
            }}
          >
            {/* Column header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `${col.color}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18,
                }}>
                  {col.emoji}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>{col.label}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{colTasks.length} tasks</div>
                </div>
              </div>
              <div style={{
                background: `${col.color}20`, color: col.color,
                borderRadius: 8, padding: '2px 10px', fontSize: 13, fontWeight: 700,
              }}>
                {colTasks.length}
              </div>
            </div>

            {/* Colored line */}
            <div style={{ height: 2, background: `linear-gradient(90deg,${col.color},transparent)`, borderRadius: 2, marginBottom: 16 }} />

            {/* Tasks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <AnimatePresence mode="popLayout">
                {colTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </AnimatePresence>
              {colTasks.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{
                    textAlign: 'center', padding: '40px 20px',
                    color: 'rgba(255,255,255,0.2)', fontSize: 13,
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>
                    {col.id === 'todo' ? '📭' : col.id === 'inprogress' ? '🚀' : '🎉'}
                  </div>
                  {col.id === 'todo' ? 'No tasks to do' :
                   col.id === 'inprogress' ? 'Nothing in progress' :
                   "You're all caught up!"}
                </motion.div>
              )}
            </div>

            {/* Add task btn for todo column */}
            {col.id === 'todo' && (
              <motion.button
                whileHover={{ scale: 1.02, borderColor: col.color }}
                whileTap={{ scale: 0.97 }}
                onClick={onNewTask}
                style={{
                  width: '100%', padding: '10px', borderRadius: 12, marginTop: 12,
                  background: 'transparent', border: `1.5px dashed rgba(59,130,246,0.3)`,
                  color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: 13,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  transition: 'all 0.2s',
                }}
              >
                <FiPlus size={14} /> Add Task
              </motion.button>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
