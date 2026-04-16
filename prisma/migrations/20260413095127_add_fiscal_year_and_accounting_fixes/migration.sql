-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "accounting";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "core";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "inventory";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "logistics";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "purchasing";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "sales";

-- CreateEnum
CREATE TYPE "inventory"."StockMovementType" AS ENUM ('IN', 'OUT', 'TRANSFER', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "sales"."QuotationStatus" AS ENUM ('DRAFT', 'SENT', 'CONFIRMED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "sales"."DeliveryStatus" AS ENUM ('DRAFT', 'CONFIRMED', 'DONE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "sales"."SalesPaymentMethod" AS ENUM ('CASH', 'BANK_TRANSFER', 'CHEQUE', 'CARD');

-- CreateEnum
CREATE TYPE "sales"."SalesReturnStatus" AS ENUM ('DRAFT', 'CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "sales"."SalesOrderStatus" AS ENUM ('DRAFT', 'CONFIRMED', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "sales"."InvoiceStatus" AS ENUM ('UNPAID', 'PAID', 'PARTIAL', 'CANCELLED');

-- CreateEnum
CREATE TYPE "purchasing"."RFQStatus" AS ENUM ('DRAFT', 'SENT', 'CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "purchasing"."PurchaseReturnStatus" AS ENUM ('DRAFT', 'CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "purchasing"."PurchaseOrderStatus" AS ENUM ('DRAFT', 'CONFIRMED', 'PARTIALLY_RECEIVED', 'FULLY_RECEIVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "purchasing"."VendorBillStatus" AS ENUM ('UNPAID', 'PAID', 'PARTIAL', 'CANCELLED');

-- CreateEnum
CREATE TYPE "purchasing"."PurchasePaymentMethod" AS ENUM ('CASH', 'BANK_TRANSFER', 'CHEQUE', 'CARD');

-- CreateEnum
CREATE TYPE "accounting"."FiscalYearStatus" AS ENUM ('OPEN', 'CLOSED', 'LOCKED');

-- CreateEnum
CREATE TYPE "accounting"."FiscalPeriodStatus" AS ENUM ('OPEN', 'SOFT_LOCKED', 'HARD_LOCKED');

-- CreateEnum
CREATE TYPE "accounting"."NormalBalance" AS ENUM ('DEBIT', 'CREDIT');

-- CreateEnum
CREATE TYPE "accounting"."AccountType" AS ENUM ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE', 'COGS', 'BANK', 'CASH', 'RECEIVABLE', 'PAYABLE');

-- CreateEnum
CREATE TYPE "accounting"."JournalType" AS ENUM ('SALE', 'PURCHASE', 'CASH', 'BANK', 'GENERAL');

-- CreateEnum
CREATE TYPE "accounting"."JournalEntryState" AS ENUM ('DRAFT', 'POSTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "accounting"."JournalEntrySource" AS ENUM ('INVOICE', 'VENDOR_BILL', 'PAYMENT', 'VENDOR_PAYMENT', 'STOCK_VALUATION', 'MANUAL');

-- CreateEnum
CREATE TYPE "accounting"."PartnerType" AS ENUM ('CUSTOMER', 'SUPPLIER');

-- CreateEnum
CREATE TYPE "accounting"."TaxType" AS ENUM ('PERCENTAGE', 'FIXED', 'NONE');

-- CreateEnum
CREATE TYPE "accounting"."TaxScope" AS ENUM ('SALES', 'PURCHASES', 'BOTH');

-- CreateEnum
CREATE TYPE "logistics"."ShipmentStatus" AS ENUM ('DRAFT', 'CONFIRMED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED');

-- CreateTable
CREATE TABLE "core"."companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."branches" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT NOT NULL,
    "branchId" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."permissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "module" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."user_roles" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."role_permissions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."outbox_events" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "outbox_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."company_settings" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "defaultCurrency" TEXT NOT NULL DEFAULT 'EGP',
    "fiscalYearStart" INTEGER NOT NULL DEFAULT 1,
    "taxIncludedInPrice" BOOLEAN NOT NULL DEFAULT false,
    "salesOrderPrefix" TEXT NOT NULL DEFAULT 'SO',
    "purchaseOrderPrefix" TEXT NOT NULL DEFAULT 'PO',
    "invoicePrefix" TEXT NOT NULL DEFAULT 'INV',
    "receiptPrefix" TEXT NOT NULL DEFAULT 'REC',
    "billPrefix" TEXT NOT NULL DEFAULT 'BILL',
    "quotationPrefix" TEXT NOT NULL DEFAULT 'QUO',
    "rfqPrefix" TEXT NOT NULL DEFAULT 'RFQ',
    "deliveryPrefix" TEXT NOT NULL DEFAULT 'DEL',
    "returnPrefix" TEXT NOT NULL DEFAULT 'RET',
    "shipmentPrefix" TEXT NOT NULL DEFAULT 'SHP',
    "country" TEXT NOT NULL DEFAULT 'EG',
    "taxRegNumber" TEXT,
    "commercialReg" TEXT,
    "activityCode" TEXT,
    "etaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "etaClientId" TEXT,
    "etaClientSecret" TEXT,
    "etaEnvironment" TEXT NOT NULL DEFAULT 'sandbox',
    "zatcaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "zatcaCSID" TEXT,
    "zatcaEnvironment" TEXT NOT NULL DEFAULT 'sandbox',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."currencies" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isBase" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."exchange_rates" (
    "id" TEXT NOT NULL,
    "rate" DECIMAL(65,30) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currencyId" TEXT NOT NULL,

    CONSTRAINT "exchange_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."document_sequences" (
    "id" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "docType" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "padding" INTEGER NOT NULL DEFAULT 5,
    "nextNumber" INTEGER NOT NULL DEFAULT 1,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "document_sequences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."sales_settings" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "taxEnabled" BOOLEAN NOT NULL DEFAULT false,
    "multiCurrency" BOOLEAN NOT NULL DEFAULT false,
    "allowDiscounts" BOOLEAN NOT NULL DEFAULT true,
    "maxDiscountPercent" DECIMAL(65,30) NOT NULL DEFAULT 100,
    "quotationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "deliveryEnabled" BOOLEAN NOT NULL DEFAULT false,
    "salesReturnsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "requireApproval" BOOLEAN NOT NULL DEFAULT false,
    "approvalThreshold" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "defaultPaymentTerms" INTEGER NOT NULL DEFAULT 30,
    "defaultWarehouseId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."purchasing_settings" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "taxEnabled" BOOLEAN NOT NULL DEFAULT false,
    "rfqEnabled" BOOLEAN NOT NULL DEFAULT true,
    "purchaseReturnsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "landedCostsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "requireApproval" BOOLEAN NOT NULL DEFAULT false,
    "approvalThreshold" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "threeWayMatching" BOOLEAN NOT NULL DEFAULT false,
    "defaultPaymentTerms" INTEGER NOT NULL DEFAULT 30,
    "defaultWarehouseId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchasing_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."accounting_settings" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "method" TEXT NOT NULL DEFAULT 'ACCRUAL',
    "taxMethod" TEXT NOT NULL DEFAULT 'EXCLUSIVE',
    "multiCurrency" BOOLEAN NOT NULL DEFAULT false,
    "journalEntriesEnabled" BOOLEAN NOT NULL DEFAULT true,
    "softLockDate" TIMESTAMP(3),
    "hardLockDate" TIMESTAMP(3),
    "defaultSalesAccount" TEXT,
    "defaultCOGSAccount" TEXT,
    "defaultExpenseAccount" TEXT,
    "defaultARAccount" TEXT,
    "defaultAPAccount" TEXT,
    "defaultCashAccount" TEXT,
    "defaultBankAccount" TEXT,
    "defaultSaleJournalId" TEXT,
    "defaultPurchaseJournalId" TEXT,
    "defaultCashJournalId" TEXT,
    "defaultBankJournalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounting_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."logistics_settings" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "localDeliveryEnabled" BOOLEAN NOT NULL DEFAULT true,
    "exportEnabled" BOOLEAN NOT NULL DEFAULT false,
    "storageEnabled" BOOLEAN NOT NULL DEFAULT false,
    "vehicleManagement" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "logistics_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."module_settings" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "module_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory"."warehouses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "branchId" TEXT NOT NULL,

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory"."categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory"."units_of_measure" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "unitCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "units_of_measure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory"."products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "barcode" TEXT,
    "sku" TEXT,
    "price" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "cost" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "itemCode" TEXT,
    "itemType" TEXT,
    "unitType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT,
    "unitOfMeasureId" TEXT,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory"."stock" (
    "id" TEXT NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "minStock" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory"."stock_movements" (
    "id" TEXT NOT NULL,
    "type" "inventory"."StockMovementType" NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "reason" TEXT,
    "reference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "warehouseId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "fromWarehouseId" TEXT,
    "toWarehouseId" TEXT,
    "userId" TEXT,

    CONSTRAINT "stock_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory"."stock_adjustments" (
    "id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "stock_adjustments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory"."stock_adjustment_items" (
    "id" TEXT NOT NULL,
    "expectedQuantity" DECIMAL(65,30) NOT NULL,
    "actualQuantity" DECIMAL(65,30) NOT NULL,
    "difference" DECIMAL(65,30) NOT NULL,
    "adjustmentId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "stock_adjustment_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory"."reordering_rules" (
    "id" TEXT NOT NULL,
    "minQuantity" DECIMAL(65,30) NOT NULL,
    "maxQuantity" DECIMAL(65,30) NOT NULL,
    "reorderQuantity" DECIMAL(65,30) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,

    CONSTRAINT "reordering_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory"."product_images" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" TEXT NOT NULL,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory"."product_price_history" (
    "id" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "cost" DECIMAL(65,30) NOT NULL,
    "changedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" TEXT NOT NULL,

    CONSTRAINT "product_price_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory"."product_variants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT,
    "barcode" TEXT,
    "price" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "cost" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "attributes" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory"."lot_numbers" (
    "id" TEXT NOT NULL,
    "lotNumber" TEXT NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "receivedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,

    CONSTRAINT "lot_numbers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory"."serial_numbers" (
    "id" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'IN_STOCK',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,

    CONSTRAINT "serial_numbers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory"."inventory_settings" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "valuationMethod" TEXT NOT NULL DEFAULT 'FIFO',
    "trackLotNumbers" BOOLEAN NOT NULL DEFAULT false,
    "trackSerialNumbers" BOOLEAN NOT NULL DEFAULT false,
    "trackExpiryDates" BOOLEAN NOT NULL DEFAULT false,
    "requireTransferApproval" BOOLEAN NOT NULL DEFAULT false,
    "requireAdjustmentApproval" BOOLEAN NOT NULL DEFAULT false,
    "enableLowStockAlert" BOOLEAN NOT NULL DEFAULT true,
    "defaultMinStock" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "allowNegativeStock" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales"."customers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "taxRegNumber" TEXT,
    "commercialReg" TEXT,
    "country" TEXT DEFAULT 'EG',
    "buyerType" TEXT DEFAULT 'B',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales"."sales_quotations" (
    "id" TEXT NOT NULL,
    "quotationNumber" TEXT NOT NULL,
    "status" "sales"."QuotationStatus" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "validUntil" TIMESTAMP(3),
    "untaxedAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "discountAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'EGP',
    "exchangeRate" DECIMAL(65,30) NOT NULL DEFAULT 1,
    "customerId" TEXT,
    "branchId" TEXT NOT NULL,
    "paymentTermId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_quotations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales"."sales_quotation_items" (
    "id" TEXT NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "unitPrice" DECIMAL(65,30) NOT NULL,
    "discount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "subtotal" DECIMAL(65,30) NOT NULL,
    "taxAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "total" DECIMAL(65,30) NOT NULL,
    "productId" TEXT NOT NULL,
    "taxId" TEXT,
    "quotationId" TEXT NOT NULL,

    CONSTRAINT "sales_quotation_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales"."sales_orders" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "status" "sales"."SalesOrderStatus" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "untaxedAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "discountAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'EGP',
    "exchangeRate" DECIMAL(65,30) NOT NULL DEFAULT 1,
    "deliveryStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "expectedDate" TIMESTAMP(3),
    "customerId" TEXT,
    "branchId" TEXT NOT NULL,
    "quotationId" TEXT,
    "paymentTermId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales"."sales_order_items" (
    "id" TEXT NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "unitPrice" DECIMAL(65,30) NOT NULL,
    "discount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "subtotal" DECIMAL(65,30) NOT NULL,
    "taxAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "total" DECIMAL(65,30) NOT NULL,
    "productId" TEXT NOT NULL,
    "taxId" TEXT,
    "orderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sales_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales"."deliveries" (
    "id" TEXT NOT NULL,
    "deliveryNumber" TEXT NOT NULL,
    "status" "sales"."DeliveryStatus" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "deliveryDate" TIMESTAMP(3),
    "orderId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales"."delivery_items" (
    "id" TEXT NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "productId" TEXT NOT NULL,
    "deliveryId" TEXT NOT NULL,

    CONSTRAINT "delivery_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales"."invoices" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "status" "sales"."InvoiceStatus" NOT NULL DEFAULT 'UNPAID',
    "untaxedAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(65,30) NOT NULL,
    "paidAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "discountAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'EGP',
    "exchangeRate" DECIMAL(65,30) NOT NULL DEFAULT 1,
    "dueDate" TIMESTAMP(3),
    "uuid" TEXT NOT NULL,
    "dateTimeIssued" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "etaStatus" TEXT,
    "etaUUID" TEXT,
    "zatcaStatus" TEXT,
    "qrCode" TEXT,
    "orderId" TEXT NOT NULL,
    "paymentTermId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales"."invoice_items" (
    "id" TEXT NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "unitPrice" DECIMAL(65,30) NOT NULL,
    "discount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "subtotal" DECIMAL(65,30) NOT NULL,
    "taxAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "total" DECIMAL(65,30) NOT NULL,
    "itemCode" TEXT,
    "itemType" TEXT,
    "unitType" TEXT,
    "productId" TEXT NOT NULL,
    "taxId" TEXT,
    "invoiceId" TEXT NOT NULL,

    CONSTRAINT "invoice_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales"."payments" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(18,4) NOT NULL,
    "paymentMethod" "sales"."SalesPaymentMethod" NOT NULL DEFAULT 'CASH',
    "reference" TEXT,
    "notes" TEXT,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "journalEntryId" TEXT,
    "journalId" TEXT,
    "invoiceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales"."sales_returns" (
    "id" TEXT NOT NULL,
    "returnNumber" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "sales"."SalesReturnStatus" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "totalAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "orderId" TEXT NOT NULL,
    "customerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_returns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales"."sales_return_items" (
    "id" TEXT NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "unitPrice" DECIMAL(65,30) NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,
    "productId" TEXT NOT NULL,
    "returnId" TEXT NOT NULL,

    CONSTRAINT "sales_return_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchasing"."suppliers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "taxRegNumber" TEXT,
    "commercialReg" TEXT,
    "country" TEXT DEFAULT 'EG',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchasing"."rfqs" (
    "id" TEXT NOT NULL,
    "rfqNumber" TEXT NOT NULL,
    "status" "purchasing"."RFQStatus" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "validUntil" TIMESTAMP(3),
    "totalAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'EGP',
    "exchangeRate" DECIMAL(65,30) NOT NULL DEFAULT 1,
    "supplierId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "paymentTermId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rfqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchasing"."rfq_items" (
    "id" TEXT NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "unitCost" DECIMAL(65,30) NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,
    "productId" TEXT NOT NULL,
    "taxId" TEXT,
    "rfqId" TEXT NOT NULL,

    CONSTRAINT "rfq_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchasing"."purchase_orders" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "status" "purchasing"."PurchaseOrderStatus" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "untaxedAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'EGP',
    "exchangeRate" DECIMAL(65,30) NOT NULL DEFAULT 1,
    "expectedDate" TIMESTAMP(3),
    "supplierId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "rfqId" TEXT,
    "paymentTermId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchasing"."purchase_order_items" (
    "id" TEXT NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "unitCost" DECIMAL(65,30) NOT NULL,
    "discount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "subtotal" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "total" DECIMAL(65,30) NOT NULL,
    "receivedQty" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "productId" TEXT NOT NULL,
    "taxId" TEXT,
    "orderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "purchase_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchasing"."purchase_receipts" (
    "id" TEXT NOT NULL,
    "receiptNumber" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,

    CONSTRAINT "purchase_receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchasing"."purchase_receipt_items" (
    "id" TEXT NOT NULL,
    "receivedQty" DECIMAL(65,30) NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "receiptId" TEXT NOT NULL,

    CONSTRAINT "purchase_receipt_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchasing"."vendor_bills" (
    "id" TEXT NOT NULL,
    "billNumber" TEXT NOT NULL,
    "status" "purchasing"."VendorBillStatus" NOT NULL DEFAULT 'UNPAID',
    "totalAmount" DECIMAL(65,30) NOT NULL,
    "paidAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "dueDate" TIMESTAMP(3),
    "orderId" TEXT NOT NULL,
    "paymentTermId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendor_bills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchasing"."vendor_payments" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(18,4) NOT NULL,
    "paymentMethod" "purchasing"."PurchasePaymentMethod" NOT NULL DEFAULT 'CASH',
    "reference" TEXT,
    "notes" TEXT,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "journalEntryId" TEXT,
    "journalId" TEXT,
    "billId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendor_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchasing"."purchase_returns" (
    "id" TEXT NOT NULL,
    "returnNumber" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "purchasing"."PurchaseReturnStatus" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "totalAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "orderId" TEXT NOT NULL,
    "supplierId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_returns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchasing"."purchase_return_items" (
    "id" TEXT NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "unitCost" DECIMAL(65,30) NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,
    "productId" TEXT NOT NULL,
    "returnId" TEXT NOT NULL,

    CONSTRAINT "purchase_return_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounting"."fiscal_years" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "accounting"."FiscalYearStatus" NOT NULL DEFAULT 'OPEN',
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fiscal_years_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounting"."fiscal_periods" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "periodNumber" INTEGER NOT NULL,
    "status" "accounting"."FiscalPeriodStatus" NOT NULL DEFAULT 'OPEN',
    "companyId" TEXT NOT NULL,
    "fiscalYearId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fiscal_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounting"."chart_of_accounts" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "accounting"."AccountType" NOT NULL,
    "normalBalance" "accounting"."NormalBalance" NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "isGroup" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "companyId" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chart_of_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounting"."journals" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "accounting"."JournalType" NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "journals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounting"."journal_entries" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "name" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "state" "accounting"."JournalEntryState" NOT NULL DEFAULT 'DRAFT',
    "note" TEXT,
    "currencyId" TEXT NOT NULL,
    "exchangeRate" DECIMAL(18,6) NOT NULL DEFAULT 1,
    "sourceType" "accounting"."JournalEntrySource",
    "sourceId" TEXT,
    "reversalOfId" TEXT,
    "postedAt" TIMESTAMP(3),
    "postedById" TEXT,
    "createdById" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "journalId" TEXT NOT NULL,
    "fiscalPeriodId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journal_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounting"."journal_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "debit" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "credit" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "amountCurrency" DECIMAL(18,4),
    "currencyId" TEXT,
    "partnerType" "accounting"."PartnerType",
    "partnerId" TEXT,
    "reconciled" BOOLEAN NOT NULL DEFAULT false,
    "reconcileDate" TIMESTAMP(3),
    "reconcileRef" TEXT,
    "dueDate" TIMESTAMP(3),
    "entryId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "journal_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounting"."taxes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rate" DECIMAL(8,4) NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "taxType" "accounting"."TaxType" NOT NULL DEFAULT 'PERCENTAGE',
    "scope" "accounting"."TaxScope" NOT NULL DEFAULT 'BOTH',
    "salesAccountId" TEXT,
    "purchaseAccountId" TEXT,
    "etaType" TEXT,
    "etaSubtype" TEXT,
    "zatcaType" TEXT,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "taxes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounting"."payment_terms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "payment_terms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounting"."payment_term_lines" (
    "id" TEXT NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "valueType" TEXT NOT NULL,
    "days" INTEGER NOT NULL DEFAULT 0,
    "paymentTermId" TEXT NOT NULL,

    CONSTRAINT "payment_term_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistics"."carriers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'ROAD',
    "phone" TEXT,
    "email" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carriers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistics"."vehicles" (
    "id" TEXT NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "capacity" DECIMAL(65,30),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistics"."shipments" (
    "id" TEXT NOT NULL,
    "shipmentNumber" TEXT NOT NULL,
    "status" "logistics"."ShipmentStatus" NOT NULL DEFAULT 'DRAFT',
    "type" TEXT NOT NULL DEFAULT 'LOCAL',
    "originCountry" TEXT NOT NULL DEFAULT 'EG',
    "destCountry" TEXT NOT NULL,
    "originCity" TEXT,
    "destCity" TEXT,
    "pickupDate" TIMESTAMP(3),
    "deliveryDate" TIMESTAMP(3),
    "freightCost" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'EGP',
    "exchangeRate" DECIMAL(65,30) NOT NULL DEFAULT 1,
    "salesOrderId" TEXT,
    "purchaseOrderId" TEXT,
    "carrierId" TEXT,
    "vehicleId" TEXT,
    "driverId" TEXT,
    "companyId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistics"."shipment_items" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "weight" DECIMAL(65,30),
    "productId" TEXT,
    "shipmentId" TEXT NOT NULL,

    CONSTRAINT "shipment_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistics"."storage_contracts" (
    "id" TEXT NOT NULL,
    "contractNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "clientName" TEXT NOT NULL,
    "clientPhone" TEXT,
    "clientEmail" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "spaceAllocated" DECIMAL(65,30) NOT NULL,
    "pricePerUnit" DECIMAL(65,30) NOT NULL,
    "billingCycle" TEXT NOT NULL DEFAULT 'MONTHLY',
    "currency" TEXT NOT NULL DEFAULT 'EGP',
    "companyId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "storage_contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistics"."storage_invoices" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UNPAID',
    "dueDate" TIMESTAMP(3),
    "contractId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "storage_invoices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_email_key" ON "core"."companies"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "core"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "core"."permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_userId_roleId_key" ON "core"."user_roles"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_roleId_permissionId_key" ON "core"."role_permissions"("roleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "company_settings_companyId_key" ON "core"."company_settings"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "currencies_code_key" ON "core"."currencies"("code");

-- CreateIndex
CREATE UNIQUE INDEX "document_sequences_companyId_module_docType_key" ON "core"."document_sequences"("companyId", "module", "docType");

-- CreateIndex
CREATE UNIQUE INDEX "sales_settings_companyId_key" ON "core"."sales_settings"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "purchasing_settings_companyId_key" ON "core"."purchasing_settings"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "accounting_settings_companyId_key" ON "core"."accounting_settings"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "logistics_settings_companyId_key" ON "core"."logistics_settings"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "module_settings_companyId_module_key_key" ON "core"."module_settings"("companyId", "module", "key");

-- CreateIndex
CREATE UNIQUE INDEX "products_barcode_key" ON "inventory"."products"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "inventory"."products"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "stock_warehouseId_productId_key" ON "inventory"."stock"("warehouseId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "reordering_rules_productId_warehouseId_key" ON "inventory"."reordering_rules"("productId", "warehouseId");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_sku_key" ON "inventory"."product_variants"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_barcode_key" ON "inventory"."product_variants"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "lot_numbers_lotNumber_productId_warehouseId_key" ON "inventory"."lot_numbers"("lotNumber", "productId", "warehouseId");

-- CreateIndex
CREATE UNIQUE INDEX "serial_numbers_serialNumber_key" ON "inventory"."serial_numbers"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_settings_companyId_key" ON "inventory"."inventory_settings"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "sales_quotations_quotationNumber_key" ON "sales"."sales_quotations"("quotationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "sales_orders_orderNumber_key" ON "sales"."sales_orders"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "deliveries_deliveryNumber_key" ON "sales"."deliveries"("deliveryNumber");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoiceNumber_key" ON "sales"."invoices"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_uuid_key" ON "sales"."invoices"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "payments_journalEntryId_key" ON "sales"."payments"("journalEntryId");

-- CreateIndex
CREATE UNIQUE INDEX "sales_returns_returnNumber_key" ON "sales"."sales_returns"("returnNumber");

-- CreateIndex
CREATE UNIQUE INDEX "rfqs_rfqNumber_key" ON "purchasing"."rfqs"("rfqNumber");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_orders_orderNumber_key" ON "purchasing"."purchase_orders"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_receipts_receiptNumber_key" ON "purchasing"."purchase_receipts"("receiptNumber");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_bills_billNumber_key" ON "purchasing"."vendor_bills"("billNumber");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_payments_journalEntryId_key" ON "purchasing"."vendor_payments"("journalEntryId");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_returns_returnNumber_key" ON "purchasing"."purchase_returns"("returnNumber");

-- CreateIndex
CREATE INDEX "fiscal_years_companyId_status_idx" ON "accounting"."fiscal_years"("companyId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "fiscal_years_companyId_startDate_key" ON "accounting"."fiscal_years"("companyId", "startDate");

-- CreateIndex
CREATE INDEX "fiscal_periods_companyId_status_idx" ON "accounting"."fiscal_periods"("companyId", "status");

-- CreateIndex
CREATE INDEX "fiscal_periods_companyId_startDate_endDate_idx" ON "accounting"."fiscal_periods"("companyId", "startDate", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "fiscal_periods_fiscalYearId_periodNumber_key" ON "accounting"."fiscal_periods"("fiscalYearId", "periodNumber");

-- CreateIndex
CREATE INDEX "chart_of_accounts_companyId_type_idx" ON "accounting"."chart_of_accounts"("companyId", "type");

-- CreateIndex
CREATE INDEX "chart_of_accounts_companyId_isActive_idx" ON "accounting"."chart_of_accounts"("companyId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "chart_of_accounts_companyId_code_key" ON "accounting"."chart_of_accounts"("companyId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "journal_entries_reversalOfId_key" ON "accounting"."journal_entries"("reversalOfId");

-- CreateIndex
CREATE INDEX "journal_entries_companyId_state_idx" ON "accounting"."journal_entries"("companyId", "state");

-- CreateIndex
CREATE INDEX "journal_entries_companyId_date_idx" ON "accounting"."journal_entries"("companyId", "date");

-- CreateIndex
CREATE INDEX "journal_entries_companyId_sourceType_sourceId_idx" ON "accounting"."journal_entries"("companyId", "sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "journal_entries_fiscalPeriodId_idx" ON "accounting"."journal_entries"("fiscalPeriodId");

-- CreateIndex
CREATE INDEX "journal_items_accountId_reconciled_idx" ON "accounting"."journal_items"("accountId", "reconciled");

-- CreateIndex
CREATE INDEX "journal_items_partnerId_partnerType_idx" ON "accounting"."journal_items"("partnerId", "partnerType");

-- CreateIndex
CREATE INDEX "journal_items_entryId_idx" ON "accounting"."journal_items"("entryId");

-- CreateIndex
CREATE INDEX "taxes_companyId_isActive_idx" ON "accounting"."taxes"("companyId", "isActive");

-- CreateIndex
CREATE INDEX "taxes_companyId_scope_idx" ON "accounting"."taxes"("companyId", "scope");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_plateNumber_key" ON "logistics"."vehicles"("plateNumber");

-- CreateIndex
CREATE UNIQUE INDEX "shipments_shipmentNumber_key" ON "logistics"."shipments"("shipmentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "storage_contracts_contractNumber_key" ON "logistics"."storage_contracts"("contractNumber");

-- CreateIndex
CREATE UNIQUE INDEX "storage_invoices_invoiceNumber_key" ON "logistics"."storage_invoices"("invoiceNumber");

-- AddForeignKey
ALTER TABLE "core"."branches" ADD CONSTRAINT "branches_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."users" ADD CONSTRAINT "users_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."users" ADD CONSTRAINT "users_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "core"."branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "core"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."user_roles" ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "core"."roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "core"."roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "core"."permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."exchange_rates" ADD CONSTRAINT "exchange_rates_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "core"."currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."warehouses" ADD CONSTRAINT "warehouses_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "core"."branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "inventory"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "inventory"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."products" ADD CONSTRAINT "products_unitOfMeasureId_fkey" FOREIGN KEY ("unitOfMeasureId") REFERENCES "inventory"."units_of_measure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."stock" ADD CONSTRAINT "stock_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "inventory"."warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."stock" ADD CONSTRAINT "stock_productId_fkey" FOREIGN KEY ("productId") REFERENCES "inventory"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."stock_movements" ADD CONSTRAINT "stock_movements_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "inventory"."warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."stock_movements" ADD CONSTRAINT "stock_movements_productId_fkey" FOREIGN KEY ("productId") REFERENCES "inventory"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."stock_adjustments" ADD CONSTRAINT "stock_adjustments_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "inventory"."warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."stock_adjustment_items" ADD CONSTRAINT "stock_adjustment_items_adjustmentId_fkey" FOREIGN KEY ("adjustmentId") REFERENCES "inventory"."stock_adjustments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."stock_adjustment_items" ADD CONSTRAINT "stock_adjustment_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "inventory"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."reordering_rules" ADD CONSTRAINT "reordering_rules_productId_fkey" FOREIGN KEY ("productId") REFERENCES "inventory"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."reordering_rules" ADD CONSTRAINT "reordering_rules_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "inventory"."warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."product_images" ADD CONSTRAINT "product_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES "inventory"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."product_price_history" ADD CONSTRAINT "product_price_history_productId_fkey" FOREIGN KEY ("productId") REFERENCES "inventory"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."product_variants" ADD CONSTRAINT "product_variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "inventory"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."lot_numbers" ADD CONSTRAINT "lot_numbers_productId_fkey" FOREIGN KEY ("productId") REFERENCES "inventory"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."lot_numbers" ADD CONSTRAINT "lot_numbers_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "inventory"."warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."serial_numbers" ADD CONSTRAINT "serial_numbers_productId_fkey" FOREIGN KEY ("productId") REFERENCES "inventory"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."serial_numbers" ADD CONSTRAINT "serial_numbers_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "inventory"."warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales"."sales_quotations" ADD CONSTRAINT "sales_quotations_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "sales"."customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales"."sales_quotations" ADD CONSTRAINT "sales_quotations_paymentTermId_fkey" FOREIGN KEY ("paymentTermId") REFERENCES "accounting"."payment_terms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales"."sales_quotation_items" ADD CONSTRAINT "sales_quotation_items_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "sales"."sales_quotations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales"."sales_orders" ADD CONSTRAINT "sales_orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "sales"."customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales"."sales_orders" ADD CONSTRAINT "sales_orders_paymentTermId_fkey" FOREIGN KEY ("paymentTermId") REFERENCES "accounting"."payment_terms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales"."sales_order_items" ADD CONSTRAINT "sales_order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "sales"."sales_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales"."deliveries" ADD CONSTRAINT "deliveries_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "sales"."sales_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales"."delivery_items" ADD CONSTRAINT "delivery_items_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "sales"."deliveries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales"."invoices" ADD CONSTRAINT "invoices_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "sales"."sales_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales"."invoices" ADD CONSTRAINT "invoices_paymentTermId_fkey" FOREIGN KEY ("paymentTermId") REFERENCES "accounting"."payment_terms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales"."invoice_items" ADD CONSTRAINT "invoice_items_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "sales"."invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales"."payments" ADD CONSTRAINT "payments_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "sales"."invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales"."sales_returns" ADD CONSTRAINT "sales_returns_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "sales"."sales_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales"."sales_returns" ADD CONSTRAINT "sales_returns_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "sales"."customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales"."sales_return_items" ADD CONSTRAINT "sales_return_items_returnId_fkey" FOREIGN KEY ("returnId") REFERENCES "sales"."sales_returns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchasing"."rfqs" ADD CONSTRAINT "rfqs_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "purchasing"."suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchasing"."rfqs" ADD CONSTRAINT "rfqs_paymentTermId_fkey" FOREIGN KEY ("paymentTermId") REFERENCES "accounting"."payment_terms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchasing"."rfq_items" ADD CONSTRAINT "rfq_items_rfqId_fkey" FOREIGN KEY ("rfqId") REFERENCES "purchasing"."rfqs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchasing"."purchase_orders" ADD CONSTRAINT "purchase_orders_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "purchasing"."suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchasing"."purchase_orders" ADD CONSTRAINT "purchase_orders_paymentTermId_fkey" FOREIGN KEY ("paymentTermId") REFERENCES "accounting"."payment_terms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchasing"."purchase_order_items" ADD CONSTRAINT "purchase_order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "purchasing"."purchase_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchasing"."purchase_receipts" ADD CONSTRAINT "purchase_receipts_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "purchasing"."purchase_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchasing"."purchase_receipt_items" ADD CONSTRAINT "purchase_receipt_items_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "purchasing"."purchase_receipts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchasing"."vendor_bills" ADD CONSTRAINT "vendor_bills_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "purchasing"."purchase_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchasing"."vendor_bills" ADD CONSTRAINT "vendor_bills_paymentTermId_fkey" FOREIGN KEY ("paymentTermId") REFERENCES "accounting"."payment_terms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchasing"."vendor_payments" ADD CONSTRAINT "vendor_payments_billId_fkey" FOREIGN KEY ("billId") REFERENCES "purchasing"."vendor_bills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchasing"."purchase_returns" ADD CONSTRAINT "purchase_returns_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "purchasing"."purchase_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchasing"."purchase_returns" ADD CONSTRAINT "purchase_returns_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "purchasing"."suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchasing"."purchase_return_items" ADD CONSTRAINT "purchase_return_items_returnId_fkey" FOREIGN KEY ("returnId") REFERENCES "purchasing"."purchase_returns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting"."fiscal_periods" ADD CONSTRAINT "fiscal_periods_fiscalYearId_fkey" FOREIGN KEY ("fiscalYearId") REFERENCES "accounting"."fiscal_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting"."chart_of_accounts" ADD CONSTRAINT "chart_of_accounts_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "accounting"."chart_of_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting"."journal_entries" ADD CONSTRAINT "journal_entries_reversalOfId_fkey" FOREIGN KEY ("reversalOfId") REFERENCES "accounting"."journal_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting"."journal_entries" ADD CONSTRAINT "journal_entries_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "accounting"."journals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting"."journal_entries" ADD CONSTRAINT "journal_entries_fiscalPeriodId_fkey" FOREIGN KEY ("fiscalPeriodId") REFERENCES "accounting"."fiscal_periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting"."journal_items" ADD CONSTRAINT "journal_items_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "accounting"."journal_entries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting"."journal_items" ADD CONSTRAINT "journal_items_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounting"."chart_of_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting"."payment_term_lines" ADD CONSTRAINT "payment_term_lines_paymentTermId_fkey" FOREIGN KEY ("paymentTermId") REFERENCES "accounting"."payment_terms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logistics"."shipments" ADD CONSTRAINT "shipments_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "logistics"."carriers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logistics"."shipment_items" ADD CONSTRAINT "shipment_items_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "logistics"."shipments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logistics"."storage_invoices" ADD CONSTRAINT "storage_invoices_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "logistics"."storage_contracts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
