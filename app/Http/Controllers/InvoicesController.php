<?php

namespace App\Http\Controllers;

use App\Utils\IXCQuies;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvoicesController extends Controller
{
    use IXCQuies;

    public function index(Request $request) {
        if (!$request->has('invoices')) return json_encode([
            'message' => "Informe o parametro 'invoices'",
        ]);

        $ids = explode(',', $request->get('invoices'));


        return json_encode($this->getInvoicesPerId($ids));
    }

    public function calculate(Request $request)
    {
        if (!$request->has('invoices')) {
            return response()->json([
                'message' => "Informe o parâmetro 'invoices'",
            ], 400);
        }
    
        $ids = explode(',', $request->get('invoices'));
        $invoices = $this->getInvoicesPerId($ids);
    
        $updatedInvoices = $invoices->map(function ($invoice) {
            $dueDate = \Carbon\Carbon::parse($invoice->data_vencimento);
            $today = \Carbon\Carbon::now();
    
            if ($dueDate->lt($today)) {
                $daysLate = $dueDate->diffInDays($today);
                $monthsLate = $dueDate->diffInMonths($today);
    
                $dailyInterestRate = 0.033 / 100;
                $interest = $invoice->valor * ($dailyInterestRate * $daysLate);
    
                $fine = (2.00 / 100) * $invoice->valor;
    
                $newTotal = $invoice->valor + round($interest + $fine, 2);

                $invoice->interestfine = round($interest + $fine, 2);
                $invoice->fine = $fine;
                $invoice->interest = $interest;
    
                $invoice->days_late = $daysLate;
                $invoice->interest = $interest;
                $invoice->fine = $fine;
                $invoice->new_total = $newTotal;
            } else {
                $invoice->days_late = 0;
                $invoice->interest = 0;
                $invoice->fine = 0;
                $invoice->new_total = $invoice->valor;
            }
    
            return $invoice;
        });
    
        return response()->json($updatedInvoices);
    }
}
