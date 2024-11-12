import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { codigo, vencimento, emissao, parcela, status, valor } = req.body;

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
      res.status(500).json({ error: "Erro ao criar fatura" });
    }
  } else if (req.method === 'GET') {
    try {
      const faturas = await prisma.fatura.findMany(); // Busca todas as faturas
      res.status(200).json(faturas);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar faturas" });
    }
  } else {
    res.status(405).json({ error: "Método não permitido" });
  }
}
