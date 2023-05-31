const express = require('express');
const bodyParser = require('body-parser');

const app = express();
var cors = require('cors')

app.use(cors())
app.use(bodyParser.json());

let candidates = [];


app.get('/candidates', (req, res) => {
  res.json(candidates);
});


app.get('/candidates/non-hired', (req, res) => {
  const nonHiredCandidates = candidates.filter(candidate => !candidate.hired);
  res.json(nonHiredCandidates);
});


app.get('/candidates/hired', (req, res) => {
  const hiredCandidates = candidates.filter(candidate => candidate.hired);
  res.json(hiredCandidates);
});


app.post('/candidates', (req, res) => {
  const candidate = req.body;
  candidates.push(candidate);
  res.status(201).json(candidate);
});


app.put('/candidates', (req, res) => {
  const id = parseInt(req.body.id);
  const updatedCandidate = req.body;

  candidates = candidates.map(candidate => {
    if (candidate.id === id) {
      return { ...candidate, ...updatedCandidate };
    }
    return candidate; 
  });

  res.json(updatedCandidate);
});


app.delete('/candidates', (req, res) => {
  var { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }
  id = parseInt(id);
  candidates = candidates.filter(candidate => candidate.id !== id);
  res.sendStatus(204);
});


const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
