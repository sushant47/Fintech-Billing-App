import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Check,
  Plus,
  Save,
  RotateCcw,
  Printer,
  Sparkles,
  CheckCircle2,
  FileText,
  Palette,
  Image as ImageIcon,
} from 'lucide-react';
import { TemplateSettings } from '../types';
import { ACCENT_COLOR_PRESETS, FONT_OPTIONS, DEFAULT_TEMPLATE_SETTINGS } from '../data/mockData';

interface TemplateDesignerViewProps {
  settings: TemplateSettings;
  onSaveSettings: (newSettings: TemplateSettings) => void;
}

export const TemplateDesignerView: React.FC<TemplateDesignerViewProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<TemplateSettings>(settings);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColor, setCustomColor] = useState(formData.accentColor);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setFormData((prev) => ({
            ...prev,
            companyLogoUrl: uploadEvent.target!.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSaveSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    setFormData(DEFAULT_TEMPLATE_SETTINGS);
  };

  const getActiveFontFamily = () => {
    const found = FONT_OPTIONS.find((f) => f.id === formData.fontFamily);
    return found ? found.family : "'Inter', sans-serif";
  };

  const sampleSubtotal = 18000.0;
  const sampleTax = sampleSubtotal * (formData.defaultTaxRate / 100);
  const sampleTotal = sampleSubtotal + sampleTax;

  return (
    <div className="space-y-6">
      {/* Save Toast Notification */}
      {saveSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="font-semibold text-sm">Template Saved</p>
            <p className="text-xs text-slate-300">All new invoices will use this design and defaults.</p>
          </div>
        </div>
      )}

      {/* 2-Column Split: Controls on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Controls (5 cols on lg) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-7">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Template Designer
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Customize your brand identity and defaults.
            </p>
          </div>

          {/* Section: BRAND IDENTITY */}
          <div className="space-y-4 pt-1">
            <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
              <Palette className="w-3.5 h-3.5" />
              <span>BRAND IDENTITY</span>
            </div>

            {/* Company Logo Upload Box */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-2">
                Company Logo
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoUpload}
                accept="image/png,image/jpeg,image/svg+xml"
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-xl p-5 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-slate-50 flex flex-col items-center justify-center group"
              >
                {formData.companyLogoUrl ? (
                  <div className="space-y-2">
                    <img
                      src={formData.companyLogoUrl}
                      alt="Uploaded Logo"
                      className="max-h-16 max-w-full object-contain mx-auto"
                    />
                    <p className="text-xs text-blue-600 font-medium group-hover:underline">
                      Click to change logo
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-lg bg-slate-200/70 group-hover:bg-slate-300/70 flex items-center justify-center text-slate-600 mb-2.5 transition-colors">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-slate-800">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      SVG, PNG, JPG (max. 800×400px)
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Accent Color Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-2">
                Accent Color
              </label>
              <div className="flex items-center gap-3">
                {ACCENT_COLOR_PRESETS.map((preset) => {
                  const isSelected = formData.accentColor.toLowerCase() === preset.hex.toLowerCase();
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, accentColor: preset.hex })}
                      className={`w-9 h-9 rounded-full ${preset.bgClass} flex items-center justify-center text-white cursor-pointer transition-all hover:scale-105 shadow-xs ${
                        isSelected ? 'ring-3 ring-offset-2 ring-slate-900' : ''
                      }`}
                      aria-label={preset.name}
                    >
                      {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>
                  );
                })}

                {/* Custom Color Button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="w-9 h-9 rounded-full border border-slate-300 bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer transition-colors text-xs font-bold"
                    aria-label="Custom color"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  {showColorPicker && (
                    <div className="absolute left-0 mt-2 p-3 bg-white border border-slate-200 rounded-xl shadow-xl z-30 flex flex-col gap-2">
                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) => {
                          setCustomColor(e.target.value);
                          setFormData({ ...formData, accentColor: e.target.value });
                        }}
                        className="w-24 h-10 cursor-pointer rounded border-0"
                      />
                      <button
                        onClick={() => setShowColorPicker(false)}
                        className="text-xs px-2 py-1 bg-slate-900 text-white rounded font-medium"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Font Family Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-2">
                Font Family
              </label>
              <div className="relative">
                <select
                  value={formData.fontFamily}
                  onChange={(e) => setFormData({ ...formData, fontFamily: e.target.value })}
                  className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer appearance-none"
                >
                  {FONT_OPTIONS.map((font) => (
                    <option key={font.id} value={font.id}>
                      {font.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                  ▼
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5 space-y-4">
            {/* Section: FINANCIAL DEFAULTS */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                <FileText className="w-3.5 h-3.5" />
                <span>FINANCIAL DEFAULTS</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const customRate = prompt('Enter new tax rate percentage (e.g. 18.5):', '18.5');
                  if (customRate) {
                    const num = parseFloat(customRate);
                    if (!isNaN(num)) {
                      setFormData({
                        ...formData,
                        defaultTaxRate: num,
                        taxRateLabel: `Custom VAT (${num}%)`,
                      });
                    }
                  }
                }}
                className="text-xs font-bold text-slate-900 hover:text-blue-600 flex items-center gap-0.5 cursor-pointer"
              >
                <span>+ New</span>
              </button>
            </div>

            {/* Default Tax Rate */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-2">
                Default Tax Rate
              </label>
              <div className="relative">
                <select
                  value={formData.defaultTaxRate}
                  onChange={(e) => {
                    const rate = parseFloat(e.target.value);
                    const label = rate === 20 ? 'Standard VAT (20%)' : rate === 0 ? 'No Tax (0%)' : `Tax (${rate}%)`;
                    setFormData({ ...formData, defaultTaxRate: rate, taxRateLabel: label });
                  }}
                  className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer appearance-none"
                >
                  <option value={20}>Standard VAT (20%)</option>
                  <option value={10}>Reduced Rate (10%)</option>
                  <option value={8.25}>State & City Tax (8.25%)</option>
                  <option value={5}>GST (5%)</option>
                  <option value={0}>Zero Rated (0%)</option>
                  {![20, 10, 8.25, 5, 0].includes(formData.defaultTaxRate) && (
                    <option value={formData.defaultTaxRate}>{formData.taxRateLabel}</option>
                  )}
                </select>
                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Payment Terms */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-2">
                Payment Terms
              </label>
              <div className="relative">
                <select
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                  className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer appearance-none"
                >
                  <option value="Net 30">Net 30</option>
                  <option value="Net 15">Net 15</option>
                  <option value="Net 60">Net 60</option>
                  <option value="Due on Receipt">Due on Receipt</option>
                </select>
                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Terms Notes Textarea */}
            <div>
              <textarea
                rows={3}
                value={formData.termsAndConditions}
                onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value })}
                className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-colors"
                placeholder="Terms and conditions..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs sm:text-sm font-medium text-white bg-slate-950 hover:bg-slate-800 active:scale-95 rounded-lg flex items-center gap-2 shadow-sm cursor-pointer transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Template</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Document Preview (7 cols on lg) matching Image 1.png */}
        <div className="lg:col-span-7 bg-slate-100/70 p-4 sm:p-8 rounded-2xl border border-slate-200/60 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Live Interactive Paper Preview
            </span>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1 text-slate-700 hover:text-slate-900 font-medium px-2 py-1 rounded hover:bg-white/80 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Preview</span>
            </button>
          </div>

          {/* Paper Document Container */}
          <div
            className="w-full max-w-2xl bg-white rounded-lg shadow-xl border border-slate-200/80 p-6 sm:p-10 relative overflow-hidden text-slate-900 transition-all"
            style={{ fontFamily: getActiveFontFamily() }}
          >
            {/* Watermark diagonal overlay exactly matching Image 1.png */}
            <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center z-0 overflow-hidden">
              <span className="text-slate-900/[0.04] font-black text-6xl sm:text-8xl -rotate-45 tracking-widest uppercase">
                PREVIEW
              </span>
            </div>

            {/* Document Content */}
            <div className="relative z-10 space-y-8">
              {/* Header Top Section */}
              <div className="flex items-start justify-between">
                {/* Logo Space Box or Uploaded Logo */}
                <div>
                  {formData.companyLogoUrl ? (
                    <img
                      src={formData.companyLogoUrl}
                      alt="Company Logo"
                      className="h-12 object-contain"
                    />
                  ) : (
                    <div className="px-5 py-3 rounded bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-500 tracking-wide">
                      Logo Space
                    </div>
                  )}

                  <div className="mt-4 text-xs text-slate-600 leading-relaxed">
                    <p className="font-bold text-slate-900 text-sm">{formData.companyName}</p>
                    <p className="whitespace-pre-line text-slate-500 mt-0.5">{formData.companyAddress}</p>
                  </div>
                </div>

                {/* INVOICE & Meta Details */}
                <div className="text-right">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 uppercase">
                    INVOICE
                  </h1>
                  <p className="text-xs font-bold text-slate-800 mt-1">#INV-2024-001</p>
                  <div className="text-[11px] text-slate-500 mt-1.5 space-y-0.5">
                    <p>Date: Oct 24, 2024</p>
                    <p>Due: Nov 23, 2024</p>
                  </div>
                </div>
              </div>

              {/* BILL TO */}
              <div className="pt-2">
                <span className="text-[10px] font-extrabold tracking-wider text-slate-500 uppercase block mb-1">
                  BILL TO
                </span>
                <p className="font-bold text-slate-900 text-sm">Acme Corporation</p>
                <div className="text-xs text-slate-600 space-y-0.5 mt-0.5">
                  <p>Attn: Accounts Payable</p>
                  <p>456 Corporate Blvd</p>
                  <p>San Francisco, CA 94105</p>
                </div>
              </div>

              {/* Items Table matching Image 1.png */}
              <div className="pt-2">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-2.5 font-bold">DESCRIPTION</th>
                      <th className="py-2.5 text-center font-bold">QTY</th>
                      <th className="py-2.5 text-right font-bold">RATE</th>
                      <th className="py-2.5 text-right font-bold">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                    <tr>
                      <td className="py-3 pr-2 font-medium">Enterprise Software License (Annual)</td>
                      <td className="py-3 text-center text-slate-600">1</td>
                      <td className="py-3 text-right text-slate-600">$12,000.00</td>
                      <td className="py-3 text-right font-semibold text-slate-900">$12,000.00</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-2 font-medium">Implementation Consulting (Hours)</td>
                      <td className="py-3 text-center text-slate-600">40</td>
                      <td className="py-3 text-right text-slate-600">$150.00</td>
                      <td className="py-3 text-right font-semibold text-slate-900">$6,000.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Summary Section matching Image 1.png */}
              <div className="flex justify-end pt-2">
                <div className="w-full max-w-xs border border-slate-200/80 rounded-lg p-3.5 bg-slate-50/50 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-slate-900">
                      ${sampleSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tax ({formData.defaultTaxRate}%)</span>
                    <span className="font-medium text-slate-900">
                      ${sampleTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div
                    className="flex justify-between pt-2 border-t border-slate-200 font-bold text-sm text-slate-900"
                    style={{ color: formData.accentColor !== '#18181b' ? formData.accentColor : undefined }}
                  >
                    <span>Total Due</span>
                    <span>
                      ${sampleTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* TERMS & CONDITIONS matching Image 1.png */}
              <div className="pt-4 border-t border-slate-100">
                <span className="text-[10px] font-extrabold tracking-wider text-slate-500 uppercase block mb-1">
                  TERMS & CONDITIONS
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {formData.termsAndConditions}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
