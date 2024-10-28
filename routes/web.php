<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::post('/authorize-payment', [PaymentController::class, 'authorizePayment']);
Route::post('/pix-payment', [PaymentController::class, 'createPixPayment']);
Route::post('/credit-payment', [PaymentController::class, 'createCreditCardPayment']);
Route::post('/debit-payment', [PaymentController::class, 'createDebitCardPayment']);
Route::get('/payment-status/{tid}', [PaymentController::class, 'checkPaymentStatus']);
Route::post('/cancel-payment/{tid}', [PaymentController::class, 'cancelPayment']);