<?php

use App\Http\Controllers\InvoicesController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

//rotas do calculo das faturas
Route::post('invoices-calculadas', [InvoicesController::class, 'index']);
Route::post('/invoices/calculate', [InvoicesController::class, 'calculate']);

/**
 * rotas de pagamento com a api e.REDE
 */
//rota para autorizar pagamento
Route::post('/payments/authorize', [PaymentController::class, 'authorizePayment']);

//rota para criar pagamento com o pix
Route::post('/payments/pix', [PaymentController::class, 'createPixPayment']);

//rota para criar pagamento via credito
Route::post('/payments/credit', [PaymentController::class, 'createCreditCardPayment']);

//rota para criar pagamneto via debito
Route::post('/payments/debit', [PaymentController::class, 'createDebitCardPayment']);

//rota para consultar o status de ums compra
Route::get('/payments/status/{tid}', [PaymentController::class, 'checkPaymentStatus']);

//rota para cancelar uma compra
Route::delete('/payments/cancel/{tid}', [PaymentController::class, 'cancelPayment']);
