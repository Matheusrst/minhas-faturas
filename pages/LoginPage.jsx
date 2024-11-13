import { useState } from 'react';
import { useRouter } from 'next/router'; // Importa o useRouter do Next.js

export default function LoginPage() {
  const [cpf, setCpf] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter(); // Inicializa o useRouter
  
  // Função para lidar com a mudança no campo CPF
  const handleChange = (e) => {
    setCpf(e.target.value);
  };

  // Função para realizar o login
  const handleLogin = () => {
    // Regex simples para validar o CPF
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/; // Valida CPF com máscara
    const cpfNoMaskRegex = /^\d{11}$/; // Valida CPF sem máscara

    if (!cpfRegex.test(cpf) && !cpfNoMaskRegex.test(cpf)) {
      setError('Por favor, insira um CPF válido.');
      setSuccessMessage(''); // Limpa a mensagem de sucesso caso haja erro
      return;
    }

    // Aqui você pode adicionar a lógica de autenticação real
    setSuccessMessage('Login realizado com sucesso!'); // Exibe a mensagem de sucesso
    setTimeout(() => {
      setSuccessMessage(''); // Remove a mensagem após 3 segundos
    }, 3000);

    // Adiciona um pequeno intervalo de 1 segundo antes do redirecionamento
    setTimeout(() => {
      router.push('/'); // Isso redireciona para a página index ("/")
    }, 500); // 1 segundo de intervalo
    
    setError(''); // Limpa qualquer erro
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-semibold text-center mb-4">Login</h2>
        
        {/* Mensagem de sucesso */}
        {successMessage && (
          <div className="bg-green-500 text-white p-2 rounded mb-4 text-center">
            {successMessage}
          </div>
        )}
        
        {/* Mensagem de erro */}
        {error && <div className="bg-red-500 text-white p-2 rounded mb-4 text-center">{error}</div>}
        
        <div className="mb-4">
          <label htmlFor="cpf" className="block text-sm font-semibold mb-2">CPF</label>
          <input
            type="text"
            id="cpf"
            name="cpf"
            value={cpf}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="000.000.000-00"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Entrar
        </button>
        
        <div className="flex justify-center mt-4">
          <button 
            onClick={() => window.history.back()} 
            className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
