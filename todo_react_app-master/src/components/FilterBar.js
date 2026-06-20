import React from 'react';
import { motion } from 'framer-motion';
import { useTaskStore } from '../store/useTaskStore';

export default function FilterBar() {
  const filter = useTaskStore(s => s.filter);
  const setFilter = useTaskStore(s => s.setFilter);
  const CATEGORIES = useTaskStore(s => s.CATEGORIES);
  const PRIORITIES = useTaskStore(s => s.PRIORITIES);

  const chip = (active, color, onClick, children) => (
    <motion.button
      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600,
        background: active ? `${color}25` : 'rgba(255,255,255,0.06)',
        border: `1.5px solid ${active ? color : 'rgba(255,255,255,0.1)'}`,
        color: active ? color : 'rgba(255,255,255,0.5)',
        cursor: 'pointer', transition: 'all 0.18s', whiteSpace: 'nowrap',
      }}
    >
      {children}
    </motion.button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16, padding: '14px 20px',
        display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
      }}
    >
      {/* Category */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Category</span>
        {chip(filter.category === 'all', '#8b5cf6', () => setFilter('category', 'all'), 'All')}
        {CATEGORIES.map(c => chip(filter.category === c.id, c.color, () => setFilter('category', c.id), `${c.emoji} ${c.label}`))}
      </div>

      <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.08)' }} />

      {/* Priority */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Priority</span>
        {chip(filter.priority === 'all', '#8b5cf6', () => setFilter('priority', 'all'), 'All')}
        {PRIORITIES.map(p => chip(filter.priority === p.id, p.color, () => setFilter('priority', p.id), p.label))}
      </div>

      <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.08)' }} />

      {/* Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Status</span>
        {[['all','All','#8b5cf6'],['todo','To Do','#3b82f6'],['inprogress','In Progress','#f97316'],['done','Done','#10b981']].map(([id,label,color]) =>
          chip(filter.status === id, color, () => setFilter('status', id), label)
        )}
      </div>
    </motion.div>
  );
}
