import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Plus, User, LogOut, CheckCircle2 } from 'lucide-react';

export const Navbar = ({ onOpenNewTask, title = 'Painel de Controle' }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header style={{
      height: '70px',
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-card)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      backdropFilter: 'blur(8px)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.35rem', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          {title}
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Nova Tarefa Button */}
        {onOpenNewTask && (
          <button
            onClick={onOpenNewTask}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              padding: '0.6rem 1.1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: '600',
              fontSize: '0.875rem',
              boxShadow: '0 4px 12px var(--primary-glow)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Nova Tarefa</span>
          </button>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
        >
          {theme === 'dark' ? <Sun size={19} color="#f59e0b" /> : <Moon size={19} color="#6366f1" />}
        </button>

        {/* User Info & Logout */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          paddingLeft: '0.75rem',
          borderLeft: '1px solid var(--border-color)'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '0.9rem'
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : <User size={18} />}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              {user?.name || 'Usuário'}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {user?.email || ''}
            </span>
          </div>

          <button
            onClick={logout}
            style={{
              padding: '0.45rem',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)',
              marginLeft: '0.5rem',
              transition: 'color 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--danger)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            title="Sair da conta"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
