import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus } from 'react-icons/fi';
import { useTaskStore } from '../store/useTaskStore';

const overlay = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  exit: { opacity: 0 },
};
const modal = {
  hidden: { opacity: 0, scale: 0.85, y: 40 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 28 } },
  exit: { opacity: 0, scale: 0.85, y: 40 },
};

const COLORS = ['#8b5cf6','#ec4899','#3b82f6','#06b6d4','#10b981','#f97316','#ef4444','#f59e0b'];

export default function TaskModal({ opened, onClose }) {
  const addTask = useTaskStore(s => s.addTask);
  const CATEGORIES = useTaskStore(s => s.CATEGORIES);
  const PRIORITIES = useTaskStore(s => s.PRIORITIES);

  const [title, setTitle]       = useState('');
  const [summary, setSummary]   = useState('');
  const [category, setCategory] = useState('personal');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate]   = useState('');
  const [color, setColor]       = useState('#8b5cf6');
  const [error, setError]       = useState('');

  const reset = () => { setTitle(''); setSummary(''); setCategory('personal'); setPriority('medium'); setDueDate(''); setColor('#8b5cf6'); setError(''); };

  const handleCreate = () => {
    if (!title.trim()) { setError('Title is required'); return; }
    addTask({ title: title.trim(), summary: summary.trim(), category, priority, dueDate, color });
    reset();
    onClose();
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(139,92,246,0.2)',
    borderRadius: 12, color: '#e2e8f0', fontSize: 14, outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  };

  const labelStyle = { fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, display: 'block' };

  return (
    <AnimatePresence>
      {opened && (
        <motion.div
          variants={overlay} initial="hidden" animate="show" exit="exit"
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
          }}
        >
          <motion.div
            variants={modal} initial="hidden" animate="show" exit="exit"
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 520,
              background: 'rgba(20,14,40,0.95)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 24, padding: 32,
              boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 40px rgba(139,92,246,0.15)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
              <div>
                <h2 style={{ color: '#fff', fontWeight: 700, fontSize: 22, margin: 0 }}>Create New Task</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '4px 0 0' }}>Fill in the details below</p>
              </div>
              <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                onClick={() => { reset(); onClose(); }}
                style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 10, padding: 8, cursor: 'pointer', color: '#e2e8f0' }}
              >
                <FiX size={18} />
              </motion.button>
            </div>

            {/* Title */}
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Title *</label>
              <input value={title} onChange={e => { setTitle(e.target.value); setError(''); }}
                placeholder="What needs to be done?" style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'rgba(139,92,246,0.7)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(139,92,246,0.2)')}
              />
              {error && <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{error}</div>}
            </div>

            {/* Summary */}
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Description</label>
              <textarea value={summary} onChange={e => setSummary(e.target.value)}
                placeholder="Add some details..." rows={3}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
                onFocus={e => (e.target.style.borderColor = 'rgba(139,92,246,0.7)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(139,92,246,0.2)')}
              />
            </div>

            {/* Category & Priority */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
              <div>
                <label style={labelStyle}>Category</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {CATEGORIES.map(c => (
                    <motion.button key={c.id} whileTap={{ scale: 0.95 }}
                      onClick={() => setCategory(c.id)}
                      style={{
                        padding: '6px 12px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                        background: category === c.id ? c.color : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${category === c.id ? c.color : 'rgba(255,255,255,0.1)'}`,
                        color: '#fff', cursor: 'pointer', transition: 'all 0.2s',
                      }}
                    >
                      {c.emoji} {c.label}
                    </motion.button>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Priority</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {PRIORITIES.map(p => (
                    <motion.button key={p.id} whileTap={{ scale: 0.95 }}
                      onClick={() => setPriority(p.id)}
                      style={{
                        padding: '8px 12px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                        background: priority === p.id ? p.bg : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${priority === p.id ? p.color : 'rgba(255,255,255,0.1)'}`,
                        color: priority === p.id ? p.color : 'rgba(255,255,255,0.6)',
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                      }}
                    >
                      {p.id === 'high' ? '🔴' : p.id === 'medium' ? '🟡' : '🟢'} {p.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Due Date & Color */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
              <div>
                <label style={labelStyle}>Due Date</label>
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                  style={{ ...inputStyle, colorScheme: 'dark' }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(139,92,246,0.7)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(139,92,246,0.2)')}
                />
              </div>
              <div>
                <label style={labelStyle}>Color Tag</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                  {COLORS.map(c => (
                    <motion.button key={c} whileTap={{ scale: 0.9 }}
                      onClick={() => setColor(c)}
                      style={{
                        width: 28, height: 28, borderRadius: '50%', background: c, border: 'none', cursor: 'pointer',
                        outline: color === c ? `3px solid ${c}` : '3px solid transparent',
                        outlineOffset: 2, transition: 'outline 0.15s',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12 }}>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => { reset(); onClose(); }}
                style={{
                  flex: 1, padding: '13px 0', borderRadius: 14, fontSize: 14, fontWeight: 600,
                  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
                }}
              >
                Cancel
              </motion.button>
              <motion.button whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(139,92,246,0.5)' }} whileTap={{ scale: 0.97 }}
                onClick={handleCreate}
                style={{
                  flex: 2, padding: '13px 0', borderRadius: 14, fontSize: 14, fontWeight: 700,
                  background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', border: 'none',
                  color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                <FiPlus size={16} /> Create Task
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
