import React from 'react';
import { TaskCard } from './TaskCard';
import { Circle, PlayCircle, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

export const KanbanBoard = ({
  tasks = [],
  onToggleStatus,
  onEdit,
  onDelete,
  onUpdateStatus,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask
}) => {
  const columns = [
    {
      id: 'todo',
      title: 'A Fazer',
      icon: Circle,
      color: '#3B82F6',
      tasks: tasks.filter(t => t.status === 'todo')
    },
    {
      id: 'in_progress',
      title: 'Em Andamento',
      icon: PlayCircle,
      color: '#F59E0B',
      tasks: tasks.filter(t => t.status === 'in_progress')
    },
    {
      id: 'completed',
      title: 'Concluídas',
      icon: CheckCircle2,
      color: '#10B981',
      tasks: tasks.filter(t => t.status === 'completed')
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '1.5rem',
      alignItems: 'start'
    }}>
      {columns.map(col => {
        const IconComponent = col.icon;
        return (
          <div
            key={col.id}
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              minHeight: '450px'
            }}
          >
            {/* Column Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '0.75rem',
              borderBottom: '2px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IconComponent size={18} style={{ color: col.color }} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {col.title}
                </h3>
              </div>

              <span style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-secondary)'
              }}>
                {col.tasks.length}
              </span>
            </div>

            {/* Column Task Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1 }}>
              {col.tasks.length === 0 ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '3rem 1rem',
                  border: '2px dashed var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  textAlign: 'center'
                }}>
                  Nenhuma tarefa nesta coluna
                </div>
              ) : (
                col.tasks.map(task => (
                  <div key={task.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <TaskCard
                      task={task}
                      onToggleStatus={onToggleStatus}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onAddSubtask={onAddSubtask}
                      onToggleSubtask={onToggleSubtask}
                      onDeleteSubtask={onDeleteSubtask}
                    />

                    {/* Quick Move Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem', padding: '0 0.25rem' }}>
                      {col.id === 'todo' && (
                        <button
                          onClick={() => onUpdateStatus(task.id, 'in_progress')}
                          style={{
                            fontSize: '0.72rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            color: 'var(--warning)',
                            fontWeight: '600',
                            padding: '0.2rem 0.4rem',
                            borderRadius: '4px',
                            backgroundColor: 'var(--warning-light)'
                          }}
                        >
                          <span>Iniciar</span>
                          <ArrowRight size={12} />
                        </button>
                      )}

                      {col.id === 'in_progress' && (
                        <>
                          <button
                            onClick={() => onUpdateStatus(task.id, 'todo')}
                            style={{
                              fontSize: '0.72rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              color: 'var(--text-muted)',
                              fontWeight: '600',
                              padding: '0.2rem 0.4rem',
                              borderRadius: '4px',
                              backgroundColor: 'var(--bg-tertiary)'
                            }}
                          >
                            <ArrowLeft size={12} />
                            <span>A Fazer</span>
                          </button>
                          <button
                            onClick={() => onUpdateStatus(task.id, 'completed')}
                            style={{
                              fontSize: '0.72rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              color: 'var(--success)',
                              fontWeight: '600',
                              padding: '0.2rem 0.4rem',
                              borderRadius: '4px',
                              backgroundColor: 'var(--success-light)'
                            }}
                          >
                            <span>Concluir</span>
                            <ArrowRight size={12} />
                          </button>
                        </>
                      )}

                      {col.id === 'completed' && (
                        <button
                          onClick={() => onUpdateStatus(task.id, 'in_progress')}
                          style={{
                            fontSize: '0.72rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            color: 'var(--warning)',
                            fontWeight: '600',
                            padding: '0.2rem 0.4rem',
                            borderRadius: '4px',
                            backgroundColor: 'var(--warning-light)'
                          }}
                        >
                          <ArrowLeft size={12} />
                          <span>Reabrir</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
