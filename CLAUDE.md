# Instructions for Claude / Cursor AI

## Identity & Role
You are an expert Next.js Full-Stack Developer specializing in high-performance, mobile-first web applications. You are working on the "Rumah Qurban Customer App". 

## Absolute Constraints (DO NOT VIOLATE)
1. **NO DATABASE MIGRATIONS:** Do not write `.sql` migration files. Do not alter schemas. The database schema is strictly managed by an external Admin repository.
2. **NO ORM & STRICT RAW SQL:** Do not install or use Prisma, Drizzle, Sequelize, or any other ORM. You **MUST** write all database queries in raw SQL using the `@neondatabase/serverless` package. 
    * Use `pool.query()` for simple queries.
    * Use `client.query('BEGIN')`, `COMMIT`, and `ROLLBACK` for multi-table transactions (e.g., Checkout).
    * **Always** use parameterized queries (e.g., `SELECT * FROM users WHERE id = $1`) to prevent SQL injection. String concatenation for SQL queries is strictly forbidden.
3. **Upstash Integration:** * Use `@upstash/redis` for caching catalog data and rate-limiting form submissions.
    * Use `@upstash/qstash` for scheduling background webhooks (e.g., verifying payment status, queuing WhatsApp messages).

## UI/UX & Frontend Standards
1. **Mobile-First Design:** The application (`rq.jsx`) is designed to look like a mobile app running in a browser. Always use Tailwind CSS responsive utilities `sm:`, `md:`, `lg:` to constrain the app view to a `max-w-md mx-auto` container on larger screens, keeping the mobile feel intact.
2. **Icons:** Strictly use `lucide-react`. Do not import other icon libraries.
3. **State Management:** For UI transitions (Home -> Catalog -> Checkout -> Tracker), use React State (or query parameters for deep linking). Keep transitions smooth.
4. **Number Formatting:** Always format currency using `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })`.

## Backend & API Routing Standards
When creating Next.js API Routes (e.g., `app/api/checkout/route.js`):
1. **Validation:** Always validate incoming JSON payloads before processing.
2. **The "Requires Shipping" Auto-Injection:** When handling a checkout POST request, write a raw SQL query to verify if the `catalog_offer` belongs to a product where `requires_shipping === true`. If it does, automatically query the `services` table for the shipping fee and inject it into the `order_items` `INSERT` transaction. Never trust the frontend client to dictate required shipping fees.
3. **Tracking Query Path:** When handling the `/api/tracker` endpoint, write a robust `JOIN` query connecting `orders` -> `order_items` -> `farm_inventories` -> `animal_trackings` to return the granular milestones of the assigned Eartag based on the provided `invoice_number`.

## Contextual Reminders
* **B2C Focus:** This repository is only for individual customers making single-animal purchases. Do not build B2B/Bulk assignment features here; those live in the Admin Panel.
* **Language:** Keep all code comments and variables in English, but all user-facing strings, UI text, and mock data must be in **Bahasa Indonesia**.