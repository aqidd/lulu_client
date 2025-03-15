# Lulu Print API Integration

A Next.js application that integrates with Lulu's Print API for on-demand book printing and fulfillment. Built with TypeScript, Tailwind CSS, and modern React practices.

## Screenshots

### Main Interface
![Lulu Client Interface](./lulu%20client.png)
*The main interface provides an intuitive form for creating print jobs with real-time cost calculation*

## Features

- 📚 Create and manage print jobs for books
- 💳 Real-time cost calculation
- 📦 Multiple shipping options
- 🎨 Beautiful, responsive UI with Tailwind CSS
- 🔒 Secure API integration with OAuth2
- ✨ Modern component architecture

## Prerequisites

1. Node.js 18.x or later
2. Lulu API credentials (Client Key and Secret)
3. npm or yarn package manager

## Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd lulu-print-app
npm install
```

### 2. Configure Environment

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_LULU_CLIENT_KEY=your_client_key
NEXT_PUBLIC_LULU_CLIENT_SECRET=your_client_secret
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Lulu API Integration

### 1. Get API Credentials

1. Create a Lulu account at [developers.lulu.com](https://developers.lulu.com)
2. Navigate to User Profile > API Keys
3. Generate your Client Key and Secret
4. Choose environment:
   - Sandbox: `api.sandbox.lulu.com` (for testing)
   - Production: `api.lulu.com` (for live orders)

### 2. API Authentication

The application handles OAuth2 authentication automatically using the provided credentials:

```typescript
const api = new LuluAPI({
  clientKey: process.env.NEXT_PUBLIC_LULU_CLIENT_KEY,
  clientSecret: process.env.NEXT_PUBLIC_LULU_CLIENT_SECRET,
  environment: 'sandbox' // or 'production'
});
```

Authentication flow:
1. Token generation using client credentials
2. Automatic token refresh before expiry
3. Secure API requests with bearer tokens
4. Error handling for auth failures

### 3. Available Endpoints

The integration supports these main operations:

#### Cost Calculation
```typescript
// POST /print-job-cost-calculations/
const cost = await api.calculatePrintJobCost({
  line_items: [...],
  shipping_address: {...},
  shipping_level: 'MAIL'
});
```

#### Print Job Creation
```typescript
// POST /print-jobs/
const job = await api.createPrintJob({
  contact_email: 'user@example.com',
  line_items: [...],
  shipping_address: {...},
  shipping_level: 'MAIL'
});
```

#### Print Job Status
```typescript
// GET /print-jobs/{id}/
const status = await api.getPrintJob(id);
```

### 4. Product Specifications

Common product packages:
- `0600X0900BWSTDPB060UW444MXX`: 6" x 9" Black & White Paperback
- `0850X1100BWSTDPB060UW444MXX`: 8.5" x 11" Black & White Paperback
- `0600X0900FCSTDPB080CW444GXX`: 6" x 9" Full Color Paperback

Shipping levels:
- `MAIL`: Standard shipping
- `PRIORITY_MAIL`: Priority mail
- `GROUND`: Ground shipping
- `EXPEDITED`: 2-day delivery
- `EXPRESS`: Overnight delivery

## Component Structure

```
src/
├── components/
│   ├── LineItemForm.tsx      # Book details form
│   ├── PrintJobForm.tsx      # Main form container
│   └── ShippingAddressForm.tsx
├── lib/
│   └── api/
│       └── lulu.ts          # API client
└── app/
    └── page.tsx             # Main page
```

## Development

### Adding New Features

1. Follow the component-based architecture
2. Use TypeScript for type safety
3. Maintain UI consistency with Tailwind CSS
4. Keep components under 300 lines
5. Add descriptive comments for changes

### Code Style

- Use type hints consistently
- Follow single responsibility principle
- Keep functions short (under 20 lines)
- Use descriptive naming
- Remove unnecessary comments

## Production Deployment

1. Set up production environment variables
2. Build the application:
   ```bash
   npm run build
   ```
3. Start the production server:
   ```bash
   npm start
   ```

## Contributing

1. Follow the established code style
2. Test thoroughly
3. Document changes
4. Create descriptive pull requests

## License

MIT
