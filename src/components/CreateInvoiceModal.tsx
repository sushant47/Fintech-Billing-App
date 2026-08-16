import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Calendar,
  Building2,
  DollarSign,
  FileCheck,
  Package,
} from 'lucide-react';
import { Client, Invoice, InvoiceItem, InventoryItem, TemplateSettings } from '../types';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  inventory: InventoryItem[];
  templateSettings: TemplateSettings;
  onSaveInvoice: (invoice: Invoice) => void;
  preselectedClient?: Client | null;
}

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  isOpen,
  onClose,
  clients,
  inventory,
  templateSettings,
  onSaveInvoice,
  preselectedClient,
}) => {
  if (!isOpen) return null;

  const [invoiceNumber, setInvoiceNumber] = useState(
    `INV-2024-${Math.floor(100 + Math.random() * 900)}`
  );
  const [selectedClientId, setSelectedClientId] = useState(
    preselectedClient ? preselectedClient.id : clients[0]?.id || ''
  );
  const [dateIssued, setDateIssued] = useState('Oct 24, 2024');
  const [dueDate, setDueDate] = useState('Nov 23, 2024');
  const [status, setStatus] = useState<'DRAFT' | 'SENT' | 'PAID'>('SENT');
  const [taxRate, setTaxRate] = useState<number>(templateSettings.defaultTaxRate);
  const [notes, setNotes] = useState('Thank you for your partnership.');
  const [terms, setTerms] = useState(templateSettings.termsAndConditions);

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: 'it-1',
      description: 'Enterprise Software License (Annual)',
      quantity: 1,
      rate: 12000.0,
      amount: 12000.0,
    },
    {
      id: 'it-2',
      description: 'Implementation Consulting (Hours)',
      quantity: 40,
      rate: 150.0,
      amount: 6000.0,
    },
  ]);

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'rate') {
      const q = field === 'quantity' ? parseFloat(value) || 0 : item.quantity;
      const r = field === 'rate' ? parseFloat(value) || 0 : item.rate;
      item.amount = q * r;
    }
    updated[index] = item;
    setItems(updated);
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `it-${Date.now()}`,
        description: '',
        quantity: 1,
        rate: 0,
        amount: 0,
      },
    ]);
  };

  const addFromInventory = (invItem: InventoryItem) => {
    setItems((prev) => [
      ...prev,
      {
        id: `it-${Date.now()}`,
        description: invItem.name,
        quantity: 1,
        rate: invItem.rate,
        amount: invItem.rate,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const subtotal = items.reduce((sum, it) => sum + (it.amount || 0), 0);
  const taxAmount = subtotal * (taxRate / 100);
  const totalAmount = subtotal + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber,
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      clientEmail: selectedClient.email,
      clientAddress: selectedClient.address,
      clientAttention: selectedClient.primaryContact,
      dateIssued,
      dueDate,
      items,
      subtotal,
      taxRate: taxRate / 100,
      taxAmount,
      totalAmount,
      status,
      notes,
      terms,
      createdAt: new Date().toISOString(),
    };

    onSaveInvoice(newInvoice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Create New Invoice</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Draft and issue enterprise billing with custom line items.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Metadata Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Invoice Number
              </label>
              <input
                type="text"
                required
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Client / Company
              </label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.clientCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900"
              >
                <option value="SENT">Issued / Sent</option>
                <option value="DRAFT">Draft</option>
                <option value="PAID">Paid</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date Issued</label>
              <input
                type="text"
                value={dateIssued}
                onChange={(e) => setDateIssued(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900"
              />
            </div>
          </div>

          {/* Quick Insert from Catalog */}
          <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/60">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Quick Add From Catalog
            </span>
            <div className="flex flex-wrap gap-2">
              {inventory.slice(0, 4).map((inv) => (
                <button
                  key={inv.id}
                  type="button"
                  onClick={() => addFromInventory(inv)}
                  className="text-xs px-2.5 py-1 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <Plus className="w-3 h-3 text-blue-600" />
                  <span>{inv.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Line Items
              </label>
              <button
                type="button"
                onClick={addItem}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Custom Line</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Description</th>
                    <th className="p-3 w-20 text-center">Qty</th>
                    <th className="p-3 w-28 text-right">Rate ($)</th>
                    <th className="p-3 w-28 text-right">Amount ($)</th>
                    <th className="p-3 w-10 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="p-2.5">
                        <input
                          type="text"
                          required
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          placeholder="Item or service description"
                          className="w-full bg-transparent border-0 focus:ring-1 focus:ring-slate-900 rounded p-1 text-slate-900"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          className="w-full bg-transparent border-0 focus:ring-1 focus:ring-slate-900 rounded p-1 text-center text-slate-900"
                        />
                      </td>
                      <td className="p-2.5 text-right">
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={item.rate}
                          onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                          className="w-full bg-transparent border-0 focus:ring-1 focus:ring-slate-900 rounded p-1 text-right text-slate-900"
                        />
                      </td>
                      <td className="p-2.5 text-right font-semibold text-slate-900">
                        ${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-2.5 text-center">
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Calculation Summary */}
          <div className="flex flex-col sm:flex-row justify-end pt-2">
            <div className="w-full sm:w-72 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">
                  ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  Tax Rate (%)
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-12 text-center bg-white border border-slate-200 rounded px-1 py-0.5 text-xs text-slate-900"
                  />
                </span>
                <span className="font-semibold text-slate-900">
                  ${taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-sm text-slate-900">
                <span>Total Due</span>
                <span>
                  ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs sm:text-sm font-medium bg-slate-900 hover:bg-slate-800 active:scale-95 text-white rounded-lg shadow-sm cursor-pointer transition-all flex items-center gap-2"
            >
              <FileCheck className="w-4 h-4" />
              <span>Issue Invoice</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
