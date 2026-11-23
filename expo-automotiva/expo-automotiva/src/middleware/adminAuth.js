module.exports = function adminAuth(req, res, next) {
  const expected = process.env.ADMIN_TOKEN;
  const received = req.get('x-admin-token');
  if (!expected || expected.length < 20) {
    return res.status(503).json({ erro: 'Configure um ADMIN_TOKEN seguro no arquivo .env.' });
  }
  if (!received || received !== expected) {
    return res.status(401).json({ erro: 'Acesso administrativo não autorizado.' });
  }
  next();
};
