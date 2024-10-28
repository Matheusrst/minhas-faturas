<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class RedePaymentService
{
    private $pv; // Código PV (Ponto de Venda) fornecido pela e.Rede.
    private $token; // Token de autenticação fornecido pela e.Rede.
    private $baseUrl; // URL base da API da e.Rede.

    public function __construct()
    {
        // Inicializa as variáveis de configuração, buscando o PV e o Token do arquivo de configuração 'services.php'
        $this->pv = config('services.rede.pv');
        $this->token = config('services.rede.token');
        $this->baseUrl = 'https://sandbox-erede.useredecloud.com.br/v1/transactions';
    }

    /**
     * Autenticação e headers básicos
     * Retorna o array de cabeçalhos necessários para autenticação na API da e.Rede
     */
    private function getHeaders()
    {
        return [
            'Content-Type' => 'application/json', // Define o conteúdo como JSON
            'Authorization' => 'Bearer ' . $this->token, // Cabeçalho de autorização com Bearer Token
            'PV' => $this->pv, // Cabeçalho com o código PV
        ];
    }

    /**
     * Autoriza uma transação
     * @param array $data - Dados da transação que serão enviados para a autorização
     * @return array - Resultado da autorização
     */
    public function authorizeTransaction($data)
    {
        $url = $this->baseUrl;

        // Envia uma requisição POST com os dados da transação para a URL de autorização
        $response = Http::withHeaders($this->getHeaders())
            ->post($url, $data);

        // Verifica se a requisição foi bem-sucedida
        if ($response->successful()) {
            return [
                'error' => false,
                'message' => 'Transação autorizada com sucesso.',
                'details' => $response->json(), // Retorna os detalhes da resposta
                'status_code' => $response->status()
            ];
        }

        // Retorna mensagem de erro e detalhes em caso de falha
        return [
            'error' => true,
            'message' => $response->json()['returnMessage'] ?? 'Erro ao autorizar a transação.',
            'details' => $response->json(),
            'status_code' => $response->status()
        ];
    }

    /**
     * Cria um pagamento PIX na API e.Rede
     * @param int $amount - Valor do pagamento
     * @param string $reference - Referência do pagamento
     * @return array - Resultado da criação do pagamento PIX
     */
    public function createPixPayment($amount, $reference)
    {
        $url = "{$this->baseUrl}/payments/pix"; // URL para pagamentos PIX

        $data = [
            'amount' => (int) $amount,
            'currency' => 'BRL', // Define a moeda como Real Brasileiro
            'reference' => $reference,
            'kind' => 'pix', // Tipo de pagamento
            'capture' => true, // Indica captura automática do pagamento
        ];

        // Envia a requisição POST para criar o pagamento PIX
        $response = Http::withHeaders($this->getHeaders())
            ->post($url, $data);

        // Retorna o resultado em caso de sucesso ou erro
        if ($response->successful()) {
            return $response->json();
        }

        $errorDetails = $response->json();

        return [
            'error' => true,
            'message' => $errorDetails['returnMessage'] ?? 'Erro ao criar pagamentos PIX.',
            'details' => $errorDetails,
            'status_code' => $response->status()
        ];
    }

    /**
     * Cria um pagamento via cartão de crédito
     * @param int $amount - Valor do pagamento
     * @param string $reference - Referência do pagamento
     * @param string $cardNumber - Número do cartão
     * @param string $cardHolderName - Nome do titular do cartão
     * @param int $expirationMonth - Mês de expiração
     * @param int $expirationYear - Ano de expiração
     * @param string $securityCode - Código de segurança (CVV)
     * @return array - Resultado da criação do pagamento com cartão de crédito
     */
    public function createCreditCardPayment($amount, $reference, $cardNumber, $cardHolderName, $expirationMonth, $expirationYear, $securityCode)
    {
        $url = "{$this->baseUrl}/payments/credit"; // URL para pagamento com cartão de crédito

        $data = [
            'amount' => (int) $amount,
            'currency' => 'BRL',
            'reference' => $reference,
            'kind' => 'credit',
            'capture' => true,
            'card' => [
                'number' => $cardNumber,
                'holderName' => $cardHolderName,
                'expirationMonth' => $expirationMonth,
                'expirationYear' => $expirationYear,
                'securityCode' => $securityCode,
            ]
        ];

        // Envia a requisição POST para criar o pagamento com cartão de crédito
        $response = Http::withHeaders($this->getHeaders())
            ->post($url, $data);

        if ($response->successful()) {
            return $response->json();
        }

        return [
            'error' => true,
            'message' => $response->json()['returnMessage'] ?? 'Erro ao criar o pagamento com cartão de crédito.',
            'details' => $response->json(),
            'status_code' => $response->status()
        ];
    }

    /**
     * Cria um pagamento via cartão de débito
     * @param int $amount - Valor do pagamento
     * @param string $reference - Referência do pagamento
     * @param string $cardNumber - Número do cartão
     * @param string $cardHolderName - Nome do titular do cartão
     * @param int $expirationMonth - Mês de expiração
     * @param int $expirationYear - Ano de expiração
     * @param string $securityCode - Código de segurança (CVV)
     * @param string $returnUrl - URL de retorno após a autenticação do pagamento
     * @return array - Resultado da criação do pagamento com cartão de débito
     */
    public function createDebitCardPayment($amount, $reference, $cardNumber, $cardHolderName, $expirationMonth, $expirationYear, $securityCode, $returnUrl)
    {
        $url = "{$this->baseUrl}/payments/debit"; // URL para pagamento com cartão de débito

        $data = [
            'amount' => (int) $amount,
            'currency' => 'BRL',
            'reference' => $reference,
            'kind' => 'debit',
            'capture' => true,
            'card' => [
                'number' => $cardNumber,
                'holderName' => $cardHolderName,
                'expirationMonth' => $expirationMonth,
                'expirationYear' => $expirationYear,
                'securityCode' => $securityCode,
            ],
            'urls' => [
                'returnUrl' => $returnUrl
            ]
        ];

        $response = Http::withHeaders($this->getHeaders())
            ->post($url, $data);

        if ($response->successful()) {
            return $response->json();
        }

        return [
            'error' => true,
            'message' => $response->json()['returnMessage'] ?? 'Erro ao criar o pagamento via cartão de débito.',
            'details' => $response->json(),
            'status_code' => $response->status()
        ];
    }

    /**
     * Verifica o status de uma transação PIX
     * @param string $tid - ID da transação
     * @return array - Status da transação
     */
    public function checkPaymentStatus($tid)
    {
        $url = "{$this->baseUrl}/payments/{$tid}"; // URL para consulta de status da transação

        $response = Http::withHeaders($this->getHeaders())
            ->get($url);

        if ($response->successful()) {
            return $response->json();
        }

        return [
            'error' => true,
            'message' => $response->json()['returnMessage'] ?? 'Erro ao verificar status do pagamento.',
        ];
    }

    /**
     * Cancela uma transação PIX
     * @param string $tid - ID da transação a ser cancelada
     * @return array - Resultado do cancelamento da transação
     */
    public function cancelPayment($tid)
    {
        $url = "{$this->baseUrl}/payments/{$tid}/refund"; // URL para cancelar a transação

        $response = Http::withHeaders($this->getHeaders())
            ->post($url);

        if ($response->successful()) {
            return $response->json();
        }

        return [
            'error' => true,
            'message' => $response->json()['returnMessage'] ?? 'Erro ao cancelar o pagamento.',
        ];
    }
}
