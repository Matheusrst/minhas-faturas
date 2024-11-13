import { CreditCard, Calendar, Lock, User, Package } from 'lucide-react'; // Importando ícones do Lucide

export default function Fatura() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Conteúdo da Fatura */}
      <div className="pt-24 min-h-screen flex items-center justify-center p-4"> {/* Adicionando padding-top para ajustar o conteúdo abaixo do cabeçalho fixo */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden w-11/12 max-w-6xl min-w-[900px]"> {/* Aumentando a largura para 11/12 da tela */}
          <div className="flex">
            {/* Resumo das Faturas */}
            <div className="w-1/2 p-6 border-r border-gray-200">
              <h2 className="text-xl font-bold mb-4">Resumo das Faturas</h2>
              <div className="text-sm space-y-4">
                <div>
                  <span className="font-semibold">Contrato:</span> 31398 - HOSPEDAGEM PROFISSIONAL - CPANEL
                </div>
                <div className="flex justify-between">
                  <span><Calendar size={16} className="mr-2" /> Vencimento</span>
                  <span>10/11/2024</span>
                </div>
                <div className="flex justify-between">
                  <span><Package size={16} className="mr-2" /> Valor</span>
                  <span>R$ 19,95</span>
                </div>
                <div className="flex justify-between">
                  <span><Lock size={16} className="mr-2" /> Multa</span>
                  <span>R$ 0,40</span>
                </div>
                <div className="flex justify-between">
                  <span><Lock size={16} className="mr-2" /> Juros</span>
                  <span>R$ 0,01</span>
                </div>
                <hr className="my-4 border-gray-300" />
                <div className="flex justify-between font-bold">
                  <span>Valor Total</span>
                  <span>R$ 20,36</span>
                </div>
                
                <div><br /></div>
                <div><br /></div>

                {/* Botão Cancelar */}
                <div className="flex justify-between mt-4">
                  <button 
                    onClick={() => window.history.back()} // Botão de retorno
                    className="w-full py-2 bg-[#ff2121] text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>

            {/* Dados do Pagador */}
            <div className="w-1/2 p-6"> {/* Mudando de w-200 para w-1/2 para ocupar metade da tela */}
              <h2 className="text-xl font-bold mb-4">Dados do Pagador</h2>
              <div className="space-y-4">
                {/* Nome do Titular */}
                <div className="flex items-center border p-2 rounded-lg">
                  <User size={20} className="mr-2" />
                  <input 
                    type="text" 
                    placeholder="Nome Do Titular" 
                    className="flex-grow p-2 border-none focus:outline-none"
                  />
                </div>

                {/* Número do Cartão */}
                <div className="flex items-center border p-2 rounded-lg">
                  <CreditCard size={20} className="mr-2" />
                  <input 
                    type="text" 
                    placeholder="Número Do Cartão" 
                    className="flex-grow p-2 border-none focus:outline-none"
                  />
                </div>

                {/* Data de Expiração e Cód. De Segurança */}
                <div className="flex space-x-4">
                  <div className="flex items-center border p-2 rounded-lg">
                    <Calendar size={20} className="mr-2" />
                    <input 
                      type="text" 
                      placeholder="Data De Expiração" 
                      className="flex-grow p-2 border-none focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center border p-2 rounded-lg">
                    <Lock size={20} className="mr-2" />
                    <input 
                      type="text" 
                      placeholder="Cód. De Segurança" 
                      className="flex-grow p-2 border-none focus:outline-none"
                    />
                  </div>
                </div>

                {/* CPF/CNPJ */}
                <div className="flex items-center border p-2 rounded-lg">
                  <User size={20} className="mr-2" />
                  <input 
                    type="text" 
                    placeholder="CPF/CNPJ Do Titular do Cartão" 
                    className="flex-grow p-2 border-none focus:outline-none"
                  />
                </div>

                {/* Parcelamento */}
                <div className="flex items-center border p-2 rounded-lg">
                  <Package size={20} className="mr-2" />
                  <select className="flex-grow p-2 border-none focus:outline-none">
                    <option value="1x">1x</option>
                    <option value="2x">2x</option>
                    <option value="3x">3x</option>
                    <option value="4x">4x</option>
                    <option value="5x">5x</option>
                    <option value="6x">6x</option>
                    <option value="7x">7x</option>
                    <option value="8x">8x</option>
                    <option value="9x">9x</option>
                    <option value="10x">10x</option>
                    <option value="11x">11x</option>
                    <option value="12x">12x</option>
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
