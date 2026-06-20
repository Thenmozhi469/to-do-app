import React from 'react';

export default function ParticleBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Animated gradient base */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(-45deg,#0f0a1e,#1a0533,#0d1b3e,#0a1a2e)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
      }} />
      {/* Floating blobs */}
      <div className="particle p1" />
      <div className="particle p2" />
      <div className="particle p3" />
      <div className="particle p4" />
      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
      }} />
    </div>
  );
}
