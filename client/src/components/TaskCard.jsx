import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Check, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  Flame, 
  Edit3, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  CheckCircle2,
  Circle
} from 'lucide-react';
import { format, isPast, isToday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const TaskCard = ({ 
  task, 
  onToggleStatus, 
  onEdit, 
  onDelete,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask
}) => {
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [addingSubtask, setAddingSubtask] = useState(false);

  const isCompleted = task.status === 'completed';

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!isCompleted) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
    onToggleStatus(task.id);
  };

  // Due date status evaluation
  let dueDateText = null;
  let isOverdue = false;
  let isDueToday = false;

  if (task.due_date) {
    try {
      const parsedDate = parseISO(task.due_date);
      if (!isCompleted && isPast(parsedDate) && !isToday(parsedDate)) {
        isOverdue = true;
        dueDateText = `Atrasada: ${format(parsedDate, "dd 'de' MMM", { locale: ptBR })}`;
      } else if (isToday(parsedDate)) {
        isDueToday = true;
        dueDateText = `Vence Hoje (${format(parsedDate, 'HH:mm')})`;
      } else {
        dueDateText = format(parsedDate, "dd 'de' MMM, HH:mm", { locale: ptBR });
      }
    } catch (e) {
      dueDateText = task.due_date;
    }
  }

  // Priority Styles
  const PRIORITY_CONFIG = {
    urgent: { label: 'Urgente', bg: 'var(--urgent-light)', color: 'var(--urgent)', icon: Flame },
    high: { label: 'Alta', bg: 'var(--warning-light)', color: 'var(--warning)', icon: AlertTriangle },
    medium: { label: 'Média', bg: 'var(--primary-light)', color: 'var(--primary)', icon: Clock },
    low: { label: 'Baixa', bg: 'var(--bg-tertiary)', color: 'var(--text-muted)', icon: Circle }
  };

  const priorityInfo = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const PriorityIcon = priorityInfo.icon;

  // Subtasks calculation
  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter(s => s.completed)?.length || 0;
  const subtaskProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const handleCreateSubtask = async (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim() || !onAddSubtask) return;
    await onAddSubtask(task.id, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
    setAddingSubtask(false);
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        border: isOverdue ? '1.5px solid var(--danger)' : '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.2rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        transition: 'all 0.2s ease',
        opacity: isCompleted ? 0.75 : 1,
        position: 'relative'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        e.currentTarget.style.borderColor = isOverdue ? 'var(--danger)' : 'var(--primary)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        e.currentTarget.style.borderColor = isOverdue ? 'var(--danger)' : 'var(--border-color)';
      }}
    >
      {/* Header: Checkbox + Title + Actions */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1 }}>
          {/* Custom Checkbox */}
          <button
            onClick={handleToggle}
            style={{
              width: '22px',
              height: '22px',
              borderRadius: '6px',
              border: isCompleted ? 'none' : '2px solid var(--border-color)',
              backgroundColor: isCompleted ? 'var(--success)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              marginTop: '2px',
              flexShrink: 0,
              transition: 'all 0.2s ease'
            }}
            title={isCompleted ? 'Marcar como pendente' : 'Marcar como concluída'}
          >
            {isCompleted && <Check size={14} strokeWidth={3} />}
          </button>

          <div style={{ flex: 1 }}>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
              textDecoration: isCompleted ? 'line-through' : 'none',
              lineHeight: '1.3'
            }}>
              {task.title}
            </h4>

            {task.description && (
              <p style={{
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                marginTop: '0.35rem',
                lineHeight: '1.4',
                textDecoration: isCompleted ? 'line-through' : 'none'
              }}>
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)' }}
              onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              title="Editar tarefa"
            >
              <Edit3 size={16} />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(task.id)}
              style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)' }}
              onMouseOver={(e) => e.currentTarget.style.color = 'var(--danger)'}
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              title="Excluir tarefa"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Meta Badges: Priority, Category, Due Date, Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
        
        {/* Priority Badge */}
        <span style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontSize: '0.75rem',
          fontWeight: '700',
          padding: '0.2rem 0.6rem',
          borderRadius: '999px',
          backgroundColor: priorityInfo.bg,
          color: priorityInfo.color
        }}>
          <PriorityIcon size={12} strokeWidth={2.5} />
          {priorityInfo.label}
        </span>

        {/* Category Pill */}
        {task.category_name && (
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.75rem',
            fontWeight: '600',
            padding: '0.2rem 0.6rem',
            borderRadius: '999px',
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-secondary)'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: task.category_color || '#3B82F6' }} />
            {task.category_name}
          </span>
        )}

        {/* Due Date Badge */}
        {dueDateText && (
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.75rem',
            fontWeight: '600',
            padding: '0.2rem 0.6rem',
            borderRadius: '999px',
            backgroundColor: isOverdue ? 'var(--danger-light)' : (isDueToday ? 'var(--warning-light)' : 'var(--bg-tertiary)'),
            color: isOverdue ? 'var(--danger)' : (isDueToday ? 'var(--warning)' : 'var(--text-muted)')
          }}>
            <Calendar size={13} />
            {dueDateText}
          </span>
        )}

        {/* Tags */}
        {task.tags && task.tags.map(tag => (
          <span
            key={tag.id}
            style={{
              fontSize: '0.72rem',
              fontWeight: '600',
              padding: '0.15rem 0.5rem',
              borderRadius: '6px',
              backgroundColor: 'var(--bg-tertiary)',
              color: tag.color || 'var(--text-muted)',
              border: `1px solid ${tag.color ? `${tag.color}40` : 'var(--border-color)'}`
            }}
          >
            #{tag.name}
          </span>
        ))}
      </div>

      {/* Subtasks Section */}
      {totalSubtasks > 0 && (
        <div style={{
          marginTop: '0.4rem',
          paddingTop: '0.6rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <div
            onClick={() => setShowSubtasks(!showSubtasks)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              fontWeight: '600'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Subtarefas ({completedSubtasks}/{totalSubtasks})</span>
              <div style={{ width: '70px', height: '5px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${subtaskProgress}%`, height: '100%', backgroundColor: 'var(--success)' }} />
              </div>
            </div>
            {showSubtasks ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </div>

          {showSubtasks && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingLeft: '0.5rem', marginTop: '0.2rem' }}>
              {task.subtasks.map(sub => (
                <div key={sub.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', flex: 1, fontSize: '0.82rem' }}>
                    <input
                      type="checkbox"
                      checked={!!sub.completed}
                      onChange={() => onToggleSubtask && onToggleSubtask(sub.id)}
                      style={{ cursor: 'pointer', accentColor: 'var(--success)' }}
                    />
                    <span style={{
                      textDecoration: sub.completed ? 'line-through' : 'none',
                      color: sub.completed ? 'var(--text-muted)' : 'var(--text-secondary)'
                    }}>
                      {sub.title}
                    </span>
                  </label>

                  {onDeleteSubtask && (
                    <button
                      onClick={() => onDeleteSubtask(sub.id)}
                      style={{ color: 'var(--text-muted)', padding: '0.15rem' }}
                      onMouseOver={(e) => e.currentTarget.style.color = 'var(--danger)'}
                      onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}

              {/* Add subtask mini input */}
              {addingSubtask ? (
                <form onSubmit={handleCreateSubtask} style={{ display: 'flex', gap: '0.4rem', marginTop: '0.3rem' }}>
                  <input
                    type="text"
                    placeholder="Adicionar item..."
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    autoFocus
                    style={{
                      flex: 1,
                      padding: '0.35rem 0.6rem',
                      fontSize: '0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '0.35rem 0.7rem',
                      fontSize: '0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--primary)',
                      color: '#ffffff',
                      fontWeight: '600'
                    }}
                  >
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddingSubtask(false)}
                    style={{
                      padding: '0.35rem 0.5rem',
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)'
                    }}
                  >
                    Cancelar
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setAddingSubtask(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontSize: '0.78rem',
                    color: 'var(--primary)',
                    fontWeight: '600',
                    marginTop: '0.2rem',
                    textAlign: 'left'
                  }}
                >
                  <Plus size={14} />
                  <span>Adicionar item</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
