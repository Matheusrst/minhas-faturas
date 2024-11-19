import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // Pega o ID da fatura a partir da URL

  try {
    const fatura = await prisma.fatura.findUnique({
      where: { id: Number(id) }, // Busca a fatura pelo ID
    });

    if (!fatura) {
      return res.status(404).json({ message: "Fatura não encontrada" });
    }

    res.status(200).json(fatura); // Retorna a fatura encontrada
  } catch (error) {
    console.error("Erro ao buscar fatura:", error); // Agora a variável `error` é usada
    res.status(500).json({ error: "Erro ao buscar a fatura" });
  } finally {
    await prisma.$disconnect();
  }
}
