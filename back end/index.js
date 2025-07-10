const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'matheus02',
  database: 'sync360'
});

connection.connect(err => {
  if (err) {
    console.error('Erro ao conectar no MySQL:', err);
    return;
  }
  console.log('Conectado ao banco MySQL!');
});

// GET - retorna todos os usuários para listar no modal
app.get('/usuarios', (req, res) => {
  connection.query('SELECT * FROM usuario', (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuários:', err);
      return res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
    res.json(results);
  });
});

// GET - retorna o usuário por ID
app.get('/usuario/:id', (req, res) => {
  const id = req.params.id;
  connection.query('SELECT * FROM usuario WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err);
      return res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(results[0]);
  });
});

// POST - insere novo usuário
app.post('/usuario', (req, res) => {
  const { nome, idade, rua, bairro, estado, biografia, foto } = req.body;
  const queryInsert = `
    INSERT INTO usuario (nome, idade, rua, bairro, estado, biografia, foto)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  connection.query(queryInsert, [nome, idade, rua, bairro, estado, biografia, foto], (err) => {
    if (err) {
      console.error('Erro ao inserir usuário:', err);
      return res.status(500).json({ error: 'Erro ao inserir usuário' });
    }
    res.json({ message: 'Usuário inserido com sucesso!' });
  });
});

// PUT - atualiza usuário existente por ID
app.put('/usuario/:id', (req, res) => {
  const id = req.params.id;
  const { nome, idade, rua, bairro, estado, biografia, foto } = req.body;
  const queryUpdate = `
    UPDATE usuario SET nome=?, idade=?, rua=?, bairro=?, estado=?, biografia=?, foto=? WHERE id=?
  `;
  connection.query(queryUpdate, [nome, idade, rua, bairro, estado, biografia, foto, id], (err) => {
    if (err) {
      console.error('Erro ao atualizar usuário:', err);
      return res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
    res.json({ message: 'Usuário atualizado com sucesso!' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// DELETE - remove usuário por ID
app.delete('/usuario/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM usuario WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Erro ao deletar usuário:', err);
      return res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
    res.json({ message: 'Usuário deletado com sucesso!' });
  });
});

