-- Add new customer fields for the sales customer page
ALTER TABLE "sales"."customers"
  ADD COLUMN IF NOT EXISTS "code" TEXT,
  ADD COLUMN IF NOT EXISTS "nationalId" TEXT,
  ADD COLUMN IF NOT EXISTS "taxNumber" TEXT;

-- Backfill a deterministic unique customer code for existing rows
UPDATE "sales"."customers"
SET "code" = 'CUST-' || UPPER(REPLACE("id", '-', ''))
WHERE "code" IS NULL;

-- Make customer code required and unique
ALTER TABLE "sales"."customers"
  ALTER COLUMN "code" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "customers_code_key"
  ON "sales"."customers"("code");
