// src/server.ts
import express from 'express';
import disciplinaRoutes from './routes/disciplina.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api', (req, res) => {
  res.send('API do Ciclo de Estudos funcionando!');
});

// Agora esta única linha gerencia tanto as disciplinas quanto os tópicos aninhados
app.use('/api/disciplinas', disciplinaRoutes);

// A linha antiga 'app.use('/api/disciplinas/:disciplinaId/topicos', topicoRoutes)' foi removida daqui.

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});