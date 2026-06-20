import React from 'react';
import { motion } from 'framer-motion';
import { FiTrash2, FiArrowRight, FiCheckCircle, FiClock, FiCalendar } from 'react-icons/fi';
import { useTaskStore } from '../store/useTaskStore';

const STATUS_NEXT = { todo: 'inprogress', inprogress: 'done', done: 'todo' };
const STATUS_LABEL = { todo: 'To Do', inprogress: 'In Progress', done: 'Done' };
const STATUS_COLOR = { todo: '#3b82f6', inprogress: '#f97316', done: '#10b981' };
const STATUS_ICON = { todo: FiClock, inprogress: FiArrowRight, done: FiCheckCircle };

export default function TaskCard({ task }) {
  const deleteTask = useTaskStore(s => s.deleteTask);
  const updateStatus = useTaskStore(s => s.updateStatus);
  const CATEGORIES = useTaskStore(s => s.CATEGORIES);
  const PRIORITIES = useTaskStore(s => s.PRIORITIES);

  const cat = CATEGORIES.find(c => c.id === task.category) || CATEGORIES[0];
  const pri = PRIORITIES.find(p => p.id === task.priority) || PRIORITIES[1];
  const StatusIcon = STATUS_ICON[task.status];

  const isDone = task.status === 'done';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: -10 }}
      whileHover={{ y: -3, boxShadow: `0 16px 40px rgba(0,0,0,0.35), 0 0 20px ${task.color}22` }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      style={{
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${isDone ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: 16,
        padding: '16px',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Color accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${task.color}, transparent)`,
        borderRadius: '16px 16px 0 0',
      }} />

      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontWeight: 700, fontSize: 14, color: isDone ? 'rgba(255,255,255,0.45)' : '#fff',
            textDecoration: isDone ? 'line-through' : 'none',
            marginBottom: 4, lineHeight: 1.4,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {task.title}
          </div>
          {task.summary && (
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4, marginBottom: 10,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {task.summary}
            </div>
          )}
        </div>

        {/* Delete */}
        <motion.button
          whileHover={{ scale: 1.15, color: '#ef4444' }}
          whileTap={{ scale: 0.9 }}
          onClick={() => deleteTask(task.id)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 4, flexShrink: 0 }}
        >
          <FiTrash2 size={14} />
        </motion.button>
      </div>

      {/* Badges row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
        <span style={{
          fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 8,
          background: `${cat.color}22`, color: cat.color, border: `1px solid ${cat.color}33`,
        }}>
          {cat.emoji} {cat.label}
        </span>
        <span style={{
          fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 8,
          background: pri.bg, color: pri.color, border: `1px solid ${pri.color}33`,
        }}>
          {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'} {pri.label}
        </span>
        {task.dueDate && (
          <span style={{
            fontSize: 11, fontWeight: 500, padding: '3px 8px', borderRadius: 8,
            background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <FiCalendar size={10} />
            {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>

      {/* Status advance button */}
      <motion.button
        whileHover={{ scale: 1.02, boxShadow: `0 4px 16px ${STATUS_COLOR[task.status]}44` }}
        whileTap={{ scale: 0.97 }}
        onClick={() => updateStatus(task.id, STATUS_NEXT[task.status])}
        style={{
          width: '100%', padding: '8px', borderRadius: 10, fontSize: 12, fontWeight: 600,
          background: `${STATUS_COLOR[task.status]}18`,
          border: `1px solid ${STATUS_COLOR[task.status]}44`,
          color: STATUS_COLOR[task.status], cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          transition: 'all 0.2s',
        }}
      >
        <StatusIcon size={13} />
        {STATUS_LABEL[task.status]}
        {!isDone && <FiArrowRight size={12} />}
      </motion.button>

      {/* Done overlay glow */}
      {isDone && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{
            position: 'absolute', inset: 0, borderRadius: 16,
            background: 'rgba(16,185,129,0.04)',
            pointerEvents: 'none',
          }}
        />
      )}
    </motion.div>
  );
}
