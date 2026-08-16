import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Bell,
  Globe,
  Sliders,
  CheckCircle2,
  Lock,
  Building,
} from 'lucide-react';
import { TemplateSettings } from '../types';

interface SettingsViewProps {
  templateSettings: TemplateSettings;
  onUpdateTemplateSettings: (settings: TemplateSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  templateSettings,
  onUpdateTemplateSettings,
}) => {
  const [currency, setCurrency] = useState('USD ($)');
  const [taxId, setTaxId] = useState('US-EIN 94-8271049');
  const [autoReminderDays, setAutoReminderDays] = useState('3');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [lateFeePercent, setLateFeePercent] = useState('1.5');
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="font-semibold text-sm">Settings Saved</p>
            <p className="text-xs text-slate-300">System configuration updated successfully.</p>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          System & Billing Settings
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Configure enterprise billing parameters, tax IDs, and reminder automations.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Enterprise Organization */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <Building className="w-4 h-4 text-blue-600" />
            <span>Organization Profile</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company Legal Name</label>
              <input
                type="text"
                value={templateSettings.companyName}
                onChange={(e) =>
                  onUpdateTemplateSettings({ ...templateSettings, companyName: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tax / VAT ID</label>
              <input
                type="text"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Currency & Financial Preferences */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <CreditCard className="w-4 h-4 text-blue-600" />
            <span>Currency & Payment Terms</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Base Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
              >
                <option value="USD ($)">USD ($) - US Dollar</option>
                <option value="EUR (€)">EUR (€) - Euro</option>
                <option value="GBP (£)">GBP (£) - British Pound</option>
                <option value="CAD ($)">CAD ($) - Canadian Dollar</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Late Payment Penalty (%)</label>
              <input
                type="number"
                step="0.1"
                value={lateFeePercent}
                onChange={(e) => setLateFeePercent(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Default Terms</label>
              <select
                value={templateSettings.paymentTerms}
                onChange={(e) =>
                  onUpdateTemplateSettings({ ...templateSettings, paymentTerms: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
              >
                <option value="Net 30">Net 30</option>
                <option value="Net 15">Net 15</option>
                <option value="Net 60">Net 60</option>
                <option value="Due on Receipt">Due on Receipt</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications & Reminders */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <Bell className="w-4 h-4 text-blue-600" />
            <span>Automated Overdue Reminders</span>
          </div>

          <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100">
            <div>
              <p className="font-semibold text-slate-800">Email notifications on overdue invoices</p>
              <p className="text-slate-500 text-[11px]">
                Automatically send reminder notices to client finance contacts.
              </p>
            </div>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
            />
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-700 mb-1">
              Send reminder before due date (days)
            </label>
            <input
              type="number"
              value={autoReminderDays}
              onChange={(e) => setAutoReminderDays(e.target.value)}
              className="w-28 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-slate-950 hover:bg-slate-800 text-white rounded-lg text-xs sm:text-sm font-medium shadow-xs cursor-pointer transition-colors"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
