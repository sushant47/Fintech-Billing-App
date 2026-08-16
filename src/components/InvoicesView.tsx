import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Filter,
  Plus,
  MoreVertical,
  Eye,
  CheckCircle,
  Copy,
  Trash2,
  Download,
  Send,
  FileCheck,
} from 'lucide-react';
import { Invoice, InvoiceStatus } from '../types';

interface InvoicesViewProps {
  invoices: Invoice[];
  onOpenCreateInvoice: () => void;
  onSelectInvoice: (invoice: Invoice) => void;
  onMarkAsPaid: (invoiceId: string) => void;
  onDeleteInvoice: (invoiceId: string) => void;
  onDuplicateInvoice: (invoice: Invoice) => void;
  searchQuery: string;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({
  invoices,
  onOpenCreateInvoice,
  onSelectInvoice,
  onMarkAsPaid,
  onDeleteInvoice,
  onDuplicateInvoice,
  searchQuery,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All Statuses');
  const [dateFilter, setDateFilter] = useState<string>('Last 30 Days');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter invoices by search and dropdown status
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesSearch =
        inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.clientName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'All Statuses' ||
        inv.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchQuery, statusFilter]);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage) || 1;
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedInvoices.length && paginatedInvoices.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedInvoices.map((i) => i.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/60">
            PAID
          </span>
        );
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200/60">
            OVERDUE
          </span>
        );
      case 'SENT':
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200/60">
            SENT
          </span>
        );
      case 'DRAFT':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider text-slate-600 bg-slate-100 border border-slate-200">
            DRAFT
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider text-slate-600 bg-slate-100 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Row matching Image 5.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            All Invoices
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage and track your client billing
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowDateDropdown(!showDateDropdown);
                setShowStatusDropdown(false);
              }}
              className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-700 shadow-xs cursor-pointer transition-colors"
            >
              <span>{dateFilter}</span>
              <Calendar className="w-4 h-4 text-slate-400" />
            </button>

            {showDateDropdown && (
              <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30 animate-in fade-in duration-150">
                {['Last 30 Days', 'This Month', 'Last Quarter', 'All Time'].map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setDateFilter(d);
                      setShowDateDropdown(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm hover:bg-slate-50 cursor-pointer ${
                      dateFilter === d ? 'font-semibold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowStatusDropdown(!showStatusDropdown);
                setShowDateDropdown(false);
              }}
              className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-700 shadow-xs cursor-pointer transition-colors"
            >
              <span>{statusFilter}</span>
              <Filter className="w-4 h-4 text-slate-400" />
            </button>

            {showStatusDropdown && (
              <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30 animate-in fade-in duration-150">
                {['All Statuses', 'Paid', 'Sent', 'Overdue', 'Draft'].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setStatusFilter(st);
                      setShowStatusDropdown(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm hover:bg-slate-50 cursor-pointer ${
                      statusFilter === st ? 'font-semibold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* New Invoice Button */}
          <button
            onClick={onOpenCreateInvoice}
            className="flex items-center gap-2 bg-slate-950 hover:bg-slate-800 active:scale-95 text-white px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Invoice</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards Row - Matching Image 5.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Outstanding */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase block">
            TOTAL OUTSTANDING
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight block mt-2">
            $124,500
          </span>
        </div>

        {/* Card 2: Overdue */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase block">
            OVERDUE
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-red-600 tracking-tight block mt-2">
            $18,200
          </span>
        </div>

        {/* Card 3: Paid This Month */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase block">
            PAID THIS MONTH
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight block mt-2">
            $45,000
          </span>
        </div>

        {/* Card 4: Drafts */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase block">
            DRAFTS
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              12
            </span>
            <span className="text-xs text-slate-500 font-medium">invoices</span>
          </div>
        </div>
      </div>

      {/* Main Invoices Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {selectedIds.length > 0 && (
          <div className="bg-blue-50/80 px-4 sm:px-6 py-2.5 border-b border-blue-100 flex items-center justify-between text-xs sm:text-sm">
            <span className="font-semibold text-blue-900">
              {selectedIds.length} invoice(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  selectedIds.forEach((id) => onMarkAsPaid(id));
                  setSelectedIds([]);
                }}
                className="px-2.5 py-1 bg-white border border-blue-200 text-blue-800 rounded font-medium hover:bg-blue-50"
              >
                Mark as Paid
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="text-slate-500 hover:text-slate-700 ml-2"
              >
                Deselect
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-500 tracking-wider">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === paginatedInvoices.length &&
                      paginatedInvoices.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-4 w-4 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4 sm:px-6 font-semibold">Invoice #</th>
                <th className="py-3.5 px-4 sm:px-6 font-semibold">Client Name</th>
                <th className="py-3.5 px-4 sm:px-6 font-semibold">Date</th>
                <th className="py-3.5 px-4 sm:px-6 font-semibold">Due Date</th>
                <th className="py-3.5 px-4 sm:px-6 font-semibold">Total Amount</th>
                <th className="py-3.5 px-4 sm:px-6 font-semibold">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {paginatedInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No invoices found matching your filters.
                  </td>
                </tr>
              ) : (
                paginatedInvoices.map((inv) => {
                  const isSelected = selectedIds.includes(inv.id);
                  const isOverdue = inv.status === 'OVERDUE';

                  return (
                    <tr
                      key={inv.id}
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                        isSelected ? 'bg-blue-50/30' : ''
                      }`}
                      onClick={() => onSelectInvoice(inv)}
                    >
                      <td
                        className="py-4 px-4 text-center whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(inv.id)}
                          className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-4 w-4 cursor-pointer"
                        />
                      </td>
                      <td className="py-4 px-4 sm:px-6 font-semibold text-slate-900 whitespace-nowrap">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-4 px-4 sm:px-6 font-medium text-slate-800 whitespace-nowrap">
                        {inv.clientName}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-slate-600 whitespace-nowrap">
                        {inv.dateIssued}
                      </td>
                      <td
                        className={`py-4 px-4 sm:px-6 whitespace-nowrap font-medium ${
                          isOverdue ? 'text-red-600 font-semibold' : 'text-slate-600'
                        }`}
                      >
                        {inv.dueDate}
                      </td>
                      <td className="py-4 px-4 sm:px-6 font-semibold text-slate-900 whitespace-nowrap">
                        ${inv.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                        {getStatusBadge(inv.status)}
                      </td>
                      <td
                        className="py-4 px-4 sm:px-6 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() => setActiveMenuId(activeMenuId === inv.id ? null : inv.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeMenuId === inv.id && (
                            <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30 text-xs text-left">
                              <button
                                onClick={() => {
                                  onSelectInvoice(inv);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                              >
                                <Eye className="w-3.5 h-3.5 text-slate-400" />
                                View Details
                              </button>
                              {inv.status !== 'PAID' && (
                                <button
                                  onClick={() => {
                                    onMarkAsPaid(inv.id);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-emerald-600"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  Mark as Paid
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  onDuplicateInvoice(inv);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                              >
                                <Copy className="w-3.5 h-3.5 text-slate-400" />
                                Duplicate
                              </button>
                              <button
                                onClick={() => {
                                  onDeleteInvoice(inv.id);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 hover:bg-rose-50 flex items-center gap-2 text-rose-600"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer matching mockup Image 5.png */}
        <div className="p-4 sm:px-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-slate-600">
          <div>
            Showing {paginatedInvoices.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} of 48 entries
          </div>

          <div className="flex items-center gap-1 self-center sm:self-auto">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs font-medium"
            >
              Previous
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                  currentPage === page
                    ? 'bg-slate-900 text-white'
                    : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
              disabled={currentPage === 3}
              className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs font-medium"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
