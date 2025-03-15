/**
 * Changes:
 * 2025-03-15 - Initial creation of PrintJobForm component with shipping options and cost calculation
 */

import { useState } from 'react';
import type { CreatePrintJobRequest, LineItem, PrintJobCostCalculationResponse, ShippingAddress } from '@/lib/api/lulu';
import { ShippingAddressForm } from './ShippingAddressForm';
import { LineItemForm } from './LineItemForm';
import { Truck, PlusCircle, Calculator } from 'lucide-react';

interface PrintJobFormProps {
  onSubmit: (data: CreatePrintJobRequest) => void;
  onCalculateCost: (data: CreatePrintJobRequest) => Promise<PrintJobCostCalculationResponse>;
}

const SHIPPING_LEVELS = [
  { id: 'MAIL', name: 'Standard Mail', description: 'Slowest and most economical option' },
  { id: 'PRIORITY_MAIL', name: 'Priority Mail', description: 'Balance of speed and cost' },
  { id: 'GROUND', name: 'Ground', description: 'Courier-based ground shipping' },
  { id: 'EXPEDITED', name: 'Expedited', description: '2nd day delivery via air mail' },
  { id: 'EXPRESS', name: 'Express', description: 'Overnight delivery - fastest option' },
];

const DEFAULT_LINE_ITEM: LineItem = {
  pod_package_id: '',
  page_count: 0,
  quantity: 1,
  title: '',
};

const DEFAULT_SHIPPING_ADDRESS: ShippingAddress = {
  name: '',
  street1: '',
  city: '',
  country_code: '',
  postcode: '',
  phone_number: '',
};

export function PrintJobForm({ onSubmit, onCalculateCost }: PrintJobFormProps) {
  const [email, setEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>(DEFAULT_SHIPPING_ADDRESS);
  const [shippingLevel, setShippingLevel] = useState<string>('MAIL');
  const [lineItems, setLineItems] = useState<LineItem[]>([{ ...DEFAULT_LINE_ITEM }]);
  const [costCalculation, setCostCalculation] = useState<PrintJobCostCalculationResponse | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCalculating, setIsCalculating] = useState(false);

  const handleAddLineItem = () => {
    setLineItems([...lineItems, { ...DEFAULT_LINE_ITEM }]);
  };

  const handleRemoveLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const handleLineItemChange = (index: number, item: LineItem) => {
    setLineItems(lineItems.map((li, i) => (i === index ? item : li)));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email) newErrors.email = 'Email is required';
    if (!shippingAddress.name) newErrors.name = 'Name is required';
    if (!shippingAddress.street1) newErrors.street1 = 'Street address is required';
    if (!shippingAddress.city) newErrors.city = 'City is required';
    if (!shippingAddress.country_code) newErrors.country_code = 'Country is required';
    if (!shippingAddress.postcode) newErrors.postcode = 'Postal code is required';
    if (!shippingAddress.phone_number) newErrors.phone_number = 'Phone number is required';

    lineItems.forEach((item, index) => {
      if (!item.title) newErrors[`lineItem${index}.title`] = 'Title is required';
      if (!item.pod_package_id) newErrors[`lineItem${index}.pod_package_id`] = 'Product type is required';
      if (!item.page_count || item.page_count < 1) newErrors[`lineItem${index}.page_count`] = 'Valid page count is required';
      if (!item.quantity || item.quantity < 1) newErrors[`lineItem${index}.quantity`] = 'Valid quantity is required';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculateCost = async () => {
    if (!validateForm()) return;

    setIsCalculating(true);
    try {
      const calculation = await onCalculateCost({
        contact_email: email,
        shipping_address: shippingAddress,
        shipping_level: shippingLevel as any,
        line_items: lineItems,
      });
      setCostCalculation(calculation);
    } catch (error) {
      console.error('Error calculating cost:', error);
      setErrors({ ...errors, calculation: 'Failed to calculate cost. Please try again.' });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit({
      contact_email: email,
      shipping_address: shippingAddress,
      shipping_level: shippingLevel as any,
      line_items: lineItems,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : ''
              }`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          <ShippingAddressForm
            value={shippingAddress}
            onChange={setShippingAddress}
            errors={errors}
          />

          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Truck className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold">Shipping Method</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SHIPPING_LEVELS.map((level) => (
                <label
                  key={level.id}
                  className={`relative rounded-lg border p-4 flex cursor-pointer focus:outline-none ${
                    shippingLevel === level.id
                      ? 'bg-blue-50 border-blue-500'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="shipping-level"
                    value={level.id}
                    checked={shippingLevel === level.id}
                    onChange={(e) => setShippingLevel(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{level.name}</p>
                      {shippingLevel === level.id && (
                        <div className="h-5 w-5 text-blue-500">
                          <span className="absolute h-3 w-3 rounded-full bg-blue-500 top-1/2 right-4 transform -translate-y-1/2" />
                        </div>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{level.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Line Items</h2>
              <button
                type="button"
                onClick={handleAddLineItem}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Book
              </button>
            </div>

            {lineItems.map((item, index) => (
              <LineItemForm
                key={index}
                value={item}
                onChange={(newItem) => handleLineItemChange(index, newItem)}
                onRemove={() => handleRemoveLineItem(index)}
                errors={errors}
              />
            ))}
          </div>

          {costCalculation && (
            <div className="mt-6 bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-4">Cost Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{costCalculation.total_cost_excl_tax} {costCalculation.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{costCalculation.shipping_cost.total} {costCalculation.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>{costCalculation.total_tax} {costCalculation.currency}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>{costCalculation.total_cost_incl_tax} {costCalculation.currency}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleCalculateCost}
              disabled={isCalculating}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Calculator className="h-4 w-4 mr-2" />
              {isCalculating ? 'Calculating...' : 'Calculate Cost'}
            </button>

            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Print Job
            </button>
          </div>

          {errors.calculation && (
            <p className="mt-2 text-sm text-red-500">{errors.calculation}</p>
          )}
        </div>
      </div>
    </form>
  );
}
