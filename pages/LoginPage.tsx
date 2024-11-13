import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // Importa o useRouter do Next.js

export default function LoginPage() {
  const [cpf, setCpf] = useState<string>(''); // Aqui você especifica que o estado é do tipo string
  const [error, setError] = useState<string>(''); // Estado para armazenar a mensagem de erro
  const [successMessage, setSuccessMessage] = useState<string>(''); // Estado para a mensagem de sucesso
  const router = useRouter(); // Inicializa o useRouter
  
  // Verifica se o usuário já está autenticado ao carregar a página
  useEffect(() => {
    const userCpf = document.cookie.replace(/(?:(?:^|.*;\s*)userCpf\s*=\s*([^;]*).*$)|^.*$/, "$1");
    const isLogout = sessionStorage.getItem("logout");
    if (userCpf) {
      // Se o CPF estiver no cookie, redireciona para a página principal
      router.push('/');
    }
    if (isLogout) {
      sessionStorage.removeItem("logout");
    }
  }, [router]);

  // Função para lidar com a mudança no campo CPF
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { // Tipando corretamente o parâmetro 'e'
    setCpf(e.target.value);
  };

  // Função para definir o cookie no navegador
  const setCpfCookie = (cpf: string): void => { // Definindo o tipo de retorno da função como void (sem retorno)
    document.cookie = `userCpf=${cpf}; path=/; Secure; SameSite=Strict`;
  };

  // Função para realizar o login
  const handleLogin = (): void => { // Tipo de retorno 'void' pois a função não retorna nada
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

    // Define o cookie com o CPF
    setCpfCookie(cpf);

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
        
        {/*<div className="flex justify-center mt-4">
          <button 
            onClick={() => window.history.back()} 
            className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Cancelar
          </button>
        </div>*/}
      </div>
    </div>
  );
}
