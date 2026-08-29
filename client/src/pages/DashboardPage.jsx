import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { StatsCard } from '../components/StatsCard';
import { DashboardCharts } from '../components/DashboardCharts';
import { TaskCard } from '../components/TaskCard';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Flame, 
  TrendingUp, 
  ArrowRight,
  ListTodo,
  CalendarCheck2
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const DashboardPage = ({ onOpenNewTask, onViewAllTasks, onEditTask }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
      setError('Não foi possível carregar as métricas do painel.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleToggleTask = async (taskId) => {
    try {
      await api.toggleTaskStatus(taskId);
      await fetchStats();
    } catch (err) {
      console.error('Erro ao atualizar tarefa:', err);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const currentDateFormatted = format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR });

  if (loading && !stats) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: '500' }}>
          Carregando seu painel de produtividade...
        </div>
      </div>
    );
  }

  const metrics = stats?.metrics || {
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    completedToday: 0,
    overdueTasks: 0,
    dueToday: 0,
    urgentPending: 0,
    completionRate: 0
  };

  return (
    <div className="page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Welcome Banner */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-tertiary) 100%)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'capitalize' }}>
            <CalendarCheck2 size={16} />
            <span>{currentDateFormatted}</span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Usuário'}! 👋
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '540px' }}>
            {metrics.overdueTasks > 0 
              ? `Você tem ${metrics.overdueTasks} tarefa(s) que precisam de atenção hoje. Vamos colocar tudo em dia!`
              : (metrics.completedToday > 0
                ? `Excelente ritmo! Você já concluiu ${metrics.completedToday} tarefa(s) hoje.`
                : 'Mantenha o foco em suas prioridades para ter um dia super produtivo.')}
          </p>
        </div>

        {/* Productivity Circle / Progress */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '1.25rem 1.5rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-muted)' }}>
              Taxa de Conclusão Total
            </span>
            <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '-0.02em' }}>
              {metrics.completionRate}%
            </span>
            <div style={{ width: '130px', height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', marginTop: '0.35rem', overflow: 'hidden' }}>
              <div style={{ width: `${metrics.completionRate}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '3px' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem'
      }}>
        <StatsCard
          title="Total de Tarefas"
          value={metrics.totalTasks}
          subtitle={`${metrics.pendingTasks} pendentes`}
          icon={ListTodo}
          gradient="linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)"
        />

        <StatsCard
          title="Concluídas Hoje"
          value={metrics.completedToday}
          subtitle={`${metrics.completedTasks} concluídas no total`}
          icon={CheckCircle2}
          gradient="linear-gradient(135deg, #10B981 0%, #059669 100%)"
        />

        <StatsCard
          title="Vencem Hoje"
          value={metrics.dueToday}
          subtitle="Planejadas para hoje"
          icon={Clock}
          gradient="linear-gradient(135deg, #F59E0B 0%, #D97706 100%)"
        />

        <StatsCard
          title="Tarefas Atrasadas"
          value={metrics.overdueTasks}
          subtitle={metrics.overdueTasks > 0 ? "Atenção necessária" : "Tudo em dia!"}
          icon={AlertTriangle}
          gradient="linear-gradient(135deg, #EF4444 0%, #DC2626 100%)"
          highlight={metrics.overdueTasks > 0}
          highlightColor="var(--danger)"
        />
      </div>

      {/* Charts Section */}
      <DashboardCharts
        activity7Days={stats?.activity7Days || []}
        categoryStats={stats?.categoryStats || []}
        priorityStats={stats?.priorityStats || []}
      />

      {/* Focus Section: Upcoming Urgent / Overdue Tasks */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Flame size={20} color="#E11D48" />
              <span>Foco Imediato (Prioridades & Prazos)</span>
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Tarefas urgentes ou mais próximas do vencimento para agir agora
            </p>
          </div>

          <button
            onClick={onViewAllTasks}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: 'var(--primary)',
              fontSize: '0.85rem',
              fontWeight: '600',
              padding: '0.4rem 0.8rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-light)'
            }}
          >
            <span>Ver todas</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {stats?.focusTasks?.length === 0 ? (
          <div style={{
            padding: '2.5rem',
            textAlign: 'center',
            border: '2px dashed var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--text-muted)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <Sparkles size={32} color="#10B981" />
            <p style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              Nenhuma tarefa urgente pendente no momento!
            </p>
            <span style={{ fontSize: '0.85rem' }}>Você está com suas principais prioridades em dia.</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {stats.focusTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleStatus={handleToggleTask}
                onEdit={onEditTask}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
