/**
 * Changes:
 * 2025-03-15 - Initial creation of Lulu API client with authentication, print job, and cost calculation endpoints
 */

import axios, { AxiosInstance } from 'axios';

export type LuluEnvironment = 'production' | 'sandbox';

interface LuluConfig {
  clientKey: string;
  clientSecret: string;
  environment: LuluEnvironment;
}

interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}

export class LuluAPI {
  private axiosInstance: AxiosInstance;
  private config: LuluConfig;
  private token: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(config: LuluConfig) {
    this.config = config;
    const baseURL = config.environment === 'production' 
      ? 'https://api.lulu.com'
      : 'https://api.sandbox.lulu.com';

    this.axiosInstance = axios.create({ baseURL });
  }

  private async authenticate(): Promise<void> {
    if (this.token && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return;
    }

    const authString = Buffer.from(
      `${this.config.clientKey}:${this.config.clientSecret}`
    ).toString('base64');

    const tokenEndpoint = this.config.environment === 'production'
      ? 'https://api.lulu.com/auth/realms/glasstree/protocol/openid-connect/token'
      : 'https://api.sandbox.lulu.com/auth/realms/glasstree/protocol/openid-connect/token';

    const response = await axios.post<TokenResponse>(
      tokenEndpoint,
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${authString}`,
        },
      }
    );

    this.token = response.data.access_token;
    this.tokenExpiry = new Date(Date.now() + response.data.expires_in * 1000);
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: unknown
  ): Promise<T> {
    await this.authenticate();

    const response = await this.axiosInstance.request<T>({
      method,
      url: endpoint,
      data,
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  }

  async calculatePrintJobCost(data: PrintJobCostCalculationRequest): Promise<PrintJobCostCalculationResponse> {
    return this.request('POST', '/print-job-cost-calculations/', data);
  }

  async createPrintJob(data: CreatePrintJobRequest): Promise<PrintJobResponse> {
    return this.request('POST', '/print-jobs/', data);
  }

  async getPrintJobs(): Promise<PrintJobListResponse> {
    return this.request('GET', '/print-jobs/');
  }
}

export interface ShippingAddress {
  name: string;
  street1: string;
  street2?: string;
  city: string;
  state_code?: string;
  country_code: string;
  postcode: string;
  phone_number: string;
  is_business?: boolean;
  company?: string;
}

export interface PrintableFile {
  source_url: string;
  source_md5_sum?: string;
}

export interface LineItem {
  pod_package_id: string;
  page_count: number;
  quantity: number;
  title: string;
  cover?: PrintableFile;
  interior?: PrintableFile;
}

export interface PrintJobCostCalculationRequest {
  line_items: LineItem[];
  shipping_address: ShippingAddress;
  shipping_level: 'MAIL' | 'PRIORITY_MAIL' | 'GROUND' | 'EXPEDITED' | 'EXPRESS';
}

export interface CostSummary {
  total_cost_excl_tax: string;
  total_cost_incl_tax: string;
  total_tax: string;
  currency: string;
  shipping_cost: {
    total: string;
    tax_rate: string;
    tax: string;
  };
  line_item_costs: Array<{
    quantity: number;
    unit_price_excl_tax: string;
    unit_price_incl_tax: string;
    tax_rate: string;
    tax: string;
  }>;
}

export interface PrintJobCostCalculationResponse extends CostSummary {
  shipping_address: ShippingAddress;
}

export interface CreatePrintJobRequest {
  contact_email: string;
  external_id?: string;
  line_items: LineItem[];
  shipping_address: ShippingAddress;
  shipping_level: 'MAIL' | 'PRIORITY_MAIL' | 'GROUND' | 'EXPEDITED' | 'EXPRESS';
}

export interface PrintJobResponse {
  id: string;
  status: {
    name: string;
    messages: Record<string, string>;
  };
  line_items: LineItem[];
  shipping_address: ShippingAddress;
  contact_email: string;
  external_id?: string;
  costs: CostSummary;
}

export interface PrintJobListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: PrintJobResponse[];
}
