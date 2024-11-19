// pages/api/faturas.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const faturas = await prisma.fatura.findMany({
        where: {
          status: {
            in: ['A Receber', 'Pendente'],
          },
        },
      });
      res.status(200).json(faturas);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar faturas' });
    }
  }
}
