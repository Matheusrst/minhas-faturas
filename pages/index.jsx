import { CreditCard, QrCode, Barcode, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function MinhasFaturas() {
  return (
    <div className="bg-[#ffffff] min-h-screen flex flex-col">
      {/* Cabeçalho fixo no topo */}
      <div className="bg-white px-4 sm:px-8 py-6 w-full fixed top-0 left-0 right-0 z-10 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="text-blue-700 font-bold text-xl sm:text-2xl">GRUPO CEDNET</div>

          {/* Cards para os botões de Nova Consulta e Carrinho */}
          <div className="flex items-center space-x-4 ml-auto">
            {/* Card para o botão Nova Consulta */}
            <div className="flex items-center space-x-3 bg-[#2B6FC9] text-white px-6 py-3 rounded-lg shadow-md hover:shadow-xl cursor-pointer transition-all">
              <span className="text-lg">Nova Consulta</span>
            </div>

            {/* Card para o botão do carrinho */}
            <div className="flex items-center space-x-3 bg-[#0687F1] text-white px-6 py-3 rounded-lg shadow-md hover:shadow-xl cursor-pointer transition-all">
              <ShoppingCart size={24} />
              <span className="text-lg">Carrinho</span>
            </div>
          </div>
        </div>
      </div>

      {/* Espaçamento para evitar sobreposição do cabeçalho */}
      <div className="h-24"></div>

      {/* Área de Tabs logo abaixo do cabeçalho */}
      <div className="flex justify-center border-b border-[#C7C7C7] px-4 sm:px-8 shadow-lg">
        <Link href="/" passHref>
          <button className="text-blue-700 font-semibold text-lg sm:text-xl px-6 sm:px-12 py-4 focus:outline-none border-b-4 border-blue-700">
            Minhas Faturas
          </button>
        </Link>
        <Link href="/history" passHref>
          <button className="text-black-700 font-semibold text-lg sm:text-xl px-6 sm:px-12 py-4 focus:outline-none">
            Histórico
          </button>
        </Link>
      </div>

      {/* Tabela de Faturas */}
      <div className="flex-grow px-4 sm:px-8 py-6 overflow-y-auto bg-[#ffffff] mt-10">
        <div className="bg-[#ebebeb] rounded-lg p-4 sm:p-8">
          {/* Cabeçalho da Tabela */}
          <div className="grid grid-cols-1 sm:grid-cols-7 gap-4 sm:gap-6 text-black-300 font-semibold text-lg sm:text-xl border-b-2 border-[#adadad] pb-4 mb-6">
            <div>Código</div>
            <div>Vencimento</div>
            <div>Emissão</div>
            <div>Parcela</div>
            <div>Status</div>
            <div>Valor</div>
            <div>Pagar</div>
          </div>

          {/* Linhas da Tabela */}
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-7 gap-4 sm:gap-11 text-black bg-[#dddddd] rounded p-4 sm:p-6 text-sm sm:text-lg">
                <div>195676</div>
                <div>15/11/2024</div>
                <div>18/01/2024</div>
                <div>10</div>
                <div>A Receber</div>
                <div>104,90</div>
                <div className="flex space-x-2 sm:space-x-3">
                  <button className="text-black">
                    <CreditCard size={24} />
                  </button>
                  <button className="text-black">
                    <QrCode size={24} />
                  </button>
                  <button className="text-black">
                    <Barcode size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
