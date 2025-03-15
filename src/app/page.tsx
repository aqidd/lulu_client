/**
 * Changes:
 * 2025-03-15 - Initial creation of main page with print job form and API integration
 */

'use client';

import { useState } from 'react';
import { PrinterIcon } from 'lucide-react';
import { PrintJobForm } from '@/components/PrintJobForm';
import type { CreatePrintJobRequest, PrintJobCostCalculationResponse } from '@/lib/api/lulu';
import { LuluAPI } from '@/lib/api/lulu';

const api = new LuluAPI({
  clientKey: process.env.NEXT_PUBLIC_LULU_CLIENT_KEY || '',
  clientSecret: process.env.NEXT_PUBLIC_LULU_CLIENT_SECRET || '',
  environment: 'sandbox',
});

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCalculateCost = async (data: CreatePrintJobRequest): Promise<PrintJobCostCalculationResponse> => {
    try {
      return await api.calculatePrintJobCost(data);
    } catch (error) {
      console.error('Error calculating cost:', error);
      throw error;
    }
  };

  const handleSubmit = async (data: CreatePrintJobRequest) => {
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await api.createPrintJob(data);
      setSuccessMessage(`Print job created successfully! Job ID: ${response.id}`);
    } catch (error) {
      console.error('Error creating print job:', error);
      setErrorMessage('Failed to create print job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4 mb-8">
          <PrinterIcon className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Lulu Print Job Creator</h1>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 rounded-md bg-green-50 border border-green-200">
            <p className="text-green-700">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-200">
            <p className="text-red-700">{errorMessage}</p>
          </div>
        )}

        <PrintJobForm
          onSubmit={handleSubmit}
          onCalculateCost={handleCalculateCost}
        />
      </div>
    </div>
  );
}
