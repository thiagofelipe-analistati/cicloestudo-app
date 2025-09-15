// src/server.ts
import express from 'express';
import cors from 'cors';
import disciplinaRoutes from './routes/disciplina.routes';
import sessaoRoutes from './routes/sessao.routes';
import authRoutes from './routes/auth.routes'; // <-- 1. IMPORTE AS ROTAS DE AUTENTICAÇÃO

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.send('API do Ciclo de Estudos funcionando!');
});

// --- ROTAS PÚBLICAS (NÃO EXIGEM AUTENTICAÇÃO) ---
app.use('/api/auth', authRoutes); // <-- 2. USE AS ROTAS DE AUTENTICAÇÃO

// --- ROTAS PROTEGIDAS (EXIGIRÃO AUTENTICAÇÃO NO FUTURO) ---
app.use('/api/disciplinas', disciplinaRoutes);
app.use('/api/sessoes', sessaoRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});