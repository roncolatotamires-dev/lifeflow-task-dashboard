import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Briefcase, 
  BookOpen, 
  Home, 
  ShoppingCart, 
  Heart, 
  Folder,
  Tag as TagIcon,
  Layers,
  Star,
  Coffee,
  Zap
} from 'lucide-react';
import { CategoryModal } from '../components/CategoryModal';
import { TagModal } from '../components/TagModal';

const ICON_MAP = {
  Briefcase,
  BookOpen,
  Home,
  ShoppingCart,
  Heart,
  Folder,
  Star,
  Coffee,
  Zap
};

export const CategoriesPage = ({
  categories = [],
  tags = [],
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  onCreateTag,
  onDeleteTag
}) => {
  const [editingCategory, setEditingCategory] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  const renderIcon = (iconName, color) => {
    const IconComp = ICON_MAP[iconName] || Folder;
    return <IconComp size={20} style={{ color: color || '#3B82F6' }} />;
  };

  const handleEditCategoryClick = (cat) => {
    setEditingCategory(cat);
    setIsCategoryModalOpen(true);
  };

  const handleCreateCategoryClick = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (catData) => {
    if (catData.id) {
      await onUpdateCategory(catData.id, catData);
    } else {
      await onCreateCategory(catData);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* Category Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Categorias
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Organize suas tarefas por áreas da sua vida
            </p>
          </div>

          <button
            onClick={handleCreateCategoryClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              padding: '0.55rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: '600',
              fontSize: '0.85rem'
            }}
          >
            <Plus size={16} />
            <span>Nova Categoria</span>
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1rem'
        }}>
          {categories.map(cat => (
            <div
              key={cat.id}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: `${cat.color || '#3B82F6'}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {renderIcon(cat.icon, cat.color)}
                </div>

                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {cat.name}
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {cat.total_tasks || 0} tarefas ({cat.completed_tasks || 0} concluídas)
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <button
                  onClick={() => handleEditCategoryClick(cat)}
                  style={{ padding: '0.35rem', color: 'var(--text-muted)' }}
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => onDeleteCategory(cat.id)}
                  style={{ padding: '0.35rem', color: 'var(--text-muted)' }}
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--danger)'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tags Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Etiquetas (Tags)
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Palavras-chave para filtrar e identificar tarefas rapidamente
            </p>
          </div>

          <button
            onClick={() => setIsTagModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '0.55rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: '600',
              fontSize: '0.85rem'
            }}
          >
            <Plus size={16} />
            <span>Nova Tag</span>
          </button>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          {tags.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Nenhuma tag cadastrada ainda.</p>
          ) : (
            tags.map(tag => (
              <div
                key={tag.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: `1px solid ${tag.color || 'var(--border-color)'}40`
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: tag.color || '#64748B' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: tag.color || 'var(--text-primary)' }}>
                  #{tag.name}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  ({tag.task_count || 0})
                </span>
                <button
                  onClick={() => onDeleteTag(tag.id)}
                  style={{ color: 'var(--text-muted)', marginLeft: '0.25rem' }}
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--danger)'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        category={editingCategory}
      />

      <TagModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        onSave={onCreateTag}
      />

    </div>
  );
};
