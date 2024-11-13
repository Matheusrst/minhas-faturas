import { useEffect, useState } from "react";
import { CreditCard, QrCode, Barcode, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

// Define o tipo para uma fatura
interface Fatura {
  id: string;
  codigo: string;
  vencimento: string;
  emissao: string;
  parcela: number;
  status: string;
  valor: number;
}

export default function MinhasFaturas() {
  const [faturas, setFaturas] = useState<Fatura[]>([]);
  const [selectedFaturas, setSelectedFaturas] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [showCard, setShowCard] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchFaturas() {
      try {
        const response = await fetch("/api/faturas");
        const data = await response.json();
        setFaturas(data);
      } catch (error) {
        console.error("Erro ao buscar faturas:", error);
      }
    }
    fetchFaturas();
  }, []);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedFaturas([]);
    } else {
      setSelectedFaturas(faturas.map((fatura) => fatura.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelect = (id: string) => {
    if (selectedFaturas.includes(id)) {
      setSelectedFaturas(selectedFaturas.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedFaturas([...selectedFaturas, id]);
    }
  };

  const isVencida = (vencimento: string) => {
    const hoje = new Date();
    const vencimentoDate = new Date(vencimento);
    return vencimentoDate < hoje;
  };

  const temFaturaAtrasada = () => {
    return faturas.some((fatura) => isVencida(fatura.vencimento));
  };

  const handleLogout = () => {
    Cookies.remove("userCpf");
    sessionStorage.setItem("logout", "true");
    router.push("/LoginPage");
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

            {selectedFaturas.length > 0 ? (
              <Link href="/payment">
                <div className="flex items-center space-x-3 bg-[#0687F1] text-white px-6 py-3 rounded-lg shadow-md hover:shadow-xl cursor-pointer transition-all">
                  <ShoppingCart size={24} />
                  <span className="text-lg">Carrinho</span>
                </div>
              </Link>
            ) : (
              <div className="flex items-center space-x-3 bg-gray-400 text-white px-6 py-3 rounded-lg shadow-md cursor-not-allowed transition-all">
                <ShoppingCart size={24} />
                <span className="text-lg">Carrinho</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-24"></div>

      <div className="flex justify-center border-b border-[#C7C7C7] px-4 sm:px-8 shadow-lg">
        <Link href="/" passHref>
          <button className="text-blue-700 font-semibold text-lg sm:text-xl px-6 sm:px-10 py-4 focus:outline-none border-b-4 border-blue-700">
            Minhas Faturas
          </button>
        </Link>
        <Link href="/history" passHref>
          <button className="text-black-700 font-semibold text-lg sm:text-xl px-6 sm:px-12 py-4 focus:outline-none">
            Histórico
          </button>
        </Link>
      </div>

      <div className="flex-grow px-4 sm:px-8 py-6 overflow-y-auto bg-[#ffffff] mt-10">
        <div className="bg-[#ebebeb] rounded-lg p-4 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-8 gap-[10px] text-black-300 font-semibold text-lg sm:text-xl border-b-2 border-[#adadad] pb-4 mb-6">
            <div style={{ width: "5px", height: "24px" }} className="mr-2">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="w-6 h-6"
              />
            </div>
            <div>Código</div>
            <div>Vencimento</div>
            <div>Emissão</div>
            <div>Parcela</div>
            <div>Status</div>
            <div>Valor</div>
            <div>Pagar</div>
          </div>

          <div className="space-y-4">
            {faturas.map((fatura) => {
              const vencida = isVencida(fatura.vencimento);
              return (
                <div
                  key={fatura.id}
                  className={`grid grid-cols-1 sm:grid-cols-8 gap-[10px] text-black rounded p-4 sm:p-6 text-sm sm:text-lg ${
                    vencida ? "bg-[#ff929b]" : "bg-[#dddddd]"
                  }`}
                >
                  <div
                    className="flex items-center justify-center"
                    style={{ width: "24px", height: "24px" }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedFaturas.includes(fatura.id)}
                      onChange={() => handleSelect(fatura.id)}
                      className="w-6 h-6"
                    />
                  </div>
                  <div className="ml-[-10px]">{fatura.codigo}</div>
                  <div>{new Date(fatura.vencimento).toLocaleDateString()}</div>
                  <div>{new Date(fatura.emissao).toLocaleDateString()}</div>
                  <div>{fatura.parcela}</div>
                  <div>{fatura.status}</div>
                  <div>{fatura.valor.toFixed(2)}</div>
                  <div className="flex space-x-2 sm:space-x-3">
                    <Link href="/payment">
                      <div className="text-black">
                        <CreditCard size={24} />
                      </div>
                    </Link>
                    <Link href="/pixModal">
                      <div className="text-black">
                        <QrCode size={24} />
                      </div>
                    </Link>
                    <div className="text-black">
                      <Barcode size={24} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showCard && temFaturaAtrasada() && (
        <div className="fixed bottom-6 right-6 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center justify-between">
          <span>Você tem faturas vencidas!</span>
          <button onClick={() => setShowCard(false)} className="text-xl font-bold hover:text-black">
            ×
          </button>
        </div>
      )}
    </div>
  );
}
