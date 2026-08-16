import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { InvoicesView } from './components/InvoicesView';
import { ClientsView } from './components/ClientsView';
import { InventoryView } from './components/InventoryView';
import { TemplateDesignerView } from './components/TemplateDesignerView';
import { SettingsView } from './components/SettingsView';
import { SupportView } from './components/SupportView';
import { CreateInvoiceModal } from './components/CreateInvoiceModal';
import { InvoiceDetailModal } from './components/InvoiceDetailModal';
import { AddClientModal } from './components/AddClientModal';
import {
  INITIAL_CLIENTS,
  INITIAL_INVOICES,
  INITIAL_INVENTORY,
  DEFAULT_TEMPLATE_SETTINGS,
} from './data/mockData';
import { NavItem, Invoice, Client, InventoryItem, TemplateSettings } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<NavItem>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Persistent / dynamic application states
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('fintrack_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('fintrack_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('fintrack_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [templateSettings, setTemplateSettings] = useState<TemplateSettings>(() => {
    const saved = localStorage.getItem('fintrack_template_settings');
    return saved ? JSON.parse(saved) : DEFAULT_TEMPLATE_SETTINGS;
  });

  // Modals state
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [preselectedClientForInvoice, setPreselectedClientForInvoice] = useState<Client | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('fintrack_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('fintrack_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('fintrack_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('fintrack_template_settings', JSON.stringify(templateSettings));
  }, [templateSettings]);

  // Invoice Handlers
  const handleSaveInvoice = (newInvoice: Invoice) => {
    setInvoices((prev) => [newInvoice, ...prev]);
    // Also update client active invoices count & total business
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === newInvoice.clientId) {
          return {
            ...c,
            totalBusiness: c.totalBusiness + newInvoice.totalAmount,
            activeInvoicesCount: c.activeInvoicesCount + 1,
          };
        }
        return c;
      })
    );
  };

  const handleMarkAsPaid = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === invoiceId ? { ...inv, status: 'PAID' } : inv))
    );
    if (selectedInvoice && selectedInvoice.id === invoiceId) {
      setSelectedInvoice((prev) => (prev ? { ...prev, status: 'PAID' } : null));
    }
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== invoiceId));
    if (selectedInvoice && selectedInvoice.id === invoiceId) {
      setSelectedInvoice(null);
    }
  };

  const handleDuplicateInvoice = (invoice: Invoice) => {
    const duplicated: Invoice = {
      ...invoice,
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2024-${Math.floor(100 + Math.random() * 900)}`,
      status: 'DRAFT',
      dateIssued: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setInvoices((prev) => [duplicated, ...prev]);
  };

  // Client Handlers
  const handleSaveClient = (newClient: Client) => {
    setClients((prev) => [newClient, ...prev]);
  };

  const handleDeleteClient = (clientId: string) => {
    setClients((prev) => prev.filter((c) => c.id !== clientId));
  };

  const handleCreateInvoiceForClient = (client: Client) => {
    setPreselectedClientForInvoice(client);
    setIsCreateInvoiceOpen(true);
  };

  // Inventory Handlers
  const handleAddInventory = (item: InventoryItem) => {
    setInventory((prev) => [item, ...prev]);
  };

  const handleUpdateInventory = (item: InventoryItem) => {
    setInventory((prev) => prev.map((i) => (i.id === item.id ? item : i)));
  };

  const handleDeleteInventory = (id: string) => {
    setInventory((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex font-sans text-slate-900">
      {/* Responsive Sidebar */}
      <Sidebar
        currentView={currentView}
        onSelectView={(v) => {
          setCurrentView(v);
          setSearchQuery('');
        }}
        onOpenCreateInvoice={() => {
          setPreselectedClientForInvoice(null);
          setIsCreateInvoiceOpen(true);
        }}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-64">
        {/* Top Header */}
        <Header
          currentView={currentView}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectView={setCurrentView}
        />

        {/* View Router */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentView === 'dashboard' && (
            <DashboardView
              invoices={invoices}
              onViewAllInvoices={() => setCurrentView('invoices')}
              onSelectInvoice={(inv) => setSelectedInvoice(inv)}
              onMarkAsPaid={handleMarkAsPaid}
            />
          )}

          {currentView === 'invoices' && (
            <InvoicesView
              invoices={invoices}
              onOpenCreateInvoice={() => {
                setPreselectedClientForInvoice(null);
                setIsCreateInvoiceOpen(true);
              }}
              onSelectInvoice={(inv) => setSelectedInvoice(inv)}
              onMarkAsPaid={handleMarkAsPaid}
              onDeleteInvoice={handleDeleteInvoice}
              onDuplicateInvoice={handleDuplicateInvoice}
              searchQuery={searchQuery}
            />
          )}

          {currentView === 'clients' && (
            <ClientsView
              clients={clients}
              onOpenAddClient={() => setIsAddClientOpen(true)}
              onSelectClient={(cli) => handleCreateInvoiceForClient(cli)}
              onDeleteClient={handleDeleteClient}
              onCreateInvoiceForClient={handleCreateInvoiceForClient}
              searchQuery={searchQuery}
            />
          )}

          {currentView === 'inventory' && (
            <InventoryView
              inventory={inventory}
              onAddInventoryItem={handleAddInventory}
              onUpdateInventoryItem={handleUpdateInventory}
              onDeleteInventoryItem={handleDeleteInventory}
              searchQuery={searchQuery}
            />
          )}

          {currentView === 'templates' && (
            <TemplateDesignerView
              settings={templateSettings}
              onSaveSettings={(newSettings) => setTemplateSettings(newSettings)}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              templateSettings={templateSettings}
              onUpdateTemplateSettings={setTemplateSettings}
            />
          )}

          {currentView === 'support' && <SupportView />}
        </main>
      </div>

      {/* Modal Dialogs */}
      <CreateInvoiceModal
        isOpen={isCreateInvoiceOpen}
        onClose={() => {
          setIsCreateInvoiceOpen(false);
          setPreselectedClientForInvoice(null);
        }}
        clients={clients}
        inventory={inventory}
        templateSettings={templateSettings}
        onSaveInvoice={handleSaveInvoice}
        preselectedClient={preselectedClientForInvoice}
      />

      <InvoiceDetailModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        onMarkAsPaid={handleMarkAsPaid}
        onDeleteInvoice={handleDeleteInvoice}
        templateSettings={templateSettings}
      />

      <AddClientModal
        isOpen={isAddClientOpen}
        onClose={() => setIsAddClientOpen(false)}
        onSaveClient={handleSaveClient}
        clientCount={clients.length}
      />
    </div>
  );
}
