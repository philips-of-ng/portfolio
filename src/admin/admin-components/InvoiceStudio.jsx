import React, { useState } from 'react';
import { generateInvoicePDF } from '../../utils/invoiceGenerator';

export default function InvoiceStudio() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    devName: 'The Philips',
    devTitle: 'Full-Stack Developer',
    invoiceNumber: 'INV-2026-001',
    issueDate: 'Aug 13, 2026',
    dueDate: 'Aug 27, 2026',
    currency: '$',
    devCompany: 'The Philips — Full-Stack Dev',
    devEmail: 'hello@devphilips.com',
    devPhone: '+234 (0) 000 000 0000',
    devWebsite: 'devphilips.com',
    devAddress: 'Ibadan, Oyo State, Nigeria',
    clientName: 'Acme Corporation',
    clientEmail: 'accounts@acmecorp.com',
    clientPhone: '+1 (555) 987-6543',
    clientWebsite: 'acmecorp.com',
    clientAddress: '456 Client Ave, New York, NY 10001',
    taxRate: 0,
    bankName: 'Guaranty Trust Bank (GTB)',
    accountName: 'Philips Edun',
    bankAccount: '0123456789',
    notes: "Payment is due within 14 days of invoice issuance.\nLate payments are subject to a 2% monthly fee.\nThank you for working with me — looking forward to our next project!",
    items: [
      { description: 'Frontend Development – Responsive Landing Page', qty: 1, rate: 2500 },
      { description: 'Backend API Integration & Authentication', qty: 1, rate: 1800 }
    ]
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...formData.items];
    updated[index][field] = value;
    setFormData({ ...formData, items: updated });
  };

  const addItem = () => {
    setFormData({ ...formData, items: [...formData.items, { description: '', qty: 1, rate: 0 }] });
  };

  const removeItem = (index) => {
    setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });
  };

  // Live calculations
  const subtotal = formData.items.reduce((sum, item) => sum + (Number(item.qty) * Number(item.rate) || 0), 0);
  const taxAmount = (subtotal * (Number(formData.taxRate) || 0)) / 100;
  const totalDue = subtotal + taxAmount;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const base64Pdf = await generateInvoicePDF(formData);
      
      const byteCharacters = atob(base64Pdf);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${formData.invoiceNumber}.pdf`;
      link.click();
    } catch (err) {
      console.error("PDF Generation Error:", err);
      alert("Failed to generate PDF. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-[#0A0B0D] text-white min-h-screen font-sans">
      {/* Top Bar with Brand Monogram */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#22242A] pb-5 mb-8 gap-4">
        <div className="flex items-center gap-3">
          
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Invoice Studio</h1>
            <p className="text-xs text-[#7E848F]">Client Invoice Generator</p>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full sm:w-auto bg-[#E8724A] hover:bg-[#d5613a] text-white font-bold px-6 py-2.5 rounded-lg transition-all shadow-lg shadow-[#E8724A]/10 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Building PDF...
            </>
          ) : (
            'Generate & Download PDF'
          )}
        </button>
      </div>

      {/* Invoice Details Header Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-[#131417] border border-[#22242A] rounded-xl">
        <div>
          <label className="text-[11px] font-bold text-[#E8724A] block mb-1 uppercase tracking-wider">Invoice #</label>
          <input name="invoiceNumber" value={formData.invoiceNumber} onChange={handleInputChange} className="w-full bg-[#0A0B0D] border border-[#22242A] p-2 rounded text-xs text-white focus:outline-none focus:border-[#E8724A]" />
        </div>
        <div>
          <label className="text-[11px] font-bold text-[#E8724A] block mb-1 uppercase tracking-wider">Currency</label>
          <select name="currency" value={formData.currency} onChange={handleInputChange} className="w-full bg-[#0A0B0D] border border-[#22242A] p-2 rounded text-xs text-white focus:outline-none focus:border-[#E8724A]">
            <option value="$">USD ($)</option>
            <option value="₦">NGN (₦)</option>
            <option value="€">EUR (€)</option>
            <option value="£">GBP (£)</option>
          </select>
        </div>
        <div>
          <label className="text-[11px] font-bold text-[#7E848F] block mb-1 uppercase tracking-wider">Issue Date</label>
          <input name="issueDate" value={formData.issueDate} onChange={handleInputChange} className="w-full bg-[#0A0B0D] border border-[#22242A] p-2 rounded text-xs text-white focus:outline-none focus:border-[#E8724A]" />
        </div>
        <div>
          <label className="text-[11px] font-bold text-[#7E848F] block mb-1 uppercase tracking-wider">Due Date</label>
          <input name="dueDate" value={formData.dueDate} onChange={handleInputChange} className="w-full bg-[#0A0B0D] border border-[#22242A] p-2 rounded text-xs text-white focus:outline-none focus:border-[#E8724A]" />
        </div>
      </div>

      {/* Main Form Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Client Card */}
        <div className="p-5 bg-[#131417] border border-[#22242A] rounded-xl space-y-3">
          <h2 className="text-xs font-bold text-[#E8724A] uppercase tracking-wider">CLIENT INFORMATION</h2>
          <input name="clientName" placeholder="Client / Company Name" value={formData.clientName} onChange={handleInputChange} className="w-full bg-[#0A0B0D] border border-[#22242A] p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-[#E8724A]" />
          <input name="clientEmail" placeholder="Client Email" value={formData.clientEmail} onChange={handleInputChange} className="w-full bg-[#0A0B0D] border border-[#22242A] p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-[#E8724A]" />
          <input name="clientPhone" placeholder="Client Phone" value={formData.clientPhone} onChange={handleInputChange} className="w-full bg-[#0A0B0D] border border-[#22242A] p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-[#E8724A]" />
          <input name="clientWebsite" placeholder="Client Website" value={formData.clientWebsite} onChange={handleInputChange} className="w-full bg-[#0A0B0D] border border-[#22242A] p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-[#E8724A]" />
          <input name="clientAddress" placeholder="Client Address" value={formData.clientAddress} onChange={handleInputChange} className="w-full bg-[#0A0B0D] border border-[#22242A] p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-[#E8724A]" />
        </div>

        {/* Banking Card (Nigerian Format) */}
        <div className="p-5 bg-[#131417] border border-[#22242A] rounded-xl space-y-3">
          <h2 className="text-xs font-bold text-[#7E848F] uppercase tracking-wider">NIGERIAN BANKING DETAILS</h2>
          <input name="bankName" placeholder="Bank Name (e.g. GTBank, Kuda, Zenith)" value={formData.bankName} onChange={handleInputChange} className="w-full bg-[#0A0B0D] border border-[#22242A] p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-[#E8724A]" />
          <input name="accountName" placeholder="Account Name" value={formData.accountName} onChange={handleInputChange} className="w-full bg-[#0A0B0D] border border-[#22242A] p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-[#E8724A]" />
          <input name="bankAccount" placeholder="10-Digit Account Number" value={formData.bankAccount} onChange={handleInputChange} className="w-full bg-[#0A0B0D] border border-[#22242A] p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-[#E8724A]" />
          <div className="grid grid-cols-2 gap-2">
            <input name="paypalEmail" placeholder="PayPal Email (Optional)" value={formData.paypalEmail} onChange={handleInputChange} className="bg-[#0A0B0D] border border-[#22242A] p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-[#E8724A]" />
            <input name="taxRate" type="number" placeholder="Tax Rate (%)" value={formData.taxRate} onChange={handleInputChange} className="bg-[#0A0B0D] border border-[#22242A] p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-[#E8724A]" />
          </div>
        </div>
      </div>

      {/* Line Items Card */}
      <div className="p-5 bg-[#131417] border border-[#22242A] rounded-xl mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xs font-bold text-[#E8724A] uppercase tracking-wider">LINE ITEMS</h2>
          <button onClick={addItem} className="text-xs bg-[#22242A] hover:bg-[#2e313a] text-white px-3 py-1.5 rounded-lg transition">
            + Add Line Item
          </button>
        </div>

        <div className="space-y-3">
          {formData.items.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-2 items-center bg-[#0A0B0D] p-3 rounded-lg border border-[#22242A]">
              <input
                placeholder="Item Description"
                value={item.description}
                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                className="flex-1 w-full bg-transparent border-0 p-1 text-xs text-white focus:outline-none"
              />
              <div className="flex gap-2 w-full sm:w-auto items-center">
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.qty}
                  onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                  className="w-16 bg-[#131417] border border-[#22242A] p-1.5 rounded text-xs text-center text-white focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Rate"
                  value={item.rate}
                  onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                  className="w-28 bg-[#131417] border border-[#22242A] p-1.5 rounded text-xs text-right text-white focus:outline-none"
                />
                <span className="text-xs text-[#E8724A] font-bold w-24 text-right">
                  {formData.currency}{((Number(item.qty) || 0) * (Number(item.rate) || 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <button onClick={() => removeItem(index)} className="text-red-400 hover:text-red-300 p-1 text-xs">
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Live Subtotal / Total Summary */}
        <div className="border-t border-[#22242A] mt-4 pt-4 flex flex-col items-end space-y-1 text-xs">
          <div className="flex justify-between w-48 text-[#7E848F]">
            <span>Subtotal:</span>
            <span className="text-white font-bold">{formData.currency}{subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          {Number(formData.taxRate) > 0 && (
            <div className="flex justify-between w-48 text-[#7E848F]">
              <span>Tax ({formData.taxRate}%):</span>
              <span className="text-white font-bold">{formData.currency}{taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          )}
          <div className="flex justify-between w-48 pt-2 border-t border-[#22242A] text-sm font-bold">
            <span className="text-white">Total Due:</span>
            <span className="text-[#E8724A]">{formData.currency}{totalDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      {/* Invoice Notes */}
      <div className="p-5 bg-[#131417] border border-[#22242A] rounded-xl">
        <h2 className="text-xs font-bold text-[#7E848F] uppercase tracking-wider mb-2">TERMS & NOTES</h2>
        <textarea
          name="notes"
          rows="3"
          value={formData.notes}
          onChange={handleInputChange}
          className="w-full bg-[#0A0B0D] border border-[#22242A] p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-[#E8724A]"
        />
      </div>
    </div>
  );
}