// src/services/auth.service.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const authService = {
  register: async (email: string, password: string) => {
    // Criptografa a senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Cria o novo usuário no banco de dados
    return prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  },

  login: async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Senha inválida');
    }

    // Cria o token se a senha for válida
    const token = jwt.sign(
      { userId: user.id, email: user.email }, // Adicionamos o email ao token
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    return { token };
  },
};