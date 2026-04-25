import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../../generated/prisma';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import {
  TaxScope,
  AccountType,
  TaxType,
  JournalType,
  FiscalYearStatus,
  FiscalPeriodStatus,
  NormalBalance,
} from '../../../generated/prisma';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const ARABIC_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

// ─── UUIDs ثابتة للـ COA ─────────────────────────────────────────────────────
const COA = {
  ASSETS_ROOT:           'aaaaaaaa-0001-0000-0000-000000000000',
  LIABILITIES_ROOT:      'aaaaaaaa-0002-0000-0000-000000000000',
  EQUITY_ROOT:           'aaaaaaaa-0003-0000-0000-000000000000',
  REVENUE_ROOT:          'aaaaaaaa-0004-0000-0000-000000000000',
  EXPENSE_ROOT:          'aaaaaaaa-0005-0000-0000-000000000000',
  CURRENT_ASSETS:        'aaaaaaaa-0011-0000-0000-000000000000',
  FIXED_ASSETS:          'aaaaaaaa-0012-0000-0000-000000000000',
  CURRENT_LIABILITIES:   'aaaaaaaa-0021-0000-0000-000000000000',
  LONG_TERM_LIABILITIES: 'aaaaaaaa-0022-0000-0000-000000000000',
  SALES_REVENUE:         'aaaaaaaa-0041-0000-0000-000000000000',
  SERVICE_REVENUE:       'aaaaaaaa-0042-0000-0000-000000000000',
  OPERATING_EXPENSES:    'aaaaaaaa-0051-0000-0000-000000000000',
  COGS_GROUP:            'aaaaaaaa-0052-0000-0000-000000000000',
  CASH:                  'aaaaaaaa-0111-0000-0000-000000000000',
  BANK:                  'aaaaaaaa-0112-0000-0000-000000000000',
  AR:                    'aaaaaaaa-0113-0000-0000-000000000000',
  INVENTORY_ACCOUNT:     'aaaaaaaa-0114-0000-0000-000000000000',
  VAT_RECEIVABLE:        'aaaaaaaa-0115-0000-0000-000000000000',
  PREPAID_EXPENSES:      'aaaaaaaa-0121-0000-0000-000000000000',
  FIXED_ASSETS_ACCOUNT:  'aaaaaaaa-0122-0000-0000-000000000000',
  AP:                    'aaaaaaaa-0211-0000-0000-000000000000',
  VAT_PAYABLE:           'aaaaaaaa-0212-0000-0000-000000000000',
  ACCRUED_LIABILITIES:   'aaaaaaaa-0213-0000-0000-000000000000',
  CAPITAL:               'aaaaaaaa-0311-0000-0000-000000000000',
  RETAINED_EARNINGS:     'aaaaaaaa-0312-0000-0000-000000000000',
  SALES_ACCOUNT:         'aaaaaaaa-0411-0000-0000-000000000000',
  SERVICE_ACCOUNT:       'aaaaaaaa-0421-0000-0000-000000000000',
  COGS_ACCOUNT:          'aaaaaaaa-0521-0000-0000-000000000000',
  SALARIES_EXPENSE:      'aaaaaaaa-0511-0000-0000-000000000000',
  RENT_EXPENSE:          'aaaaaaaa-0512-0000-0000-000000000000',
  UTILITIES_EXPENSE:     'aaaaaaaa-0513-0000-0000-000000000000',
  MARKETING_EXPENSE:     'aaaaaaaa-0514-0000-0000-000000000000',
  DEPRECIATION_EXPENSE:  'aaaaaaaa-0515-0000-0000-000000000000',
};

// ─── UUIDs ثابتة للـ Journals ────────────────────────────────────────────────
const JOURNALS = {
  SALE:     'bbbbbbbb-0001-0000-0000-000000000000',
  PURCHASE: 'bbbbbbbb-0002-0000-0000-000000000000',
  CASH:     'bbbbbbbb-0003-0000-0000-000000000000',
  BANK:     'bbbbbbbb-0004-0000-0000-000000000000',
  GENERAL:  'bbbbbbbb-0005-0000-0000-000000000000',
};

// ─── UUIDs ثابتة للـ Payment Terms ──────────────────────────────────────────
const PT = {
  IMMEDIATE: 'cccccccc-0001-0000-0000-000000000000',
  NET30:     'cccccccc-0002-0000-0000-000000000000',
  NET60:     'cccccccc-0003-0000-0000-000000000000',
  HALF:      'cccccccc-0004-0000-0000-000000000000',
};

// ─── UUID ثابت للـ Fiscal Year ───────────────────────────────────────────────
const FISCAL_YEAR_ID = '4aa923d8-aaf4-400e-8e53-e8c8124914c5';

async function main() {
  console.log('🌱 Starting seed...\n');

  await prisma.$transaction(
    async (tx) => {

      // ─────────────────────────────────────
      // 1. COMPANY + BRANCHES
      // ─────────────────────────────────────
      console.log('📦 Creating company and branches...');

      const company = await tx.company.upsert({
        where: { email: 'admin@erp.com' },
        update: {},
        create: {
          id: randomUUID(),
          name: 'شركة النبغاء للأجهزة المنزلية',
          email: 'admin@erp.com',
          phone: '01000000000',
          address: 'القاهرة، مصر',
        },
      });

      const BRANCH_IDS = {
        CAIRO:    randomUUID(),
        SUDAN:    randomUUID(),
        SHOWROOM: randomUUID(),
      };

      const mainBranch = await tx.branch.upsert({
        where: { id: BRANCH_IDS.CAIRO },
        update: {},
        create: {
          id: BRANCH_IDS.CAIRO,
          name: 'المقر الرئيسي — القاهرة',
          address: 'القاهرة، مصر',
          phone: '01000000000',
          companyId: company.id,
        },
      });

      await tx.branch.upsert({
        where: { id: BRANCH_IDS.SUDAN },
        update: {},
        create: {
          id: BRANCH_IDS.SUDAN,
          name: 'فرع السودان — الخرطوم',
          address: 'الخرطوم، السودان',
          phone: '',
          companyId: company.id,
        },
      });

      await tx.branch.upsert({
        where: { id: BRANCH_IDS.SHOWROOM },
        update: {},
        create: {
          id: BRANCH_IDS.SHOWROOM,
          name: 'معرض القاهرة',
          address: 'القاهرة، مصر',
          companyId: company.id,
        },
      });

      console.log('✅ Company & branches created\n');

      // ─────────────────────────────────────
      // 2. FISCAL YEAR + FISCAL PERIODS
      // ─────────────────────────────────────
      console.log('📅 Creating fiscal year and periods...');

      const fiscalYearStart = new Date('2026-01-01T00:00:00.000Z');
      const fiscalYearEnd   = new Date('2026-12-31T23:59:59.999Z');

      const fiscalYear = await tx.fiscalYear.upsert({
        where: { companyId_startDate: { companyId: company.id, startDate: fiscalYearStart } },
        update: {},
        create: {
          id: FISCAL_YEAR_ID,
          name: 'السنة المالية 2026',
          startDate: fiscalYearStart,
          endDate: fiscalYearEnd,
          status: FiscalYearStatus.OPEN,
          companyId: company.id,
        },
      });

      for (let month = 0; month < 12; month++) {
        const periodStart  = new Date(2026, month, 1);
        const periodEnd    = new Date(2026, month + 1, 0, 23, 59, 59, 999);
        const periodNumber = month + 1;
        const periodName   = `${ARABIC_MONTHS[month]} 2026`;

        await tx.fiscalPeriod.upsert({
          where: { fiscalYearId_periodNumber: { fiscalYearId: fiscalYear.id, periodNumber } },
          update: {},
          create: {
            id: randomUUID(),
            name: periodName,
            startDate: periodStart,
            endDate: periodEnd,
            periodNumber,
            status: FiscalPeriodStatus.OPEN,
            companyId: company.id,
            fiscalYearId: fiscalYear.id,
          },
        });
      }

      console.log('✅ Fiscal year 2026 + 12 periods created\n');

      // ─────────────────────────────────────
      // 3. ROLES + PERMISSIONS
      // ─────────────────────────────────────
      console.log('🔐 Creating roles and permissions...');

      const superAdminRole = await tx.role.upsert({
        where: { id: 'super-admin-role' },
        update: {},
        create: { id: 'super-admin-role', name: 'Super Admin', description: 'صلاحيات كاملة على النظام' },
      });

      const accountantRole = await tx.role.upsert({
        where: { id: 'accountant-role' },
        update: {},
        create: { id: 'accountant-role', name: 'محاسب', description: 'صلاحيات المحاسبة والتقارير المالية' },
      });

      const salesRole = await tx.role.upsert({
        where: { id: 'sales-role' },
        update: {},
        create: { id: 'sales-role', name: 'مندوب مبيعات', description: 'صلاحيات المبيعات والعملاء' },
      });

      const warehouseRole = await tx.role.upsert({
        where: { id: 'warehouse-role' },
        update: {},
        create: { id: 'warehouse-role', name: 'أمين مخزن', description: 'صلاحيات المخزون والمستودعات' },
      });

      const permissions = [
        { name: 'inventory.products.view',                module: 'inventory',   description: 'عرض المنتجات' },
        { name: 'inventory.products.create',              module: 'inventory',   description: 'إضافة منتج' },
        { name: 'inventory.products.edit',                module: 'inventory',   description: 'تعديل منتج' },
        { name: 'inventory.products.delete',              module: 'inventory',   description: 'حذف منتج' },
        { name: 'inventory.warehouses.view',              module: 'inventory',   description: 'عرض المخازن' },
        { name: 'inventory.warehouses.create',            module: 'inventory',   description: 'إضافة مخزن' },
        { name: 'inventory.warehouses.edit',              module: 'inventory',   description: 'تعديل مخزن' },
        { name: 'inventory.warehouses.delete',            module: 'inventory',   description: 'حذف مخزن' },
        { name: 'inventory.stock.view',                   module: 'inventory',   description: 'عرض المخزون' },
        { name: 'inventory.stock.edit',                   module: 'inventory',   description: 'تعديل المخزون' },
        { name: 'inventory.stock.transfer',               module: 'inventory',   description: 'تحويل مخزون' },
        { name: 'inventory.categories.view',              module: 'inventory',   description: 'عرض التصنيفات' },
        { name: 'inventory.categories.create',            module: 'inventory',   description: 'إضافة تصنيف' },
        { name: 'inventory.categories.delete',            module: 'inventory',   description: 'حذف تصنيف' },
        { name: 'inventory.units.view',                   module: 'inventory',   description: 'عرض وحدات القياس' },
        { name: 'inventory.units.create',                 module: 'inventory',   description: 'إضافة وحدة قياس' },
        { name: 'inventory.units.delete',                 module: 'inventory',   description: 'حذف وحدة قياس' },
        { name: 'inventory.adjustments.view',             module: 'inventory',   description: 'عرض تسويات المخزون' },
        { name: 'inventory.adjustments.create',           module: 'inventory',   description: 'إنشاء تسوية مخزون' },
        { name: 'inventory.adjustments.confirm',          module: 'inventory',   description: 'تأكيد تسوية مخزون' },
        { name: 'inventory.reordering.view',              module: 'inventory',   description: 'عرض قواعد إعادة الطلب' },
        { name: 'inventory.reordering.create',            module: 'inventory',   description: 'إضافة قاعدة إعادة طلب' },
        { name: 'inventory.reordering.delete',            module: 'inventory',   description: 'حذف قاعدة إعادة طلب' },
        { name: 'inventory.variants.create',              module: 'inventory',   description: 'إضافة متغير منتج' },
        { name: 'inventory.variants.delete',              module: 'inventory',   description: 'حذف متغير منتج' },
        { name: 'inventory.traceability.view',            module: 'inventory',   description: 'عرض تتبع المنتجات' },
        { name: 'inventory.traceability.create',          module: 'inventory',   description: 'إضافة بيانات تتبع' },
        { name: 'inventory.valuation.view',               module: 'inventory',   description: 'عرض تقييم المخزون' },
        { name: 'inventory.settings.view',                module: 'inventory',   description: 'عرض إعدادات المخزون' },
        { name: 'inventory.settings.edit',                module: 'inventory',   description: 'تعديل إعدادات المخزون' },
        { name: 'sales.customers.view',                   module: 'sales',       description: 'عرض العملاء' },
        { name: 'sales.customers.create',                 module: 'sales',       description: 'إضافة عميل' },
        { name: 'sales.customers.edit',                   module: 'sales',       description: 'تعديل عميل' },
        { name: 'sales.customers.delete',                 module: 'sales',       description: 'حذف عميل' },
        { name: 'sales.quotations.view',                  module: 'sales',       description: 'عرض عروض الأسعار' },
        { name: 'sales.quotations.create',                module: 'sales',       description: 'إنشاء عرض سعر' },
        { name: 'sales.quotations.confirm',               module: 'sales',       description: 'تأكيد عرض سعر' },
        { name: 'sales.orders.view',                      module: 'sales',       description: 'عرض أوامر البيع' },
        { name: 'sales.orders.create',                    module: 'sales',       description: 'إنشاء أمر بيع' },
        { name: 'sales.orders.confirm',                   module: 'sales',       description: 'تأكيد أمر بيع' },
        { name: 'sales.orders.cancel',                    module: 'sales',       description: 'إلغاء أمر بيع' },
        { name: 'sales.deliveries.view',                  module: 'sales',       description: 'عرض التسليمات' },
        { name: 'sales.deliveries.create',                module: 'sales',       description: 'إنشاء تسليم' },
        { name: 'sales.deliveries.confirm',               module: 'sales',       description: 'تأكيد تسليم' },
        { name: 'sales.invoices.view',                    module: 'sales',       description: 'عرض الفواتير' },
        { name: 'sales.invoices.create',                  module: 'sales',       description: 'إنشاء فاتورة' },
        { name: 'sales.invoices.pay',                     module: 'sales',       description: 'تسجيل دفع' },
        { name: 'sales.invoices.cancel',                  module: 'sales',       description: 'إلغاء فاتورة' },
        { name: 'sales.returns.view',                     module: 'sales',       description: 'عرض المرتجعات' },
        { name: 'sales.returns.create',                   module: 'sales',       description: 'إنشاء مرتجع' },
        { name: 'sales.returns.confirm',                  module: 'sales',       description: 'تأكيد مرتجع' },
        { name: 'purchasing.suppliers.view',              module: 'purchasing',  description: 'عرض الموردين' },
        { name: 'purchasing.suppliers.create',            module: 'purchasing',  description: 'إضافة مورد' },
        { name: 'purchasing.suppliers.edit',              module: 'purchasing',  description: 'تعديل مورد' },
        { name: 'purchasing.suppliers.delete',            module: 'purchasing',  description: 'حذف مورد' },
        { name: 'purchasing.rfq.view',                    module: 'purchasing',  description: 'عرض طلبات عروض الأسعار' },
        { name: 'purchasing.rfq.create',                  module: 'purchasing',  description: 'إنشاء طلب عرض سعر' },
        { name: 'purchasing.rfq.send',                    module: 'purchasing',  description: 'إرسال طلب عرض سعر' },
        { name: 'purchasing.rfq.confirm',                 module: 'purchasing',  description: 'تأكيد طلب عرض سعر' },
        { name: 'purchasing.rfq.cancel',                  module: 'purchasing',  description: 'إلغاء طلب عرض سعر' },
        { name: 'purchasing.orders.view',                 module: 'purchasing',  description: 'عرض أوامر الشراء' },
        { name: 'purchasing.orders.create',               module: 'purchasing',  description: 'إنشاء أمر شراء' },
        { name: 'purchasing.orders.confirm',              module: 'purchasing',  description: 'تأكيد أمر شراء' },
        { name: 'purchasing.orders.cancel',               module: 'purchasing',  description: 'إلغاء أمر شراء' },
        { name: 'purchasing.receipts.view',               module: 'purchasing',  description: 'عرض الاستلامات' },
        { name: 'purchasing.receipts.create',             module: 'purchasing',  description: 'إنشاء استلام' },
        { name: 'purchasing.bills.view',                  module: 'purchasing',  description: 'عرض فواتير الموردين' },
        { name: 'purchasing.bills.create',                module: 'purchasing',  description: 'إنشاء فاتورة مورد' },
        { name: 'purchasing.bills.pay',                   module: 'purchasing',  description: 'دفع فاتورة مورد' },
        { name: 'purchasing.bills.cancel',                module: 'purchasing',  description: 'إلغاء فاتورة مورد' },
        { name: 'purchasing.returns.view',                module: 'purchasing',  description: 'عرض مرتجعات المشتريات' },
        { name: 'purchasing.returns.create',              module: 'purchasing',  description: 'إنشاء مرتجع مشتريات' },
        { name: 'purchasing.returns.confirm',             module: 'purchasing',  description: 'تأكيد مرتجع مشتريات' },
        { name: 'accounting.taxes.view',                  module: 'accounting',  description: 'عرض الضرائب' },
        { name: 'accounting.taxes.create',                module: 'accounting',  description: 'إضافة ضريبة' },
        { name: 'accounting.taxes.edit',                  module: 'accounting',  description: 'تعديل ضريبة' },
        { name: 'accounting.taxes.delete',                module: 'accounting',  description: 'حذف ضريبة' },
        { name: 'accounting.payment-terms.view',          module: 'accounting',  description: 'عرض شروط الدفع' },
        { name: 'accounting.payment-terms.create',        module: 'accounting',  description: 'إضافة شرط دفع' },
        { name: 'accounting.payment-terms.edit',          module: 'accounting',  description: 'تعديل شرط دفع' },
        { name: 'accounting.payment-terms.delete',        module: 'accounting',  description: 'حذف شرط دفع' },
        { name: 'accounting.accounts.view',               module: 'accounting',  description: 'عرض الحسابات' },
        { name: 'accounting.accounts.create',             module: 'accounting',  description: 'إضافة حساب' },
        { name: 'accounting.accounts.edit',               module: 'accounting',  description: 'تعديل حساب' },
        { name: 'accounting.accounts.delete',             module: 'accounting',  description: 'حذف حساب' },
        { name: 'accounting.journals.view',               module: 'accounting',  description: 'عرض دفاتر اليومية' },
        { name: 'accounting.journals.create',             module: 'accounting',  description: 'إضافة دفتر يومية' },
        { name: 'accounting.journals.edit',               module: 'accounting',  description: 'تعديل دفتر يومية' },
        { name: 'accounting.journals.delete',             module: 'accounting',  description: 'حذف دفتر يومية' },
        { name: 'accounting.journal-entries.view',        module: 'accounting',  description: 'عرض القيود المحاسبية' },
        { name: 'accounting.journal-entries.create',      module: 'accounting',  description: 'إنشاء قيد محاسبي' },
        { name: 'accounting.journal-entries.edit',        module: 'accounting',  description: 'تعديل قيد محاسبي' },
        { name: 'accounting.journal-entries.post',        module: 'accounting',  description: 'ترحيل قيد محاسبي' },
        { name: 'accounting.journal-entries.cancel',      module: 'accounting',  description: 'إلغاء قيد محاسبي' },
        { name: 'accounting.fiscal-years.view',           module: 'accounting',  description: 'عرض السنوات المالية' },
        { name: 'accounting.fiscal-years.create',         module: 'accounting',  description: 'إنشاء سنة مالية' },
        { name: 'accounting.fiscal-years.close',          module: 'accounting',  description: 'إقفال سنة مالية' },
        { name: 'accounting.fiscal-years.lock',           module: 'accounting',  description: 'قفل سنة مالية نهائياً' },
        { name: 'accounting.fiscal-periods.view',         module: 'accounting',  description: 'عرض الفترات المحاسبية' },
        { name: 'accounting.fiscal-periods.open',         module: 'accounting',  description: 'فتح فترة محاسبية' },
        { name: 'accounting.fiscal-periods.soft-lock',    module: 'accounting',  description: 'قفل فترة محاسبية (قابل للفتح)' },
        { name: 'accounting.fiscal-periods.hard-lock',    module: 'accounting',  description: 'قفل فترة محاسبية نهائياً' },
        { name: 'accounting.reports.trial-balance',       module: 'accounting',  description: 'تقرير ميزان المراجعة' },
        { name: 'accounting.reports.income-statement',    module: 'accounting',  description: 'تقرير الدخل والخسارة' },
        { name: 'accounting.reports.balance-sheet',       module: 'accounting',  description: 'تقرير الميزانية العمومية' },
        { name: 'accounting.reports.general-ledger',      module: 'accounting',  description: 'تقرير الأستاذ العام' },
        { name: 'accounting.reports.cash-flow',           module: 'accounting',  description: 'تقرير التدفقات النقدية' },
        { name: 'accounting.settings.view',               module: 'accounting',  description: 'عرض إعدادات المحاسبة' },
        { name: 'accounting.settings.edit',               module: 'accounting',  description: 'تعديل إعدادات المحاسبة' },
        { name: 'settings.company.view',                  module: 'core',        description: 'عرض إعدادات الشركة' },
        { name: 'settings.company.edit',                  module: 'core',        description: 'تعديل إعدادات الشركة' },
        { name: 'settings.currencies.view',               module: 'core',        description: 'عرض العملات' },
        { name: 'settings.currencies.create',             module: 'core',        description: 'إضافة عملة' },
        { name: 'settings.currencies.edit',               module: 'core',        description: 'تعديل سعر صرف' },
        { name: 'settings.branches.view',                 module: 'core',        description: 'عرض الفروع' },
        { name: 'settings.branches.create',               module: 'core',        description: 'إضافة فرع' },
        { name: 'settings.branches.edit',                 module: 'core',        description: 'تعديل فرع' },
        { name: 'settings.users.view',                    module: 'core',        description: 'عرض المستخدمين' },
        { name: 'settings.users.create',                  module: 'core',        description: 'إضافة مستخدم' },
        { name: 'settings.users.edit',                    module: 'core',        description: 'تعديل مستخدم' },
        { name: 'settings.roles.view',                    module: 'core',        description: 'عرض الأدوار' },
        { name: 'settings.roles.create',                  module: 'core',        description: 'إضافة دور' },
        { name: 'settings.roles.edit',                    module: 'core',        description: 'تعديل دور' },
      ];

      for (const perm of permissions) {
        await tx.permission.upsert({
          where: { name: perm.name },
          update: {},
          create: perm,
        });
      }

      const allPermissions = await tx.permission.findMany();

      for (const perm of allPermissions) {
        await tx.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: superAdminRole.id, permissionId: perm.id } },
          update: {},
          create: { roleId: superAdminRole.id, permissionId: perm.id },
        });
      }

      const accountingPermissions = allPermissions.filter(
        (p) => p.module === 'accounting' || p.name.startsWith('settings.currencies'),
      );
      for (const perm of accountingPermissions) {
        await tx.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: accountantRole.id, permissionId: perm.id } },
          update: {},
          create: { roleId: accountantRole.id, permissionId: perm.id },
        });
      }

      const salesPermissions = allPermissions.filter((p) => p.module === 'sales');
      for (const perm of salesPermissions) {
        await tx.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: salesRole.id, permissionId: perm.id } },
          update: {},
          create: { roleId: salesRole.id, permissionId: perm.id },
        });
      }

      const warehousePermissions = allPermissions.filter((p) => p.module === 'inventory');
      for (const perm of warehousePermissions) {
        await tx.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: warehouseRole.id, permissionId: perm.id } },
          update: {},
          create: { roleId: warehouseRole.id, permissionId: perm.id },
        });
      }

      console.log('✅ Roles & permissions created\n');

      // ─────────────────────────────────────
      // 4. USERS
      // ─────────────────────────────────────
      console.log('👤 Creating users...');

      const hashedPassword = await bcrypt.hash('Admin@123', 10);

      const adminUser = await tx.user.upsert({
        where: { email: 'admin@erp.com' },
        update: {},
        create: {
          name: 'مدير النظام',
          email: 'admin@erp.com',
          password: hashedPassword,
          companyId: company.id,
          branchId: mainBranch.id,
        },
      });

      await tx.userRole.upsert({
        where: { userId_roleId: { userId: adminUser.id, roleId: superAdminRole.id } },
        update: {},
        create: { userId: adminUser.id, roleId: superAdminRole.id },
      });

      console.log('✅ Users created\n');

      // ─────────────────────────────────────
      // 5. CURRENCIES
      // ─────────────────────────────────────
      console.log('💱 Creating currencies...');

      await tx.currency.upsert({ where: { code: 'EGP' }, update: {}, create: { code: 'EGP', name: 'جنيه مصري',     symbol: 'ج.م', isBase: true,  isActive: true } });
      await tx.currency.upsert({ where: { code: 'USD' }, update: {}, create: { code: 'USD', name: 'دولار أمريكي', symbol: '$',   isBase: false, isActive: true } });
      await tx.currency.upsert({ where: { code: 'AED' }, update: {}, create: { code: 'AED', name: 'درهم إماراتي', symbol: 'د.إ', isBase: false, isActive: true } });
      await tx.currency.upsert({ where: { code: 'EUR' }, update: {}, create: { code: 'EUR', name: 'يورو',          symbol: '€',   isBase: false, isActive: true } });
      await tx.currency.upsert({ where: { code: 'SDG' }, update: {}, create: { code: 'SDG', name: 'جنيه سوداني',  symbol: 'ج.س', isBase: false, isActive: true } });

      const usdCurrency = await tx.currency.findUnique({ where: { code: 'USD' } });
      if (usdCurrency) {
        await tx.exchangeRate.create({ data: { currencyId: usdCurrency.id, rate: 50.0, date: new Date() } });
      }

      const sdgCurrency = await tx.currency.findUnique({ where: { code: 'SDG' } });
      if (sdgCurrency) {
        await tx.exchangeRate.create({ data: { currencyId: sdgCurrency.id, rate: 0.09, date: new Date() } });
      }

      console.log('✅ Currencies created\n');

      // ─────────────────────────────────────
      // 6. CHART OF ACCOUNTS
      // ─────────────────────────────────────
      console.log('📊 Creating chart of accounts...');

      type CoaRecord = {
        id: string; code: string; name: string; type: AccountType;
        normalBalance: NormalBalance; level: number; isGroup: boolean;
        parentId: string | null; companyId: string; isActive: boolean;
      };

      const chartOfAccounts: CoaRecord[] = [
        // Level 1
        { id: COA.ASSETS_ROOT,           code: '1',   name: 'الأصول',                          type: AccountType.ASSET,      normalBalance: NormalBalance.DEBIT,  level: 1, isGroup: true,  parentId: null,                    companyId: company.id, isActive: true },
        { id: COA.LIABILITIES_ROOT,      code: '2',   name: 'الخصوم',                          type: AccountType.LIABILITY,  normalBalance: NormalBalance.CREDIT, level: 1, isGroup: true,  parentId: null,                    companyId: company.id, isActive: true },
        { id: COA.EQUITY_ROOT,           code: '3',   name: 'حقوق الملكية',                    type: AccountType.EQUITY,     normalBalance: NormalBalance.CREDIT, level: 1, isGroup: true,  parentId: null,                    companyId: company.id, isActive: true },
        { id: COA.REVENUE_ROOT,          code: '4',   name: 'الإيرادات',                       type: AccountType.REVENUE,    normalBalance: NormalBalance.CREDIT, level: 1, isGroup: true,  parentId: null,                    companyId: company.id, isActive: true },
        { id: COA.EXPENSE_ROOT,          code: '5',   name: 'المصروفات',                       type: AccountType.EXPENSE,    normalBalance: NormalBalance.DEBIT,  level: 1, isGroup: true,  parentId: null,                    companyId: company.id, isActive: true },
        // Level 2
        { id: COA.CURRENT_ASSETS,        code: '11',  name: 'الأصول المتداولة',                type: AccountType.ASSET,      normalBalance: NormalBalance.DEBIT,  level: 2, isGroup: true,  parentId: COA.ASSETS_ROOT,         companyId: company.id, isActive: true },
        { id: COA.FIXED_ASSETS,          code: '12',  name: 'الأصول الثابتة',                  type: AccountType.ASSET,      normalBalance: NormalBalance.DEBIT,  level: 2, isGroup: true,  parentId: COA.ASSETS_ROOT,         companyId: company.id, isActive: true },
        { id: COA.CURRENT_LIABILITIES,   code: '21',  name: 'الخصوم المتداولة',                type: AccountType.LIABILITY,  normalBalance: NormalBalance.CREDIT, level: 2, isGroup: true,  parentId: COA.LIABILITIES_ROOT,    companyId: company.id, isActive: true },
        { id: COA.LONG_TERM_LIABILITIES, code: '22',  name: 'الخصوم طويلة الأجل',              type: AccountType.LIABILITY,  normalBalance: NormalBalance.CREDIT, level: 2, isGroup: true,  parentId: COA.LIABILITIES_ROOT,    companyId: company.id, isActive: true },
        { id: COA.SALES_REVENUE,         code: '41',  name: 'إيرادات المبيعات',                type: AccountType.REVENUE,    normalBalance: NormalBalance.CREDIT, level: 2, isGroup: true,  parentId: COA.REVENUE_ROOT,        companyId: company.id, isActive: true },
        { id: COA.SERVICE_REVENUE,       code: '42',  name: 'إيرادات الخدمات',                 type: AccountType.REVENUE,    normalBalance: NormalBalance.CREDIT, level: 2, isGroup: true,  parentId: COA.REVENUE_ROOT,        companyId: company.id, isActive: true },
        { id: COA.OPERATING_EXPENSES,    code: '51',  name: 'المصروفات التشغيلية',             type: AccountType.EXPENSE,    normalBalance: NormalBalance.DEBIT,  level: 2, isGroup: true,  parentId: COA.EXPENSE_ROOT,        companyId: company.id, isActive: true },
        { id: COA.COGS_GROUP,            code: '52',  name: 'تكلفة البضاعة المباعة',           type: AccountType.COGS,       normalBalance: NormalBalance.DEBIT,  level: 2, isGroup: true,  parentId: COA.EXPENSE_ROOT,        companyId: company.id, isActive: true },
        // Level 3
        { id: COA.CASH,                  code: '111', name: 'الصندوق',                         type: AccountType.CASH,       normalBalance: NormalBalance.DEBIT,  level: 3, isGroup: false, parentId: COA.CURRENT_ASSETS,      companyId: company.id, isActive: true },
        { id: COA.BANK,                  code: '112', name: 'البنك',                           type: AccountType.BANK,       normalBalance: NormalBalance.DEBIT,  level: 3, isGroup: false, parentId: COA.CURRENT_ASSETS,      companyId: company.id, isActive: true },
        { id: COA.AR,                    code: '113', name: 'العملاء — حسابات القبض',          type: AccountType.RECEIVABLE, normalBalance: NormalBalance.DEBIT,  level: 3, isGroup: false, parentId: COA.CURRENT_ASSETS,      companyId: company.id, isActive: true },
        { id: COA.INVENTORY_ACCOUNT,     code: '114', name: 'المخزون',                         type: AccountType.ASSET,      normalBalance: NormalBalance.DEBIT,  level: 3, isGroup: false, parentId: COA.CURRENT_ASSETS,      companyId: company.id, isActive: true },
        { id: COA.VAT_RECEIVABLE,        code: '115', name: 'ضريبة القيمة المضافة — مدخلات',  type: AccountType.ASSET,      normalBalance: NormalBalance.DEBIT,  level: 3, isGroup: false, parentId: COA.CURRENT_ASSETS,      companyId: company.id, isActive: true },
        { id: COA.PREPAID_EXPENSES,      code: '121', name: 'مصروفات مدفوعة مقدماً',          type: AccountType.ASSET,      normalBalance: NormalBalance.DEBIT,  level: 3, isGroup: false, parentId: COA.FIXED_ASSETS,        companyId: company.id, isActive: true },
        { id: COA.FIXED_ASSETS_ACCOUNT,  code: '122', name: 'الأصول الثابتة — صافي',          type: AccountType.ASSET,      normalBalance: NormalBalance.DEBIT,  level: 3, isGroup: false, parentId: COA.FIXED_ASSETS,        companyId: company.id, isActive: true },
        { id: COA.AP,                    code: '211', name: 'الموردون — حسابات الدفع',         type: AccountType.PAYABLE,    normalBalance: NormalBalance.CREDIT, level: 3, isGroup: false, parentId: COA.CURRENT_LIABILITIES, companyId: company.id, isActive: true },
        { id: COA.VAT_PAYABLE,           code: '212', name: 'ضريبة القيمة المضافة — مخرجات',  type: AccountType.LIABILITY,  normalBalance: NormalBalance.CREDIT, level: 3, isGroup: false, parentId: COA.CURRENT_LIABILITIES, companyId: company.id, isActive: true },
        { id: COA.ACCRUED_LIABILITIES,   code: '213', name: 'مستحقات الدفع',                  type: AccountType.LIABILITY,  normalBalance: NormalBalance.CREDIT, level: 3, isGroup: false, parentId: COA.CURRENT_LIABILITIES, companyId: company.id, isActive: true },
        { id: COA.CAPITAL,               code: '311', name: 'رأس المال',                       type: AccountType.EQUITY,     normalBalance: NormalBalance.CREDIT, level: 3, isGroup: false, parentId: COA.EQUITY_ROOT,         companyId: company.id, isActive: true },
        { id: COA.RETAINED_EARNINGS,     code: '312', name: 'الأرباح المحتجزة',               type: AccountType.EQUITY,     normalBalance: NormalBalance.CREDIT, level: 3, isGroup: false, parentId: COA.EQUITY_ROOT,         companyId: company.id, isActive: true },
        { id: COA.SALES_ACCOUNT,         code: '411', name: 'إيرادات المبيعات',               type: AccountType.REVENUE,    normalBalance: NormalBalance.CREDIT, level: 3, isGroup: false, parentId: COA.SALES_REVENUE,       companyId: company.id, isActive: true },
        { id: COA.SERVICE_ACCOUNT,       code: '421', name: 'إيرادات الخدمات',                type: AccountType.REVENUE,    normalBalance: NormalBalance.CREDIT, level: 3, isGroup: false, parentId: COA.SERVICE_REVENUE,     companyId: company.id, isActive: true },
        { id: COA.COGS_ACCOUNT,          code: '521', name: 'تكلفة البضاعة المباعة',          type: AccountType.COGS,       normalBalance: NormalBalance.DEBIT,  level: 3, isGroup: false, parentId: COA.COGS_GROUP,          companyId: company.id, isActive: true },
        { id: COA.SALARIES_EXPENSE,      code: '511', name: 'مصروفات الرواتب والأجور',        type: AccountType.EXPENSE,    normalBalance: NormalBalance.DEBIT,  level: 3, isGroup: false, parentId: COA.OPERATING_EXPENSES,  companyId: company.id, isActive: true },
        { id: COA.RENT_EXPENSE,          code: '512', name: 'مصروفات الإيجار',                type: AccountType.EXPENSE,    normalBalance: NormalBalance.DEBIT,  level: 3, isGroup: false, parentId: COA.OPERATING_EXPENSES,  companyId: company.id, isActive: true },
        { id: COA.UTILITIES_EXPENSE,     code: '513', name: 'مصروفات المرافق',               type: AccountType.EXPENSE,    normalBalance: NormalBalance.DEBIT,  level: 3, isGroup: false, parentId: COA.OPERATING_EXPENSES,  companyId: company.id, isActive: true },
        { id: COA.MARKETING_EXPENSE,     code: '514', name: 'مصروفات التسويق والإعلان',       type: AccountType.EXPENSE,    normalBalance: NormalBalance.DEBIT,  level: 3, isGroup: false, parentId: COA.OPERATING_EXPENSES,  companyId: company.id, isActive: true },
        { id: COA.DEPRECIATION_EXPENSE,  code: '515', name: 'مصروفات الإهلاك',               type: AccountType.EXPENSE,    normalBalance: NormalBalance.DEBIT,  level: 3, isGroup: false, parentId: COA.OPERATING_EXPENSES,  companyId: company.id, isActive: true },
      ];

      const sortedAccounts = chartOfAccounts.sort((a, b) => a.level - b.level);
      for (const account of sortedAccounts) {
        const exists = await tx.chartOfAccount.findFirst({ where: { companyId: company.id, code: account.code } });
        if (!exists) await tx.chartOfAccount.create({ data: account });
      }

      console.log('✅ Chart of accounts created\n');

      // ─────────────────────────────────────
      // 7. JOURNALS
      // ─────────────────────────────────────
      console.log('📓 Creating journals...');

      const journals = [
        { id: JOURNALS.SALE,     name: 'يومية المبيعات',  type: JournalType.SALE,     companyId: company.id },
        { id: JOURNALS.PURCHASE, name: 'يومية المشتريات', type: JournalType.PURCHASE,  companyId: company.id },
        { id: JOURNALS.CASH,     name: 'يومية الصندوق',   type: JournalType.CASH,     companyId: company.id },
        { id: JOURNALS.BANK,     name: 'يومية البنك',     type: JournalType.BANK,     companyId: company.id },
        { id: JOURNALS.GENERAL,  name: 'يومية عامة',      type: JournalType.GENERAL,  companyId: company.id },
      ];

      for (const journal of journals) {
        const exists = await tx.journal.findFirst({ where: { name: journal.name, companyId: journal.companyId } });
        if (!exists) await tx.journal.create({ data: journal });
      }

      console.log('✅ Journals created\n');

      // ─────────────────────────────────────
      // 8. TAXES
      // ─────────────────────────────────────
      console.log('🧾 Creating taxes...');

      const taxes = [
        {
          id: randomUUID(),
          name: 'ضريبة القيمة المضافة 14%',
          rate: 14,
          taxType: TaxType.PERCENTAGE,
          scope: TaxScope.BOTH,
          isActive: true,
          companyId: company.id,
          etaType: 'T1',
          etaSubtype: 'V001',
          zatcaType: null,
          salesAccountId: COA.VAT_PAYABLE,
          purchaseAccountId: COA.VAT_RECEIVABLE,
        },
        {
          id: randomUUID(),
          name: 'معفى من الضريبة 0%',
          rate: 0,
          taxType: TaxType.PERCENTAGE,
          scope: TaxScope.BOTH,
          isActive: true,
          companyId: company.id,
          etaType: 'T1',
          etaSubtype: 'V002',
          zatcaType: null,
          salesAccountId: COA.VAT_PAYABLE,
          purchaseAccountId: COA.VAT_RECEIVABLE,
        },
      ];

      for (const tax of taxes) {
        const exists = await tx.tax.findFirst({ where: { name: tax.name, companyId: tax.companyId } });
        if (!exists) await tx.tax.create({ data: tax });
      }

      console.log('✅ Taxes created\n');

      // ─────────────────────────────────────
      // 9. PAYMENT TERMS
      // ─────────────────────────────────────
      console.log('💳 Creating payment terms...');

      const paymentTerms = [
        {
          id: PT.IMMEDIATE,
          name: 'فوري',
          companyId: company.id,
          lines: [{ id: randomUUID(), value: 100, valueType: 'PERCENT', days: 0 }],
        },
        {
          id: PT.NET30,
          name: 'صافي 30 يوم',
          companyId: company.id,
          lines: [{ id: randomUUID(), value: 100, valueType: 'PERCENT', days: 30 }],
        },
        {
          id: PT.NET60,
          name: 'صافي 60 يوم',
          companyId: company.id,
          lines: [{ id: randomUUID(), value: 100, valueType: 'PERCENT', days: 60 }],
        },
        {
          id: PT.HALF,
          name: '50% مقدم — 50% عند الاستلام',
          companyId: company.id,
          lines: [
            { id: randomUUID(), value: 50, valueType: 'PERCENT', days: 0 },
            { id: randomUUID(), value: 50, valueType: 'PERCENT', days: 30 },
          ],
        },
      ];

      for (const term of paymentTerms) {
        const exists = await tx.paymentTerm.findFirst({ where: { name: term.name, companyId: term.companyId } });
        if (!exists) {
          await tx.paymentTerm.create({
            data: {
              id: term.id,
              name: term.name,
              companyId: term.companyId,
              lines: { create: term.lines },
            },
          });
        }
      }

      console.log('✅ Payment terms created\n');

      // ─────────────────────────────────────
      // 10. SETTINGS
      // ─────────────────────────────────────
      console.log('⚙️  Creating settings...');

      await tx.companySettings.upsert({
        where: { companyId: company.id },
        update: {},
        create: {
          id: randomUUID(),
          companyId: company.id,
          defaultCurrency: 'EGP',
          fiscalYearStart: 1,
          country: 'EG',
          taxIncludedInPrice: false,
          etaEnabled: false,
          etaEnvironment: 'sandbox',
          zatcaEnabled: false,
        },
      });

      await tx.accountingSettings.upsert({
        where: { companyId: company.id },
        update: {},
        create: {
          id: randomUUID(),
          companyId: company.id,
          method: 'ACCRUAL',
          taxMethod: 'EXCLUSIVE',
          multiCurrency: true,
          journalEntriesEnabled: true,
          defaultSalesAccount:      COA.SALES_ACCOUNT,
          defaultCOGSAccount:       COA.COGS_ACCOUNT,
          defaultExpenseAccount:    COA.OPERATING_EXPENSES,
          defaultARAccount:         COA.AR,
          defaultAPAccount:         COA.AP,
          defaultCashAccount:       COA.CASH,
          defaultBankAccount:       COA.BANK,
          defaultSaleJournalId:     JOURNALS.SALE,
          defaultPurchaseJournalId: JOURNALS.PURCHASE,
          defaultCashJournalId:     JOURNALS.CASH,
          defaultBankJournalId:     JOURNALS.BANK,
        },
      });

      await tx.salesSettings.upsert({
        where: { companyId: company.id },
        update: {},
        create: {
          id: randomUUID(),
          companyId: company.id,
          taxEnabled: true,
          multiCurrency: true,
          allowDiscounts: true,
          quotationsEnabled: true,
          deliveryEnabled: true,
          salesReturnsEnabled: true,
          requireApproval: false,
        },
      });

      await tx.purchasingSettings.upsert({
        where: { companyId: company.id },
        update: {},
        create: {
          id: randomUUID(),
          companyId: company.id,
          taxEnabled: true,
          rfqEnabled: true,
          purchaseReturnsEnabled: true,
          landedCostsEnabled: false,
          threeWayMatching: false,
          requireApproval: false,
        },
      });

      await tx.inventorySettings.upsert({
        where: { companyId: company.id },
        update: {},
        create: {
          id: randomUUID(),
          companyId: company.id,
          valuationMethod: 'FIFO',
          trackLotNumbers: false,
          trackSerialNumbers: false,
          trackExpiryDates: false,
          allowNegativeStock: false,
          enableLowStockAlert: true,
        },
      });

      await tx.logisticsSettings.upsert({
        where: { companyId: company.id },
        update: {},
        create: {
          id: randomUUID(),
          companyId: company.id,
          localDeliveryEnabled: true,
          exportEnabled: false,
          storageEnabled: true,
          vehicleManagement: false,
        },
      });

      console.log('✅ All settings created\n');

      // ─────────────────────────────────────
      // 11. DOCUMENT SEQUENCES
      // ─────────────────────────────────────
      console.log('🔢 Creating document sequences...');

      const sequences = [
        { module: 'sales',      docType: 'quotation',     prefix: 'QUO'  },
        { module: 'sales',      docType: 'order',         prefix: 'SO'   },
        { module: 'sales',      docType: 'invoice',       prefix: 'INV'  },
        { module: 'sales',      docType: 'delivery',      prefix: 'DEL'  },
        { module: 'sales',      docType: 'return',        prefix: 'SRET' },
        { module: 'purchasing', docType: 'rfq',           prefix: 'RFQ'  },
        { module: 'purchasing', docType: 'order',         prefix: 'PO'   },
        { module: 'purchasing', docType: 'receipt',       prefix: 'GRN'  },
        { module: 'purchasing', docType: 'bill',          prefix: 'BILL' },
        { module: 'purchasing', docType: 'return',        prefix: 'PRET' },
        { module: 'inventory',  docType: 'adjustment',    prefix: 'ADJ'  },
        { module: 'inventory',  docType: 'transfer',      prefix: 'TRF'  },
        { module: 'logistics',  docType: 'shipment',      prefix: 'SHP'  },
        { module: 'logistics',  docType: 'storage',       prefix: 'STR'  },
        { module: 'accounting', docType: 'journal-entry', prefix: 'JE'   },
        { module: 'accounting', docType: 'fiscal-year',   prefix: 'FY'   },
      ];

      for (const seq of sequences) {
        await tx.documentSequence.upsert({
          where: { companyId_module_docType: { companyId: company.id, module: seq.module, docType: seq.docType } },
          update: {},
          create: { id: randomUUID(), companyId: company.id, ...seq, padding: 5, nextNumber: 1 },
        });
      }

      console.log('✅ Document sequences created\n');

      console.log('═══════════════════════════════════════');
      console.log('🎉 Seed completed successfully!');
      console.log('═══════════════════════════════════════');
      console.log('📧 Email    : admin@erp.com');
      console.log('🔑 Password : Admin@123');
      console.log('🏢 Company  : شركة النبغاء للأجهزة المنزلية');
      console.log('📅 Fiscal   : السنة المالية 2026 (12 periods)');
      console.log('💱 Currencies: EGP, USD, AED, EUR, SDG');
      console.log('📊 Accounts : 32 حساب (3 مستويات)');
      console.log('═══════════════════════════════════════');
    },
    { timeout: 60_000 },
  );
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());