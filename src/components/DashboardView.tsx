import React, { useState } from 'react';
import {
  TrendingUp,
  Hourglass,
  AlertTriangle,
  Calendar,
  Download,
  ArrowRight,
  MoreHorizontal,
  Eye,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { Invoice } from '../types';

interface DashboardViewProps {
  invoices: Invoice[];
  onViewAllInvoices: () => void;
  onSelectInvoice: (invoice: Invoice) => void;
  onMarkAsPaid: (invoiceId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  invoices,
  onViewAllInvoices,
  onSelectInvoice,
  onMarkAsPaid,
}) => {
  const [timeRange, setTimeRange] = useState('This Quarter');
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Recent invoices specifically matching the dashboard mockup Image 3.png
  const recentInvoices = invoices.slice(0, 6);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/60">
            PAID
          </span>
        );
      case 'PENDING':
      case 'SENT':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200/60">
            PENDING
          </span>
        );
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200/60">
            OVERDUE
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

  const getAvatarCircle = (name: string) => {
    const initial = name.charAt(0).toUpperCase();
    let bgClass = 'bg-blue-100 text-blue-700';
    if (name.includes('Globex')) bgClass = 'bg-sky-100 text-sky-700';
    if (name.includes('Stark')) bgClass = 'bg-slate-200 text-slate-700';
    if (name.includes('Initech')) bgClass = 'bg-purple-100 text-purple-700';

    return (
      <div className={`w-6 h-6 rounded-full ${bgClass} flex items-center justify-center text-xs font-semibold flex-shrink-0`}>
        {initial}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Financial Overview
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Real-time insights for current fiscal quarter.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Time Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowTimeDropdown(!showTimeDropdown)}
              className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-700 shadow-xs cursor-pointer transition-colors"
            >
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>{timeRange}</span>
              <span className="text-slate-400 text-xs">▼</span>
            </button>

            {showTimeDropdown && (
              <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30 animate-in fade-in duration-150">
                {['This Quarter', 'Last Quarter', 'This Fiscal Year', 'Last 30 Days'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setTimeRange(opt);
                      setShowTimeDropdown(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm hover:bg-slate-50 cursor-pointer ${
                      timeRange === opt ? 'font-semibold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export Button */}
          <button
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(invoices, null, 2));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute("href", dataStr);
              downloadAnchor.setAttribute("download", "fintrack_financial_overview.json");
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="flex items-center gap-2 bg-slate-950 hover:bg-slate-800 text-white px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Cards Grid - Matching Image 3.png */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: Total Revenue */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                TOTAL REVENUE
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60">
                <TrendingUp className="w-3 h-3" />
                +14.5%
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                $1,245,890.00
              </span>
            </div>
          </div>

          {/* Smooth Revenue Wave / Area Graphic exactly matching mockup */}
          <div className="mt-4 pt-2">
            <svg
              className="w-full h-14 sm:h-16 text-slate-300"
              viewBox="0 0 300 80"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <path
                d="M0 65 Q 40 68, 80 60 T 160 45 T 240 25 T 300 15 L 300 80 L 0 80 Z"
                fill="url(#revenueGrad)"
              />
              <path
                d="M0 65 Q 40 68, 80 60 T 160 45 T 240 25 T 300 15"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Pending Invoices */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-blue-50/80 border border-blue-100 flex items-center justify-center text-blue-600">
                <Hourglass className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase block">
                PENDING INVOICES
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight block mt-1">
                $342,100.00
              </span>
            </div>
          </div>
          <div className="mt-6 text-xs text-slate-500 font-medium">
            42 active invoices
          </div>
        </div>

        {/* Card 3: Overdue */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-rose-50/80 border border-rose-100 flex items-center justify-center text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase block">
                OVERDUE
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight block mt-1">
                $85,450.00
              </span>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-rose-600">
            <span>↑ 12 invoices overdue</span>
          </div>
        </div>
      </div>

      {/* Recent Invoices Card & Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base sm:text-lg">Recent Invoices</h3>
          <button
            onClick={onViewAllInvoices}
            className="text-xs sm:text-sm font-semibold text-slate-800 hover:text-blue-600 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-500 tracking-wider uppercase">
                <th className="py-3.5 px-4 sm:px-6">INVOICE ID</th>
                <th className="py-3.5 px-4 sm:px-6">CLIENT</th>
                <th className="py-3.5 px-4 sm:px-6">DATE ISSUED</th>
                <th className="py-3.5 px-4 sm:px-6">DUE DATE</th>
                <th className="py-3.5 px-4 sm:px-6">AMOUNT</th>
                <th className="py-3.5 px-4 sm:px-6">STATUS</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {recentInvoices.map((inv) => {
                const isOverdue = inv.status === 'OVERDUE';
                return (
                  <tr
                    key={inv.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => onSelectInvoice(inv)}
                  >
                    <td className="py-4 px-4 sm:px-6 font-semibold text-slate-900 whitespace-nowrap">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        {getAvatarCircle(inv.clientName)}
                        <span className="font-medium text-slate-800">{inv.clientName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-slate-600 whitespace-nowrap">
                      {inv.dateIssued}
                    </td>
                    <td
                      className={`py-4 px-4 sm:px-6 font-medium whitespace-nowrap ${
                        isOverdue ? 'text-rose-600 font-semibold' : 'text-slate-600'
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
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {activeMenuId === inv.id && (
                          <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-20 text-xs text-left">
                            <button
                              onClick={() => {
                                onSelectInvoice(inv);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-400" />
                              View Detail
                            </button>
                            {inv.status !== 'PAID' && (
                              <button
                                onClick={() => {
                                  onMarkAsPaid(inv.id);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-emerald-600"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Mark as Paid
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
