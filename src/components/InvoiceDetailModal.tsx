import React, { useState } from 'react';
import {
  X,
  Printer,
  CheckCircle2,
  Send,
  Download,
  Trash2,
  Clock,
  Check,
} from 'lucide-react';
import { Invoice, TemplateSettings } from '../types';

interface InvoiceDetailModalProps {
  invoice: Invoice | null;
  onClose: () => void;
  onMarkAsPaid: (id: string) => void;
  onDeleteInvoice: (id: string) => void;
  templateSettings: TemplateSettings;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  invoice,
  onClose,
  onMarkAsPaid,
  onDeleteInvoice,
  templateSettings,
}) => {
  if (!invoice) return null;

  const [sentToast, setSentToast] = useState(false);

  const handleSendEmail = () => {
    setSentToast(true);
    setTimeout(() => setSentToast(false), 3000);
  };

  const getStatusPill = () => {
    switch (invoice.status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200">
            <Check className="w-3.5 h-3.5" />
            PAID
          </span>
        );
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200">
            <Clock className="w-3.5 h-3.5" />
            OVERDUE
          </span>
        );
      case 'SENT':
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200">
            <Send className="w-3.5 h-3.5" />
            SENT / PENDING
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 border border-slate-200">
            {invoice.status}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 animate-in fade-in zoom-in-95 duration-150">
        {sentToast && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2.5 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Invoice successfully emailed to {invoice.clientEmail || invoice.clientName}!</span>
          </div>
        )}

        {/* Modal Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-slate-900 font-mono">
              {invoice.invoiceNumber}
            </span>
            {getStatusPill()}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Paper Document Render */}
        <div className="my-6 p-6 sm:p-8 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-6 text-xs text-slate-800">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <p className="font-extrabold text-slate-900 text-base">{templateSettings.companyName}</p>
              <p className="whitespace-pre-line text-slate-500 mt-1">{templateSettings.companyAddress}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-900 text-sm">INVOICE</p>
              <p className="text-slate-500 mt-1">Issued: {invoice.dateIssued}</p>
              <p className="text-slate-500">Due: {invoice.dueDate}</p>
            </div>
          </div>

          {/* Bill To */}
          <div className="pt-2 border-t border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              BILL TO
            </span>
            <p className="font-bold text-slate-900 text-sm">{invoice.clientName}</p>
            {invoice.clientAttention && (
              <p className="text-slate-600">Attn: {invoice.clientAttention}</p>
            )}
            {invoice.clientAddress && (
              <p className="text-slate-500 whitespace-pre-line">{invoice.clientAddress}</p>
            )}
            {invoice.clientEmail && (
              <p className="text-slate-500">{invoice.clientEmail}</p>
            )}
          </div>

          {/* Line items */}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase">
                <th className="py-2">Description</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Rate</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60">
              {invoice.items.map((it, i) => (
                <tr key={it.id || i}>
                  <td className="py-2.5 font-medium text-slate-900">{it.description}</td>
                  <td className="py-2.5 text-center text-slate-600">{it.quantity}</td>
                  <td className="py-2.5 text-right text-slate-600">
                    ${it.rate.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-2.5 text-right font-semibold text-slate-900">
                    ${it.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total Box */}
          <div className="flex justify-end pt-2">
            <div className="w-64 space-y-1.5 text-right">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-medium text-slate-900">
                  ${invoice.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              {invoice.taxAmount > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Tax:</span>
                  <span className="font-medium text-slate-900">
                    ${invoice.taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-slate-300 font-extrabold text-slate-900 text-sm">
                <span>Total Due:</span>
                <span>
                  ${invoice.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Terms */}
          {invoice.terms && (
            <div className="pt-3 border-t border-slate-200/60 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700 block">Terms & Conditions</span>
              <p className="mt-0.5">{invoice.terms}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this invoice?')) {
                onDeleteInvoice(invoice.id);
                onClose();
              }
            }}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 p-2 rounded hover:bg-rose-50 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Invoice</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={handleSendEmail}
              className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-blue-600" />
              <span>Email Client</span>
            </button>

            {invoice.status !== 'PAID' && (
              <button
                onClick={() => {
                  onMarkAsPaid(invoice.id);
                  onClose();
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Paid</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
