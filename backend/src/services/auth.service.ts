// src/services/auth.service.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const authService = {
  register: async (email: string, password: string) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    // Prisma sabe que 'user' é um modelo válido por causa do 'prisma generate'
    return prisma.user.create({
      data: { email, password: hashedPassword },
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

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    return { token };
  },
};