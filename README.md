# ClareBags

ClareBags is a refined e-commerce storefront for browsing and ordering leather bags. It uses a warm cream and burgundy visual system, responsive product grids, product detail pages, a persistent shopping cart, and an admin area for managing the collection.

## Features

- Editorial storefront homepage with ClareBags branding and collection call-to-action
- Product collection loaded from Supabase
- Responsive product cards with optimized remote images
- Product detail pages with variants and related products
- Cart drawer with quantity controls, item removal, persisted local cart data, and first-use guidance
- Paystack checkout flow
- WhatsApp order flow
- Password-protected admin panel for creating, editing, deleting, and updating product stock
- Admin orders view
- Responsive layouts for mobile, tablet, and desktop

## Tech Stack

- Next.js 16 App Router
- React 19 and TypeScript
- Supabase for product, order, and image data
- Paystack for online payments
- Tailwind CSS v4 and component-level CSS
- Vercel-ready production deployment

## Requirements

- Node.js 20 or newer recommended
- npm
- A Supabase project with the required tables and storage bucket
- Paystack public key for card payments

## Getting Started

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your-paystack-public-key
NEXT_PUBLIC_WHATSAPP_NUMBER=234XXXXXXXXXX

SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
ADMIN_PASSWORD=your-admin-password
```

The service role key and admin password are server-side secrets. Do not expose them with a `NEXT_PUBLIC_` prefix or commit them to source control.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

```bash
npm run dev      # Start the local development server
npm run lint     # Run ESLint
npm run build    # Create a production build
npm run start    # Start the production server
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | ClareBags homepage |
| `/shop` | In-stock product collection |
| `/shop/[slug]` | Product details and related products |
| `/admin` | Protected product management panel |
| `/admin/orders` | Protected order management view |

## Supabase Data

The storefront expects a `products` table with fields matching the `Product` type in `lib/types.ts`:

- `id`
- `name`
- `description`
- `price`
- `image_url`
- `category_id`
- `in_stock`
- `variants`

Orders are written to an `orders` table. Product images can be stored in the `product-images` Supabase Storage bucket. The bucket URL is allowed in `next.config.ts` for `next/image`.

## Admin Panel

Visit `/admin` and sign in with the value configured in `ADMIN_PASSWORD`. The admin panel uses the Supabase service role key for protected product and order operations. Keep this area behind a strong password and never expose the service role key to client-side code.

## Deployment

To deploy with Vercel:

1. Import the repository into Vercel.
2. Add all required environment variables in the Vercel project settings.
3. Use `npm run build` as the build command.
4. Deploy the project.

Before deploying, verify the production build locally:

```bash
npm run lint
npm run build
```

## Project Structure

```text
app/                 App Router pages and global styles
components/         Storefront, cart, checkout, and shared UI components
lib/                 Supabase client, cart context, types, and helpers
public/              Public static assets
```
