import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../../generated/prisma';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { TaxScope, AccountType, TaxType } from '../../../generated/prisma';
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
    // Inventory
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
    // Sales
    { name: 'sales.customers.view', module: 'sales', description: 'عرض العملاء' },
    { name: 'sales.customers.create', module: 'sales', description: 'إضافة عميل' },
    { name: 'sales.customers.edit', module: 'sales', description: 'تعديل عميل' },
    { name: 'sales.customers.delete', module: 'sales', description: 'حذف عميل' },
    { name: 'sales.quotations.view', module: 'sales', description: 'عرض عروض الأسعار' },
    { name: 'sales.quotations.create', module: 'sales', description: 'إنشاء عرض سعر' },
    { name: 'sales.quotations.confirm', module: 'sales', description: 'تأكيد عرض سعر' },
    { name: 'sales.orders.view', module: 'sales', description: 'عرض أوامر البيع' },
    { name: 'sales.orders.create', module: 'sales', description: 'إنشاء أمر بيع' },
    { name: 'sales.orders.confirm', module: 'sales', description: 'تأكيد أمر بيع' },
    { name: 'sales.deliveries.view', module: 'sales', description: 'عرض التسليمات' },
    { name: 'sales.deliveries.create', module: 'sales', description: 'إنشاء تسليم' },
    { name: 'sales.deliveries.confirm', module: 'sales', description: 'تأكيد تسليم' },
    { name: 'sales.invoices.view', module: 'sales', description: 'عرض الفواتير' },
    { name: 'sales.invoices.create', module: 'sales', description: 'إنشاء فاتورة' },
    { name: 'sales.invoices.pay', module: 'sales', description: 'تسجيل دفع' },
    { name: 'sales.returns.view', module: 'sales', description: 'عرض المرتجعات' },
    { name: 'sales.returns.create', module: 'sales', description: 'إنشاء مرتجع' },
    { name: 'sales.returns.confirm', module: 'sales', description: 'تأكيد مرتجع' },
    // Purchasing
    { name: 'purchasing.suppliers.view', module: 'purchasing', description: 'عرض الموردين' },
    { name: 'purchasing.suppliers.create', module: 'purchasing', description: 'إضافة مورد' },
    { name: 'purchasing.suppliers.edit', module: 'purchasing', description: 'تعديل مورد' },
    { name: 'purchasing.suppliers.delete', module: 'purchasing', description: 'حذف مورد' },
    { name: 'purchasing.rfq.view', module: 'purchasing', description: 'عرض طلبات عروض الأسعار' },
    { name: 'purchasing.rfq.create', module: 'purchasing', description: 'إنشاء طلب عرض سعر' },
    { name: 'purchasing.rfq.confirm', module: 'purchasing', description: 'تأكيد طلب عرض سعر' },
    { name: 'purchasing.orders.view', module: 'purchasing', description: 'عرض أوامر الشراء' },
    { name: 'purchasing.orders.create', module: 'purchasing', description: 'إنشاء أمر شراء' },
    { name: 'purchasing.orders.confirm', module: 'purchasing', description: 'تأكيد أمر شراء' },
    { name: 'purchasing.receipts.view', module: 'purchasing', description: 'عرض الاستلامات' },
    { name: 'purchasing.receipts.create', module: 'purchasing', description: 'إنشاء استلام' },
    { name: 'purchasing.bills.view', module: 'purchasing', description: 'عرض فواتير الموردين' },
    { name: 'purchasing.bills.create', module: 'purchasing', description: 'إنشاء فاتورة مورد' },
    { name: 'purchasing.bills.pay', module: 'purchasing', description: 'دفع فاتورة مورد' },
    { name: 'purchasing.returns.view', module: 'purchasing', description: 'عرض مرتجعات المشتريات' },
    { name: 'purchasing.returns.create', module: 'purchasing', description: 'إنشاء مرتجع مشتريات' },
    { name: 'purchasing.returns.confirm', module: 'purchasing', description: 'تأكيد مرتجع مشتريات' },
    // Accounting
    { name: 'accounting.taxes.view', module: 'accounting', description: 'عرض الضرائب' },
    { name: 'accounting.taxes.create', module: 'accounting', description: 'إضافة ضريبة' },
    { name: 'accounting.taxes.edit', module: 'accounting', description: 'تعديل ضريبة' },
    { name: 'accounting.taxes.delete', module: 'accounting', description: 'حذف ضريبة' },
    { name: 'accounting.payment-terms.view', module: 'accounting', description: 'عرض شروط الدفع' },
    { name: 'accounting.payment-terms.create', module: 'accounting', description: 'إضافة شرط دفع' },
    { name: 'accounting.payment-terms.edit', module: 'accounting', description: 'تعديل شرط دفع' },
    { name: 'accounting.payment-terms.delete', module: 'accounting', description: 'حذف شرط دفع' },
    { name: 'accounting.accounts.view', module: 'accounting', description: 'عرض الحسابات' },
    { name: 'accounting.accounts.create', module: 'accounting', description: 'إضافة حساب' },
    { name: 'accounting.accounts.edit', module: 'accounting', description: 'تعديل حساب' },
    { name: 'accounting.accounts.delete', module: 'accounting', description: 'حذف حساب' },
    // Settings
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

  await prisma.logisticsSettings.upsert({
    where: { companyId: company.id },
    update: {},
    create: { id: randomUUID(), companyId: company.id },
  });

  console.log('✅ Company settings created');

  // Create Document Sequences
  const sequences = [
    { module: 'sales', docType: 'quotation', prefix: 'QUO' },
    { module: 'sales', docType: 'order', prefix: 'SO' },
    { module: 'sales', docType: 'invoice', prefix: 'INV' },
    { module: 'sales', docType: 'delivery', prefix: 'DEL' },
    { module: 'sales', docType: 'return', prefix: 'RET' },
    { module: 'purchasing', docType: 'rfq', prefix: 'RFQ' },
    { module: 'purchasing', docType: 'order', prefix: 'PO' },
    { module: 'purchasing', docType: 'bill', prefix: 'BILL' },
    { module: 'purchasing', docType: 'return', prefix: 'PRET' },
    { module: 'inventory', docType: 'receipt', prefix: 'REC' },
    { module: 'inventory', docType: 'adjustment', prefix: 'ADJ' },
    { module: 'logistics', docType: 'shipment', prefix: 'SHP' },
    { module: 'logistics', docType: 'storage', prefix: 'STR' },
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

  // Create Default Taxes
// Create Default Taxes
const taxes = [
  {
    id: randomUUID(),
    name: 'ضريبة القيمة المضافة 14%',
    rate: 14,
    taxType: 'PERCENTAGE' as TaxType,  // ✅ تم التصليح
    scope: 'BOTH' as TaxScope,
    isActive: true,
    companyId: company.id,
    etaType: 'T1',
    etaSubtype: 'V001',
    zatcaType: 'S',
  },
  {
    id: randomUUID(),
    name: 'معفى من الضريبة 0%',
    rate: 0,
    taxType: 'PERCENTAGE' as TaxType,  // ✅ تم التصليح
    scope: 'BOTH' as TaxScope,
    isActive: true,
    companyId: company.id,
    etaType: 'T1',
    etaSubtype: 'V002',
    zatcaType: 'Z',
  },
  {
    id: randomUUID(),
    name: 'ضريبة القيمة المضافة 15% (السعودية)',
    rate: 15,
    taxType: 'PERCENTAGE' as TaxType,  // ✅ تم التصليح
    scope: 'BOTH' as TaxScope,
    isActive: true,
    companyId: company.id,
    etaType: null,
    etaSubtype: null,
    zatcaType: 'S',
  },
];

  for (const tax of taxes) {
    const exists = await prisma.tax.findFirst({
      where: { name: tax.name, companyId: tax.companyId },
    });
    if (!exists) {
      await prisma.tax.create({ data: tax });
    }
  }

  console.log('✅ Default taxes created');

  // Create Default Payment Terms
  const paymentTerms = [
    {
      id: randomUUID(),
      name: 'فوري',
      companyId: company.id,
      lines: [{ id: randomUUID(), value: 100, valueType: 'PERCENT', days: 0 }],
    },
    {
      id: randomUUID(),
      name: 'صافي 30 يوم',
      companyId: company.id,
      lines: [{ id: randomUUID(), value: 100, valueType: 'PERCENT', days: 30 }],
    },
    {
      id: randomUUID(),
      name: 'صافي 60 يوم',
      companyId: company.id,
      lines: [{ id: randomUUID(), value: 100, valueType: 'PERCENT', days: 60 }],
    },
    {
      id: randomUUID(),
      name: '50% مقدم - 50% عند الاستلام',
      companyId: company.id,
      lines: [
        { id: randomUUID(), value: 50, valueType: 'PERCENT', days: 0 },
        { id: randomUUID(), value: 50, valueType: 'PERCENT', days: 30 },
      ],
    },
  ];

  for (const term of paymentTerms) {
    const exists = await prisma.paymentTerm.findFirst({
      where: { name: term.name, companyId: term.companyId },
    });
    if (!exists) {
      await prisma.paymentTerm.create({
        data: {
          id: term.id,
          name: term.name,
          companyId: term.companyId,
          lines: { create: term.lines },
        },
      });
    }
  }

  console.log('✅ Default payment terms created');

  // Create Default Chart of Accounts
const accounts = [
  { id: randomUUID(), code: '1000', name: 'الأصول المتداولة', type: 'ASSET' as AccountType, companyId: company.id },
  { id: randomUUID(), code: '1100', name: 'النقدية والبنوك', type: 'ASSET' as AccountType, companyId: company.id },
  { id: randomUUID(), code: '1200', name: 'حسابات القبض', type: 'ASSET' as AccountType, companyId: company.id },
  { id: randomUUID(), code: '1300', name: 'المخزون', type: 'ASSET' as AccountType, companyId: company.id },
  { id: randomUUID(), code: '2000', name: 'الخصوم المتداولة', type: 'LIABILITY' as AccountType, companyId: company.id },
  { id: randomUUID(), code: '2100', name: 'حسابات الدفع', type: 'LIABILITY' as AccountType, companyId: company.id },
  { id: randomUUID(), code: '2200', name: 'ضريبة القيمة المضافة المستحقة', type: 'LIABILITY' as AccountType, companyId: company.id },
  { id: randomUUID(), code: '3000', name: 'حقوق الملكية', type: 'EQUITY' as AccountType, companyId: company.id },
  { id: randomUUID(), code: '4000', name: 'المبيعات', type: 'REVENUE' as AccountType, companyId: company.id },
  { id: randomUUID(), code: '4100', name: 'إيرادات الخدمات', type: 'REVENUE' as AccountType, companyId: company.id },
  { id: randomUUID(), code: '5000', name: 'تكلفة البضاعة المباعة', type: 'COGS' as AccountType, companyId: company.id },
  { id: randomUUID(), code: '6000', name: 'المصروفات التشغيلية', type: 'EXPENSE' as AccountType, companyId: company.id },
  { id: randomUUID(), code: '6100', name: 'مصروفات الرواتب', type: 'EXPENSE' as AccountType, companyId: company.id },
  { id: randomUUID(), code: '6200', name: 'مصروفات الإيجار', type: 'EXPENSE' as AccountType, companyId: company.id },
  { id: randomUUID(), code: '6300', name: 'مصروفات المرافق', type: 'EXPENSE' as AccountType, companyId: company.id },
];

  for (const account of accounts) {
    const exists = await prisma.chartOfAccount.findFirst({
      where: { code: account.code, companyId: account.companyId },
    });
    if (!exists) {
      await prisma.chartOfAccount.create({ data: { ...account, isActive: true } });
    }
  }

  console.log('✅ Default chart of accounts created');
  console.log('');
  console.log('🎉 Seed completed successfully!');
  console.log('📧 Email: admin@erp.com');
  console.log('🔑 Password: Admin@123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());