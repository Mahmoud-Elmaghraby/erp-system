import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../../generated/prisma';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seed...');

  // Create Company
  const company = await prisma.company.upsert({
    where: { email: 'admin@erp.com' },
    update: {},
    create: {
      name: 'شركة تجريبية',
      email: 'admin@erp.com',
      phone: '01000000000',
      address: 'القاهرة، مصر',
      branches: {
        create: {
          name: 'الفرع الرئيسي',
          address: 'القاهرة، مصر',
          phone: '01000000000',
        },
      },
    },
    include: { branches: true },
  });

  console.log('✅ Company created:', company.name);

  // Create Super Admin Role
  const role = await prisma.role.upsert({
    where: { id: 'super-admin-role' },
    update: {},
    create: {
      id: 'super-admin-role',
      name: 'Super Admin',
      description: 'صلاحيات كاملة',
    },
  });

  console.log('✅ Role created:', role.name);

  // Create Permissions
  const permissions = [
    { name: 'inventory.products.view', module: 'inventory', description: 'عرض المنتجات' },
    { name: 'inventory.products.create', module: 'inventory', description: 'إضافة منتج' },
    { name: 'inventory.products.edit', module: 'inventory', description: 'تعديل منتج' },
    { name: 'inventory.products.delete', module: 'inventory', description: 'حذف منتج' },
    { name: 'inventory.warehouses.view', module: 'inventory', description: 'عرض المخازن' },
    { name: 'inventory.warehouses.create', module: 'inventory', description: 'إضافة مخزن' },
    { name: 'inventory.warehouses.edit', module: 'inventory', description: 'تعديل مخزن' },
    { name: 'inventory.warehouses.delete', module: 'inventory', description: 'حذف مخزن' },
    { name: 'inventory.stock.view', module: 'inventory', description: 'عرض المخزون' },
    { name: 'inventory.stock.edit', module: 'inventory', description: 'تعديل المخزون' },
    { name: 'inventory.stock.transfer', module: 'inventory', description: 'تحويل مخزون' },
    { name: 'inventory.categories.view', module: 'inventory', description: 'عرض التصنيفات' },
    { name: 'inventory.categories.create', module: 'inventory', description: 'إضافة تصنيف' },
    { name: 'inventory.categories.delete', module: 'inventory', description: 'حذف تصنيف' },
    { name: 'inventory.units.view', module: 'inventory', description: 'عرض وحدات القياس' },
    { name: 'inventory.units.create', module: 'inventory', description: 'إضافة وحدة قياس' },
    { name: 'inventory.units.delete', module: 'inventory', description: 'حذف وحدة قياس' },
    { name: 'inventory.settings.view', module: 'inventory', description: 'عرض إعدادات المخزون' },
    { name: 'inventory.settings.edit', module: 'inventory', description: 'تعديل إعدادات المخزون' },
    { name: 'inventory.adjustments.view', module: 'inventory', description: 'عرض تسويات المخزون' },
    { name: 'inventory.adjustments.create', module: 'inventory', description: 'إنشاء تسوية مخزون' },
    { name: 'inventory.adjustments.confirm', module: 'inventory', description: 'تأكيد تسوية مخزون' },
    { name: 'inventory.reordering.view', module: 'inventory', description: 'عرض قواعد إعادة الطلب' },
    { name: 'inventory.reordering.create', module: 'inventory', description: 'إضافة قاعدة إعادة طلب' },
    { name: 'inventory.reordering.delete', module: 'inventory', description: 'حذف قاعدة إعادة طلب' },
    { name: 'inventory.variants.create', module: 'inventory', description: 'إضافة متغير منتج' },
    { name: 'inventory.variants.delete', module: 'inventory', description: 'حذف متغير منتج' },
    { name: 'inventory.traceability.view', module: 'inventory', description: 'عرض تتبع المنتجات' },
    { name: 'inventory.traceability.create', module: 'inventory', description: 'إضافة بيانات تتبع' },
    { name: 'inventory.valuation.view', module: 'inventory', description: 'عرض تقييم المخزون' },
    { name: 'sales.customers.view', module: 'sales', description: 'عرض العملاء' },
    { name: 'sales.customers.create', module: 'sales', description: 'إضافة عميل' },
    { name: 'sales.customers.edit', module: 'sales', description: 'تعديل عميل' },
    { name: 'sales.customers.delete', module: 'sales', description: 'حذف عميل' },
    { name: 'sales.orders.view', module: 'sales', description: 'عرض الأوردرات' },
    { name: 'sales.orders.create', module: 'sales', description: 'إنشاء أوردر' },
    { name: 'sales.orders.confirm', module: 'sales', description: 'تأكيد أوردر' },
    { name: 'sales.invoices.view', module: 'sales', description: 'عرض الفواتير' },
    { name: 'sales.invoices.create', module: 'sales', description: 'إنشاء فاتورة' },
    { name: 'sales.invoices.pay', module: 'sales', description: 'تسجيل دفع' },
    { name: 'settings.company.view', module: 'core', description: 'عرض إعدادات الشركة' },
    { name: 'settings.company.edit', module: 'core', description: 'تعديل إعدادات الشركة' },
    { name: 'settings.currencies.view', module: 'core', description: 'عرض العملات' },
    { name: 'settings.currencies.create', module: 'core', description: 'إضافة عملة' },
    { name: 'settings.currencies.edit', module: 'core', description: 'تعديل سعر صرف' },
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission,
    });
  }

  console.log('✅ Permissions created');

  // Assign all permissions to super admin role
  const allPermissions = await prisma.permission.findMany();
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
      update: {},
      create: { roleId: role.id, permissionId: permission.id },
    });
  }

  console.log('✅ Permissions assigned to role');

  // Create Admin User
  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  const branch = company.branches[0];

  const user = await prisma.user.upsert({
    where: { email: 'admin@erp.com' },
    update: {},
    create: {
      name: 'مدير النظام',
      email: 'admin@erp.com',
      password: hashedPassword,
      companyId: company.id,
      branchId: branch.id,
    },
  });

  console.log('✅ User created:', user.email);

  // Assign role to user
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId: role.id } },
    update: {},
    create: { userId: user.id, roleId: role.id },
  });

  console.log('✅ Role assigned to user');

  // Create Currencies
  const currencies = [
    { id: randomUUID(), code: 'EGP', name: 'جنيه مصري', symbol: 'ج.م', isBase: true, isActive: true },
    { id: randomUUID(), code: 'USD', name: 'دولار أمريكي', symbol: '$', isBase: false, isActive: true },
    { id: randomUUID(), code: 'AED', name: 'درهم إماراتي', symbol: 'د.إ', isBase: false, isActive: true },
    { id: randomUUID(), code: 'EUR', name: 'يورو', symbol: '€', isBase: false, isActive: true },
  ];

  for (const currency of currencies) {
    await prisma.currency.upsert({
      where: { code: currency.code },
      update: {},
      create: currency,
    });
  }

  console.log('✅ Currencies created');

  // Create Company Settings
  await prisma.companySettings.upsert({
    where: { companyId: company.id },
    update: {},
    create: {
      id: randomUUID(),
      companyId: company.id,
      defaultCurrency: 'EGP',
      fiscalYearStart: 1,
    },
  });

  await prisma.salesSettings.upsert({
    where: { companyId: company.id },
    update: {},
    create: { id: randomUUID(), companyId: company.id },
  });

  await prisma.purchasingSettings.upsert({
    where: { companyId: company.id },
    update: {},
    create: { id: randomUUID(), companyId: company.id },
  });

  await prisma.accountingSettings.upsert({
    where: { companyId: company.id },
    update: {},
    create: { id: randomUUID(), companyId: company.id },
  });

  console.log('✅ Company settings created');

  // Create Document Sequences
  const sequences = [
    { module: 'sales', docType: 'order', prefix: 'SO' },
    { module: 'sales', docType: 'invoice', prefix: 'INV' },
    { module: 'purchasing', docType: 'order', prefix: 'PO' },
    { module: 'purchasing', docType: 'bill', prefix: 'BILL' },
    { module: 'inventory', docType: 'receipt', prefix: 'REC' },
    { module: 'inventory', docType: 'adjustment', prefix: 'ADJ' },
  ];

  for (const seq of sequences) {
    await prisma.documentSequence.upsert({
      where: {
        companyId_module_docType: {
          companyId: company.id,
          module: seq.module,
          docType: seq.docType,
        },
      },
      update: {},
      create: {
        id: randomUUID(),
        companyId: company.id,
        ...seq,
        padding: 5,
        nextNumber: 1,
      },
    });
  }

  console.log('✅ Document sequences created');
  console.log('');
  console.log('🎉 Seed completed successfully!');
  console.log('📧 Email: admin@erp.com');
  console.log('🔑 Password: Admin@123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());