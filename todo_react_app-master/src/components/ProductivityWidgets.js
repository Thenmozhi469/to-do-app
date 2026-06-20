import React from 'react';
import { motion } from 'framer-motion';
import { FiZap, FiAward, FiTrendingUp, FiStar } from 'react-icons/fi';
import GlassCard from './GlassCard';
import { useTaskStore } from '../store/useTaskStore';

export default function ProductivityWidgets() {
  const getStats = useTaskStore(s => s.getStats);
  const { total, completed, percent } = getStats();

  const streak = completed > 0 ? Math.min(completed, 7) : 0;
  const focusScore = Math.min(Math.round(percent * 0.8 + streak * 5), 100);
  const weeklyCompletion = Math.min(completed, total);

  const widgets = [
    { label: 'Daily Streak', value: `${streak}`, unit: 'days', icon: FiZap, color: '#f97316', glow: 'rgba(249,115,22,0.3)', suffix: '🔥' },
    { label: 'Focus Score', value: focusScore, unit: '/100', icon: FiStar, color: '#8b5cf6', glow: 'rgba(139,92,246,0.3)', suffix: '⭐' },
    { label: 'Weekly Done', value: weeklyCompletion, unit: 'tasks', icon: FiAward, color: '#10b981', glow: 'rgba(16,185,129,0.3)', suffix: '🏆' },
    { label: 'Productivity', value: `${percent}`, unit: '%', icon: FiTrendingUp, color: '#06b6d4', glow: 'rgba(6,182,212,0.3)', suffix: '📈' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
      {widgets.map((w, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <GlassCard glow={w.glow} style={{ padding: 20, textAlign: 'center' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: `${w.color}20`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px',
            }}>
              <w.icon size={20} color={w.color} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', lineHeight: 1 }}>
              {w.value}<span style={{ fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>{w.unit}</span>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 6, fontWeight: 500 }}>
              {w.label} {w.suffix}
            </div>
            {/* Mini progress bar */}
            <div style={{ marginTop: 12, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((parseFloat(w.value) / (w.unit === '%' || w.unit === '/100' ? 100 : Math.max(total, 1))) * 100, 100)}%` }}
                transition={{ duration: 1.2, delay: i * 0.1 + 0.5, ease: 'easeOut' }}
                style={{ height: '100%', borderRadius: 99, background: w.color }}
              />
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}
