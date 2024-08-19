const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Rota de verificação do token
router.get('/verify-token', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  console.log('Token received:', token);  // Adicione este log para verificar o token recebido

  if (!token) {
    return res.status(401).send('Access Denied: No token provided');
  }

  try {
    const secret = 'dXx?2#_P4w4F!bN+9@K2hT&f5L!mS*Z';
    console.log('Token secret:', secret);  // Adicione este log para verificar a chave secreta

    const verified = jwt.verify(token, secret);
    console.log('Token verified:', verified);  // Adicione este log para verificar a verificação do token
    res.status(200).send(verified);
  } catch (err) {
    console.error('Token verification error:', err);  // Adicione este log para erros de verificação
    res.status(400).send('Invalid Token');
  }
});

module.exports = router;
