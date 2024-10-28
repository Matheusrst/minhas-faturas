<?php 

namespace App\Http\Controllers;

use App\Services\RedePaymentService;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    protected $redePaymentService;

    // Injeta o serviço de pagamento da e.Rede
    public function __construct(RedePaymentService $redePaymentService)
    {
        $this->redePaymentService = $redePaymentService;
    }

    /**
     * Autoriza um pagamento via cartão
     * @param Request $request - Requisição contendo os dados do pagamento
     * @return \Illuminate\Http\JsonResponse - Resposta JSON com o status da autorização
     */
    public function authorizePayment(Request $request)
    {
        // Valida os campos necessários para a autorização do pagamento
        $request->validate([
            'amount' => 'required|int',
            'reference' => 'required|string',
            'installments' => 'required|numeric',
            'cardholderName' => 'required|string',
            'cardNumber' => 'required|string',
            'expirationMonth' => 'required|numeric',
            'expirationYear' => 'required|numeric',
            'securityCode' => 'required|string',
            'softDescriptor' => 'nullable|string',
            'subscription' => 'nullable|boolean',
            'origin' => 'nullable|numeric', 
            'distributorAffiliation' => 'nullable|numeric', 
            'brandTid' => 'nullable|string',
            'storageCard' => 'nullable|string',
            'transactionCredentials' => 'required|array',
            'transactionCredentials.credentialId' => 'required|string',
        ]);

        // Obtem os dados da requisição necessários para a autorização
        $data = $request->only([
            'capture', 'kind', 'reference', 'amount', 'installments', 
            'cardholderName', 'cardNumber', 'expirationMonth', 
            'expirationYear', 'securityCode', 'softDescriptor', 
            'subscription', 'origin', 'distributorAffiliation', 
            'brandTid', 'storageCard', 'transactionCredentials'
        ]);

        // Verifica se os dados de afiliação são válidos
        if (!isset($data['distributorAffiliation']) || empty($data['distributorAffiliation'])) {
            unset($data['distributorAffiliation']);
        }

        // Chama o serviço de pagamento para autorizar a transação
        $response = $this->redePaymentService->authorizeTransaction($data);

        // Retorna a resposta da autorização como JSON
        return response()->json($response);
    }

    /**
     * Cria um pagamento PIX
     * @param Request $request - Requisição contendo valor e referência do pagamento PIX
     * @return \Illuminate\Http\JsonResponse - Resposta JSON com o status da criação do pagamento PIX
     */
    public function createPixPayment(Request $request)
    {
        // Validação dos dados de pagamento PIX
        $request->validate([
            'amount' => 'required|numeric',
            'reference' => 'required|string',
        ]);

        // Extrai os dados de valor e referência da requisição
        $amount = $request->input('amount');
        $reference = $request->input('reference');

        // Chama o serviço para criar o pagamento PIX
        $response = $this->redePaymentService->createPixPayment($amount, $reference);

        // Retorna resposta em caso de erro ou sucesso
        if (isset($response['error']) && $response['error']) {
            return response()->json([
                'status' => 'error',
                'message' => $response['message'] ?? 'Erro ao processar pagamento PIX.',
                'details' => $response
            ], 500);
        }

        return response()->json([
            'status' => 'success',
            'data' => $response
        ], 200);
    }

    /**
     * Cria um pagamento com cartão de crédito
     * @param Request $request - Requisição contendo os dados do cartão e do pagamento
     * @return \Illuminate\Http\JsonResponse - Resposta JSON com o status da criação do pagamento
     */
    public function createCreditCardPayment(Request $request)
    {
        // Validação dos dados de pagamento com cartão de crédito
        $request->validate([
            'amount' => 'required|numeric',
            'reference' => 'required|string',
            'cardNumber' => 'required|string',
            'cardHolderName' => 'required|string',
            'expirationMonth' => 'required|numeric',
            'expirationYear' => 'required|numeric',
            'securityCode' => 'required|string',
        ]);

        // Chama o serviço para criar o pagamento com cartão de crédito
        $response = $this->redePaymentService->createCreditCardPayment(
            $request->input('amount'),
            $request->input('reference'),
            $request->input('cardNumber'),
            $request->input('cardHolderName'),
            $request->input('expirationMonth'),
            $request->input('expirationYear'),
            $request->input('securityCode')
        );

        return response()->json($response);
    }

    /**
     * Cria um pagamento com cartão de débito
     * @param Request $request - Requisição contendo os dados do cartão e do pagamento
     * @return \Illuminate\Http\JsonResponse - Resposta JSON com o status da criação do pagamento
     */
    public function createDebitCardPayment(Request $request)
    {
        // Validação dos dados de pagamento com cartão de débito
        $request->validate([
            'amount' => 'required|numeric',
            'reference' => 'required|string',
            'cardNumber' => 'required|string',
            'cardHolderName' => 'required|string',
            'expirationMonth' => 'required|numeric',
            'expirationYear' => 'required|numeric',
            'securityCode' => 'required|string',
            'returnUrl' => 'required|url', // URL de retorno obrigatória após a autenticação
        ]);

        // Chama o serviço para criar o pagamento com cartão de débito
        $response = $this->redePaymentService->createDebitCardPayment(
            $request->input('amount'),
            $request->input('reference'),
            $request->input('cardNumber'),
            $request->input('cardHolderName'),
            $request->input('expirationMonth'),
            $request->input('expirationYear'),
            $request->input('securityCode'),
            $request->input('returnUrl')
        );

        return response()->json($response);
    }

    /**
     * Verifica o status de um pagamento
     * @param string $tid - ID da transação
     * @return \Illuminate\Http\JsonResponse - Resposta JSON com o status do pagamento
     */
    public function checkPaymentStatus($tid)
    {
        // Chama o serviço para verificar o status da transação
        $response = $this->redePaymentService->checkPaymentStatus($tid);

        return response()->json($response);
    }

    /**
     * Cancela um pagamento
     * @param string $tid - ID da transação a ser cancelada
     * @return \Illuminate\Http\JsonResponse - Resposta JSON com o status do cancelamento
     */
    public function cancelPayment($tid)
    {
        // Chama o serviço para cancelar a transação
        $response = $this->redePaymentService->cancelPayment($tid);

        return response()->json($response);
    }
}
