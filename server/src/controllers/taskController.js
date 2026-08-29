import crypto from 'crypto';
import db from '../config/db.js';

// Helper to attach tags and subtasks to tasks
const attachTaskRelations = (tasks, userId) => {
  if (!tasks || tasks.length === 0) return [];

  const taskIds = tasks.map(t => t.id);
  const placeholders = taskIds.map(() => '?').join(',');

  // Get tags for these tasks
  const tagsQuery = db.prepare(`
    SELECT tt.task_id, tg.id, tg.name, tg.color
    FROM task_tags tt
    JOIN tags tg ON tt.tag_id = tg.id
    WHERE tt.task_id IN (${placeholders})
  `);
  const allTags = tagsQuery.all(...taskIds);

  // Get subtasks for these tasks
  const subtasksQuery = db.prepare(`
    SELECT * FROM subtasks
    WHERE task_id IN (${placeholders})
    ORDER BY created_at ASC
  `);
  const allSubtasks = subtasksQuery.all(...taskIds);

  const tagsByTask = {};
  for (const tag of allTags) {
    if (!tagsByTask[tag.task_id]) tagsByTask[tag.task_id] = [];
    tagsByTask[tag.task_id].push({ id: tag.id, name: tag.name, color: tag.color });
  }

  const subtasksByTask = {};
  for (const sub of allSubtasks) {
    if (!subtasksByTask[sub.task_id]) subtasksByTask[sub.task_id] = [];
    subtasksByTask[sub.task_id].push(sub);
  }

  return tasks.map(t => ({
    ...t,
    tags: tagsByTask[t.id] || [],
    subtasks: subtasksByTask[t.id] || []
  }));
};

export const getTasks = (req, res) => {
  try {
    const { status, category_id, priority, tag_id, search, filter } = req.query;
    const userId = req.user.id;

    let query = `
      SELECT t.*, 
             c.name as category_name, 
             c.color as category_color, 
             c.icon as category_icon
      FROM tasks t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ?
    `;
    const params = [userId];

    if (status) {
      query += ` AND t.status = ?`;
      params.push(status);
    }

    if (category_id) {
      query += ` AND t.category_id = ?`;
      params.push(category_id);
    }

    if (priority) {
      query += ` AND t.priority = ?`;
      params.push(priority);
    }

    if (search) {
      query += ` AND (t.title LIKE ? OR t.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (tag_id) {
      query += ` AND t.id IN (SELECT task_id FROM task_tags WHERE tag_id = ?)`;
      params.push(tag_id);
    }

    // Special quick filters
    if (filter === 'today') {
      query += ` AND DATE(t.due_date) = DATE('now', 'localtime')`;
    } else if (filter === 'overdue') {
      query += ` AND t.status != 'completed' AND datetime(t.due_date) < datetime('now', 'localtime')`;
    } else if (filter === 'upcoming') {
      query += ` AND t.status != 'completed' AND datetime(t.due_date) >= datetime('now', 'localtime')`;
    }

    query += ` ORDER BY 
      CASE t.priority 
        WHEN 'urgent' THEN 1 
        WHEN 'high' THEN 2 
        WHEN 'medium' THEN 3 
        WHEN 'low' THEN 4 
        ELSE 5 
      END ASC,
      CASE WHEN t.due_date IS NOT NULL THEN t.due_date ELSE '9999-12-31' END ASC,
      t.created_at DESC
    `;

    const rawTasks = db.prepare(query).all(...params);
    const tasks = attachTaskRelations(rawTasks, userId);

    return res.json({ tasks });
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    return res.status(500).json({ error: 'Erro ao buscar tarefas.' });
  }
};

export const getTaskById = (req, res) => {
  try {
    const { id } = req.params;
    const rawTask = db.prepare(`
      SELECT t.*, 
             c.name as category_name, 
             c.color as category_color, 
             c.icon as category_icon
      FROM tasks t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = ? AND t.user_id = ?
    `).get(id, req.user.id);

    if (!rawTask) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }

    const [task] = attachTaskRelations([rawTask], req.user.id);
    return res.json({ task });
  } catch (error) {
    console.error('Erro ao buscar tarefa:', error);
    return res.status(500).json({ error: 'Erro ao obter detalhes da tarefa.' });
  }
};

export const createTask = (req, res) => {
  try {
    const { title, description, category_id, priority, due_date, tags, subtasks } = req.body;
    const userId = req.user.id;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'O título da tarefa é obrigatório.' });
    }

    const taskId = crypto.randomUUID();
    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    const selectedPriority = validPriorities.includes(priority) ? priority : 'medium';

    const insertTask = db.prepare(`
      INSERT INTO tasks (id, user_id, category_id, title, description, priority, status, due_date)
      VALUES (?, ?, ?, ?, ?, ?, 'todo', ?)
    `);

    insertTask.run(
      taskId,
      userId,
      category_id || null,
      title.trim(),
      description ? description.trim() : null,
      selectedPriority,
      due_date || null
    );

    // Attach tags if provided
    if (Array.isArray(tags) && tags.length > 0) {
      const insertTaskTag = db.prepare('INSERT OR IGNORE INTO task_tags (task_id, tag_id) VALUES (?, ?)');
      for (const tagId of tags) {
        insertTaskTag.run(taskId, tagId);
      }
    }

    // Attach subtasks if provided
    if (Array.isArray(subtasks) && subtasks.length > 0) {
      const insertSubtask = db.prepare('INSERT INTO subtasks (id, task_id, title, completed) VALUES (?, ?, ?, 0)');
      for (const sub of subtasks) {
        if (sub && sub.title && sub.title.trim()) {
          insertSubtask.run(crypto.randomUUID(), taskId, sub.title.trim());
        }
      }
    }

    const rawTask = db.prepare(`
      SELECT t.*, 
             c.name as category_name, 
             c.color as category_color, 
             c.icon as category_icon
      FROM tasks t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?
    `).get(taskId);

    const [task] = attachTaskRelations([rawTask], userId);
    return res.status(201).json({ task });
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    return res.status(500).json({ error: 'Erro ao criar tarefa.' });
  }
};

export const updateTask = (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category_id, priority, status, due_date, tags } = req.body;
    const userId = req.user.id;

    const existing = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(id, userId);
    if (!existing) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }

    let completedAt = existing.completed_at;
    if (status && status !== existing.status) {
      completedAt = status === 'completed' ? new Date().toISOString() : null;
    }

    const update = db.prepare(`
      UPDATE tasks
      SET title = COALESCE(?, title),
          description = ?,
          category_id = ?,
          priority = COALESCE(?, priority),
          status = COALESCE(?, status),
          due_date = ?,
          completed_at = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `);

    update.run(
      title ? title.trim() : null,
      description !== undefined ? (description ? description.trim() : null) : existing.description,
      category_id !== undefined ? (category_id || null) : existing.category_id,
      priority || null,
      status || null,
      due_date !== undefined ? (due_date || null) : existing.due_date,
      completedAt,
      id,
      userId
    );

    // Update tags if passed
    if (Array.isArray(tags)) {
      db.prepare('DELETE FROM task_tags WHERE task_id = ?').run(id);
      const insertTaskTag = db.prepare('INSERT OR IGNORE INTO task_tags (task_id, tag_id) VALUES (?, ?)');
      for (const tagId of tags) {
        insertTaskTag.run(id, tagId);
      }
    }

    const rawTask = db.prepare(`
      SELECT t.*, 
             c.name as category_name, 
             c.color as category_color, 
             c.icon as category_icon
      FROM tasks t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?
    `).get(id);

    const [task] = attachTaskRelations([rawTask], userId);
    return res.json({ task });
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    return res.status(500).json({ error: 'Erro ao atualizar tarefa.' });
  }
};

export const toggleTaskStatus = (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(id, userId);
    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }

    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    const completedAt = newStatus === 'completed' ? new Date().toISOString() : null;

    db.prepare(`
      UPDATE tasks 
      SET status = ?, completed_at = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(newStatus, completedAt, id);

    const rawTask = db.prepare(`
      SELECT t.*, 
             c.name as category_name, 
             c.color as category_color, 
             c.icon as category_icon
      FROM tasks t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?
    `).get(id);

    const [updatedTask] = attachTaskRelations([rawTask], userId);
    return res.json({ task: updatedTask });
  } catch (error) {
    console.error('Erro ao alternar status da tarefa:', error);
    return res.status(500).json({ error: 'Erro ao alternar status.' });
  }
};

export const deleteTask = (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = db.prepare('SELECT id FROM tasks WHERE id = ? AND user_id = ?').get(id, userId);
    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }

    db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?').run(id, userId);
    return res.json({ message: 'Tarefa excluída com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir tarefa:', error);
    return res.status(500).json({ error: 'Erro ao excluir tarefa.' });
  }
};

// Subtasks endpoints
export const addSubtask = (req, res) => {
  try {
    const { id } = req.params; // task_id
    const { title } = req.body;
    const userId = req.user.id;

    const task = db.prepare('SELECT id FROM tasks WHERE id = ? AND user_id = ?').get(id, userId);
    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Título do item é obrigatório.' });
    }

    const subtaskId = crypto.randomUUID();
    db.prepare('INSERT INTO subtasks (id, task_id, title, completed) VALUES (?, ?, ?, 0)')
      .run(subtaskId, id, title.trim());

    const subtask = db.prepare('SELECT * FROM subtasks WHERE id = ?').get(subtaskId);
    return res.status(201).json({ subtask });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao adicionar item.' });
  }
};

export const toggleSubtask = (req, res) => {
  try {
    const { subtaskId } = req.params;
    const subtask = db.prepare('SELECT * FROM subtasks WHERE id = ?').get(subtaskId);
    if (!subtask) {
      return res.status(404).json({ error: 'Item não encontrado.' });
    }

    const newCompleted = subtask.completed ? 0 : 1;
    db.prepare('UPDATE subtasks SET completed = ? WHERE id = ?').run(newCompleted, subtaskId);

    return res.json({ subtask: { ...subtask, completed: newCompleted } });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao alternar item.' });
  }
};

export const deleteSubtask = (req, res) => {
  try {
    const { subtaskId } = req.params;
    db.prepare('DELETE FROM subtasks WHERE id = ?').run(subtaskId);
    return res.json({ message: 'Item removido com sucesso.' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao remover item.' });
  }
};
