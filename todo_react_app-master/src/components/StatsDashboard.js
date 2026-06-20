import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts';
import { FiCheckCircle, FiClock, FiList, FiTrendingUp } from 'react-icons/fi';
import GlassCard from './GlassCard';
import { useTaskStore } from '../store/useTaskStore';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };

function CircularProgress({ value, color, size = 80 }) {
  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={7} />
      <motion.circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={7}
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.4, ease: 'easeInOut' }}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
      />
      <text x="50%" y="54%" textAnchor="middle" fill="#fff" fontSize={size * 0.2} fontWeight="700">{value}%</text>
    </svg>
  );
}

export default function StatsDashboard() {
  const getStats = useTaskStore(s => s.getStats);
  const tasks = useTaskStore(s => s.tasks);
  const CATEGORIES = useTaskStore(s => s.CATEGORIES);
  const { total, completed, inProgress, todo, percent } = getStats();

  const pieData = CATEGORIES.map(c => ({
    name: c.label,
    value: tasks.filter(t => t.category === c.id).length || 0,
    color: c.color,
  })).filter(d => d.value > 0);

  // Weekly fake progress data
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const weekData = days.map((d, i) => ({
    day: d,
    completed: Math.floor(Math.random() * 5 + (i === 6 ? completed : 1)),
    added: Math.floor(Math.random() * 3 + 1),
  }));

  const statCards = [
    { label: 'Total Tasks', value: total, icon: FiList, color: '#8b5cf6', glow: 'rgba(139,92,246,0.3)' },
    { label: 'Completed', value: completed, icon: FiCheckCircle, color: '#10b981', glow: 'rgba(16,185,129,0.3)' },
    { label: 'In Progress', value: inProgress, icon: FiClock, color: '#f97316', glow: 'rgba(249,115,22,0.3)' },
    { label: 'To Do', value: todo, icon: FiTrendingUp, color: '#3b82f6', glow: 'rgba(59,130,246,0.3)' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Stat cards row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        {statCards.map((s, i) => (
          <motion.div key={i} variants={item}>
            <GlassCard glow={s.glow} style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: `${s.color}22`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <s.icon size={20} color={s.color} />
                </div>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase' }}>
                  {s.label}
                </span>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.12 + 0.3 }}
                style={{ fontSize: 36, fontWeight: 800, color: '#fff', lineHeight: 1 }}
              >
                {s.value}
              </motion.div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {/* Progress circle */}
        <motion.div variants={item}>
          <GlassCard style={{ padding: 24, height: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Completion Rate</div>
            <CircularProgress value={percent} color="#8b5cf6" size={100} />
          </GlassCard>
        </motion.div>

        {/* Category pie */}
        <motion.div variants={item}>
          <GlassCard style={{ padding: 20, height: 200 }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>By Category</div>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'rgba(15,10,30,0.9)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 12, color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 150, color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
                No tasks yet
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* Weekly area chart */}
        <motion.div variants={item}>
          <GlassCard style={{ padding: 20, height: 200 }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>This Week</div>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={weekData}>
                <defs>
                  <linearGradient id="colorC" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: 'rgba(15,10,30,0.9)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 12, color: '#fff' }} />
                <Area type="monotone" dataKey="completed" stroke="#8b5cf6" fill="url(#colorC)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
}
