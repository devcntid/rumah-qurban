-- -------------------------------------------------------------
-- TablePlus 6.8.6(662)
--
-- https://tableplus.com/
--
-- Database: neondb
-- Generation Time: 2026-04-08 09:23:28.4560
-- -------------------------------------------------------------


DROP VIEW IF EXISTS "public"."view_spreadsheet_catalog";


DROP VIEW IF EXISTS "public"."target_vs_actual";


DROP VIEW IF EXISTS "public"."stock_by_branch_variant";


DROP TABLE IF EXISTS "public"."sales_agents";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS sales_agents_id_seq;

-- Table Definition
CREATE TABLE "public"."sales_agents" (
    "id" int8 NOT NULL DEFAULT nextval('sales_agents_id_seq'::regclass),
    "name" varchar(100) NOT NULL,
    "category" varchar(50) NOT NULL,
    "phone" varchar(20) NOT NULL,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."payment_methods";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS payment_methods_id_seq;

-- Table Definition
CREATE TABLE "public"."payment_methods" (
    "id" int8 NOT NULL DEFAULT nextval('payment_methods_id_seq'::regclass),
    "code" varchar(50) NOT NULL,
    "name" varchar(100) NOT NULL,
    "category" varchar(50) NOT NULL,
    "coa_code" varchar(50),
    "is_active" bool DEFAULT true,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."payment_instructions";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS payment_instructions_id_seq;

-- Table Definition
CREATE TABLE "public"."payment_instructions" (
    "id" int8 NOT NULL DEFAULT nextval('payment_instructions_id_seq'::regclass),
    "payment_method_code" varchar(50) NOT NULL,
    "channel" varchar(50) NOT NULL,
    "instruction_steps" text NOT NULL,
    "is_active" bool DEFAULT true,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."branches";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS branches_id_seq;

-- Table Definition
CREATE TABLE "public"."branches" (
    "id" int8 NOT NULL DEFAULT nextval('branches_id_seq'::regclass),
    "name" varchar(100) NOT NULL,
    "coa_code" varchar(50),
    "is_active" bool DEFAULT true,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."vendors";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS vendors_id_seq;

-- Table Definition
CREATE TABLE "public"."vendors" (
    "id" int8 NOT NULL DEFAULT nextval('vendors_id_seq'::regclass),
    "name" varchar(100) NOT NULL,
    "location" text,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."notif_templates";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS notif_templates_id_seq;

-- Table Definition
CREATE TABLE "public"."notif_templates" (
    "id" int8 NOT NULL DEFAULT nextval('notif_templates_id_seq'::regclass),
    "name" varchar(100) NOT NULL,
    "template_text" text NOT NULL,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."zains_logs";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS zains_logs_id_seq;

-- Table Definition
CREATE TABLE "public"."zains_logs" (
    "id" int8 NOT NULL DEFAULT nextval('zains_logs_id_seq'::regclass),
    "endpoint" varchar(255) NOT NULL,
    "method" varchar(10) NOT NULL,
    "payload" jsonb,
    "response" jsonb,
    "status_code" int4,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."sales_targets";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS sales_targets_id_seq;

-- Table Definition
CREATE TABLE "public"."sales_targets" (
    "id" int8 NOT NULL DEFAULT nextval('sales_targets_id_seq'::regclass),
    "branch_id" int8 NOT NULL,
    "year" int4 NOT NULL,
    "season" varchar(50),
    "species" varchar(50) NOT NULL,
    "category" varchar(20) NOT NULL,
    "target_ekor" int4 NOT NULL DEFAULT 0,
    "target_omset" numeric(15,2) NOT NULL DEFAULT 0,
    "target_hpp" numeric(15,2) NOT NULL DEFAULT 0,
    "notes" text,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."products";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS products_id_seq;

-- Table Definition
CREATE TABLE "public"."products" (
    "id" int8 NOT NULL DEFAULT nextval('products_id_seq'::regclass),
    "code" varchar(20) NOT NULL,
    "name" varchar(100) NOT NULL,
    "requires_shipping" bool DEFAULT false,
    "coa_code" varchar(50),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."catalog_offers";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS catalog_offers_id_seq;

-- Table Definition
CREATE TABLE "public"."catalog_offers" (
    "id" int8 NOT NULL DEFAULT nextval('catalog_offers_id_seq'::regclass),
    "product_id" int8,
    "animal_variant_id" int8,
    "branch_id" int8,
    "vendor_id" int8,
    "display_name" varchar(255) NOT NULL,
    "sub_type" varchar(50),
    "sku_code" varchar(50),
    "projected_weight" varchar(50),
    "price" numeric(15,2) NOT NULL,
    "image_url" text,
    "is_active" bool DEFAULT true,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."animal_variants";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS animal_variants_id_seq;

-- Table Definition
CREATE TABLE "public"."animal_variants" (
    "id" int8 NOT NULL DEFAULT nextval('animal_variants_id_seq'::regclass),
    "species" varchar(50) NOT NULL,
    "class_grade" varchar(10),
    "weight_range" varchar(50),
    "description" text,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."services";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS services_id_seq;

-- Table Definition
CREATE TABLE "public"."services" (
    "id" int8 NOT NULL DEFAULT nextval('services_id_seq'::regclass),
    "name" varchar(100) NOT NULL,
    "service_type" varchar(50) NOT NULL,
    "base_price" numeric(15,2) NOT NULL,
    "branch_id" int8,
    "animal_variant_id" int8,
    "coa_code" varchar(50),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."orders";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS orders_id_seq;

-- Table Definition
CREATE TABLE "public"."orders" (
    "id" int8 NOT NULL DEFAULT nextval('orders_id_seq'::regclass),
    "invoice_number" varchar(50) NOT NULL,
    "branch_id" int8,
    "sales_agent_id" int8,
    "customer_type" varchar(10) DEFAULT 'B2C'::character varying,
    "customer_name" varchar(150) NOT NULL,
    "company_name" varchar(150),
    "customer_phone" varchar(20),
    "customer_email" varchar(100),
    "delivery_address" text,
    "latitude" numeric(10,8),
    "longitude" numeric(11,8),
    "subtotal" numeric(15,2) NOT NULL,
    "discount" numeric(15,2) DEFAULT 0,
    "grand_total" numeric(15,2) NOT NULL,
    "dp_paid" numeric(15,2) DEFAULT 0,
    "remaining_balance" numeric(15,2) NOT NULL,
    "status" varchar(50) DEFAULT 'PENDING'::character varying,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."order_items";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS order_items_id_seq;

-- Table Definition
CREATE TABLE "public"."order_items" (
    "id" int8 NOT NULL DEFAULT nextval('order_items_id_seq'::regclass),
    "order_id" int8 NOT NULL,
    "item_type" varchar(20) NOT NULL,
    "catalog_offer_id" int8,
    "service_id" int8,
    "item_name" varchar(255) NOT NULL,
    "quantity" int4 NOT NULL DEFAULT 1,
    "unit_price" numeric(15,2) NOT NULL,
    "total_price" numeric(15,2) NOT NULL,
    "coa_code" varchar(50),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."order_participants";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS order_participants_id_seq;

-- Table Definition
CREATE TABLE "public"."order_participants" (
    "id" int8 NOT NULL DEFAULT nextval('order_participants_id_seq'::regclass),
    "order_item_id" int8 NOT NULL,
    "participant_name" varchar(150) NOT NULL,
    "father_name" varchar(150),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."farm_inventories";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS farm_inventories_id_seq;

-- Table Definition
CREATE TABLE "public"."farm_inventories" (
    "id" int8 NOT NULL DEFAULT nextval('farm_inventories_id_seq'::regclass),
    "eartag_id" varchar(50) NOT NULL,
    "animal_variant_id" int8,
    "branch_id" int8,
    "vendor_id" int8,
    "weight_actual" numeric(6,2),
    "photo_url" text,
    "status" varchar(50) DEFAULT 'AVAILABLE'::character varying,
    "order_item_id" int8,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."inventory_allocations";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS inventory_allocations_id_seq;

-- Table Definition
CREATE TABLE "public"."inventory_allocations" (
    "id" int8 NOT NULL DEFAULT nextval('inventory_allocations_id_seq'::regclass),
    "order_item_id" int8 NOT NULL,
    "farm_inventory_id" int8 NOT NULL,
    "allocated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."animal_trackings";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS animal_trackings_id_seq;

-- Table Definition
CREATE TABLE "public"."animal_trackings" (
    "id" int8 NOT NULL DEFAULT nextval('animal_trackings_id_seq'::regclass),
    "farm_inventory_id" int8 NOT NULL,
    "milestone" varchar(50) NOT NULL,
    "description" text,
    "location_lat" numeric(10,8),
    "location_lng" numeric(11,8),
    "media_url" text,
    "logged_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."logistics_trips";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS logistics_trips_id_seq;

-- Table Definition
CREATE TABLE "public"."logistics_trips" (
    "id" int8 NOT NULL DEFAULT nextval('logistics_trips_id_seq'::regclass),
    "branch_id" int8,
    "vehicle_plate" varchar(20) NOT NULL,
    "driver_name" varchar(100) NOT NULL,
    "scheduled_date" date NOT NULL,
    "status" varchar(50) DEFAULT 'PREPARING'::character varying,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."delivery_manifests";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS delivery_manifests_id_seq;

-- Table Definition
CREATE TABLE "public"."delivery_manifests" (
    "id" int8 NOT NULL DEFAULT nextval('delivery_manifests_id_seq'::regclass),
    "trip_id" int8 NOT NULL,
    "farm_inventory_id" int8,
    "destination_address" text,
    "destination_lat" numeric(10,8),
    "destination_lng" numeric(11,8),
    "delivery_status" varchar(50) DEFAULT 'PENDING'::character varying,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."transactions";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS transactions_id_seq;

-- Table Definition
CREATE TABLE "public"."transactions" (
    "id" int8 NOT NULL DEFAULT nextval('transactions_id_seq'::regclass),
    "order_id" int8,
    "payment_method_code" varchar(50),
    "transaction_type" varchar(50) DEFAULT 'PELUNASAN'::character varying,
    "amount" numeric(15,2) NOT NULL,
    "va_number" varchar(50),
    "qr_code_url" text,
    "status" varchar(50) DEFAULT 'PENDING'::character varying,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."payment_receipts";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS payment_receipts_id_seq;

-- Table Definition
CREATE TABLE "public"."payment_receipts" (
    "id" int8 NOT NULL DEFAULT nextval('payment_receipts_id_seq'::regclass),
    "transaction_id" int8,
    "file_url" text NOT NULL,
    "status" varchar(50) DEFAULT 'PENDING'::character varying,
    "verifier_notes" text,
    "uploaded_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "verified_at" timestamp,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."payment_logs";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS payment_logs_id_seq;

-- Table Definition
CREATE TABLE "public"."payment_logs" (
    "id" int8 NOT NULL DEFAULT nextval('payment_logs_id_seq'::regclass),
    "transaction_id" int8 NOT NULL,
    "reference_id" varchar(100),
    "log_type" varchar(50),
    "payload" jsonb,
    "response" jsonb,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."notif_logs";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS notif_logs_id_seq;

-- Table Definition
CREATE TABLE "public"."notif_logs" (
    "id" int8 NOT NULL DEFAULT nextval('notif_logs_id_seq'::regclass),
    "order_id" int8,
    "template_id" int8,
    "target_number" varchar(20) NOT NULL,
    "status" varchar(50) NOT NULL,
    "payload" jsonb,
    "provider_response" jsonb,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

INSERT INTO "public"."sales_agents" ("id", "name", "category", "phone", "created_at") VALUES
(1, 'Agro Great Indoberkah', 'KEMITRAAN', '08123456789', '2026-04-07 12:45:34.174551'),
(2, 'Tim Telemarketing Internal', 'INTERNAL', '0000000000', '2026-04-07 12:45:34.174551');

INSERT INTO "public"."payment_methods" ("id", "code", "name", "category", "coa_code", "is_active", "created_at") VALUES
(1, 'CASH', 'Tunai / Cash', 'OFFLINE_CASH', NULL, 't', '2026-04-07 12:45:34.298696'),
(2, 'TF_MANDIRI', 'Transfer Bank Mandiri', 'MANUAL_TRANSFER', '110-10-101', 't', '2026-04-07 12:45:34.298696'),
(3, 'XENDIT_VA_MANDIRI', 'Virtual Account Mandiri', 'VIRTUAL_ACCOUNT', NULL, 't', '2026-04-07 12:45:34.298696'),
(4, 'XENDIT_QRIS', 'QRIS Dinamis', 'EWALLET', NULL, 't', '2026-04-07 12:45:34.298696');

INSERT INTO "public"."payment_instructions" ("id", "payment_method_code", "channel", "instruction_steps", "is_active", "created_at") VALUES
(1, 'TF_MANDIRI', 'ATM', '1. Masukkan Kartu ATM
2. Pilih Transfer -> Antar Rekening
3. Masukkan Rekening 1310007965835', 't', '2026-04-07 12:45:34.336945'),
(2, 'TF_MANDIRI', 'MBANKING', '1. Buka Livin by Mandiri
2. Pilih Transfer ke Sesama
3. Masukkan Rek 1310007965835', 't', '2026-04-07 12:45:34.336945'),
(3, 'XENDIT_VA_MANDIRI', 'ATM', '1. Masukkan Kartu ATM
2. Pilih Bayar/Beli -> Multipayment
3. Masukkan Kode VA {{va_number}}', 't', '2026-04-07 12:45:34.336945'),
(4, 'XENDIT_VA_MANDIRI', 'MBANKING', '1. Buka Aplikasi m-Banking
2. Pilih Bayar -> Multipayment
3. Masukkan Kode VA {{va_number}}', 't', '2026-04-07 12:45:34.336945'),
(5, 'XENDIT_QRIS', 'ALL', '1. Buka Aplikasi e-Wallet / m-Banking
2. Pilih Scan QR
3. Scan QR di layar.', 't', '2026-04-07 12:45:34.336945');

INSERT INTO "public"."branches" ("id", "name", "coa_code", "is_active") VALUES
(1, 'Bandung Raya', '400-10-101', 't'),
(2, 'Jakarta Raya', '400-10-104', 't'),
(22, 'Bogor', '400-10-102', 't'),
(30, 'Cilegon', '400-10-103', 't'),
(46, 'Cirebon', NULL, 't'),
(61, 'Padang', NULL, 't'),
(69, 'Palembang', NULL, 't'),
(77, 'Semarang', '400-10-105', 't'),
(89, 'Solo', '400-10-106', 't'),
(103, 'Surabaya', NULL, 't'),
(107, 'Tangerang Raya', NULL, 't'),
(111, 'Yogyakarta', NULL, 't'),
(115, 'kupang', NULL, 't'),
(116, 'bojonegoro', NULL, 't'),
(117, 'brebes', NULL, 't');

INSERT INTO "public"."vendors" ("id", "name", "location") VALUES
(1, 'Farm Agrosurya', 'Bandung'),
(2, 'Vendor Nasional', 'Indonesia');

INSERT INTO "public"."notif_templates" ("id", "name", "template_text", "created_at") VALUES
(1, 'DP_RECEIVED', 'Halo {{name}}, DP untuk {{invoice}} telah kami terima.', '2026-05-25 14:01:00');

INSERT INTO "public"."sales_targets" ("id", "branch_id", "year", "season", "species", "category", "target_ekor", "target_omset", "target_hpp", "notes", "created_at", "updated_at") VALUES
(1, 1, 2026, 'RAMADAN', 'DOMBA', 'QA', 600, 6000000000.00, 4200000000.00, 'Target QA domba cabang Bandung', '2026-04-07 13:21:12.054376', '2026-04-08 01:46:58.376661'),
(2, 1, 2026, 'RAMADAN', 'SAPI', 'QB', 80, 136000000.00, 104000000.00, 'Target QB sapi cabang Bandung', '2026-04-07 13:21:12.054376', '2026-04-08 01:46:58.376661'),
(3, 2, 2026, 'RAMADAN', 'DOMBA', 'QA', 400, 5200000000.00, 3600000000.00, 'Target QA domba cabang Jakarta', '2026-04-07 13:21:12.054376', '2026-04-08 01:46:58.376661'),
(4, 2, 2026, 'RAMADAN', 'SAPI', 'QB', 60, 102000000.00, 78000000.00, 'Target QB sapi cabang Jakarta', '2026-04-07 13:21:12.054376', '2026-04-08 01:46:58.376661');

INSERT INTO "public"."products" ("id", "code", "name", "requires_shipping", "coa_code") VALUES
(1, 'QA', 'Qurban Antar', 't', NULL),
(2, 'QK', 'Qurban Kaleng', 'f', NULL),
(3, 'QB', 'Qurban Berbagi', 'f', NULL);

INSERT INTO "public"."catalog_offers" ("id", "product_id", "animal_variant_id", "branch_id", "vendor_id", "display_name", "sub_type", "sku_code", "projected_weight", "price", "image_url", "is_active") VALUES
(1, 1, 1, 1, 1, 'Qurban Antar Sapi Jawa', NULL, '0231', '308 Kg', 22000000.00, 'https://example.com/sapi-a.png', 't'),
(2, 1, 2, 1, 1, 'Qurban Antar Sapi Jawa', NULL, '0207', '340 Kg', 26000000.00, 'https://example.com/sapi-b.png', 't'),
(3, 1, 3, 1, 1, 'Qurban Antar Domba Jantan Tanduk', NULL, NULL, '28 Kg', 3100000.00, 'https://example.com/domba-a.jpg', 't'),
(4, 2, 6, 1, NULL, 'Qurban Kaleng Rendang Domba', 'rendang', NULL, NULL, 2500000.00, 'https://example.com/rendang-domba.jpg', 't'),
(5, 2, 5, 1, NULL, 'Qurban Kaleng Rendang Sapi', 'rendang', NULL, NULL, 18000000.00, 'https://example.com/rendang-sapi.jpg', 't'),
(6, 3, 5, NULL, NULL, 'Qurban Berbagi Sapi di Desa Oebufu Kupang', NULL, NULL, NULL, 17000000.00, 'https://example.com/kupang.jpg', 't'),
(7, 3, 6, NULL, NULL, 'Qurban Berbagi Domba Kambing Di Desa Dukuh Turi', NULL, NULL, NULL, 2500000.00, 'https://example.com/brebes.jpg', 't'),
(8, 1, 4, 1, 1, 'Qurban Antar Domba Tipe B (Bandung)', NULL, NULL, '23 - 26 Kg', 2100000.00, NULL, 't');

INSERT INTO "public"."animal_variants" ("id", "species", "class_grade", "weight_range", "description") VALUES
(1, 'Sapi', 'A', '250 - 300 Kg', NULL),
(2, 'Sapi', 'B', '310 - 350 Kg', NULL),
(3, 'Domba', 'A', '27 - 30 Kg', NULL),
(4, 'Domba', 'B', '23 - 26 Kg', NULL),
(5, 'Sapi', '-', '-', 'Generic kaleng/berbagi'),
(6, 'Domba', '-', '-', 'Generic kaleng/berbagi');

INSERT INTO "public"."services" ("id", "name", "service_type", "base_price", "branch_id", "animal_variant_id", "coa_code") VALUES
(1, 'Ongkos Kirim Domba Area Bandung', 'SHIPPING', 50000.00, 1, 4, '400-40-101'),
(2, 'Ongkos Kirim Sapi Area Bandung', 'SHIPPING', 250000.00, 1, 1, '400-40-102'),
(3, 'Jasa Potong & Cacah Sapi', 'SLAUGHTER', 1000000.00, NULL, 1, '400-50-101');

INSERT INTO "public"."orders" ("id", "invoice_number", "branch_id", "sales_agent_id", "customer_type", "customer_name", "company_name", "customer_phone", "customer_email", "delivery_address", "latitude", "longitude", "subtotal", "discount", "grand_total", "dp_paid", "remaining_balance", "status", "created_at") VALUES
(1, 'INV-B2B-001', 1, NULL, 'B2B', 'Bpk. Ahmad', 'PT. Telkom', NULL, NULL, NULL, NULL, NULL, 107000000.00, 0.00, 107000000.00, 50000000.00, 57000000.00, 'DP_PAID', '2026-05-20 10:00:00'),
(2, 'INV-WEB-001', 1, NULL, 'B2C', 'Lili Apriliyani', NULL, '081317854742', NULL, NULL, NULL, NULL, 3150000.00, 0.00, 3150000.00, 3150000.00, 0.00, 'FULL_PAID', '2026-05-21 11:00:00');

INSERT INTO "public"."order_items" ("id", "order_id", "item_type", "catalog_offer_id", "service_id", "item_name", "quantity", "unit_price", "total_price", "coa_code") VALUES
(1, 1, 'ANIMAL', 8, NULL, 'Domba Tipe B (Bandung)', 50, 2100000.00, 105000000.00, NULL),
(2, 1, 'CUSTOM', NULL, NULL, 'Sewa Truk Fuso B2B', 1, 2000000.00, 2000000.00, NULL),
(3, 2, 'ANIMAL', 3, NULL, 'Domba Tipe A', 1, 3100000.00, 3100000.00, NULL),
(4, 2, 'SERVICE', NULL, 1, 'Ongkos Kirim Domba Area Bandung', 1, 50000.00, 50000.00, NULL);

INSERT INTO "public"."order_participants" ("id", "order_item_id", "participant_name", "father_name") VALUES
(1, 3, 'Lili Apriliyani', 'Doddy Sebo');

INSERT INTO "public"."farm_inventories" ("id", "eartag_id", "animal_variant_id", "branch_id", "vendor_id", "weight_actual", "photo_url", "status", "order_item_id", "created_at") VALUES
(1, 'TAG-1001', 4, 1, 1, 24.50, NULL, 'AVAILABLE', NULL, '2026-05-01 08:00:00'),
(2, 'TAG-1002', 4, 1, 1, 25.10, NULL, 'AVAILABLE', NULL, '2026-05-01 08:00:00'),
(3, 'TAG-1003', 4, 1, 1, 23.80, NULL, 'AVAILABLE', NULL, '2026-05-01 08:00:00');

INSERT INTO "public"."animal_trackings" ("id", "farm_inventory_id", "milestone", "description", "location_lat", "location_lng", "media_url", "logged_at") VALUES
(1, 1, 'DOCUMENTATION', 'Foto inventaris', NULL, NULL, 'https://blob.example.com/tag-1001.jpg', '2026-05-01 09:00:00');

INSERT INTO "public"."transactions" ("id", "order_id", "payment_method_code", "transaction_type", "amount", "va_number", "qr_code_url", "status", "created_at") VALUES
(1, 1, 'TF_MANDIRI', 'DP', 50000000.00, NULL, NULL, 'VERIFIED', '2026-05-20 10:30:00'),
(2, 2, 'XENDIT_VA_MANDIRI', 'PELUNASAN', 3150000.00, NULL, NULL, 'SUCCESS', '2026-05-21 11:05:00');

CREATE VIEW "public"."view_spreadsheet_catalog" AS ;
CREATE VIEW "public"."target_vs_actual" AS ;
CREATE VIEW "public"."stock_by_branch_variant" AS ;


-- Indices
CREATE UNIQUE INDEX sales_agents_name_uniq ON public.sales_agents USING btree (name);


-- Indices
CREATE UNIQUE INDEX payment_methods_code_key ON public.payment_methods USING btree (code);
ALTER TABLE "public"."payment_instructions" ADD FOREIGN KEY ("payment_method_code") REFERENCES "public"."payment_methods"("code") ON DELETE CASCADE;


-- Indices
CREATE UNIQUE INDEX payment_instructions_method_channel_uniq ON public.payment_instructions USING btree (payment_method_code, channel);


-- Indices
CREATE UNIQUE INDEX branches_name_uniq ON public.branches USING btree (name);


-- Indices
CREATE UNIQUE INDEX vendors_name_uniq ON public.vendors USING btree (name);


-- Indices
CREATE UNIQUE INDEX notif_templates_name_key ON public.notif_templates USING btree (name);
ALTER TABLE "public"."sales_targets" ADD FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");


-- Indices
CREATE UNIQUE INDEX sales_targets_branch_year_species_category_uniq ON public.sales_targets USING btree (branch_id, year, species, category);
CREATE INDEX idx_sales_targets_branch_year ON public.sales_targets USING btree (branch_id, year);
CREATE INDEX idx_sales_targets_species_category ON public.sales_targets USING btree (species, category);


-- Indices
CREATE UNIQUE INDEX products_code_key ON public.products USING btree (code);
ALTER TABLE "public"."catalog_offers" ADD FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");
ALTER TABLE "public"."catalog_offers" ADD FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id");
ALTER TABLE "public"."catalog_offers" ADD FOREIGN KEY ("animal_variant_id") REFERENCES "public"."animal_variants"("id");
ALTER TABLE "public"."catalog_offers" ADD FOREIGN KEY ("product_id") REFERENCES "public"."products"("id");


-- Indices
CREATE UNIQUE INDEX catalog_offers_product_id_animal_variant_id_branch_id_sub_t_key ON public.catalog_offers USING btree (product_id, animal_variant_id, branch_id, sub_type) NULLS NOT DISTINCT;
CREATE INDEX idx_catalog_offers_branch ON public.catalog_offers USING btree (branch_id);
CREATE INDEX idx_catalog_offers_product ON public.catalog_offers USING btree (product_id);
ALTER TABLE "public"."services" ADD FOREIGN KEY ("animal_variant_id") REFERENCES "public"."animal_variants"("id");
ALTER TABLE "public"."services" ADD FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");


-- Indices
CREATE INDEX idx_services_branch ON public.services USING btree (branch_id);
ALTER TABLE "public"."orders" ADD FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");
ALTER TABLE "public"."orders" ADD FOREIGN KEY ("sales_agent_id") REFERENCES "public"."sales_agents"("id");


-- Indices
CREATE UNIQUE INDEX orders_invoice_number_key ON public.orders USING btree (invoice_number);
CREATE INDEX idx_orders_branch_id ON public.orders USING btree (branch_id);
ALTER TABLE "public"."order_items" ADD FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE;
ALTER TABLE "public"."order_items" ADD FOREIGN KEY ("service_id") REFERENCES "public"."services"("id");
ALTER TABLE "public"."order_items" ADD FOREIGN KEY ("catalog_offer_id") REFERENCES "public"."catalog_offers"("id");


-- Indices
CREATE INDEX idx_order_items_order_id ON public.order_items USING btree (order_id);
CREATE INDEX idx_order_items_catalog_offer_id ON public.order_items USING btree (catalog_offer_id);
CREATE INDEX idx_order_items_service_id ON public.order_items USING btree (service_id);
ALTER TABLE "public"."order_participants" ADD FOREIGN KEY ("order_item_id") REFERENCES "public"."order_items"("id") ON DELETE CASCADE;


-- Indices
CREATE INDEX idx_order_participants_order_item_id ON public.order_participants USING btree (order_item_id);
ALTER TABLE "public"."farm_inventories" ADD FOREIGN KEY ("animal_variant_id") REFERENCES "public"."animal_variants"("id");
ALTER TABLE "public"."farm_inventories" ADD FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id");
ALTER TABLE "public"."farm_inventories" ADD FOREIGN KEY ("order_item_id") REFERENCES "public"."order_items"("id");
ALTER TABLE "public"."farm_inventories" ADD FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");


-- Indices
CREATE UNIQUE INDEX farm_inventories_eartag_id_key ON public.farm_inventories USING btree (eartag_id);
CREATE INDEX idx_farm_inv_branch ON public.farm_inventories USING btree (branch_id);
CREATE INDEX idx_farm_inv_variant ON public.farm_inventories USING btree (animal_variant_id);
CREATE INDEX idx_farm_inv_status ON public.farm_inventories USING btree (status);
ALTER TABLE "public"."inventory_allocations" ADD FOREIGN KEY ("order_item_id") REFERENCES "public"."order_items"("id") ON DELETE CASCADE;
ALTER TABLE "public"."inventory_allocations" ADD FOREIGN KEY ("farm_inventory_id") REFERENCES "public"."farm_inventories"("id") ON DELETE CASCADE;


-- Indices
CREATE UNIQUE INDEX inventory_allocations_farm_inventory_id_key ON public.inventory_allocations USING btree (farm_inventory_id);
CREATE INDEX idx_inventory_allocations_order_item ON public.inventory_allocations USING btree (order_item_id);
ALTER TABLE "public"."animal_trackings" ADD FOREIGN KEY ("farm_inventory_id") REFERENCES "public"."farm_inventories"("id") ON DELETE CASCADE;


-- Indices
CREATE INDEX idx_animal_trackings_farm_inv ON public.animal_trackings USING btree (farm_inventory_id);
ALTER TABLE "public"."logistics_trips" ADD FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");
ALTER TABLE "public"."delivery_manifests" ADD FOREIGN KEY ("trip_id") REFERENCES "public"."logistics_trips"("id") ON DELETE CASCADE;
ALTER TABLE "public"."delivery_manifests" ADD FOREIGN KEY ("farm_inventory_id") REFERENCES "public"."farm_inventories"("id");


-- Indices
CREATE INDEX idx_delivery_manifests_trip ON public.delivery_manifests USING btree (trip_id);
ALTER TABLE "public"."transactions" ADD FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id");
ALTER TABLE "public"."transactions" ADD FOREIGN KEY ("payment_method_code") REFERENCES "public"."payment_methods"("code");


-- Indices
CREATE INDEX idx_transactions_order_id ON public.transactions USING btree (order_id);
ALTER TABLE "public"."payment_receipts" ADD FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id");
ALTER TABLE "public"."payment_logs" ADD FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE CASCADE;


-- Indices
CREATE INDEX idx_payment_logs_transaction_id ON public.payment_logs USING btree (transaction_id);
CREATE INDEX idx_payment_logs_reference_id ON public.payment_logs USING btree (reference_id);
ALTER TABLE "public"."notif_logs" ADD FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE SET NULL;
ALTER TABLE "public"."notif_logs" ADD FOREIGN KEY ("template_id") REFERENCES "public"."notif_templates"("id");


-- Indices
CREATE INDEX idx_notif_logs_order_id ON public.notif_logs USING btree (order_id);
CREATE INDEX idx_notif_logs_target_number ON public.notif_logs USING btree (target_number);
