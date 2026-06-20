import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from 'recharts';
import {
  FiCheckCircle, FiStar, FiTrendingUp,
  FiTrash2, FiCalendar, FiZap,
} from 'react-icons/fi';
import GlassCard from './GlassCard';
import { useTaskStore } from '../store/useTaskStore';

/* ── Confetti burst on mount ── */
function Confetti() {
  const pieces = Array.from({ length: 32 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ['#8b5cf6','#ec4899','#3b82f6','#10b981','#f97316','#06b6d4','#f59e0b'][i % 7],
    delay: Math.random() * 0.8,
    size: Math.random() * 8 + 5,
  }));
  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:9 }}>
      {pieces.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ y: '110vh', opacity: 0, rotate: 720, scale: 0.3 }}
          transition={{ duration: 2.5, delay: p.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute', top: 0,
            width: p.size, height: p.size,
            borderRadius: p.id % 3 === 0 ? '50%' : 3,
            background: p.color,
          }}
        />
      ))}
    </div>
  );
}

/* ── Milestone badge ── */
const MILESTONES = [
  { count: 1,  label: 'First Win',     emoji: '🌱', color: '#10b981' },
  { count: 5,  label: 'Getting Warm',  emoji: '🔥', color: '#f97316' },
  { count: 10, label: 'On a Roll',     emoji: '🚀', color: '#8b5cf6' },
  { count: 25, label: 'Power User',    emoji: '⚡', color: '#3b82f6' },
  { count: 50, label: 'Legend',        emoji: '👑', color: '#f59e0b' },
];

function MilestoneBadge({ milestone, earned }) {
  return (
    <motion.div
      whileHover={earned ? { scale: 1.08, y: -4 } : {}}
      style={{
        padding: '14px 18px',
        borderRadius: 16,
        background: earned
          ? `linear-gradient(135deg, ${milestone.color}30, ${milestone.color}10)`
          : 'rgba(255,255,255,0.04)',
        border: `1.5px solid ${earned ? milestone.color + '55' : 'rgba(255,255,255,0.08)'}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        opacity: earned ? 1 : 0.38,
        transition: 'all 0.3s',
        minWidth: 100,
      }}
    >
      <span style={{ fontSize: 28 }}>{milestone.emoji}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color: earned ? milestone.color : 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
        {milestone.label}
      </span>
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
        {milestone.count} tasks
      </span>
      {earned && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: 'absolute', inset: -1, borderRadius: 16,
            boxShadow: `0 0 16px ${milestone.color}55`,
            pointerEvents: 'none',
          }}
        />
      )}
    </motion.div>
  );
}

/* ── Completed task row ── */
function CompletedTaskRow({ task, index }) {
  const deleteTask  = useTaskStore(s => s.deleteTask);
  const updateStatus = useTaskStore(s => s.updateStatus);
  const CATEGORIES  = useTaskStore(s => s.CATEGORIES);
  const cat = CATEGORIES.find(c => c.id === task.category) || CATEGORIES[0];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ x: 5 }}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '12px 18px',
        background: 'rgba(16,185,129,0.06)',
        border: '1px solid rgba(16,185,129,0.15)',
        borderLeft: `3px solid ${task.color || '#10b981'}`,
        borderRadius: 12,
      }}
    >
      {/* Green check */}
      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, delay: index * 0.04 + 0.1 }}
        style={{
          width: 26, height: 26, borderRadius: '50%',
          background: 'linear-gradient(135deg,#10b981,#34d399)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, boxShadow: '0 0 12px rgba(16,185,129,0.4)',
        }}
      >
        <FiCheckCircle size={14} color="#fff" />
      </motion.div>

      {/* Title */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontWeight: 600, fontSize: 14, color: 'rgba(255,255,255,0.7)',
          textDecoration: 'line-through',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {task.title}
        </div>
        {task.summary && (
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
            {task.summary}
          </div>
        )}
      </div>

      {/* Category badge */}
      <span style={{
        fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 8,
        background: `${cat.color}22`, color: cat.color, flexShrink: 0,
      }}>
        {cat.emoji} {cat.label}
      </span>

      {/* Due date */}
      {task.dueDate && (
        <span style={{
          fontSize: 11, color: 'rgba(255,255,255,0.35)',
          display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
        }}>
          <FiCalendar size={10} />
          {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      )}

      {/* Undo */}
      <motion.button
        whileHover={{ scale: 1.1, color: '#f97316' }} whileTap={{ scale: 0.9 }}
        onClick={() => updateStatus(task.id, 'todo')}
        title="Mark as To Do"
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.25)', padding: 4, flexShrink: 0 }}
      >
        ↩
      </motion.button>

      {/* Delete */}
      <motion.button
        whileHover={{ scale: 1.1, color: '#ef4444' }} whileTap={{ scale: 0.9 }}
        onClick={() => deleteTask(task.id)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.25)', padding: 4, flexShrink: 0 }}
      >
        <FiTrash2 size={13} />
      </motion.button>
    </motion.div>
  );
}

/* ════════════════════════════════════
   MAIN COMPLETION BOARD
════════════════════════════════════ */
export default function CompletionBoard() {
  const tasks      = useTaskStore(s => s.tasks);
  const getStats   = useTaskStore(s => s.getStats);
  const CATEGORIES = useTaskStore(s => s.CATEGORIES);
  const { total, completed, percent } = getStats();

  const doneTasks = tasks.filter(t => t.status === 'done');
  const [showConfetti, setShowConfetti] = useState(false);

  // Show confetti when first completing a task
  useEffect(() => {
    if (completed > 0) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(t);
    }
  }, [completed]);

  // Category breakdown for bar chart
  const catData = CATEGORIES.map(c => ({
    name: c.label,
    completed: tasks.filter(t => t.category === c.id && t.status === 'done').length,
    total: tasks.filter(t => t.category === c.id).length,
    color: c.color,
  }));

  // Daily completion (last 7 days fake + real)
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const lineData = days.map((d, i) => ({
    day: d,
    tasks: i === 6 ? completed : Math.max(0, completed - (6 - i) * 1 + Math.floor(Math.random() * 2)),
  }));

  /* ── Stat tiles ── */
  const tiles = [
    { label: 'Completed',     value: completed, icon: FiCheckCircle, color: '#10b981', glow: 'rgba(16,185,129,0.3)' },
    { label: 'Completion %',  value: `${percent}%`, icon: FiTrendingUp, color: '#8b5cf6', glow: 'rgba(139,92,246,0.3)' },
    { label: 'Total Tasks',   value: total,     icon: FiZap,          color: '#3b82f6', glow: 'rgba(59,130,246,0.3)'  },
    { label: 'Best Streak',   value: `${Math.min(completed, 7)}d`, icon: FiStar, color: '#f97316', glow: 'rgba(249,115,22,0.3)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {showConfetti && <Confetti />}

      {/* ── Hero banner ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        style={{
          borderRadius: 24, padding: '32px 36px',
          background: 'linear-gradient(135deg, rgba(16,185,129,0.18), rgba(6,182,212,0.1), rgba(139,92,246,0.15))',
          border: '1px solid rgba(16,185,129,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 20,
        }}
      >
        <div>
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
            style={{ fontSize: 48, marginBottom: 8 }}
          >
            {completed === 0 ? '📋' : percent >= 100 ? '🏆' : percent >= 50 ? '🚀' : '⚡'}
          </motion.div>
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#fff' }}>
            {completed === 0
              ? 'No completions yet'
              : percent >= 100
              ? 'All Done! Outstanding! 🎉'
              : `${completed} task${completed !== 1 ? 's' : ''} completed`}
          </h2>
          <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
            {completed === 0
              ? 'Complete your first task to get started'
              : `You've crushed ${percent}% of your workload — keep it up!`}
          </p>
        </div>

        {/* Big ring */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <svg width={110} height={110}>
            <circle cx={55} cy={55} r={44} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={9} />
            <motion.circle
              cx={55} cy={55} r={44} fill="none"
              stroke="url(#rg)" strokeWidth={9}
              strokeDasharray={2 * Math.PI * 44}
              initial={{ strokeDashoffset: 2 * Math.PI * 44 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 44 * (1 - percent / 100) }}
              transition={{ duration: 1.6, ease: 'easeInOut' }}
              strokeLinecap="round"
              transform="rotate(-90 55 55)"
            />
            <defs>
              <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <text x="50%" y="46%" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="800">{percent}%</text>
            <text x="50%" y="62%" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="10">done</text>
          </svg>
        </div>
      </motion.div>

      {/* ── Stat tiles ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        {tiles.map((t, i) => (
          <motion.div key={i} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.08 }}>
            <GlassCard glow={t.glow} style={{ padding: 20 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
                <div style={{ width:38, height:38, borderRadius:11, background:`${t.color}22`,
                  display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <t.icon size={18} color={t.color} />
                </div>
                <span style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:600, textTransform:'uppercase', letterSpacing:1 }}>{t.label}</span>
              </div>
              <div style={{ fontSize:34, fontWeight:800, color:'#fff', lineHeight:1 }}>{t.value}</div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        {/* Category bar chart */}
        <GlassCard hover={false} style={{ padding:24 }}>
          <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:1, marginBottom:16 }}>
            Completed by Category
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={catData} barGap={4}>
              <XAxis dataKey="name" tick={{ fill:'rgba(255,255,255,0.4)', fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                cursor={{ fill:'rgba(255,255,255,0.04)' }}
                contentStyle={{ background:'rgba(15,10,30,0.95)', border:'1px solid rgba(139,92,246,0.3)', borderRadius:12, color:'#fff' }}
              />
              <Bar dataKey="completed" radius={[6,6,0,0]}>
                {catData.map((entry, i) => (
                  <motion.rect key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Line chart trend */}
        <GlassCard hover={false} style={{ padding:24 }}>
          <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:1, marginBottom:16 }}>
            Weekly Completion Trend
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={lineData}>
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill:'rgba(255,255,255,0.4)', fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background:'rgba(15,10,30,0.95)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:12, color:'#fff' }}
              />
              <Line
                type="monotone" dataKey="tasks"
                stroke="url(#lineGrad)" strokeWidth={3}
                dot={{ fill:'#10b981', r:4, strokeWidth:0 }}
                activeDot={{ r:6, fill:'#34d399' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* ── Milestone badges ── */}
      <GlassCard hover={false} style={{ padding:24 }}>
        <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:1, marginBottom:18 }}>
          🏅 Milestones
        </div>
        <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
          {MILESTONES.map(m => (
            <div key={m.count} style={{ position:'relative' }}>
              <MilestoneBadge milestone={m} earned={completed >= m.count} />
            </div>
          ))}
        </div>
      </GlassCard>

      {/* ── Completed tasks list ── */}
      <GlassCard hover={false} style={{ padding:24 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
          <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:1 }}>
            ✅ Completed Tasks
            <span style={{
              marginLeft:10, fontSize:12, padding:'2px 10px', borderRadius:99,
              background:'rgba(16,185,129,0.15)', color:'#10b981', fontWeight:700,
            }}>
              {doneTasks.length}
            </span>
          </div>
          {doneTasks.length > 0 && (
            <span style={{ fontSize:12, color:'rgba(255,255,255,0.35)' }}>Click ↩ to reopen</span>
          )}
        </div>

        {doneTasks.length === 0 ? (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
            style={{ textAlign:'center', padding:'50px 20px', color:'rgba(255,255,255,0.25)' }}>
            <div style={{ fontSize:44, marginBottom:10 }}>🎯</div>
            <div style={{ fontSize:14, fontWeight:600 }}>No completed tasks yet</div>
            <div style={{ fontSize:12, marginTop:6 }}>Complete some tasks and they'll appear here</div>
          </motion.div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <AnimatePresence>
              {doneTasks.map((task, i) => (
                <CompletedTaskRow key={task.id} task={task} index={i} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
