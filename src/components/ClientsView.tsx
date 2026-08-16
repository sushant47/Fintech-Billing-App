import React, { useState, useMemo } from 'react';
import {
  Users,
  FileText,
  Building,
  Plus,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  ArrowUpRight,
  UserPlus,
  Trash2,
  Edit,
  Receipt,
  Search,
} from 'lucide-react';
import { Client } from '../types';

interface ClientsViewProps {
  clients: Client[];
  onOpenAddClient: () => void;
  onSelectClient: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
  onCreateInvoiceForClient: (client: Client) => void;
  searchQuery: string;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  onOpenAddClient,
  onSelectClient,
  onDeleteClient,
  onCreateInvoiceForClient,
  searchQuery,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const filteredClients = useMemo(() => {
    return clients.filter((cli) => {
      const matchesSearch =
        cli.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cli.primaryContact.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cli.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cli.clientCode.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'All' || cli.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [clients, searchQuery, statusFilter]);

  const itemsPerPage = 3;
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Header Row matching Image 7.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Clients
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage your client relationships, billing details, and outstanding invoices.
          </p>
        </div>

        <button
          onClick={onOpenAddClient}
          className="flex items-center gap-2 bg-slate-950 hover:bg-slate-800 active:scale-95 text-white px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* 3 Metric Cards Grid - Matching Image 7.png */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: Total Clients */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                TOTAL CLIENTS
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50/80 border border-blue-100 flex items-center justify-center text-blue-600">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                142
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-600">
            <span>↑ +12% from last month</span>
          </div>
        </div>

        {/* Card 2: Active Invoices */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                ACTIVE INVOICES
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50/80 border border-blue-100 flex items-center justify-center text-blue-600">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                48
              </span>
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-500 font-medium">
            12 overdue
          </div>
        </div>

        {/* Card 3: Total Lifetime Value */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                TOTAL LIFETIME VALUE
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50/80 border border-blue-100 flex items-center justify-center text-blue-600">
                <Building className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                $1.2M
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-600">
            <span>↑ +5% from last quarter</span>
          </div>
        </div>
      </div>

      {/* Client Directory Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Section Header with Filter & Options */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base sm:text-lg">Client Directory</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer"
                aria-label="Filter"
              >
                <Filter className="w-4 h-4" />
              </button>

              {showFilterMenu && (
                <div className="absolute right-0 mt-1.5 w-36 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30 text-xs">
                  {['All', 'Active', 'At Risk'].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setShowFilterMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 ${
                        statusFilter === status ? 'font-bold text-blue-600' : 'text-slate-700'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => onOpenAddClient()}
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer"
              aria-label="More options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Clients Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-500 tracking-wider uppercase">
                <th className="py-3.5 px-4 sm:px-6">CLIENT / COMPANY</th>
                <th className="py-3.5 px-4 sm:px-6">CONTACT DETAILS</th>
                <th className="py-3.5 px-4 sm:px-6">TOTAL BUSINESS</th>
                <th className="py-3.5 px-4 sm:px-6">STATUS</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {paginatedClients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400">
                    No clients found matching your query.
                  </td>
                </tr>
              ) : (
                paginatedClients.map((client) => {
                  const isAtRisk = client.status === 'At Risk';
                  return (
                    <tr
                      key={client.id}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      onClick={() => onSelectClient(client)}
                    >
                      {/* CLIENT / COMPANY */}
                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg ${client.avatarColor || 'bg-slate-100 text-slate-700'} flex items-center justify-center font-bold text-xs flex-shrink-0`}
                          >
                            {client.avatarInitials}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">{client.name}</p>
                            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                              ID: {client.clientCode}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CONTACT DETAILS */}
                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                        <p className="font-medium text-slate-800">{client.primaryContact}</p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{client.email}</span>
                        </p>
                      </td>

                      {/* TOTAL BUSINESS */}
                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                        <p className="font-bold text-slate-900">
                          ${client.totalBusiness.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className={`text-[11px] mt-0.5 font-medium ${isAtRisk ? 'text-rose-600' : 'text-slate-500'}`}>
                          {isAtRisk
                            ? `${client.overdueInvoicesCount} Overdue`
                            : `${client.activeInvoicesCount} Active Invoices`}
                        </p>
                      </td>

                      {/* STATUS */}
                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                        {isAtRisk ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200/60">
                            At Risk
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60">
                            Active
                          </span>
                        )}
                      </td>

                      {/* ACTIONS */}
                      <td
                        className="py-4 px-4 sm:px-6 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() => setActiveMenuId(activeMenuId === client.id ? null : client.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>

                          {activeMenuId === client.id && (
                            <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30 text-xs text-left">
                              <button
                                onClick={() => {
                                  onCreateInvoiceForClient(client);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-800 font-medium"
                              >
                                <Receipt className="w-3.5 h-3.5 text-blue-600" />
                                Create Invoice
                              </button>
                              <button
                                onClick={() => {
                                  onSelectClient(client);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                              >
                                <Edit className="w-3.5 h-3.5 text-slate-400" />
                                Edit Details
                              </button>
                              <button
                                onClick={() => {
                                  onDeleteClient(client.id);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 hover:bg-rose-50 flex items-center gap-2 text-rose-600"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete Client
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

        {/* Pagination Footer */}
        <div className="p-4 sm:px-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-slate-600">
          <div>
            Showing 1 to {paginatedClients.length} of 142 entries
          </div>

          <div className="flex items-center gap-1 self-center sm:self-auto">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs font-medium"
            >
              Prev
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
