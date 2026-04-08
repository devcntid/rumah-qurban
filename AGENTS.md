# Rumah Qurban - Customer App: AI Agent Blueprint

## 1. Project Context & Architecture
You are operating within the **Customer Application Repository** for "Rumah Qurban" (an E-commerce and ERP platform for sacrificial animals). 
* **This Repo:** Handles the B2C customer-facing mobile-first web app (Catalog, Cart, Checkout, Order Tracking, Documentation).
* **Admin Repo (External):** A completely separate repository handles the Admin Panel, offline B2B POS, and **Database Migrations**.
* **CRITICAL RULE:** **DO NOT** create, suggest, or modify database migration files (`.sql`, Prisma migrations, or Drizzle schema changes). Assume the database schema is fixed and managed externally. Your job is to interact with the existing schema via API routes.

## 2. Tech Stack
* **Framework:** Next.js (App Router / Pages Router based on current setup)
* **Styling:** Tailwind CSS, `lucide-react` for icons.
* **Database & Data Access:** PostgreSQL (Hosted on **Neon Serverless**). **STRICTLY NO ORM**. Do not use Prisma, Drizzle, TypeORM, or Sequelize. All database interactions must be written in **Raw SQL** using the `@neondatabase/serverless` package.
* **Caching & Rate Limiting:** **Upstash Redis** (use for caching catalog data, branches, and rate-limiting OTPs/Tracking checks).
* **Async Tasks & Queues:** **Upstash QStash** (use for triggering background webhook checks, sending async WhatsApp notification payloads, or delaying slaughter status updates).

## 3. Core Business Domain Rules

### 3.1. Products & The Pricing Matrix
The application sells 3 main product types, managed via a relational catalog matrix:
1. **QA (Qurban Antar):** Requires the user to select a `Branch` (e.g., Bandung Raya). Prices vary by branch, animal species, and weight class. `requires_shipping` is `TRUE`.
2. **QB (Qurban Berbagi):** Distributed to remote areas. Prices are National (Branch is `NULL`). `requires_shipping` is `FALSE`.
3. **QK (Qurban Kaleng):** Processed into canned food (Rendang/Kornet). Prices are National. `requires_shipping` is `FALSE`.

**Catalog Logic:**
Do not fetch directly from `products`. The frontend catalog is driven by the `catalog_offers` table, which joins `products`, `animal_variants`, and `branches`.

### 3.2. Order & Checkout Logic (B2C)
When processing an online checkout via Next.js API Routes:
1. Create a parent record in `orders` (`customer_type` = 'B2C', status = 'PENDING').
2. Insert the main animal into `order_items` (`item_type` = 'ANIMAL').
3. **Shipping Rule:** If the associated product has `requires_shipping = TRUE` (like Qurban Antar), the API **MUST automatically query** the `services` table for the shipping fee associated with that specific branch and animal variant, and append it as a second row in `order_items` (`item_type` = 'SERVICE'). The customer cannot opt-out of this.

### 3.3. Tracking & Documentation Logic
* **Tracking:** Customers track orders using their `invoice_number`. Physical tracking milestones are tied to the physical animal (`farm_inventories`), not the order. The API must trace: `Order` -> `Order Items` -> `Farm Inventory` -> `Animal Trackings`.
* **Documentation:** Certificates are order-level, but photos/videos are fetched from `slaughter_documentations` linked to the assigned `farm_inventories` Eartag.

## 4. API Design & Raw SQL Guidelines
* **Statelessness:** Ensure all Next.js API routes are stateless.
* **Raw SQL Only:** Use `pool.query('SELECT * FROM...')` for reads. 
* **Transactions:** When saving an order (inserting order + items + participants), you must acquire a client (`pool.connect()`) and wrap queries in `BEGIN`, `COMMIT`, and `ROLLBACK` blocks to ensure atomicity.
* **Security:** Always use parameterized queries (e.g., `$1, $2`) to prevent SQL injection.