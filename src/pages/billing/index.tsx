'use client';
import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Plus, Search, CreditCard, DollarSign } from 'lucide-react';

export default function BillingPage() {
  const invoices = useQuery(api.billing.getPatientInvoices, { patientId: "all" as any });
  const createInvoice = useMutation(api.billing.createInvoice);
  const addPayment = useMutation(api.billing.addPayment);
  
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [invoiceForm, setInvoiceForm] = useState({
    patientId: '',
    visitId: '',
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
  });
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    method: 'cash',
    transactionId: '',
  });

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createInvoice({
        patientId: invoiceForm.patientId as any,
        visitId: invoiceForm.visitId as any,
        items: invoiceForm.items,
        createdBy: "staff-id" as any,
      });
      setShowInvoiceForm(false);
      setInvoiceForm({
        patientId: '',
        visitId: '',
        items: [{ description: '', quantity: 1, unitPrice: 0 }],
      });
    } catch (error) {
      alert('Error creating invoice');
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    try {
      await addPayment({
        invoiceId: selectedInvoice._id,
        amount: parseFloat(paymentForm.amount),
        method: paymentForm.method,
        transactionId: paymentForm.transactionId || undefined,
        receivedBy: "staff-id" as any,
      });
      setShowPaymentForm(false);
      setPaymentForm({
        amount: '',
        method: 'cash',
        transactionId: '',
      });
      setSelectedInvoice(null);
    } catch (error) {
      alert('Error processing payment');
    }
  };

  const addInvoiceItem = () => {
    setInvoiceForm({
      ...invoiceForm,
      items: [...invoiceForm.items, { description: '', quantity: 1, unitPrice: 0 }],
    });
  };

  const updateInvoiceItem = (index: number, field: string, value: any) => {
    const newItems = [...invoiceForm.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setInvoiceForm({ ...invoiceForm, items: newItems });
  };

  const filteredInvoices = invoices?.filter(invoice => 
    invoice.patientId.includes(searchQuery) ||
    invoice.status.includes(searchQuery)
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing</h1>
          <p className="text-gray-600 mt-2">
            Manage patient invoices and payments
          </p>
        </div>
        <Button onClick={() => setShowInvoiceForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <CreditCard className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${invoices?.reduce((sum, inv) => sum + inv.paidAmount, 0) || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Invoices</p>
              <p className="text-2xl font-bold text-gray-900">
                {invoices?.filter(inv => inv.status === 'pending').length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <CreditCard className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Partial Payments</p>
              <p className="text-2xl font-bold text-gray-900">
                {invoices?.filter(inv => inv.status === 'partial').length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Outstanding Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                ${invoices?.reduce((sum, inv) => sum + inv.balance, 0) || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-gray-500">
            {filteredInvoices.length} invoices found
          </div>
        </div>

        <Table
          headers={['Patient', 'Amount', 'Paid', 'Balance', 'Status', 'Actions']}
        >
          {filteredInvoices.map((invoice) => (
            <tr key={invoice._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Patient ID: {invoice.patientId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${invoice.totalAmount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${invoice.paidAmount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${invoice.balance}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                  invoice.status === 'partial' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {invoice.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedInvoice(invoice);
                    setShowPaymentForm(true);
                  }}
                  disabled={invoice.status === 'paid'}
                >
                  Add Payment
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      {/* Invoice Modal */}
      <Modal
        isOpen={showInvoiceForm}
        onClose={() => setShowInvoiceForm(false)}
        title="Create New Invoice"
        size="xl"
      >
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Patient ID"
              value={invoiceForm.patientId}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, patientId: e.target.value })}
              required
            />
            <Input
              label="Visit ID (Optional)"
              value={invoiceForm.visitId}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, visitId: e.target.value })}
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">Invoice Items</h4>
              <Button type="button" variant="outline" size="sm" onClick={addInvoiceItem}>
                Add Item
              </Button>
            </div>
            
            <div className="space-y-3">
              {invoiceForm.items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-6">
                    <Input
                      label="Description"
                      value={item.description}
                      onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      label="Qty"
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateInvoiceItem(index, 'quantity', parseInt(e.target.value))}
                      required
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      label="Unit Price"
                      type="number"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateInvoiceItem(index, 'unitPrice', parseFloat(e.target.value))}
                      required
                    />
                  </div>
                  <div className="col-span-1">
                    {invoiceForm.items.length > 1 && (
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          const newItems = invoiceForm.items.filter((_, i) => i !== index);
                          setInvoiceForm({ ...invoiceForm, items: newItems });
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowInvoiceForm(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create Invoice
            </Button>
          </div>
        </form>
      </Modal>

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentForm}
        onClose={() => setShowPaymentForm(false)}
        title="Add Payment"
        size="md"
      >
        <form onSubmit={handleAddPayment} className="space-y-4">
          {selectedInvoice && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Invoice Total: ${selectedInvoice.totalAmount}</p>
              <p className="text-sm text-gray-600">Amount Paid: ${selectedInvoice.paidAmount}</p>
              <p className="text-sm text-gray-600">Balance: ${selectedInvoice.balance}</p>
            </div>
          )}

          <Input
            label="Payment Amount"
            type="number"
            step="0.01"
            value={paymentForm.amount}
            onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
            required
          />

          <Select
            label="Payment Method"
            value={paymentForm.method}
            onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
            options={[
              { value: 'cash', label: 'Cash' },
              { value: 'card', label: 'Credit/Debit Card' },
              { value: 'insurance', label: 'Insurance' },
              { value: 'mobile', label: 'Mobile Money' },
            ]}
            required
          />

          <Input
            label="Transaction ID (Optional)"
            value={paymentForm.transactionId}
            onChange={(e) => setPaymentForm({ ...paymentForm, transactionId: e.target.value })}
          />

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowPaymentForm(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Process Payment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}