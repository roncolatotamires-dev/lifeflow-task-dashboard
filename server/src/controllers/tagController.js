import crypto from 'crypto';
import db from '../config/db.js';

export const getTags = (req, res) => {
  try {
    const tags = db.prepare(`
      SELECT t.*, 
        (SELECT COUNT(*) FROM task_tags tt WHERE tt.tag_id = t.id) as task_count
      FROM tags t
      WHERE t.user_id = ?
      ORDER BY t.name ASC
    `).all(req.user.id);

    return res.json({ tags });
  } catch (error) {
    console.error('Erro ao buscar tags:', error);
    return res.status(500).json({ error: 'Erro ao buscar tags.' });
  }
};

export const createTag = (req, res) => {
  try {
    const { name, color } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Nome da etiqueta é obrigatório.' });
    }

    const id = crypto.randomUUID();
    const insert = db.prepare(`
      INSERT INTO tags (id, user_id, name, color)
      VALUES (?, ?, ?, ?)
    `);

    insert.run(id, req.user.id, name.trim(), color || '#64748B');

    const tag = db.prepare('SELECT * FROM tags WHERE id = ?').get(id);
    return res.status(201).json({ tag });
  } catch (error) {
    console.error('Erro ao criar tag:', error);
    return res.status(500).json({ error: 'Erro ao criar tag.' });
  }
};

export const deleteTag = (req, res) => {
  try {
    const { id } = req.params;
    const tag = db.prepare('SELECT * FROM tags WHERE id = ? AND user_id = ?').get(id, req.user.id);
    if (!tag) {
      return res.status(404).json({ error: 'Etiqueta não encontrada.' });
    }

    db.prepare('DELETE FROM tags WHERE id = ? AND user_id = ?').run(id, req.user.id);
    return res.json({ message: 'Etiqueta removida com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar tag:', error);
    return res.status(500).json({ error: 'Erro ao remover etiqueta.' });
  }
};
