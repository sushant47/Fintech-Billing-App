import React from 'react';
import { HelpCircle, BookOpen, MessageSquare, LifeBuoy, FileText, Phone, ArrowRight } from 'lucide-react';

export const SupportView: React.FC = () => {
  const faqs = [
    {
      q: 'How do I customize the default invoice terms and tax rates?',
      a: 'Navigate to the Templates tab in the sidebar where you can modify font styles, accent colors, VAT/GST defaults, and terms and conditions notes.',
    },
    {
      q: 'What triggers the "Overdue" status indicator?',
      a: 'Any invoice whose due date has passed without being marked as Paid automatically highlights with an Overdue tag and is grouped under the overdue metric card.',
    },
    {
      q: 'Can I export invoice records to financial reporting spreadsheets?',
      a: 'Yes, click the "Export" button located in the top-right header of the Dashboard or All Invoices tab to export formatted JSON and CSV summaries.',
    },
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Help & Documentation
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Guides, best practices, and enterprise support resources.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Billing Guide</h3>
            <p className="text-xs text-slate-500 mt-1">
              Learn how to configure tax tiers, multi-currency invoicing, and client accounts.
            </p>
          </div>
          <span className="mt-4 text-xs font-semibold text-blue-600 flex items-center gap-1 cursor-pointer hover:underline">
            Read Docs <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Concierge Chat</h3>
            <p className="text-xs text-slate-500 mt-1">
              Direct line to dedicated enterprise solution architects and billing advisors.
            </p>
          </div>
          <span className="mt-4 text-xs font-semibold text-purple-600 flex items-center gap-1 cursor-pointer hover:underline">
            Start Live Chat <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">API Reference</h3>
            <p className="text-xs text-slate-500 mt-1">
              Connect external ERP systems and webhook triggers to FinTrack Pro endpoints.
            </p>
          </div>
          <span className="mt-4 text-xs font-semibold text-emerald-600 flex items-center gap-1 cursor-pointer hover:underline">
            View API <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Frequently Asked Questions</h3>
        <div className="space-y-3 divide-y divide-slate-100">
          {faqs.map((faq, i) => (
            <div key={i} className={i > 0 ? 'pt-3' : ''}>
              <h4 className="text-xs sm:text-sm font-semibold text-slate-800">{faq.q}</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
