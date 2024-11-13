import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';

interface Fatura {
  id: number;
  codigo: string;
  vencimento: string;
  emissao: string;
  parcela: string;
  status: string;
  valor: number;
}

export default function MinhasFaturas() {
  const [faturas, setFaturas] = useState<Fatura[]>([]);
  const [numLinhas, setNumLinhas] = useState<number>(5);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchFaturas = async () => {
    try {
      const response = await fetch("/api/createInvoices");
      
      if (!response.ok) {
        throw new Error(`Erro na resposta da API: ${response.status}`);
      }

      const data = await response.json();
      setFaturas(data);
    } catch (error) {
      console.error("Erro ao buscar faturas:", error);
      setError("Não foi possível carregar as faturas.");
    }
  };

  useEffect(() => {
    fetchFaturas();
  }, []);

  const loadMore = () => {
    setNumLinhas((prevNumLinhas) => prevNumLinhas + 5);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/LoginPage');
  };

  return (
    <div className="bg-[#ffffff] min-h-screen flex flex-col">
      <div className="bg-white px-4 sm:px-8 py-6 w-full fixed top-0 left-0 right-0 z-10 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="text-blue-700 font-bold text-xl sm:text-2xl">GRUPO CEDNET</div>
          <div className="flex items-center space-x-4 ml-auto">
            <div
              onClick={handleLogout}
              className="flex items-center space-x-3 bg-[#2B6FC9] text-white px-6 py-3 rounded-lg shadow-md hover:shadow-xl cursor-pointer transition-all"
            >
              <span className="text-lg">Nova Consulta</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-24"></div>

      <div className="flex justify-center border-b border-[#C7C7C7] px-4 sm:px-8 shadow-lg">
        <Link href="/" passHref>
          <button className="text-black-700 font-semibold text-lg sm:text-xl px-6 sm:px-12 py-4 focus:outline-none">
            Minhas Faturas
          </button>
        </Link>
        <Link href="/history" passHref>
          <button className="text-blue-700 font-semibold text-lg sm:text-xl px-6 sm:px-10 py-4 focus:outline-none border-b-4 border-blue-700">
            Histórico
          </button>
        </Link>
      </div>

      <div className="flex-grow px-4 sm:px-8 py-6 overflow-y-auto bg-[#ffffff] mt-10">
        <div className="bg-[#ebebeb] rounded-lg p-4 sm:p-8">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-7 gap-4 sm:gap-6 text-black-300 font-semibold text-lg sm:text-xl border-b-2 border-[#adadad] pb-4 mb-6">
                <div>Código</div>
                <div>Vencimento</div>
                <div>Emissão</div>
                <div>Parcela</div>
                <div>Status</div>
                <div>Valor</div>
                <div>Comprovante</div>
              </div>

              {faturas.slice(0, numLinhas).map((fatura) => (
                <div
                  key={fatura.id}
                  className="grid grid-cols-1 sm:grid-cols-7 gap-4 sm:gap-11 text-black bg-[#dddddd] rounded p-4 sm:p-6 text-sm sm:text-lg"
                >
                  <div>{fatura.codigo}</div>
                  <div>{new Date(fatura.vencimento).toLocaleDateString()}</div>
                  <div>{new Date(fatura.emissao).toLocaleDateString()}</div>
                  <div>{fatura.parcela}</div>
                  <div>{fatura.status}</div>
                  <div>{fatura.valor.toFixed(2)}</div>
                  <div className="text-blue-600 underline cursor-pointer">Gerar comprovante</div>
                </div>
              ))}

              <div className="flex justify-center mt-6">
                <button
                  onClick={loadMore}
                  className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition"
                >
                  Load More
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
