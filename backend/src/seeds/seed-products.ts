import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../../modules/generated/prisma';
import { randomUUID } from 'crypto';

const pool = new Pool({ connectionString: process.env.DATABASE_URL as string });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting products seed...\n');

  await prisma.$transaction(
    async (tx) => {
      // Get the company
      const company = await tx.company.findFirst();
      if (!company) {
        throw new Error('No company found. Please run the main seed first.');
      }

      console.log(`📦 Using company: ${company.name}`);

      // Create Category
      const electronicsCat = await tx.category.create({
        data: {
          id: randomUUID(),
          name: 'أجهزة إلكترونية',
          companyId: company.id,
        }
      });

      const homeAppliancesCat = await tx.category.create({
        data: {
          id: randomUUID(),
          name: 'أجهزة منزلية',
          companyId: company.id,
        }
      });

      // Create Unit
      const unitPiece = await tx.unitOfMeasure.create({
        data: {
          id: randomUUID(),
          name: 'قطعة',
          symbol: 'pcs',
          unitCode: 'EA',
          companyId: company.id,
        }
      });

      // Create Products
      const products = [
        {
          id: randomUUID(),
          name: 'شاشة سامسونج 55 بوصة سمارت',
          description: 'شاشة ذكية بدقة 4K',
          barcode: '8806090123456',
          sku: 'SM-TV-55',
          price: 15000,
          cost: 12000,
          isActive: true,
          categoryId: electronicsCat.id,
          unitOfMeasureId: unitPiece.id,
          companyId: company.id,
        },
        {
          id: randomUUID(),
          name: 'ثلاجة توشيبا 14 قدم',
          description: 'ثلاجة نوفروست لون فضي',
          barcode: '6221234567890',
          sku: 'TS-FR-14',
          price: 22000,
          cost: 18000,
          isActive: true,
          categoryId: homeAppliancesCat.id,
          unitOfMeasureId: unitPiece.id,
          companyId: company.id,
        },
        {
          id: randomUUID(),
          name: 'غسالة ال جي 8 كيلو',
          description: 'غسالة ملابس اوتوماتيك تحميل أمامي',
          barcode: '8806090987654',
          sku: 'LG-WM-08',
          price: 18000,
          cost: 15000,
          isActive: true,
          categoryId: homeAppliancesCat.id,
          unitOfMeasureId: unitPiece.id,
          companyId: company.id,
        },
        {
          id: randomUUID(),
          name: 'ميكروويف كينوود 25 لتر',
          description: 'ميكروويف بالشواية ديجيتال',
          barcode: '5011423123456',
          sku: 'KW-MW-25',
          price: 4500,
          cost: 3500,
          isActive: true,
          categoryId: homeAppliancesCat.id,
          unitOfMeasureId: unitPiece.id,
          companyId: company.id,
        }
      ];

      for (const prod of products) {
        await tx.product.create({ data: prod });
      }

      console.log(`✅ ${products.length} Products created\n`);
    },
    { timeout: 60_000 },
  );
}

main()
  .catch((e) => { console.error('❌ Products seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
