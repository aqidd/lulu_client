/**
 * Changes:
 * 2025-03-15 - Initial creation of LineItemForm component with file upload and product selection
 */

import { useState } from 'react';
import type { LineItem } from '@/lib/api/lulu';
import { Book, Upload, X } from 'lucide-react';

interface LineItemFormProps {
  value: LineItem;
  onChange: (item: LineItem) => void;
  onRemove: () => void;
  errors?: Partial<Record<keyof LineItem, string>>;
}

const COMMON_PACKAGES = [
  {
    id: '0600X0900BWSTDPB060UW444MXX',
    name: '6" x 9" Black & White Standard Paperback',
    description: 'Standard quality, 60# white paper, matte cover',
  },
  {
    id: '0850X1100BWSTDPB060UW444MXX',
    name: '8.5" x 11" Black & White Standard Paperback',
    description: 'Standard quality, 60# white paper, matte cover',
  },
  {
    id: '0600X0900FCSTDPB080CW444GXX',
    name: '6" x 9" Full Color Standard Paperback',
    description: 'Standard quality, 80# coated paper, gloss cover',
  },
];

export function LineItemForm({ value, onChange, onRemove, errors }: LineItemFormProps) {
  const [interiorFile, setInteriorFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const handleChange = (field: keyof LineItem, fieldValue: string | number) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'interior' | 'cover'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (type === 'interior') {
      setInteriorFile(file);
      // In a real implementation, you would upload this file to your server
      // and get back a URL that can be accessed by Lulu's API
      // For now, we'll just simulate it
      onChange({
        ...value,
        interior: {
          source_url: 'https://example.com/files/' + file.name,
        },
      });
    } else {
      setCoverFile(file);
      onChange({
        ...value,
        cover: {
          source_url: 'https://example.com/files/' + file.name,
        },
      });
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Book className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-medium">Book Details</h3>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-full">
          <label className="block text-sm font-medium text-gray-700">Book Title</label>
          <input
            type="text"
            value={value.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors?.title ? 'border-red-500' : ''
            }`}
          />
          {errors?.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>

        <div className="col-span-full">
          <label className="block text-sm font-medium text-gray-700">Product Type</label>
          <select
            value={value.pod_package_id}
            onChange={(e) => handleChange('pod_package_id', e.target.value)}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors?.pod_package_id ? 'border-red-500' : ''
            }`}
          >
            <option value="">Select a product type</option>
            {COMMON_PACKAGES.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name}
              </option>
            ))}
          </select>
          {errors?.pod_package_id && (
            <p className="mt-1 text-sm text-red-500">{errors.pod_package_id}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            {COMMON_PACKAGES.find((pkg) => pkg.id === value.pod_package_id)?.description}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Page Count</label>
          <input
            type="number"
            min="1"
            value={value.page_count}
            onChange={(e) => handleChange('page_count', parseInt(e.target.value, 10))}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors?.page_count ? 'border-red-500' : ''
            }`}
          />
          {errors?.page_count && (
            <p className="mt-1 text-sm text-red-500">{errors.page_count}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            min="1"
            value={value.quantity}
            onChange={(e) => handleChange('quantity', parseInt(e.target.value, 10))}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors?.quantity ? 'border-red-500' : ''
            }`}
          />
          {errors?.quantity && (
            <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>
          )}
        </div>

        <div className="col-span-full space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Interior PDF</label>
            <div className="mt-1 flex items-center space-x-4">
              <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                <span className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose file
                </span>
                <input
                  type="file"
                  className="sr-only"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, 'interior')}
                />
              </label>
              {interiorFile && (
                <span className="text-sm text-gray-500">{interiorFile.name}</span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cover PDF</label>
            <div className="mt-1 flex items-center space-x-4">
              <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                <span className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose file
                </span>
                <input
                  type="file"
                  className="sr-only"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, 'cover')}
                />
              </label>
              {coverFile && <span className="text-sm text-gray-500">{coverFile.name}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
