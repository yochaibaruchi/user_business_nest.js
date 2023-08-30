export interface DefaultInvoice {
  invoices_invoiceType: 'INCOME' | 'EXPENSE';
  invoices_sum: string;
  invoices_currency: string;
  invoices_item: string;
  businessId: number;
  invoiceNumber: string;
}

export interface InvoiceList {
  invoices_invoiceType: 'INCOME' | 'EXPENSE';
  invoices_sum: string;
  invoices_currency: string;
  invoices_item: string;
  invoiceNumber: string;
}

export interface InvoiceResult {
  businessId: number;
  invoices: InvoiceList[];
}
