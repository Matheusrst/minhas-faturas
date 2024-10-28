<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class RedePaymentService
{
    private $pv;
    private $token;
    private $baseUrl;

    public function __construct()
    {
        $this->pv = config('services.rede.pv');
        $this->token = config('services.rede.token');
        $this->baseUrl = 'https://sandbox-erede.useredecloud.com.br/v1/transactions';
    }

    /**
     * Autenticação e headers básicos
     */
    private function getHeaders()
    {
        return [
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $this->token,
            'PV' => $this->pv,
        ];
    }

    /**
     * Autoriza uma transação
     */
    public function authorizeTransaction($data)
    {
        $url = $this->baseUrl;

        $response = Http::withHeaders($this->getHeaders())
            ->post($url, $data);

        if ($response->successful()) {
            return [
                'error' => false,
                'message' => 'Transação autorizada com sucesso.',
                'details' => $response->json(),
                'status_code' => $response->status()
            ];
        }

        return [
            'error' => true,
            'message' => $response->json()['returnMessage'] ?? 'Erro ao autorizar a transação.',
            'details' => $response->json(),
            'status_code' => $response->status()
        ];
    }

    /**
     * Cria um pagamento PIX na API e.Rede
     */
    public function createPixPayment($amount, $reference)
    {
        $url = "{$this->baseUrl}/payments/pix"; // URL corrigida

        $data = [
            'amount' => (int) $amount,
            'currency' => 'BRL',
            'reference' => $reference,
            'kind' => 'pix',
            'capture' => true,
        ];

        $response = Http::withHeaders($this->getHeaders())
            ->post($url, $data);

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
     */
    public function createCreditCardPayment($amount, $reference, $cardNumber, $cardHolderName, $expirationMonth, $expirationYear, $securityCode)
    {
        $url = "{$this->baseUrl}/payments/credit"; // URL corrigida

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
     */
    public function createDebitCardPayment($amount, $reference, $cardNumber, $cardHolderName, $expirationMonth, $expirationYear, $securityCode, $returnUrl)
    {
        $url = "{$this->baseUrl}/payments/debit"; // URL corrigida

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
     */
    public function checkPaymentStatus($tid)
    {
        $url = "{$this->baseUrl}/payments/{$tid}"; // URL corrigida

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
     */
    public function cancelPayment($tid)
    {
        $url = "{$this->baseUrl}/payments/{$tid}/refund"; // URL corrigida

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
