const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/adminAuth');
router.use(auth);

router.get('/inscricoes', async (req, res, next) => {
  try { const [rows] = await db.query(`SELECT i.id,i.nome,i.email,i.telefone,i.tipo_inscricao,i.status,i.criado_em,v.nome AS veiculo FROM inscricoes i LEFT JOIN veiculos v ON v.id=i.veiculo_id ORDER BY i.criado_em DESC`); res.json(rows); }
  catch (e) { next(e); }
});

const configs = {
  veiculos: { table: 'veiculos', fields: ['nome','marca','modelo','ano','categoria','descricao','imagem','destaque'], required: ['nome','marca','modelo','categoria','descricao'] },
  atracoes: { table: 'atracoes', fields: ['nome','descricao','tipo','local','imagem'], required: ['nome','descricao','tipo','local'] },
  programacao: { table: 'programacao', fields: ['titulo','descricao','data_evento','horario_inicio','horario_fim','local'], required: ['titulo','descricao','data_evento','horario_inicio','local'] }
};
for (const [resource, cfg] of Object.entries(configs)) {
  router.get(`/${resource}`, async (_req, res, next) => {
    try { const [rows] = await db.query(`SELECT * FROM ${cfg.table} ORDER BY id DESC`); res.json(rows); }
    catch (e) { next(e); }
  });
  router.post(`/${resource}`, async (req, res, next) => {
    try {
      for (const field of cfg.required) if (req.body[field] === undefined || req.body[field] === '') return res.status(400).json({ erro: `Campo obrigatório: ${field}` });
      const fields = cfg.fields.filter(f => req.body[f] !== undefined);
      const values = fields.map(f => req.body[f] === '' ? null : req.body[f]);
      const [r] = await db.execute(`INSERT INTO ${cfg.table} (${fields.join(',')}) VALUES (${fields.map(()=>'?').join(',')})`, values);
      res.status(201).json({ id: r.insertId, mensagem: 'Registro criado.' });
    } catch (e) { next(e); }
  });
  router.put(`/${resource}/:id`, async (req, res, next) => {
    try {
      const fields = cfg.fields.filter(f => req.body[f] !== undefined);
      if (!fields.length) return res.status(400).json({ erro: 'Nenhum campo para atualizar.' });
      const values = fields.map(f => req.body[f] === '' ? null : req.body[f]);
      const [r] = await db.execute(`UPDATE ${cfg.table} SET ${fields.map(f=>`${f}=?`).join(',')} WHERE id=?`, [...values, req.params.id]);
      if (!r.affectedRows) return res.status(404).json({ erro: 'Registro não encontrado.' });
      res.json({ mensagem: 'Registro atualizado.' });
    } catch (e) { next(e); }
  });
  router.delete(`/${resource}/:id`, async (req, res, next) => {
    try {
      const [r] = await db.execute(`DELETE FROM ${cfg.table} WHERE id=?`, [req.params.id]);
      if (!r.affectedRows) return res.status(404).json({ erro: 'Registro não encontrado.' });
      res.json({ mensagem: 'Registro excluído.' });
    } catch (e) { next(e); }
  });
}
router.patch('/inscricoes/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['Recebida','Confirmada','Cancelada'].includes(status)) return res.status(400).json({ erro: 'Status inválido.' });
    const [r] = await db.execute('UPDATE inscricoes SET status=? WHERE id=?', [status, req.params.id]);
    if (!r.affectedRows) return res.status(404).json({ erro: 'Inscrição não encontrada.' });
    res.json({ mensagem: 'Status atualizado.' });
  } catch (e) { next(e); }
});
module.exports = router;
