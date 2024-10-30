<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * essas URIs estão excluidas para fora do CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        'api/payments/authorize',
        '/authorize-payment',
        '/pix-payment',
        '/credit-payment',
        '/debit-payment',
    ];
}
