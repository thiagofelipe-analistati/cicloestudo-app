import express from 'express';
import disciplinaRoutes from './routes/disciplina.routes'; // <-- SEM .js

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api', (req, res) => {
  res.send('API do Ciclo de Estudos funcionando!');
});

app.use('/api/disciplinas', disciplinaRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});