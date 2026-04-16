/*
  Warnings:

  - The `status` column on the `serial_numbers` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[companyId,sku]` on the table `product_variants` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[companyId,barcode]` on the table `product_variants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyId` to the `product_variants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `stock_movements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `warehouses` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "inventory"."SerialNumberStatus" AS ENUM ('IN_STOCK', 'SOLD', 'RETURNED', 'DEFECTIVE');

-- DropIndex
DROP INDEX "inventory"."product_variants_barcode_key";

-- DropIndex
DROP INDEX "inventory"."product_variants_sku_key";

-- AlterTable
ALTER TABLE "inventory"."lot_numbers" ADD COLUMN     "expiryDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "inventory"."product_variants" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "inventory"."serial_numbers" DROP COLUMN "status",
ADD COLUMN     "status" "inventory"."SerialNumberStatus" NOT NULL DEFAULT 'IN_STOCK';

-- AlterTable
ALTER TABLE "inventory"."stock_movements" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "inventory"."warehouses" ADD COLUMN     "companyId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_companyId_sku_key" ON "inventory"."product_variants"("companyId", "sku");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_companyId_barcode_key" ON "inventory"."product_variants"("companyId", "barcode");

-- AddForeignKey
ALTER TABLE "inventory"."warehouses" ADD CONSTRAINT "warehouses_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."stock_movements" ADD CONSTRAINT "stock_movements_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."product_variants" ADD CONSTRAINT "product_variants_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
