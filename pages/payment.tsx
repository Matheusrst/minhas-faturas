// pages/fatura/[id].tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { CreditCard, Calendar, Lock, User, Package } from "lucide-react"; // Importando ícones do Lucide

interface Fatura {
  id: number;
  contrato: string;
  vencimento: string;
  valor: number;
  multa: number;
  juros: number;
  valorTotal: number;
  nomeTitular: string;
  numeroCartao: string;
  dataExpiracao: string;
  codSeguranca: string;
  cpfCnpj: string;
  parcelamento: string;
}

export default function Fatura() {
  const [fatura, setFatura] = useState<Fatura | null>(null);
  const router = useRouter();
  const { id } = router.query; // Recebe o ID da fatura da URL

  useEffect(() => {
    if (id) {
      // Faça uma requisição à API para buscar a fatura específica
      async function fetchFatura() {
        try {
          const response = await fetch(`/api/faturas/${id}`);
          const data = await response.json();
          setFatura(data);
        } catch (error) {
          console.error("Erro ao buscar fatura:", error);
        }
      }
      fetchFatura();
    }
  }, [id]);

  if (!fatura) {
    return <div>Carregando...</div>;
  }

  // Função para garantir que o valor seja numérico e formatado
  const formatarValor = (valor: number) => (isNaN(valor) ? "0.00" : valor.toFixed(2));

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Conteúdo da Fatura */}
      <div className="pt-24 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden w-11/12 max-w-6xl min-w-[900px]">
          <div className="flex">
            {/* Resumo das Faturas */}
            <div className="w-1/2 p-6 border-r border-gray-200">
              <h2 className="text-xl font-bold mb-4">Resumo das Faturas</h2>
              <div className="text-sm space-y-4">
                <div>
                  <span className="font-semibold">Contrato:</span> {fatura.contrato}
                </div>
                <div className="flex justify-between">
                  <span>
                    <Calendar size={16} className="mr-2" /> Vencimento
                  </span>
                  <span>{new Date(fatura.vencimento).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    <Package size={16} className="mr-2" /> Valor
                  </span>
                  <span>R$ {formatarValor(fatura.valor)}</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    <Lock size={16} className="mr-2" /> Multa
                  </span>
                  <span>R$ {formatarValor(fatura.multa)}</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    <Lock size={16} className="mr-2" /> Juros
                  </span>
                  <span>R$ {formatarValor(fatura.juros)}</span>
                </div>
                <hr className="my-4 border-gray-300" />
                <div className="flex justify-between font-bold">
                  <span>Valor Total</span>
                  <span>R$ {formatarValor(fatura.valorTotal)}</span>
                </div>
                <div><br /></div>
                <div><br /></div>

                {/* Botão Cancelar */}
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => window.history.back()}
                    className="w-full py-2 bg-[#ff2121] text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>

            {/* Dados do Pagador */}
            <div className="w-1/2 p-6">
              <h2 className="text-xl font-bold mb-4">Dados do Pagador</h2>
              <div className="space-y-4">
                {/* Nome do Titular */}
                <div className="flex items-center border p-2 rounded-lg">
                  <User size={20} className="mr-2" />
                  <input
                    type="text"
                    value={fatura.nomeTitular}
                    readOnly
                    className="flex-grow p-2 border-none focus:outline-none"
                  />
                </div>

                {/* Número do Cartão */}
                <div className="flex items-center border p-2 rounded-lg">
                  <CreditCard size={20} className="mr-2" />
                  <input
                    type="text"
                    value={fatura.numeroCartao}
                    readOnly
                    className="flex-grow p-2 border-none focus:outline-none"
                  />
                </div>

                {/* Data de Expiração e Cód. De Segurança */}
                <div className="flex space-x-4">
                  <div className="flex items-center border p-2 rounded-lg">
                    <Calendar size={20} className="mr-2" />
                    <input
                      type="text"
                      value={fatura.dataExpiracao}
                      readOnly
                      className="flex-grow p-2 border-none focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center border p-2 rounded-lg">
                    <Lock size={20} className="mr-2" />
                    <input
                      type="text"
                      value={fatura.codSeguranca}
                      readOnly
                      className="flex-grow p-2 border-none focus:outline-none"
                    />
                  </div>
                </div>

                {/* CPF/CNPJ */}
                <div className="flex items-center border p-2 rounded-lg">
                  <User size={20} className="mr-2" />
                  <input
                    type="text"
                    value={fatura.cpfCnpj}
                    readOnly
                    className="flex-grow p-2 border-none focus:outline-none"
                  />
                </div>

                {/* Parcelamento */}
                <div className="flex items-center border p-2 rounded-lg">
                  <Package size={20} className="mr-2" />
                  <select
                    value={fatura.parcelamento}
                    className="flex-grow p-2 border-none focus:outline-none"
                    disabled
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((i) => (
                      <option key={i} value={`${i}x`}>
                        {i}x
                      </option>
                    ))}
                  </select>
                </div>

                {/* Botão Confirmar Pagamento */}
                <div className="flex justify-between mt-4">
                  <button className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                    Confirmar Pagamento
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
