import React from 'react';

export const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient = 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
  iconColor = '#ffffff',
  highlight = false,
  highlightColor = 'var(--urgent)',
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: highlight ? `1.5px solid ${highlightColor}` : '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.4rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '1rem',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.2s ease',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
          {title}
        </span>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: 'var(--radius-md)',
          background: gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: iconColor,
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.12)'
        }}>
          {Icon && <Icon size={20} />}
        </div>
      </div>

      <div>
        <div style={{
          fontSize: '2rem',
          fontWeight: '800',
          letterSpacing: '-0.03em',
          color: highlight ? highlightColor : 'var(--text-primary)',
          lineHeight: '1.1'
        }}>
          {value}
        </div>
        {subtitle && (
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem', fontWeight: '500' }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
