const express = require('express');
const bodyParser = require('body-parser');

const app = express();
var cors = require('cors')

app.use(cors())
app.use(bodyParser.json());

let candidates = [];

// Rota para obter todos os candidatos
app.get('/candidates', (req, res) => {
  res.json(candidates);
});

// Rota para obter candidatos não contratados
app.get('/candidates/non-hired', (req, res) => {
  const nonHiredCandidates = candidates.filter(candidate => !candidate.hired);
  res.json(nonHiredCandidates);
});

// Rota para obter candidatos contratados
app.get('/candidates/hired', (req, res) => {
  const hiredCandidates = candidates.filter(candidate => candidate.hired);
  res.json(hiredCandidates);
});

// Rota para cadastrar um novo candidato
app.post('/candidates', (req, res) => {
  const candidate = req.body;
  candidates.push(candidate);
  res.status(201).json(candidate);
});

// Rota para atualizar um candidato existente
app.put('/candidates/:id', (req, res) => {
  const id = req.params.id;
  const updatedCandidate = req.body;

  candidates = candidates.map(candidate => {
    if (candidate.id === id) {
      return { ...candidate, ...updatedCandidate };
    }
    return candidate; 
  });

  res.json(updatedCandidate);
});

// Rota para remover um candidato
app.delete('/candidates', (req, res) => {
  var { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }
  id = parseInt(id);
  candidates = candidates.filter(candidate => candidate.id !== id);
  res.sendStatus(204);
});

// Inicializar o servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
