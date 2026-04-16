/*
  Warnings:

  - The `status` column on the `outbox_events` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `stock_adjustments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `companyId` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `units_of_measure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `suppliers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "core"."OutboxStatus" AS ENUM ('PENDING', 'PROCESSED', 'FAILED');

-- CreateEnum
CREATE TYPE "inventory"."AdjustmentStatus" AS ENUM ('DRAFT', 'CONFIRMED', 'CANCELLED');

-- AlterTable
ALTER TABLE "core"."outbox_events" DROP COLUMN "status",
ADD COLUMN     "status" "core"."OutboxStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "core"."roles" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "inventory"."categories" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "inventory"."products" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "inventory"."stock_adjustments" DROP COLUMN "status",
ADD COLUMN     "status" "inventory"."AdjustmentStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "inventory"."units_of_measure" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "purchasing"."suppliers" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "sales"."customers" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "core"."roles" ADD CONSTRAINT "roles_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core"."companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."categories" ADD CONSTRAINT "categories_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."units_of_measure" ADD CONSTRAINT "units_of_measure_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."products" ADD CONSTRAINT "products_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales"."customers" ADD CONSTRAINT "customers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchasing"."suppliers" ADD CONSTRAINT "suppliers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
