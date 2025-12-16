# FeatureMe Backend API

Backend API for the FeatureMe billboard platform built with TypeScript, Express.js, PostgreSQL, and Prisma.

## Features

- JWT Authentication with refresh tokens
- User Management
- Billboard Location Management
- Schedule/Calendar System with availability checking
- Media Upload to Cloudinary (images and videos)
- Template Management
- Plan/Pricing Management
- Complete Booking Workflow
- Stripe Payment Integration with webhooks
- WhatsApp Fallback Support
- User Dashboard with statistics

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. Set up Prisma:
```bash
npm run prisma:generate
npm run prisma:migrate
```

4. (Optional) Seed database with sample data:
```bash
npm run prisma:seed
```

5. Run development server:
```bash
npm run dev
```

## Environment Variables

Required environment variables (see `.env.example`):

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for access tokens
- `JWT_REFRESH_SECRET` - Secret for refresh tokens
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `WHATSAPP_NUMBER` - WhatsApp contact number
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS

## API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

### Quick Start

1. Register a user: `POST /api/auth/register`
2. Login: `POST /api/auth/login`
3. Get locations: `GET /api/locations`
4. Check availability: `GET /api/schedule/availability?locationId=...&date=...`
5. Upload media: `POST /api/upload` (multipart/form-data)
6. Create booking: `POST /api/bookings`
7. Create payment: `POST /api/payments/create-intent`
8. View dashboard: `GET /api/user/dashboard`

## Database Schema

The database includes the following models:
- User (with authentication)
- Location (billboard locations)
- Schedule (scheduled dates)
- Media (uploaded photos/videos)
- Template (billboard templates)
- Plan (pricing plans)
- Booking (complete booking workflow)
- Payment (payment records)
- RefreshToken (JWT refresh tokens)

## Project Structure

```
backend/
├── src/
│   ├── config/        # Configuration files
│   ├── controllers/  # Route controllers
│   ├── middleware/   # Express middleware
│   ├── routes/       # Route definitions
│   ├── services/     # Business logic
│   ├── utils/        # Utility functions
│   ├── types/        # TypeScript types
│   ├── app.ts        # Express app setup
│   └── server.ts     # Server entry point
├── prisma/
│   ├── schema.prisma # Database schema
│   └── seed.ts       # Database seed script
└── package.json
```

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## Notes

- All file uploads are stored in Cloudinary
- JWT access tokens expire after 24 hours
- Refresh tokens expire after 7 days
- Payment webhooks must be configured in Stripe dashboard
- WhatsApp fallback uses wa.me link format
- Booking status flow: DRAFT → PENDING_PAYMENT → PAYMENT_APPROVED → ACTIVE → COMPLETED

