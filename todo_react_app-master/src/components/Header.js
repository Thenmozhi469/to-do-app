import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiMoon, FiSearch, FiBell, FiZap } from 'react-icons/fi';
import { useTaskStore } from '../store/useTaskStore';

export default function Header({ dark, toggleDark }) {
  const [search, setSearch] = useState('');
  const setFilter = useTaskStore(s => s.setFilter);
  const { total, completed } = useTaskStore(s => s.getStats)();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const emoji = hour < 12 ? '🌅' : hour < 17 ? '☀️' : '🌙';

  const handleSearch = (v) => {
    setSearch(v);
    setFilter('search', v);
  };

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(15,10,30,0.8)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(139,92,246,0.15)',
        padding: '0 24px',
      }}
    >
      <div style={{
        maxWidth: 1400, margin: '0 auto',
        display: 'flex', alignItems: 'center',
        gap: 16, height: 70,
      }}>
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}
        >
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: 'linear-gradient(135deg,#8b5cf6,#ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(139,92,246,0.5)',
          }}>
            <FiZap color="#fff" size={20} />
          </div>
          <span style={{
            fontWeight: 800, fontSize: 20,
            background: 'linear-gradient(135deg,#8b5cf6,#ec4899)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>TaskFlow</span>
        </motion.div>

        {/* Greeting */}
        <div style={{ flex: 1, paddingLeft: 20 }}>
          <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 15 }}>
            {greeting} {emoji}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>
            {completed} of {total} tasks completed today
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: 260 }}>
          <FiSearch style={{
            position: 'absolute', left: 12, top: '50%',
            transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)',
          }} />
          <input
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search tasks..."
            style={{
              width: '100%', padding: '9px 12px 9px 36px',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(139,92,246,0.2)',
              borderRadius: 12, color: '#e2e8f0', fontSize: 14,
              outline: 'none', transition: 'border-color 0.2s',
            }}
            onFocus={e => (e.target.style.borderColor = 'rgba(139,92,246,0.6)')}
            onBlur={e => (e.target.style.borderColor = 'rgba(139,92,246,0.2)')}
          />
        </div>

        {/* Bell */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12, padding: 9, cursor: 'pointer',
            color: '#e2e8f0', display: 'flex', alignItems: 'center',
          }}
        >
          <FiBell size={18} />
        </motion.button>

        {/* Dark toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleDark}
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12, padding: 9, cursor: 'pointer',
            color: '#e2e8f0', display: 'flex', alignItems: 'center',
          }}
        >
          {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
        </motion.button>

        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.08 }}
          style={{
            width: 38, height: 38, borderRadius: '50%',
            background: 'linear-gradient(135deg,#8b5cf6,#ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, color: '#fff', fontSize: 15, cursor: 'pointer',
            boxShadow: '0 0 16px rgba(139,92,246,0.4)',
            flexShrink: 0,
          }}
        >
          T
        </motion.div>
      </div>
    </motion.header>
  );
}
