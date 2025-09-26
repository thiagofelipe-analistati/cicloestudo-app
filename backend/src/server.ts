// src/server.ts
import express from 'express';
import cors from 'cors'; // Importa o cors
import disciplinaRoutes from './routes/disciplina.routes';
import sessaoRoutes from './routes/sessao.routes';
import authRoutes from './routes/auth.routes';
import cicloRoutes from './routes/ciclo.routes'; 
import revisaoRoutes from './routes/revisao.routes'; // <-- IMPORTAR AS NOVAS ROTAS




const app = express();
const PORT = process.env.PORT || 3000;

// 1. Habilita o CORS para TODAS as origens.
// Esta deve ser uma das primeiras coisas que o app faz.
app.use(cors());

// 2. Middleware para o Express entender JSON
app.use(express.json());

// Rota de verificação
app.get('/api', (req, res) => {
  res.send('API do Ciclo de Estudos funcionando!');
});

// --- ROTAS PÚBLICAS ---
app.use('/api/auth', authRoutes);

// --- ROTAS PROTEGIDAS ---
app.use('/api/sessoes', sessaoRoutes);
// A rota de tópicos já está aninhada dentro de disciplinas, então não precisa ser declarada aqui.
app.use('/api/disciplinas', disciplinaRoutes);
app.use('/api/sessoes', sessaoRoutes);
app.use('/api/ciclos', cicloRoutes);
app.use('/api/revisoes', revisaoRoutes); // <-- USAR AS NOVAS ROTAS
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

