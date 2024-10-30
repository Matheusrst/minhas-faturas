<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Rede\eRede;
use Rede\Store;
use Rede\Transaction;
use Rede\Environment;
use Exception;

class RedePaymentService
{
    private $erede;
    protected $store;

    public function __construct()
    {
        $filiation = env('REDE_PV');
        $token = env('REDE_TOKEN');
        $environment = env('REDE_ENVIRONMENT', 'sandbox');

        if (is_null($filiation) || is_null($token)) {
            throw new Exception("Filiation and token must be provided and cannot be null.");
        }

        $env = $environment === 'production' ? Environment::production() : Environment::sandbox();
        $this->store = new Store($filiation, $token, $env);
        $this->erede = new eRede($this->store);
    }

    /**
     * Autoriza uma transação
     *
     * @param array $data Dados da transação
     * @return array Resposta da transação
     */
    public function authorizeTransaction(array $data)
    {
        try {
            $this->validateTransactionData($data);

            $transaction = $this->createTransaction($data);

            // Tenta autorizar a transação
            $response = $this->authorize($transaction, $data);

            // Verifica se a transação foi autorizada com sucesso
            if ($response->getReturnCode() === '00') {
                return $response;
            }

            $this->logError('Erro ao autorizar a transação:', $response, $data);
            throw new Exception($response->getReturnMessage());

        } catch (Exception $e) {
            return $this->handleException($e, $data);
        }
    }

    /**
     * Captura uma transação
     *
     * @param string $tid ID da transação
     * @param float $amount Valor da transação
     * @return array Resposta da captura
     */
    public function captureTransaction($tid, $amount)
    {
        try {
            $transaction = new Transaction($amount);
            $transaction->setTid($tid);

            // Tenta capturar a transação
            $response = $this->erede->capture($transaction);

            if ($response->getReturnCode() === '00') {
                return $response;
            }

            $this->logError('Erro ao capturar a transação:', $response, ['tid' => $tid, 'amount' => $amount]);
            throw new Exception($response->getReturnMessage());

        } catch (Exception $e) {
            return $this->handleException($e, ['tid' => $tid, 'amount' => $amount]);
        }
    }

    /**
     * Valida os dados da transação
     *
     * @param array $data
     * @throws Exception
     */
    private function validateTransactionData(array $data)
    {
        if (empty($data['kind'])) {
            throw new Exception("Required parameter 'kind' is missing.");
        }
    }

    /**
     * Cria uma instância de Transaction com os dados fornecidos
     *
     * @param array $data
     * @return Transaction
     */
    private function createTransaction(array $data)
    {
        return (new Transaction($data['amount']))
            ->setReference($data['reference'])
            ->capture($data['capture'] ?? false)
            ->setInstallments($data['installments'] ?? 1)
            ->creditCard(
                $data['cardNumber'],
                $data['securityCode'],
                $data['expirationMonth'],
                $data['expirationYear'],
                $data['cardholderName']
            )
            ->setSoftDescriptor($data['softDescriptor'] ?? '')
            ->setSubscription($data['subscription'] ?? false)
            ->setKind($data['kind'])
            ->setOrigin($data['origin'] ?? 1)
            ->setDistributorAffiliation($data['distributorAffiliation'] ?? 0)
            ->setBrandTid(isset($data['brandTid']) ? (int)$data['brandTid'] : null)
            ->setStorageCard($data['storageCard'] ?? '0');
    }

    /**
     * Autoriza a transação
     *
     * @param Transaction $transaction
     * @param array $data
     * @return mixed
     */
    private function authorize(Transaction $transaction, array $data)
    {
        return isset($data['transactionCredentials']['credentialId'])
            ? $this->erede->authorize($transaction, $data['transactionCredentials']['credentialId'])
            : $this->erede->authorize($transaction);
    }

    /**
     * Lida com exceções e registra erros
     *
     * @param Exception $e
     * @param array $data
     * @return array
     */
    private function handleException(Exception $e, array $data)
    {
        Log::error('Erro na transação:', [
            'message' => $e->getMessage(),
            'data' => $data,
        ]);
        return [
            'error' => true,
            'message' => $e->getMessage(),
        ];
    }

    /**
     * Registra erros em log
     *
     * @param string $message
     * @param mixed $response
     * @param array $data
     */
    private function logError(string $message, $response, array $data)
    {
        Log::error($message, [
            'return_code' => $response->getReturnCode(),
            'return_message' => $response->getReturnMessage(),
            'data' => $data,
        ]);
    }
}
