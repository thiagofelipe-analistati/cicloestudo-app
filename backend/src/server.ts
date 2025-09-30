// ARQUIVO: backend/src/server.ts

import express from 'express';
import cors from 'cors';
import disciplinaRoutes from './routes/disciplina.routes';
import sessaoRoutes from './routes/sessao.routes';
import authRoutes from './routes/auth.routes';
import cicloRoutes from './routes/ciclo.routes'; 
import revisaoRoutes from './routes/revisao.routes';

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'https://cicloestudo-app-1qgs.vercel.app', // Seu frontend em produção
  'http://localhost:5173'                     // Seu frontend em desenvolvimento
];

const corsOptions = {
  // AJUSTE: Adicionando os tipos para 'origin' e 'callback'
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Permite requisições sem 'origin' (como apps mobile ou Postman) ou se a origem está na lista
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Acesso não permitido pela política de CORS'));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

// Aplica o middleware do CORS com as opções definidas
app.use(cors(corsOptions));

// Middleware para o Express entender JSON
app.use(express.json());

// Rota de verificação
app.get('/api', (req, res) => {
  res.send('API do Ciclo de Estudos funcionando!');
});

// --- ROTAS DA APLICAÇÃO ---
app.use('/api/auth', authRoutes);
app.use('/api/disciplinas', disciplinaRoutes);
app.use('/api/sessoes', sessaoRoutes);
app.use('/api/ciclos', cicloRoutes);
app.use('/api/revisoes', revisaoRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});