import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { TaskCard } from '../components/TaskCard';
import { KanbanBoard } from '../components/KanbanBoard';
import { 
  Search, 
  Filter, 
  List, 
  Kanban, 
  Plus, 
  CheckCircle2, 
  Layers, 
  SlidersHorizontal,
  X
} from 'lucide-react';

export const TasksPage = ({
  onOpenNewTask,
  onEditTask,
  categories = [],
  tags = [],
  selectedCategory,
  setSelectedCategory,
  activeQuickFilter,
  setActiveQuickFilter
}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'kanban'
  
  // Filters
  const [search, setSearch] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (selectedCategory) params.category_id = selectedCategory;
      if (selectedPriority) params.priority = selectedPriority;
      if (selectedStatus) params.status = selectedStatus;
      if (selectedTag) params.tag_id = selectedTag;
      if (activeQuickFilter) params.filter = activeQuickFilter;

      const data = await api.getTasks(params);
      setTasks(data.tasks);
    } catch (err) {
      console.error('Erro ao buscar tarefas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [search, selectedCategory, selectedPriority, selectedStatus, selectedTag, activeQuickFilter]);

  const handleToggleStatus = async (taskId) => {
    try {
      await api.toggleTaskStatus(taskId);
      await fetchTasks();
    } catch (err) {
      console.error('Erro ao alternar status:', err);
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await api.updateTask(taskId, { status: newStatus });
      await fetchTasks();
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta tarefa?')) return;
    try {
      await api.deleteTask(taskId);
      await fetchTasks();
    } catch (err) {
      console.error('Erro ao excluir tarefa:', err);
    }
  };

  const handleAddSubtask = async (taskId, title) => {
    try {
      await api.addSubtask(taskId, title);
      await fetchTasks();
    } catch (err) {
      console.error('Erro ao adicionar subitem:', err);
    }
  };

  const handleToggleSubtask = async (subtaskId) => {
    try {
      await api.toggleSubtask(subtaskId);
      await fetchTasks();
    } catch (err) {
      console.error('Erro ao alternar subitem:', err);
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    try {
      await api.deleteSubtask(subtaskId);
      await fetchTasks();
    } catch (err) {
      console.error('Erro ao deletar subitem:', err);
    }
  };

  const clearAllFilters = () => {
    setSearch('');
    setSelectedPriority('');
    setSelectedStatus('');
    setSelectedTag('');
    setSelectedCategory(null);
    setActiveQuickFilter(null);
  };

  const hasActiveFilters = search || selectedCategory || selectedPriority || selectedStatus || selectedTag || activeQuickFilter;

  return (
    <div className="page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header & Controls */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Minhas Tarefas
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Gerencie, organize e acompanhe todas as suas atividades
          </p>
        </div>

        {/* View Mode Switcher + New Task Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '3px'
          }}>
            <button
              onClick={() => setViewMode('list')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: viewMode === 'list' ? 'var(--primary-light)' : 'transparent',
                color: viewMode === 'list' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: viewMode === 'list' ? '700' : '500',
                fontSize: '0.85rem',
                transition: 'all 0.15s ease'
              }}
            >
              <List size={16} />
              <span>Lista</span>
            </button>

            <button
              onClick={() => setViewMode('kanban')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: viewMode === 'kanban' ? 'var(--primary-light)' : 'transparent',
                color: viewMode === 'kanban' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: viewMode === 'kanban' ? '700' : '500',
                fontSize: '0.85rem',
                transition: 'all 0.15s ease'
              }}
            >
              <Kanban size={16} />
              <span>Quadro</span>
            </button>
          </div>

          <button
            onClick={onOpenNewTask}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              padding: '0.55rem 1.1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: '600',
              fontSize: '0.875rem',
              boxShadow: '0 4px 12px var(--primary-glow)'
            }}
          >
            <Plus size={18} />
            <span>Criar Tarefa</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', alignItems: 'center' }}>
          
          {/* Search Box */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={17} style={{ position: 'absolute', left: '0.85rem', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Buscar tarefas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.85rem 0.6rem 2.4rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem'
              }}
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            style={{
              padding: '0.6rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem'
            }}
          >
            <option value="">Todas as Categorias</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            style={{
              padding: '0.6rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem'
            }}
          >
            <option value="">Todas as Prioridades</option>
            <option value="urgent">🚨 Urgente</option>
            <option value="high">⚠️ Alta</option>
            <option value="medium">🔹 Média</option>
            <option value="low">▫️ Baixa</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              padding: '0.6rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem'
            }}
          >
            <option value="">Todos os Status</option>
            <option value="todo">A Fazer</option>
            <option value="in_progress">Em Andamento</option>
            <option value="completed">Concluídas</option>
          </select>
        </div>

        {/* Tags filter & Clear filter button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-muted)' }}>Tags:</span>
            {tags.map(tag => {
              const isSelected = selectedTag === tag.id;
              return (
                <button
                  key={tag.id}
                  onClick={() => setSelectedTag(isSelected ? '' : tag.id)}
                  style={{
                    padding: '0.2rem 0.55rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-tertiary)',
                    color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                    border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}`
                  }}
                >
                  #{tag.name}
                </button>
              );
            })}
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.78rem',
                color: 'var(--danger)',
                fontWeight: '600'
              }}
            >
              <X size={14} />
              <span>Limpar Filtros</span>
            </button>
          )}
        </div>
      </div>

      {/* Task Content */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Carregando tarefas...
        </div>
      ) : tasks.length === 0 ? (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '4rem 2rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CheckCircle2 size={32} />
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Nenhuma tarefa encontrada
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              {hasActiveFilters ? 'Nenhuma tarefa corresponde aos filtros aplicados.' : 'Comece adicionando a sua primeira tarefa agora!'}
            </p>
          </div>

          <button
            onClick={onOpenNewTask}
            style={{
              marginTop: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              padding: '0.65rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: '600',
              fontSize: '0.9rem',
              boxShadow: '0 4px 12px var(--primary-glow)'
            }}
          >
            <Plus size={18} />
            <span>Criar Primeira Tarefa</span>
          </button>
        </div>
      ) : viewMode === 'kanban' ? (
        <KanbanBoard
          tasks={tasks}
          onToggleStatus={handleToggleStatus}
          onEdit={onEditTask}
          onDelete={handleDeleteTask}
          onUpdateStatus={handleUpdateStatus}
          onAddSubtask={handleAddSubtask}
          onToggleSubtask={handleToggleSubtask}
          onDeleteSubtask={handleDeleteSubtask}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleStatus={handleToggleStatus}
              onEdit={onEditTask}
              onDelete={handleDeleteTask}
              onAddSubtask={handleAddSubtask}
              onToggleSubtask={handleToggleSubtask}
              onDeleteSubtask={handleDeleteSubtask}
            />
          ))}
        </div>
      )}

    </div>
  );
};
