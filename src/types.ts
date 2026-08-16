export type NavItem = 'dashboard' | 'invoices' | 'clients' | 'inventory' | 'templates' | 'settings' | 'support';

export type InvoiceStatus = 'PAID' | 'PENDING' | 'OVERDUE' | 'SENT' | 'DRAFT';

export type ClientStatus = 'Active' | 'At Risk' | 'Inactive';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  clientAddress?: string;
  clientAttention?: string;
  dateIssued: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number; // e.g. 0.20
  taxAmount: number;
  totalAmount: number;
  status: InvoiceStatus;
  notes?: string;
  terms?: string;
  createdAt: string;
}

export interface Client {
  id: string;
  clientCode: string; // e.g. "CLI-001"
  name: string;
  avatarInitials: string;
  avatarColor?: string;
  primaryContact: string;
  email: string;
  phone?: string;
  address?: string;
  totalBusiness: number;
  activeInvoicesCount: number;
  overdueInvoicesCount: number;
  status: ClientStatus;
  joinedDate?: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: 'Software' | 'Consulting' | 'Hardware' | 'Service';
  rate: number;
  unit: string;
  inStock?: number;
}

export interface TemplateSettings {
  companyName: string;
  companyAddress: string;
  companyLogoUrl: string | null;
  accentColor: string; // hex or tailwind identifier
  fontFamily: string; // 'Inter' | 'Plus Jakarta Sans' | 'Roboto' | 'Playfair Display' | 'Fira Code'
  defaultTaxRate: number; // percentage, e.g. 20
  taxRateLabel: string; // e.g. "Standard VAT (20%)"
  paymentTerms: string; // e.g. "Net 30"
  termsAndConditions: string;
}
