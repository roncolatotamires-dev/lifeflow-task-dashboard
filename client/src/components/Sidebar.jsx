import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Tag, 
  Calendar, 
  AlertTriangle, 
  Flame, 
  Sparkles,
  Layers,
  Briefcase,
  BookOpen,
  Home,
  ShoppingCart,
  Heart,
  Folder
} from 'lucide-react';

const ICON_MAP = {
  Briefcase,
  BookOpen,
  Home,
  ShoppingCart,
  Heart,
  Folder
};

export const Sidebar = ({ 
  activeTab, 
  setActiveTab, 
  categories = [], 
  selectedCategory, 
  setSelectedCategory,
  activeQuickFilter,
  setActiveQuickFilter
}) => {

  const renderCategoryIcon = (iconName, color) => {
    const IconComponent = ICON_MAP[iconName] || Folder;
    return <IconComponent size={17} style={{ color: color || 'var(--primary)' }} />;
  };

  return (
    <aside style={{
      width: '270px',
      backgroundColor: 'var(--bg-card)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      padding: '1.5rem 1rem',
      gap: '2rem'
    }}>
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 0.5rem' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
        }}>
          <Sparkles size={22} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            LifeFlow
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>
            Personal Task OS
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', padding: '0 0.75rem', marginBottom: '0.35rem' }}>
          Menu Principal
        </span>

        <button
          onClick={() => {
            setActiveTab('dashboard');
            setSelectedCategory(null);
            setActiveQuickFilter(null);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.7rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: activeTab === 'dashboard' ? 'var(--primary-light)' : 'transparent',
            color: activeTab === 'dashboard' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'dashboard' ? '700' : '500',
            fontSize: '0.9rem',
            transition: 'all 0.2s ease',
            textAlign: 'left'
          }}
        >
          <LayoutDashboard size={19} />
          <span>Painel de Controle</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('tasks');
            setSelectedCategory(null);
            setActiveQuickFilter(null);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.7rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: activeTab === 'tasks' && !selectedCategory && !activeQuickFilter ? 'var(--primary-light)' : 'transparent',
            color: activeTab === 'tasks' && !selectedCategory && !activeQuickFilter ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'tasks' && !selectedCategory && !activeQuickFilter ? '700' : '500',
            fontSize: '0.9rem',
            transition: 'all 0.2s ease',
            textAlign: 'left'
          }}
        >
          <CheckSquare size={19} />
          <span>Todas as Tarefas</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('categories');
            setSelectedCategory(null);
            setActiveQuickFilter(null);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.7rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: activeTab === 'categories' ? 'var(--primary-light)' : 'transparent',
            color: activeTab === 'categories' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'categories' ? '700' : '500',
            fontSize: '0.9rem',
            transition: 'all 0.2s ease',
            textAlign: 'left'
          }}
        >
          <Tag size={19} />
          <span>Categorias & Tags</span>
        </button>
      </nav>

      {/* Quick Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', padding: '0 0.75rem', marginBottom: '0.35rem' }}>
          Filtros Rápidos
        </span>

        <button
          onClick={() => {
            setActiveTab('tasks');
            setSelectedCategory(null);
            setActiveQuickFilter('today');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.6rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: activeQuickFilter === 'today' ? 'var(--primary-light)' : 'transparent',
            color: activeQuickFilter === 'today' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeQuickFilter === 'today' ? '600' : '500',
            fontSize: '0.85rem',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Calendar size={17} color="#3B82F6" />
            <span>Para Hoje</span>
          </div>
        </button>

        <button
          onClick={() => {
            setActiveTab('tasks');
            setSelectedCategory(null);
            setActiveQuickFilter('overdue');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.6rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: activeQuickFilter === 'overdue' ? 'var(--danger-light)' : 'transparent',
            color: activeQuickFilter === 'overdue' ? 'var(--danger)' : 'var(--text-secondary)',
            fontWeight: activeQuickFilter === 'overdue' ? '600' : '500',
            fontSize: '0.85rem',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <AlertTriangle size={17} color="#EF4444" />
            <span>Atrasadas</span>
          </div>
        </button>

        <button
          onClick={() => {
            setActiveTab('tasks');
            setSelectedCategory(null);
            setActiveQuickFilter('urgent');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.6rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: activeQuickFilter === 'urgent' ? 'var(--urgent-light)' : 'transparent',
            color: activeQuickFilter === 'urgent' ? 'var(--urgent)' : 'var(--text-secondary)',
            fontWeight: activeQuickFilter === 'urgent' ? '600' : '500',
            fontSize: '0.85rem',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Flame size={17} color="#E11D48" />
            <span>Urgentes</span>
          </div>
        </button>
      </div>

      {/* Categories Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', overflowY: 'auto', flex: 1 }}>
        <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', padding: '0 0.75rem', marginBottom: '0.35rem' }}>
          Categorias
        </span>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id && activeTab === 'tasks';
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveTab('tasks');
                setSelectedCategory(cat.id);
                setActiveQuickFilter(null);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.55rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isSelected ? 'var(--primary-light)' : 'transparent',
                color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: isSelected ? '700' : '500',
                fontSize: '0.85rem',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                {renderCategoryIcon(cat.icon, cat.color)}
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                  {cat.name}
                </span>
              </div>

              {cat.total_tasks > 0 && (
                <span style={{
                  fontSize: '0.75rem',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '999px',
                  backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-tertiary)',
                  color: isSelected ? '#ffffff' : 'var(--text-muted)',
                  fontWeight: '600'
                }}>
                  {cat.total_tasks}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
