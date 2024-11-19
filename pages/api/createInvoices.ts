import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Fatura } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { codigo, vencimento, emissao, parcela, status, valor }: Omit<Fatura, 'id'> = req.body;

      const fatura = await prisma.fatura.create({
        data: {
          codigo,
          vencimento: new Date(vencimento),
          emissao: new Date(emissao),
          parcela,
          status,
          valor,
        },
      });

      res.status(201).json(fatura); // Retorna a fatura criada
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar fatura" });
    }
  } else if (req.method === 'GET') {
    try {
      // Filtra as faturas com o status "Pago"
      const faturas = await prisma.fatura.findMany({
        where: {
          status: 'Pago', // Filtra para retornar apenas as faturas pagas
        },
      });

      res.status(200).json(faturas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar faturas" });
    }
  } else {
    res.status(405).json({ error: "Método não permitido" });
  }
}
