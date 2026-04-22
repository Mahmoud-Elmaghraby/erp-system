-- CreateEnum
CREATE TYPE "sales"."SalesSettingsStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "core"."sales_settings"
  ADD COLUMN "orderSourceMandatory" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "defaultOrderSourceId" TEXT,
  ADD COLUMN "shippingOptionsEnabled" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "codFeeItemId" TEXT;

-- CreateTable
CREATE TABLE "sales"."sales_price_lists" (
  "id" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "status" "sales"."SalesSettingsStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "sales_price_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales"."sales_order_sources" (
  "id" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "status" "sales"."SalesSettingsStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "sales_order_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales"."sales_shipping_options" (
  "id" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "status" "sales"."SalesSettingsStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "sales_shipping_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales"."sales_price_offers" (
  "id" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "validFrom" TIMESTAMP(3),
  "validTo" TIMESTAMP(3),
  "requiredQty" INTEGER NOT NULL DEFAULT 0,
  "type" TEXT NOT NULL DEFAULT 'item-discount',
  "discountValue" DECIMAL(65,30) NOT NULL DEFAULT 0,
  "discountType" TEXT NOT NULL DEFAULT 'fixed',
  "customerScope" TEXT NOT NULL DEFAULT 'all',
  "unitType" TEXT NOT NULL DEFAULT 'all',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "sales_price_offers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sales_price_lists_companyId_name_key"
  ON "sales"."sales_price_lists"("companyId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "sales_order_sources_companyId_name_key"
  ON "sales"."sales_order_sources"("companyId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "sales_shipping_options_companyId_name_key"
  ON "sales"."sales_shipping_options"("companyId", "name");
