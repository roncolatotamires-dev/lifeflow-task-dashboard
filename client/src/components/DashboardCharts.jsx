import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const DashboardCharts = ({ activity7Days = [], categoryStats = [], priorityStats = [] }) => {
  // Format activity data for chart
  const formattedActivity = activity7Days.map(item => {
    let dayName = item.date;
    try {
      dayName = format(parseISO(item.date), 'EEE (dd/MM)', { locale: ptBR });
    } catch (e) {
      dayName = item.date;
    }
    return {
      name: dayName,
      concluidas: item.completed,
      criadas: item.created
    };
  });

  // Category data
  const pieData = categoryStats
    .filter(c => c.total > 0)
    .map(c => ({
      name: c.name,
      value: c.total,
      color: c.color || '#3B82F6'
    }));

  // Priority mapping labels
  const PRIORITY_LABELS = {
    urgent: { label: 'Urgente', color: '#E11D48' },
    high: { label: 'Alta', color: '#F97316' },
    medium: { label: 'Média', color: '#3B82F6' },
    low: { label: 'Baixa', color: '#64748B' }
  };

  const formattedPriority = priorityStats.map(p => ({
    priority: PRIORITY_LABELS[p.priority]?.label || p.priority,
    total: p.total,
    concluidas: p.completed,
    pendentes: p.pending,
    fillColor: PRIORITY_LABELS[p.priority]?.color || '#3B82F6'
  }));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
      
      {/* 1. Atividade dos Últimos 7 Dias */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Ritmo de Conclusão (Últimos 7 dias)
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Tarefas concluídas e criadas recentemente
          </p>
        </div>

        <div style={{ width: '100%', height: '220px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={11} allowDecimals={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              />
              <Area type="monotone" dataKey="concluidas" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCompleted)" name="Concluídas" />
              <Area type="monotone" dataKey="criadas" stroke="#3B82F6" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorCreated)" name="Criadas" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Distribuição por Categorias */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Divisão por Categorias
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Onde seu tempo e energia estão concentrados
          </p>
        </div>

        {pieData.length === 0 ? (
          <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Nenhuma tarefa categorizada ainda.
          </div>
        ) : (
          <div style={{ width: '100%', height: '220px', display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val} tarefas`, name]}
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem'
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

    </div>
  );
};
