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

Route::post('invoices-calculadas', [InvoicesController::class, 'index']);
Route::post('/invoices/calculate', [InvoicesController::class, 'calculate']);

Route::post('/payments/authorize', [PaymentController::class, 'authorizePayment']);
Route::post('/payments/pix', [PaymentController::class, 'createPixPayment']);
Route::post('/payments/credit', [PaymentController::class, 'createCreditCardPayment']);
Route::post('/payments/debit', [PaymentController::class, 'createDebitCardPayment']);
Route::get('/payments/status/{tid}', [PaymentController::class, 'checkPaymentStatus']);
Route::delete('/payments/cancel/{tid}', [PaymentController::class, 'cancelPayment']);
