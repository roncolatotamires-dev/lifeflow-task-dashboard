import React, { useState, useEffect } from 'react';
import { X, Briefcase, BookOpen, Home, ShoppingCart, Heart, Folder, Star, Coffee, Zap } from 'lucide-react';

const COLOR_PRESETS = [
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#EF4444', // Red
  '#F97316', // Orange
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#06B6D4', // Cyan
  '#64748B'  // Slate
];

const ICONS = [
  { name: 'Folder', icon: Folder },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'BookOpen', icon: BookOpen },
  { name: 'Home', icon: Home },
  { name: 'ShoppingCart', icon: ShoppingCart },
  { name: 'Heart', icon: Heart },
  { name: 'Star', icon: Star },
  { name: 'Coffee', icon: Coffee },
  { name: 'Zap', icon: Zap }
];

export const CategoryModal = ({ isOpen, onClose, onSave, category = null }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [icon, setIcon] = useState('Folder');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setColor(category.color || '#3B82F6');
      setIcon(category.icon || 'Folder');
    } else {
      setName('');
      setColor('#3B82F6');
      setIcon('Folder');
    }
    setError('');
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, informe o nome da categoria.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onSave({
        id: category?.id,
        name: name.trim(),
        color,
        icon
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Erro ao salvar categoria.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        width: '100%',
        maxWidth: '460px',
        boxShadow: 'var(--shadow-xl)',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            {category ? 'Editar Categoria' : 'Nova Categoria'}
          </h2>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {error && (
            <div style={{
              padding: '0.65rem 0.85rem',
              backgroundColor: 'var(--danger-light)',
              color: 'var(--danger)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem'
            }}>
              {error}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Nome da Categoria
            </label>
            <input
              type="text"
              placeholder="Ex: Projetos Freelance, Academia..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem'
              }}
            />
          </div>

          {/* Color Presets */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Cor
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {COLOR_PRESETS.map(c => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: c,
                    border: color === c ? '3px solid #ffffff' : 'none',
                    boxShadow: color === c ? `0 0 0 2px ${c}` : 'none',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Ícone
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
              {ICONS.map(item => {
                const IconComponent = item.icon;
                const isSelected = icon === item.name;
                return (
                  <button
                    type="button"
                    key={item.name}
                    onClick={() => setIcon(item.name)}
                    style={{
                      height: '42px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? `2px solid ${color}` : '1px solid var(--border-color)',
                      backgroundColor: isSelected ? `${color}20` : 'var(--bg-tertiary)',
                      color: isSelected ? color : 'var(--text-secondary)'
                    }}
                  >
                    <IconComponent size={20} />
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} style={{ color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.88rem' }}>
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.65rem 1.4rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '0.88rem'
              }}
            >
              {loading ? 'Salvando...' : 'Salvar Categoria'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
