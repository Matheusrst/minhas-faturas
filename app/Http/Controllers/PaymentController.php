<?php 

namespace App\Http\Controllers;

use App\Services\RedePaymentService;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    protected $redePaymentService;

    public function __construct(RedePaymentService $redePaymentService)
    {
        $this->redePaymentService = $redePaymentService;
    }

    public function authorizePayment(Request $request)
{
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
        'origin' => 'nullable|numeric',  // Certifique-se de que esse valor é válido
        'distributorAffiliation' => 'nullable|numeric',  // Certifique-se de que esse valor é válido ou omita se não necessário
        'brandTid' => 'nullable|string',
        'storageCard' => 'nullable|string',
        'transactionCredentials' => 'required|array',
        'transactionCredentials.credentialId' => 'required|string',
    ]);

    // Obter todos os dados da requisição
    $data = $request->only([
        'capture', 'kind', 'reference', 'amount', 'installments', 
        'cardholderName', 'cardNumber', 'expirationMonth', 
        'expirationYear', 'securityCode', 'softDescriptor', 
        'subscription', 'origin', 'distributorAffiliation', 
        'brandTid', 'storageCard', 'transactionCredentials'
    ]);

    // Verifique se os campos de afiliação estão presentes e são válidos
    if (!isset($data['distributorAffiliation']) || empty($data['distributorAffiliation'])) {
        unset($data['distributorAffiliation']); // Remova se não for necessário
    }

    // Chamada ao serviço para autorizar a transação
    $response = $this->redePaymentService->authorizeTransaction($data);

    return response()->json($response);
}

    /**
     * Cria um pagamento PIX
     */
    public function createPixPayment(Request $request)
    {
        // Validação da requisição
        $request->validate([
            'amount' => 'required|numeric',
            'reference' => 'required|string',
        ]);

        // Obtenção dos dados da requisição
        $amount = $request->input('amount');
        $reference = $request->input('reference');

        // Chamada ao serviço para criar o pagamento PIX
        $response = $this->redePaymentService->createPixPayment($amount, $reference);

        // Verificação de sucesso e tratamento de erros na resposta
        if (isset($response['error']) && $response['error']) {
            return response()->json([
                'status' => 'error',
                'message' => $response['message'] ?? 'Erro ao processar pagamento PIX.',
                'details' => $response
            ], 500);
        }

        // Resposta em caso de sucesso
        return response()->json([
            'status' => 'success',
            'data' => $response
        ], 200);
    }

    /**
     * Cria um pagamento com cartão de crédito
     */
    public function createCreditCardPayment(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric',
            'reference' => 'required|string',
            'cardNumber' => 'required|string',
            'cardHolderName' => 'required|string',
            'expirationMonth' => 'required|numeric',
            'expirationYear' => 'required|numeric',
            'securityCode' => 'required|string',
        ]);

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
     * Cria um pagamento com cartão de Débito
     */
    public function createDebitCardPayment(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric',
            'reference' => 'required|string',
            'cardNumber' => 'required|string',
            'cardHolderName' => 'required|string',
            'expirationMonth' => 'required|numeric',
            'expirationYear' => 'required|numeric',
            'securityCode' => 'required|string',
            'returnUrl' => 'required|url', // A linha estava comentada, agora é obrigatória.
        ]);

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
     */
    public function checkPaymentStatus($tid)
    {
        $response = $this->redePaymentService->checkPaymentStatus($tid);

        return response()->json($response);
    }

    /**
     * Cancela um pagamento
     */
    public function cancelPayment($tid)
    {
        $response = $this->redePaymentService->cancelPayment($tid);

        return response()->json($response);
    }
}
