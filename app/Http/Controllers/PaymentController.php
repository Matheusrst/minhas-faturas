<?php

namespace App\Http\Controllers;

use App\Services\RedePaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Exception;

class PaymentController extends Controller
{
    private $paymentService;

    public function __construct(RedePaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    /**
     * Autoriza o pagamento
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function authorizePayment(Request $request)
    {
        try {
            // Validação dos dados de entrada
            $this->validatePaymentRequest($request);

            // Monta os dados na ordem correta
            $data = $this->buildPaymentData($request);

            // Chama o serviço de pagamento para autorizar a transação
            $response = $this->paymentService->authorizeTransaction($data);

            // Verifica se houve erro na resposta
            return $this->handleAuthorizationResponse($response, $data);

        } catch (Exception $e) {
            Log::error('Erro ao autorizar o pagamento:', [
                'message' => $e->getMessage(),
                'data' => $request->all(),
            ]);

            return response()->json([
                'error' => true,
                'message' => 'Erro ao autorizar o pagamento.',
                'details' => $e->getMessage(),
                'status_code' => 400,
            ], 400);
        }
    }

    /**
     * Captura o pagamento
     *
     * @param Request $request
     * @param string $tid
     * @return \Illuminate\Http\JsonResponse
     */
    public function capturePayment(Request $request, $tid)
    {
        try {
            // Verifica se o TID foi passado
            if (empty($tid)) {
                throw new Exception('Transaction ID (TID) é necessário.');
            }

            // Validação dos dados de entrada
            $this->validateCaptureRequest($request);

            $amount = $request->input('amount');

            // Chama o serviço para capturar a transação
            $response = $this->paymentService->captureTransaction($tid, $amount);

            // Verifica se houve erro na resposta
            return $this->handleCaptureResponse($response, $tid, $amount);

        } catch (Exception $e) {
            Log::error('Erro ao capturar o pagamento:', [
                'message' => $e->getMessage(),
                'tid' => $tid,
                'amount' => $request->input('amount'),
            ]);

            return response()->json([
                'error' => true,
                'message' => 'Erro ao capturar o pagamento.',
                'details' => $e->getMessage(),
                'status_code' => 400,
            ], 400);
        }
    }

    /**
     * Valida os dados do pagamento
     *
     * @param Request $request
     * @throws \Illuminate\Validation\ValidationException
     */
    private function validatePaymentRequest(Request $request)
    {
        $request->validate([
            'capture' => 'required|boolean',
            'credit' => 'required|string',
            'reference' => 'required|string',
            'amount' => 'required|numeric',
            'installments' => 'required|integer',
            'cardholderName' => 'required|string',
            'cardNumber' => 'required|string',
            'expirationMonth' => 'required|string',
            'expirationYear' => 'required|string',
            'securityCode' => 'required|string',
            'softDescriptor' => 'nullable|string',
            'subscription' => 'nullable|boolean',
            'origin' => 'nullable|integer',
            'distributorAffiliation' => 'nullable|integer',
            'brandTid' => 'nullable|integer',
            'storageCard' => 'nullable|string',
            'transactionCredentials.credentialId' => 'required|string',
        ]);
    }

    /**
     * Monta os dados do pagamento
     *
     * @param Request $request
     * @return array
     */
    private function buildPaymentData(Request $request)
    {
        return [
            'capture' => $request->input('capture', false),
            'kind' => $request->input('credit'),
            'reference' => $request->input('reference'),
            'amount' => $request->input('amount'),
            'installments' => $request->input('installments', 1),
            'cardholderName' => $request->input('cardholderName'),
            'cardNumber' => $request->input('cardNumber'),
            'expirationMonth' => $request->input('expirationMonth'),
            'expirationYear' => $request->input('expirationYear'),
            'securityCode' => $request->input('securityCode'),
            'softDescriptor' => $request->input('softDescriptor', 'My Store'),
            'subscription' => $request->input('subscription'),
            'origin' => $request->input('origin'),
            'distributorAffiliation' => $request->input('distributorAffiliation'),
            'brandTid' => $request->input('brandTid'),
            'storageCard' => $request->input('storageCard'),
            'transactionCredentials' => [
                'credentialId' => $request->input('transactionCredentials.credentialId'),
            ],
        ];
    }

    /**
     * Valida os dados da captura
     *
     * @param Request $request
     * @throws \Illuminate\Validation\ValidationException
     */
    private function validateCaptureRequest(Request $request)
    {
        $request->validate([
            'amount' => 'required|integer|min:1',
        ]);
    }

    /**
     * Lida com a resposta da autorização
     *
     * @param array $response
     * @param array $data
     * @return \Illuminate\Http\JsonResponse
     */
    private function handleAuthorizationResponse(array $response, array $data)
    {
        if (isset($response['error'])) {
            Log::error('Erro ao autorizar a transação:', [
                'message' => $response['message'] ?? 'Erro ao autorizar a transação.',
                'details' => $response,
                'data' => $data,
            ]);

            return response()->json([
                'error' => true,
                'message' => $response['message'] ?? 'Erro ao autorizar a transação.',
                'details' => $response,
                'status_code' => 400,
            ], 400);
        }

        Log::info('Transação autorizada com sucesso:', ['response' => $response]);

        return response()->json([
            'error' => false,
            'message' => 'Transação autorizada com sucesso.',
            'data' => $response,
            'status_code' => 200,
        ]);
    }

    /**
     * Lida com a resposta da captura
     *
     * @param array $response
     * @param string $tid
     * @param float $amount
     * @return \Illuminate\Http\JsonResponse
     */
    private function handleCaptureResponse(array $response, string $tid, float $amount)
    {
        if (isset($response['error'])) {
            Log::error('Erro ao capturar a transação:', [
                'message' => $response['message'] ?? 'Erro ao capturar a transação.',
                'details' => $response,
                'tid' => $tid,
                'amount' => $amount,
            ]);

            return response()->json([
                'error' => true,
                'message' => $response['message'] ?? 'Erro ao capturar a transação.',
                'details' => $response,
                'status_code' => 400,
            ], 400);
        }

        Log::info('Transação capturada com sucesso:', ['response' => $response]);

        return response()->json([
            'error' => false,
            'message' => 'Transação capturada com sucesso.',
            'data' => $response,
            'status_code' => 200,
        ]);
    }
}
