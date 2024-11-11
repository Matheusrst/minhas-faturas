import Link from "next/link";
import { useState } from "react";

export default function MinhasFaturas() {
  // Estado para controlar o número de linhas visíveis
  const [numLinhas, setNumLinhas] = useState(5);

  // Função para adicionar mais linhas
  const loadMore = () => {
    setNumLinhas(numLinhas + 5);
  };

  return (
    <div className="bg-[#C7C7C7] min-h-screen flex flex-col">
      {/* Cabeçalho */}
      <div className="bg-gray-400 px-4 sm:px-8 py-6 w-full fixed top-0 left-0 right-0 z-10 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="text-blue-700 font-bold text-xl sm:text-2xl">GRUPO CEDNET</div>

          {/* Cards para os botões de Nova Consulta e Carrinho */}
          <div className="flex items-center space-x-4 ml-auto">
            {/* Card para o botão Nova Consulta */}
            <div className="flex items-center space-x-3 bg-[#2B6FC9] text-white px-6 py-3 rounded-lg shadow-md hover:shadow-xl cursor-pointer transition-all">
              <span className="text-lg">Nova Consulta</span>
            </div>
          </div>
        </div>
      </div>

      {/* Espaçamento para evitar sobreposição do cabeçalho */}
      <div className="h-24"></div>

      {/* Área de Tabs logo abaixo do cabeçalho */}
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

      {/* Tabela de Faturas ocupando todo o espaço disponível */}
      <div className="flex-grow px-4 sm:px-8 py-6 overflow-y-auto bg-[#C7C7C7] mt-10">
        <div className="bg-[#E2E2E2] rounded-lg p-4 sm:p-8">
          {/* Cabeçalho da Tabela */}
          <div className="grid grid-cols-1 sm:grid-cols-7 gap-4 sm:gap-6 text-black-300 font-semibold text-lg sm:text-xl border-b-2 border-[#adadad] pb-4 mb-6">
            <div>Código</div>
            <div>Vencimento</div>
            <div>Emissão</div>
            <div>Parcela</div>
            <div>Status</div>
            <div>Valor</div>
            <div>Comprovante</div>
          </div>

          {/* Linhas da Tabela */}
          {[...Array(numLinhas)].map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-7 gap-4 sm:gap-11 text-black bg-[#dddddd] rounded p-4 sm:p-6 text-sm sm:text-lg"
            >
              <div>19564</div>
              <div>15/10/2024</div>
              <div>18/01/2024</div>
              <div>{1 + index}</div>
              <div>Pago</div>
              <div>104,90</div>
              <div className="text-blue-600 underline cursor-pointer">Gerar comprovante</div>
            </div>
          ))}

          {/* Botão Load More em formato de Card */}
          <div className="flex justify-center mt-6">
            <button
              onClick={loadMore}
              className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition"
            >
              Load More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
