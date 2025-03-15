/**
 * Changes:
 * 2025-03-15 - Initial creation of ShippingAddressForm component with validation and error handling
 */

import { useState } from 'react';
import type { ShippingAddress } from '@/lib/api/lulu';
import { MapPin, Building2, Phone } from 'lucide-react';

interface ShippingAddressFormProps {
  value: ShippingAddress;
  onChange: (address: ShippingAddress) => void;
  errors?: Partial<Record<keyof ShippingAddress, string>>;
}

export function ShippingAddressForm({ value, onChange, errors }: ShippingAddressFormProps) {
  const [isBusiness, setIsBusiness] = useState(value.is_business ?? false);

  const handleChange = (field: keyof ShippingAddress, fieldValue: string | boolean) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <MapPin className="h-5 w-5 text-gray-400" />
        <h2 className="text-lg font-semibold">Shipping Address</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={value.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors?.name ? 'border-red-500' : ''
            }`}
          />
          {errors?.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              value={value.phone_number}
              onChange={(e) => handleChange('phone_number', e.target.value)}
              className={`block w-full pl-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                errors?.phone_number ? 'border-red-500' : ''
              }`}
            />
          </div>
          {errors?.phone_number && (
            <p className="mt-1 text-sm text-red-500">{errors.phone_number}</p>
          )}
        </div>

        <div className="col-span-full">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_business"
              checked={isBusiness}
              onChange={(e) => {
                setIsBusiness(e.target.checked);
                handleChange('is_business', e.target.checked);
              }}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_business" className="text-sm font-medium text-gray-700">
              This is a business address
            </label>
          </div>
        </div>

        {isBusiness && (
          <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building2 className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={value.company}
                onChange={(e) => handleChange('company', e.target.value)}
                className="block w-full pl-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        <div className="col-span-full">
          <label className="block text-sm font-medium text-gray-700">Street Address</label>
          <input
            type="text"
            value={value.street1}
            onChange={(e) => handleChange('street1', e.target.value)}
            placeholder="Street address, P.O. box"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors?.street1 ? 'border-red-500' : ''
            }`}
          />
          {errors?.street1 && <p className="mt-1 text-sm text-red-500">{errors.street1}</p>}
        </div>

        <div className="col-span-full">
          <input
            type="text"
            value={value.street2 || ''}
            onChange={(e) => handleChange('street2', e.target.value)}
            placeholder="Apartment, suite, unit, building (optional)"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            value={value.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors?.city ? 'border-red-500' : ''
            }`}
          />
          {errors?.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">State / Province</label>
          <input
            type="text"
            value={value.state_code || ''}
            onChange={(e) => handleChange('state_code', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Postal Code</label>
          <input
            type="text"
            value={value.postcode}
            onChange={(e) => handleChange('postcode', e.target.value)}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors?.postcode ? 'border-red-500' : ''
            }`}
          />
          {errors?.postcode && <p className="mt-1 text-sm text-red-500">{errors.postcode}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Country</label>
          <select
            value={value.country_code}
            onChange={(e) => handleChange('country_code', e.target.value)}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors?.country_code ? 'border-red-500' : ''
            }`}
          >
            <option value="">Select a country</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="AU">Australia</option>
            {/* Add more countries as needed */}
          </select>
          {errors?.country_code && (
            <p className="mt-1 text-sm text-red-500">{errors.country_code}</p>
          )}
        </div>
      </div>
    </div>
  );
}
