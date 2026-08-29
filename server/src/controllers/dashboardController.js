import db from '../config/db.js';

export const getDashboardStats = (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Overall counts
    const totalTasks = db.prepare('SELECT COUNT(*) as count FROM tasks WHERE user_id = ?').get(userId).count;
    const completedTasks = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = 'completed'").get(userId).count;
    const pendingTasks = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status != 'completed'").get(userId).count;
    
    // Completed today
    const completedToday = db.prepare(`
      SELECT COUNT(*) as count 
      FROM tasks 
      WHERE user_id = ? 
        AND status = 'completed' 
        AND DATE(completed_at) = DATE('now', 'localtime')
    `).get(userId).count;

    // Overdue tasks
    const overdueTasks = db.prepare(`
      SELECT COUNT(*) as count 
      FROM tasks 
      WHERE user_id = ? 
        AND status != 'completed' 
        AND datetime(due_date) < datetime('now', 'localtime')
    `).get(userId).count;

    // Due today
    const dueToday = db.prepare(`
      SELECT COUNT(*) as count 
      FROM tasks 
      WHERE user_id = ? 
        AND status != 'completed' 
        AND DATE(due_date) = DATE('now', 'localtime')
    `).get(userId).count;

    // Urgent pending tasks
    const urgentPending = db.prepare(`
      SELECT COUNT(*) as count 
      FROM tasks 
      WHERE user_id = ? 
        AND status != 'completed' 
        AND priority IN ('urgent', 'high')
    `).get(userId).count;

    // Completion rate
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // 2. Breakdown by Category
    const categoryStats = db.prepare(`
      SELECT 
        COALESCE(c.id, 'uncategorized') as category_id,
        COALESCE(c.name, 'Sem Categoria') as name,
        COALESCE(c.color, '#94A3B8') as color,
        COALESCE(c.icon, 'Folder') as icon,
        COUNT(t.id) as total,
        SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) as completed
      FROM tasks t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ?
      GROUP BY c.id, c.name, c.color, c.icon
      ORDER BY total DESC
    `).all(userId);

    // 3. Breakdown by Priority
    const priorityStats = db.prepare(`
      SELECT 
        priority,
        COUNT(*) as total,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status != 'completed' THEN 1 ELSE 0 END) as pending
      FROM tasks
      WHERE user_id = ?
      GROUP BY priority
    `).all(userId);

    // 4. Last 7 days activity (created vs completed)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const dayRow = db.prepare(`
        SELECT 
          DATE('now', 'localtime', '-${i} days') as date,
          (
            SELECT COUNT(*) FROM tasks 
            WHERE user_id = ? 
              AND status = 'completed' 
              AND DATE(completed_at) = DATE('now', 'localtime', '-${i} days')
          ) as completed_count,
          (
            SELECT COUNT(*) FROM tasks 
            WHERE user_id = ? 
              AND DATE(created_at) = DATE('now', 'localtime', '-${i} days')
          ) as created_count
      `).get(userId, userId);
      
      last7Days.push({
        date: dayRow.date,
        completed: dayRow.completed_count,
        created: dayRow.created_count
      });
    }

    // 5. Next Focus / Upcoming tasks (Top 5 overdue or urgent pending)
    const focusTasks = db.prepare(`
      SELECT t.*, c.name as category_name, c.color as category_color
      FROM tasks t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ? AND t.status != 'completed'
      ORDER BY 
        CASE t.priority 
          WHEN 'urgent' THEN 1 
          WHEN 'high' THEN 2 
          WHEN 'medium' THEN 3 
          WHEN 'low' THEN 4 
          ELSE 5 
        END ASC,
        CASE WHEN t.due_date IS NOT NULL THEN t.due_date ELSE '9999-12-31' END ASC
      LIMIT 5
    `).all(userId);

    return res.json({
      metrics: {
        totalTasks,
        completedTasks,
        pendingTasks,
        completedToday,
        overdueTasks,
        dueToday,
        urgentPending,
        completionRate
      },
      categoryStats,
      priorityStats,
      activity7Days: last7Days,
      focusTasks
    });
  } catch (error) {
    console.error('Erro ao obter dados do dashboard:', error);
    return res.status(500).json({ error: 'Erro ao gerar métricas do dashboard.' });
  }
};
