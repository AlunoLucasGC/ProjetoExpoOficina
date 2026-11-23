require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const db = require('./db');
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: '30kb' }));
app.use(express.urlencoded({ extended: false }));
app.use('/api/inscricoes', rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-7', legacyHeaders: false }));
app.use(express.static(path.join(__dirname, '../public')));
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);
app.get('/health', (_req,res) => res.json({ status: 'ok', app: 'Expo Automotiva' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ erro: 'Registro duplicado.' });
  res.status(500).json({ erro: 'Ocorreu um erro interno. Tente novamente mais tarde.' });
});
(async () => {
  try {
    await db.query('SELECT 1');
    console.log('Banco MySQL conectado.');
    app.listen(PORT, () => console.log(`Expo Automotiva disponível em http://localhost:${PORT}`));
  } catch (err) {
    console.error('Não foi possível conectar ao MySQL. Confira o .env e execute sql/schema.sql.', err.message);
    process.exit(1);
  }
})();
