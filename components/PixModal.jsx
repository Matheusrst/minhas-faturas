// pages/pixModal.jsx
import { useState } from 'react';
import { QrCode } from 'lucide-react';  // Utilizando o ícone do Lucid

export default function PixModal() {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = () => {
    // Copia o código Pix para a área de transferência
    navigator.clipboard.writeText("00020126970014br.gov.bcb.pix2575");

    // Exibe o card de sucesso
    setCopySuccess(true);

    // Remove o card de sucesso após 3 segundos
    setTimeout(() => {
      setCopySuccess(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg w-96 relative">
        {/* Exibe o card de sucesso quando o texto for copiado */}
        {copySuccess && (
          <div className="absolute top-0 left-0 w-full p-2 bg-green-500 text-white text-center rounded-t-lg">
            Copiado para a área de transferência!
          </div>
        )}

        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">Pix Copia e Cola</h2>
          
          {/* QR Code */}
          <div className="w-48 h-48 bg-gray-300 rounded-lg flex items-center justify-center mb-4">
            {/*<img src="/path/to/your/qr-code.png" alt="QR Code" className="w-full h-full object-cover" />*/}
          </div>

          {/* Código Pix */}
          <div className="flex items-center w-full mb-4">
            <input
              type="text"
              readOnly
              value="00020126970014br.gov.bcb.pix2575"
              className="border p-2 flex-grow mr-2"
            />
            <button 
              onClick={handleCopy}  // Chama a função handleCopy para copiar o código
              className="p-2 bg-blue-500 text-white rounded"
            >
              <QrCode size={20} />
            </button>
          </div>

          {/* Detalhes de pagamento */}
          <div className="text-sm space-y-2 w-full text-center mb-4">
            <div className="flex justify-between">
              <span className="font-semibold">Vencimento:</span>
              <span>10/11/2024</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Valor:</span>
              <span>R$ 19,95</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Total:</span>
              <span>R$ 20,00</span>
            </div>
          </div>

          {/* Botão de fechar */}
          <div className="flex justify-center">
            <button 
              onClick={() => window.close()} 
              className="w-full bg-gray-200 p-2 rounded text-center"
            >
              Fechar
            </button>
          </div>

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
    </div>
  );
}
