import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import db from '../config/db.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Por favor, preencha todos os campos obrigatórios.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha deve conter no mínimo 6 caracteres.' });
    }

    const checkUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
    if (checkUser) {
      return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID();

    const insertUser = db.prepare(`
      INSERT INTO users (id, name, email, password_hash)
      VALUES (?, ?, ?, ?)
    `);

    insertUser.run(userId, name.trim(), email.toLowerCase().trim(), passwordHash);

    // Seed default categories for this user
    const defaultCategories = [
      { id: crypto.randomUUID(), name: 'Trabalho', color: '#3B82F6', icon: 'Briefcase' },
      { id: crypto.randomUUID(), name: 'Estudo', color: '#8B5CF6', icon: 'BookOpen' },
      { id: crypto.randomUUID(), name: 'Casa', color: '#10B981', icon: 'Home' },
      { id: crypto.randomUUID(), name: 'Compras', color: '#F59E0B', icon: 'ShoppingCart' },
      { id: crypto.randomUUID(), name: 'Saúde & Lazer', color: '#EC4899', icon: 'Heart' }
    ];

    const insertCat = db.prepare(`
      INSERT INTO categories (id, user_id, name, color, icon)
      VALUES (?, ?, ?, ?, ?)
    `);

    for (const cat of defaultCategories) {
      insertCat.run(cat.id, userId, cat.name, cat.color, cat.icon);
    }

    // Seed default tags
    const defaultTags = [
      { id: crypto.randomUUID(), name: 'Importante', color: '#EF4444' },
      { id: crypto.randomUUID(), name: 'Rápido', color: '#10B981' },
      { id: crypto.randomUUID(), name: 'Projeto', color: '#6366F1' },
      { id: crypto.randomUUID(), name: 'Reunião', color: '#F97316' }
    ];

    const insertTag = db.prepare(`
      INSERT INTO tags (id, user_id, name, color)
      VALUES (?, ?, ?, ?)
    `);

    for (const tag of defaultTags) {
      insertTag.run(tag.id, userId, tag.name, tag.color);
    }

    const token = jwt.sign(
      { id: userId, email: email.toLowerCase(), name: name.trim() },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Conta criada com sucesso!',
      token,
      user: { id: userId, name: name.trim(), email: email.toLowerCase() }
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    return res.status(500).json({ error: 'Erro interno ao criar conta.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Informe o e-mail e a senha.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Login realizado com sucesso!',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro interno ao realizar login.' });
  }
};

export const me = (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, email, created_at FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao obter dados do usuário.' });
  }
};
