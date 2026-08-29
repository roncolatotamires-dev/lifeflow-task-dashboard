import crypto from 'crypto';
import db from '../config/db.js';

export const getCategories = (req, res) => {
  try {
    const categories = db.prepare(`
      SELECT c.*, 
        (SELECT COUNT(*) FROM tasks t WHERE t.category_id = c.id AND t.user_id = c.user_id) as total_tasks,
        (SELECT COUNT(*) FROM tasks t WHERE t.category_id = c.id AND t.user_id = c.user_id AND t.status = 'completed') as completed_tasks
      FROM categories c
      WHERE c.user_id = ?
      ORDER BY c.created_at ASC
    `).all(req.user.id);

    return res.json({ categories });
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return res.status(500).json({ error: 'Erro ao buscar categorias.' });
  }
};

export const createCategory = (req, res) => {
  try {
    const { name, color, icon } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Nome da categoria é obrigatório.' });
    }

    const id = crypto.randomUUID();
    const insert = db.prepare(`
      INSERT INTO categories (id, user_id, name, color, icon)
      VALUES (?, ?, ?, ?, ?)
    `);

    insert.run(
      id,
      req.user.id,
      name.trim(),
      color || '#3B82F6',
      icon || 'Folder'
    );

    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    return res.status(201).json({ category });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    return res.status(500).json({ error: 'Erro ao criar categoria.' });
  }
};

export const updateCategory = (req, res) => {
  try {
    const { id } = req.params;
    const { name, color, icon } = req.body;

    const cat = db.prepare('SELECT * FROM categories WHERE id = ? AND user_id = ?').get(id, req.user.id);
    if (!cat) {
      return res.status(404).json({ error: 'Categoria não encontrada.' });
    }

    const update = db.prepare(`
      UPDATE categories
      SET name = COALESCE(?, name),
          color = COALESCE(?, color),
          icon = COALESCE(?, icon)
      WHERE id = ? AND user_id = ?
    `);

    update.run(name ? name.trim() : null, color, icon, id, req.user.id);

    const updated = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    return res.json({ category: updated });
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    return res.status(500).json({ error: 'Erro ao atualizar categoria.' });
  }
};

export const deleteCategory = (req, res) => {
  try {
    const { id } = req.params;
    const cat = db.prepare('SELECT * FROM categories WHERE id = ? AND user_id = ?').get(id, req.user.id);
    if (!cat) {
      return res.status(404).json({ error: 'Categoria não encontrada.' });
    }

    db.prepare('DELETE FROM categories WHERE id = ? AND user_id = ?').run(id, req.user.id);
    return res.json({ message: 'Categoria removida com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    return res.status(500).json({ error: 'Erro ao remover categoria.' });
  }
};
