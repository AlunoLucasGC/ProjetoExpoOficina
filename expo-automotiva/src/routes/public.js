const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/veiculos', async (req, res, next) => {
  try {
    const { categoria } = req.query;
    let sql = 'SELECT id,nome,marca,modelo,ano,categoria,descricao,imagem,destaque FROM veiculos';
    const params = [];
    if (categoria && ['Antigos','Esportivos','Modificados','Motocicletas'].includes(categoria)) {
      sql += ' WHERE categoria = ?'; params.push(categoria);
    }
    sql += ' ORDER BY destaque DESC, nome';
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (e) { next(e); }
});

router.get('/atracoes', async (_req, res, next) => {
  try { const [rows] = await db.query('SELECT * FROM atracoes ORDER BY nome'); res.json(rows); }
  catch (e) { next(e); }
});

router.get('/programacao', async (req, res, next) => {
  try {
    const params = [];
    let sql = 'SELECT * FROM programacao';
    if (req.query.data) { sql += ' WHERE data_evento = ?'; params.push(req.query.data); }
    sql += ' ORDER BY data_evento, horario_inicio';
    const [rows] = await db.query(sql, params); res.json(rows);
  } catch (e) { next(e); }
});

router.post('/inscricoes', async (req, res, next) => {
  try {
    const { nome, email, telefone, tipo_inscricao, veiculo_id, mensagem, aceite_privacidade } = req.body;
    if (!nome || !email || !telefone || !['Visitante','Expositor'].includes(tipo_inscricao) || aceite_privacidade !== true) {
      return res.status(400).json({ erro: 'Preencha nome, e-mail, telefone, tipo de inscrição e aceite a política de privacidade.' });
    }
    if (nome.trim().length < 3 || nome.length > 120 || email.length > 160 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ erro: 'Confira o nome e o endereço de e-mail informado.' });
    }
    let vehicleId = null;
    if (tipo_inscricao === 'Expositor' && veiculo_id) {
      const [vehicle] = await db.query('SELECT id FROM veiculos WHERE id = ?', [veiculo_id]);
      if (!vehicle.length) return res.status(400).json({ erro: 'Veículo selecionado não encontrado.' });
      vehicleId = veiculo_id;
    }
    const [result] = await db.execute(
      'INSERT INTO inscricoes (nome,email,telefone,tipo_inscricao,veiculo_id,mensagem,aceite_privacidade) VALUES (?,?,?,?,?,?,?)',
      [nome.trim(), email.trim().toLowerCase(), telefone.trim(), tipo_inscricao, vehicleId, mensagem?.trim() || null, true]
    );
    res.status(201).json({ mensagem: 'Inscrição recebida com sucesso!', protocolo: result.insertId });
  } catch (e) { next(e); }
});

module.exports = router;
