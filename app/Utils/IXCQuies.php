<?php
namespace App\Utils;

use \Illuminate\Support\Facades\DB;

trait IXCQuies {
    public $conn = 'ixc';
    
    public function getInvoicesPerId(array $ids) {
       $invoices = DB::connection($this->conn)->table('fn_areceber')->select(['*'])
        ->whereIn('id', $ids)
        ->get();

        return $invoices;
    }
}