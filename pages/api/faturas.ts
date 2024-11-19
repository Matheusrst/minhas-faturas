// pages/api/faturas.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Fatura } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const faturas: Fatura[] = await prisma.fatura.findMany({
        where: {
          status: {
            in: ['A Receber', 'Pendente'], // Filtra os status desejados
          },
        },
      });

      res.status(200).json(faturas); // Retorna as faturas filtradas
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar faturas' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
