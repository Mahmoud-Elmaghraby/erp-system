"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var pg_1 = require("pg");
var adapter_pg_1 = require("@prisma/adapter-pg");
var prisma_1 = require("@org/prisma");
var bcrypt = require("bcrypt");
var crypto_1 = require("crypto");
var prisma_2 = require("@org/prisma");
var pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
var adapter = new adapter_pg_1.PrismaPg(pool);
var prisma = new prisma_1.PrismaClient({ adapter: adapter });
var ARABIC_MONTHS = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];
// ─── UUIDs ثابتة للـ COA ─────────────────────────────────────────────────────
var COA = {
    ASSETS_ROOT: 'aaaaaaaa-0001-0000-0000-000000000000',
    LIABILITIES_ROOT: 'aaaaaaaa-0002-0000-0000-000000000000',
    EQUITY_ROOT: 'aaaaaaaa-0003-0000-0000-000000000000',
    REVENUE_ROOT: 'aaaaaaaa-0004-0000-0000-000000000000',
    EXPENSE_ROOT: 'aaaaaaaa-0005-0000-0000-000000000000',
    CURRENT_ASSETS: 'aaaaaaaa-0011-0000-0000-000000000000',
    FIXED_ASSETS: 'aaaaaaaa-0012-0000-0000-000000000000',
    CURRENT_LIABILITIES: 'aaaaaaaa-0021-0000-0000-000000000000',
    LONG_TERM_LIABILITIES: 'aaaaaaaa-0022-0000-0000-000000000000',
    SALES_REVENUE: 'aaaaaaaa-0041-0000-0000-000000000000',
    SERVICE_REVENUE: 'aaaaaaaa-0042-0000-0000-000000000000',
    OPERATING_EXPENSES: 'aaaaaaaa-0051-0000-0000-000000000000',
    COGS_GROUP: 'aaaaaaaa-0052-0000-0000-000000000000',
    CASH: 'aaaaaaaa-0111-0000-0000-000000000000',
    BANK: 'aaaaaaaa-0112-0000-0000-000000000000',
    AR: 'aaaaaaaa-0113-0000-0000-000000000000',
    INVENTORY_ACCOUNT: 'aaaaaaaa-0114-0000-0000-000000000000',
    VAT_RECEIVABLE: 'aaaaaaaa-0115-0000-0000-000000000000',
    PREPAID_EXPENSES: 'aaaaaaaa-0121-0000-0000-000000000000',
    FIXED_ASSETS_ACCOUNT: 'aaaaaaaa-0122-0000-0000-000000000000',
    AP: 'aaaaaaaa-0211-0000-0000-000000000000',
    VAT_PAYABLE: 'aaaaaaaa-0212-0000-0000-000000000000',
    ACCRUED_LIABILITIES: 'aaaaaaaa-0213-0000-0000-000000000000',
    CAPITAL: 'aaaaaaaa-0311-0000-0000-000000000000',
    RETAINED_EARNINGS: 'aaaaaaaa-0312-0000-0000-000000000000',
    SALES_ACCOUNT: 'aaaaaaaa-0411-0000-0000-000000000000',
    SERVICE_ACCOUNT: 'aaaaaaaa-0421-0000-0000-000000000000',
    COGS_ACCOUNT: 'aaaaaaaa-0521-0000-0000-000000000000',
    SALARIES_EXPENSE: 'aaaaaaaa-0511-0000-0000-000000000000',
    RENT_EXPENSE: 'aaaaaaaa-0512-0000-0000-000000000000',
    UTILITIES_EXPENSE: 'aaaaaaaa-0513-0000-0000-000000000000',
    MARKETING_EXPENSE: 'aaaaaaaa-0514-0000-0000-000000000000',
    DEPRECIATION_EXPENSE: 'aaaaaaaa-0515-0000-0000-000000000000',
};
// ─── UUIDs ثابتة للـ Journals ────────────────────────────────────────────────
var JOURNALS = {
    SALE: 'bbbbbbbb-0001-0000-0000-000000000000',
    PURCHASE: 'bbbbbbbb-0002-0000-0000-000000000000',
    CASH: 'bbbbbbbb-0003-0000-0000-000000000000',
    BANK: 'bbbbbbbb-0004-0000-0000-000000000000',
    GENERAL: 'bbbbbbbb-0005-0000-0000-000000000000',
};
// ─── UUIDs ثابتة للـ Payment Terms ──────────────────────────────────────────
var PT = {
    IMMEDIATE: 'cccccccc-0001-0000-0000-000000000000',
    NET30: 'cccccccc-0002-0000-0000-000000000000',
    NET60: 'cccccccc-0003-0000-0000-000000000000',
    HALF: 'cccccccc-0004-0000-0000-000000000000',
};
// ─── UUID ثابت للـ Fiscal Year ───────────────────────────────────────────────
var FISCAL_YEAR_ID = '4aa923d8-aaf4-400e-8e53-e8c8124914c5';
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🌱 Starting seed...\n');
                    return [4 /*yield*/, prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var company, BRANCH_IDS, mainBranch, fiscalYearStart, fiscalYearEnd, fiscalYear, month, periodStart, periodEnd, periodNumber, periodName, superAdminRole, accountantRole, salesRole, warehouseRole, permissions, _i, permissions_1, perm, allPermissions, _a, allPermissions_1, perm, accountingPermissions, _b, accountingPermissions_1, perm, salesPermissions, _c, salesPermissions_1, perm, warehousePermissions, _d, warehousePermissions_1, perm, hashedPassword, adminUser, usdCurrency, sdgCurrency, chartOfAccounts, sortedAccounts, _e, sortedAccounts_1, account, exists, journals, _f, journals_1, journal, exists, taxes, _g, taxes_1, tax, exists, paymentTerms, _h, paymentTerms_1, term, exists, sequences, _j, sequences_1, seq;
                            return __generator(this, function (_k) {
                                switch (_k.label) {
                                    case 0:
                                        // ─────────────────────────────────────
                                        // 1. COMPANY + BRANCHES
                                        // ─────────────────────────────────────
                                        console.log('📦 Creating company and branches...');
                                        return [4 /*yield*/, tx.company.upsert({
                                                where: { email: 'admin@erp.com' },
                                                update: {},
                                                create: {
                                                    id: (0, crypto_1.randomUUID)(),
                                                    name: 'شركة النبغاء للأجهزة المنزلية',
                                                    email: 'admin@erp.com',
                                                    phone: '01000000000',
                                                    address: 'القاهرة، مصر',
                                                },
                                            })];
                                    case 1:
                                        company = _k.sent();
                                        BRANCH_IDS = {
                                            CAIRO: (0, crypto_1.randomUUID)(),
                                            SUDAN: (0, crypto_1.randomUUID)(),
                                            SHOWROOM: (0, crypto_1.randomUUID)(),
                                        };
                                        return [4 /*yield*/, tx.branch.upsert({
                                                where: { id: BRANCH_IDS.CAIRO },
                                                update: {},
                                                create: {
                                                    id: BRANCH_IDS.CAIRO,
                                                    name: 'المقر الرئيسي — القاهرة',
                                                    address: 'القاهرة، مصر',
                                                    phone: '01000000000',
                                                    companyId: company.id,
                                                },
                                            })];
                                    case 2:
                                        mainBranch = _k.sent();
                                        return [4 /*yield*/, tx.branch.upsert({
                                                where: { id: BRANCH_IDS.SUDAN },
                                                update: {},
                                                create: {
                                                    id: BRANCH_IDS.SUDAN,
                                                    name: 'فرع السودان — الخرطوم',
                                                    address: 'الخرطوم، السودان',
                                                    phone: '',
                                                    companyId: company.id,
                                                },
                                            })];
                                    case 3:
                                        _k.sent();
                                        return [4 /*yield*/, tx.branch.upsert({
                                                where: { id: BRANCH_IDS.SHOWROOM },
                                                update: {},
                                                create: {
                                                    id: BRANCH_IDS.SHOWROOM,
                                                    name: 'معرض القاهرة',
                                                    address: 'القاهرة، مصر',
                                                    companyId: company.id,
                                                },
                                            })];
                                    case 4:
                                        _k.sent();
                                        console.log('✅ Company & branches created\n');
                                        // ─────────────────────────────────────
                                        // 2. FISCAL YEAR + FISCAL PERIODS
                                        // ─────────────────────────────────────
                                        console.log('📅 Creating fiscal year and periods...');
                                        fiscalYearStart = new Date('2026-01-01T00:00:00.000Z');
                                        fiscalYearEnd = new Date('2026-12-31T23:59:59.999Z');
                                        return [4 /*yield*/, tx.fiscalYear.upsert({
                                                where: { companyId_startDate: { companyId: company.id, startDate: fiscalYearStart } },
                                                update: {},
                                                create: {
                                                    id: FISCAL_YEAR_ID,
                                                    name: 'السنة المالية 2026',
                                                    startDate: fiscalYearStart,
                                                    endDate: fiscalYearEnd,
                                                    status: prisma_2.FiscalYearStatus.OPEN,
                                                    companyId: company.id,
                                                },
                                            })];
                                    case 5:
                                        fiscalYear = _k.sent();
                                        month = 0;
                                        _k.label = 6;
                                    case 6:
                                        if (!(month < 12)) return [3 /*break*/, 9];
                                        periodStart = new Date(2026, month, 1);
                                        periodEnd = new Date(2026, month + 1, 0, 23, 59, 59, 999);
                                        periodNumber = month + 1;
                                        periodName = "".concat(ARABIC_MONTHS[month], " 2026");
                                        return [4 /*yield*/, tx.fiscalPeriod.upsert({
                                                where: { fiscalYearId_periodNumber: { fiscalYearId: fiscalYear.id, periodNumber: periodNumber } },
                                                update: {},
                                                create: {
                                                    id: (0, crypto_1.randomUUID)(),
                                                    name: periodName,
                                                    startDate: periodStart,
                                                    endDate: periodEnd,
                                                    periodNumber: periodNumber,
                                                    status: prisma_2.FiscalPeriodStatus.OPEN,
                                                    companyId: company.id,
                                                    fiscalYearId: fiscalYear.id,
                                                },
                                            })];
                                    case 7:
                                        _k.sent();
                                        _k.label = 8;
                                    case 8:
                                        month++;
                                        return [3 /*break*/, 6];
                                    case 9:
                                        console.log('✅ Fiscal year 2026 + 12 periods created\n');
                                        // ─────────────────────────────────────
                                        // 3. ROLES + PERMISSIONS
                                        // ─────────────────────────────────────
                                        console.log('🔐 Creating roles and permissions...');
                                        return [4 /*yield*/, tx.role.upsert({
                                                where: { id: 'super-admin-role' },
                                                update: {},
                                                create: { id: 'super-admin-role', name: 'Super Admin', description: 'صلاحيات كاملة على النظام' },
                                            })];
                                    case 10:
                                        superAdminRole = _k.sent();
                                        return [4 /*yield*/, tx.role.upsert({
                                                where: { id: 'accountant-role' },
                                                update: {},
                                                create: { id: 'accountant-role', name: 'محاسب', description: 'صلاحيات المحاسبة والتقارير المالية' },
                                            })];
                                    case 11:
                                        accountantRole = _k.sent();
                                        return [4 /*yield*/, tx.role.upsert({
                                                where: { id: 'sales-role' },
                                                update: {},
                                                create: { id: 'sales-role', name: 'مندوب مبيعات', description: 'صلاحيات المبيعات والعملاء' },
                                            })];
                                    case 12:
                                        salesRole = _k.sent();
                                        return [4 /*yield*/, tx.role.upsert({
                                                where: { id: 'warehouse-role' },
                                                update: {},
                                                create: { id: 'warehouse-role', name: 'أمين مخزن', description: 'صلاحيات المخزون والمستودعات' },
                                            })];
                                    case 13:
                                        warehouseRole = _k.sent();
                                        permissions = [
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
                                            { name: 'inventory.settings.view', module: 'inventory', description: 'عرض إعدادات المخزون' },
                                            { name: 'inventory.settings.edit', module: 'inventory', description: 'تعديل إعدادات المخزون' },
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
                                            { name: 'sales.orders.cancel', module: 'sales', description: 'إلغاء أمر بيع' },
                                            { name: 'sales.deliveries.view', module: 'sales', description: 'عرض التسليمات' },
                                            { name: 'sales.deliveries.create', module: 'sales', description: 'إنشاء تسليم' },
                                            { name: 'sales.deliveries.confirm', module: 'sales', description: 'تأكيد تسليم' },
                                            { name: 'sales.invoices.view', module: 'sales', description: 'عرض الفواتير' },
                                            { name: 'sales.invoices.create', module: 'sales', description: 'إنشاء فاتورة' },
                                            { name: 'sales.invoices.pay', module: 'sales', description: 'تسجيل دفع' },
                                            { name: 'sales.invoices.cancel', module: 'sales', description: 'إلغاء فاتورة' },
                                            { name: 'sales.returns.view', module: 'sales', description: 'عرض المرتجعات' },
                                            { name: 'sales.returns.create', module: 'sales', description: 'إنشاء مرتجع' },
                                            { name: 'sales.returns.confirm', module: 'sales', description: 'تأكيد مرتجع' },
                                            { name: 'sales.settings.view', module: 'sales', description: 'عرض إعدادات المبيعات' },
                                            { name: 'sales.settings.edit', module: 'sales', description: 'تعديل إعدادات المبيعات' },
                                            { name: 'purchasing.suppliers.view', module: 'purchasing', description: 'عرض الموردين' },
                                            { name: 'purchasing.suppliers.create', module: 'purchasing', description: 'إضافة مورد' },
                                            { name: 'purchasing.suppliers.edit', module: 'purchasing', description: 'تعديل مورد' },
                                            { name: 'purchasing.suppliers.delete', module: 'purchasing', description: 'حذف مورد' },
                                            { name: 'purchasing.rfq.view', module: 'purchasing', description: 'عرض طلبات عروض الأسعار' },
                                            { name: 'purchasing.rfq.create', module: 'purchasing', description: 'إنشاء طلب عرض سعر' },
                                            { name: 'purchasing.rfq.send', module: 'purchasing', description: 'إرسال طلب عرض سعر' },
                                            { name: 'purchasing.rfq.confirm', module: 'purchasing', description: 'تأكيد طلب عرض سعر' },
                                            { name: 'purchasing.rfq.cancel', module: 'purchasing', description: 'إلغاء طلب عرض سعر' },
                                            { name: 'purchasing.orders.view', module: 'purchasing', description: 'عرض أوامر الشراء' },
                                            { name: 'purchasing.orders.create', module: 'purchasing', description: 'إنشاء أمر شراء' },
                                            { name: 'purchasing.orders.confirm', module: 'purchasing', description: 'تأكيد أمر شراء' },
                                            { name: 'purchasing.orders.cancel', module: 'purchasing', description: 'إلغاء أمر شراء' },
                                            { name: 'purchasing.receipts.view', module: 'purchasing', description: 'عرض الاستلامات' },
                                            { name: 'purchasing.receipts.create', module: 'purchasing', description: 'إنشاء استلام' },
                                            { name: 'purchasing.bills.view', module: 'purchasing', description: 'عرض فواتير الموردين' },
                                            { name: 'purchasing.bills.create', module: 'purchasing', description: 'إنشاء فاتورة مورد' },
                                            { name: 'purchasing.bills.pay', module: 'purchasing', description: 'دفع فاتورة مورد' },
                                            { name: 'purchasing.bills.cancel', module: 'purchasing', description: 'إلغاء فاتورة مورد' },
                                            { name: 'purchasing.returns.view', module: 'purchasing', description: 'عرض مرتجعات المشتريات' },
                                            { name: 'purchasing.returns.create', module: 'purchasing', description: 'إنشاء مرتجع مشتريات' },
                                            { name: 'purchasing.returns.confirm', module: 'purchasing', description: 'تأكيد مرتجع مشتريات' },
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
                                            { name: 'accounting.journals.view', module: 'accounting', description: 'عرض دفاتر اليومية' },
                                            { name: 'accounting.journals.create', module: 'accounting', description: 'إضافة دفتر يومية' },
                                            { name: 'accounting.journals.edit', module: 'accounting', description: 'تعديل دفتر يومية' },
                                            { name: 'accounting.journals.delete', module: 'accounting', description: 'حذف دفتر يومية' },
                                            { name: 'accounting.journal-entries.view', module: 'accounting', description: 'عرض القيود المحاسبية' },
                                            { name: 'accounting.journal-entries.create', module: 'accounting', description: 'إنشاء قيد محاسبي' },
                                            { name: 'accounting.journal-entries.edit', module: 'accounting', description: 'تعديل قيد محاسبي' },
                                            { name: 'accounting.journal-entries.post', module: 'accounting', description: 'ترحيل قيد محاسبي' },
                                            { name: 'accounting.journal-entries.cancel', module: 'accounting', description: 'إلغاء قيد محاسبي' },
                                            { name: 'accounting.fiscal-years.view', module: 'accounting', description: 'عرض السنوات المالية' },
                                            { name: 'accounting.fiscal-years.create', module: 'accounting', description: 'إنشاء سنة مالية' },
                                            { name: 'accounting.fiscal-years.close', module: 'accounting', description: 'إقفال سنة مالية' },
                                            { name: 'accounting.fiscal-years.lock', module: 'accounting', description: 'قفل سنة مالية نهائياً' },
                                            { name: 'accounting.fiscal-periods.view', module: 'accounting', description: 'عرض الفترات المحاسبية' },
                                            { name: 'accounting.fiscal-periods.open', module: 'accounting', description: 'فتح فترة محاسبية' },
                                            { name: 'accounting.fiscal-periods.soft-lock', module: 'accounting', description: 'قفل فترة محاسبية (قابل للفتح)' },
                                            { name: 'accounting.fiscal-periods.hard-lock', module: 'accounting', description: 'قفل فترة محاسبية نهائياً' },
                                            { name: 'accounting.reports.trial-balance', module: 'accounting', description: 'تقرير ميزان المراجعة' },
                                            { name: 'accounting.reports.income-statement', module: 'accounting', description: 'تقرير الدخل والخسارة' },
                                            { name: 'accounting.reports.balance-sheet', module: 'accounting', description: 'تقرير الميزانية العمومية' },
                                            { name: 'accounting.reports.general-ledger', module: 'accounting', description: 'تقرير الأستاذ العام' },
                                            { name: 'accounting.reports.cash-flow', module: 'accounting', description: 'تقرير التدفقات النقدية' },
                                            { name: 'accounting.settings.view', module: 'accounting', description: 'عرض إعدادات المحاسبة' },
                                            { name: 'accounting.settings.edit', module: 'accounting', description: 'تعديل إعدادات المحاسبة' },
                                            { name: 'settings.company.view', module: 'core', description: 'عرض إعدادات الشركة' },
                                            { name: 'settings.company.edit', module: 'core', description: 'تعديل إعدادات الشركة' },
                                            { name: 'settings.currencies.view', module: 'core', description: 'عرض العملات' },
                                            { name: 'settings.currencies.create', module: 'core', description: 'إضافة عملة' },
                                            { name: 'settings.currencies.edit', module: 'core', description: 'تعديل سعر صرف' },
                                            { name: 'settings.branches.view', module: 'core', description: 'عرض الفروع' },
                                            { name: 'settings.branches.create', module: 'core', description: 'إضافة فرع' },
                                            { name: 'settings.branches.edit', module: 'core', description: 'تعديل فرع' },
                                            { name: 'settings.users.view', module: 'core', description: 'عرض المستخدمين' },
                                            { name: 'settings.users.create', module: 'core', description: 'إضافة مستخدم' },
                                            { name: 'settings.users.edit', module: 'core', description: 'تعديل مستخدم' },
                                            { name: 'settings.roles.view', module: 'core', description: 'عرض الأدوار' },
                                            { name: 'settings.roles.create', module: 'core', description: 'إضافة دور' },
                                            { name: 'settings.roles.edit', module: 'core', description: 'تعديل دور' },
                                        ];
                                        _i = 0, permissions_1 = permissions;
                                        _k.label = 14;
                                    case 14:
                                        if (!(_i < permissions_1.length)) return [3 /*break*/, 17];
                                        perm = permissions_1[_i];
                                        return [4 /*yield*/, tx.permission.upsert({
                                                where: { name: perm.name },
                                                update: {},
                                                create: perm,
                                            })];
                                    case 15:
                                        _k.sent();
                                        _k.label = 16;
                                    case 16:
                                        _i++;
                                        return [3 /*break*/, 14];
                                    case 17: return [4 /*yield*/, tx.permission.findMany()];
                                    case 18:
                                        allPermissions = _k.sent();
                                        _a = 0, allPermissions_1 = allPermissions;
                                        _k.label = 19;
                                    case 19:
                                        if (!(_a < allPermissions_1.length)) return [3 /*break*/, 22];
                                        perm = allPermissions_1[_a];
                                        return [4 /*yield*/, tx.rolePermission.upsert({
                                                where: { roleId_permissionId: { roleId: superAdminRole.id, permissionId: perm.id } },
                                                update: {},
                                                create: { roleId: superAdminRole.id, permissionId: perm.id },
                                            })];
                                    case 20:
                                        _k.sent();
                                        _k.label = 21;
                                    case 21:
                                        _a++;
                                        return [3 /*break*/, 19];
                                    case 22:
                                        accountingPermissions = allPermissions.filter(function (p) { return p.module === 'accounting' || p.name.startsWith('settings.currencies'); });
                                        _b = 0, accountingPermissions_1 = accountingPermissions;
                                        _k.label = 23;
                                    case 23:
                                        if (!(_b < accountingPermissions_1.length)) return [3 /*break*/, 26];
                                        perm = accountingPermissions_1[_b];
                                        return [4 /*yield*/, tx.rolePermission.upsert({
                                                where: { roleId_permissionId: { roleId: accountantRole.id, permissionId: perm.id } },
                                                update: {},
                                                create: { roleId: accountantRole.id, permissionId: perm.id },
                                            })];
                                    case 24:
                                        _k.sent();
                                        _k.label = 25;
                                    case 25:
                                        _b++;
                                        return [3 /*break*/, 23];
                                    case 26:
                                        salesPermissions = allPermissions.filter(function (p) { return p.module === 'sales'; });
                                        _c = 0, salesPermissions_1 = salesPermissions;
                                        _k.label = 27;
                                    case 27:
                                        if (!(_c < salesPermissions_1.length)) return [3 /*break*/, 30];
                                        perm = salesPermissions_1[_c];
                                        return [4 /*yield*/, tx.rolePermission.upsert({
                                                where: { roleId_permissionId: { roleId: salesRole.id, permissionId: perm.id } },
                                                update: {},
                                                create: { roleId: salesRole.id, permissionId: perm.id },
                                            })];
                                    case 28:
                                        _k.sent();
                                        _k.label = 29;
                                    case 29:
                                        _c++;
                                        return [3 /*break*/, 27];
                                    case 30:
                                        warehousePermissions = allPermissions.filter(function (p) { return p.module === 'inventory'; });
                                        _d = 0, warehousePermissions_1 = warehousePermissions;
                                        _k.label = 31;
                                    case 31:
                                        if (!(_d < warehousePermissions_1.length)) return [3 /*break*/, 34];
                                        perm = warehousePermissions_1[_d];
                                        return [4 /*yield*/, tx.rolePermission.upsert({
                                                where: { roleId_permissionId: { roleId: warehouseRole.id, permissionId: perm.id } },
                                                update: {},
                                                create: { roleId: warehouseRole.id, permissionId: perm.id },
                                            })];
                                    case 32:
                                        _k.sent();
                                        _k.label = 33;
                                    case 33:
                                        _d++;
                                        return [3 /*break*/, 31];
                                    case 34:
                                        console.log('✅ Roles & permissions created\n');
                                        // ─────────────────────────────────────
                                        // 4. USERS
                                        // ─────────────────────────────────────
                                        console.log('👤 Creating users...');
                                        return [4 /*yield*/, bcrypt.hash('Admin@123', 10)];
                                    case 35:
                                        hashedPassword = _k.sent();
                                        return [4 /*yield*/, tx.user.upsert({
                                                where: { email: 'admin@erp.com' },
                                                update: {},
                                                create: {
                                                    name: 'مدير النظام',
                                                    email: 'admin@erp.com',
                                                    password: hashedPassword,
                                                    companyId: company.id,
                                                    branchId: mainBranch.id,
                                                },
                                            })];
                                    case 36:
                                        adminUser = _k.sent();
                                        return [4 /*yield*/, tx.userRole.upsert({
                                                where: { userId_roleId: { userId: adminUser.id, roleId: superAdminRole.id } },
                                                update: {},
                                                create: { userId: adminUser.id, roleId: superAdminRole.id },
                                            })];
                                    case 37:
                                        _k.sent();
                                        console.log('✅ Users created\n');
                                        // ─────────────────────────────────────
                                        // 5. CURRENCIES
                                        // ─────────────────────────────────────
                                        console.log('💱 Creating currencies...');
                                        return [4 /*yield*/, tx.currency.upsert({ where: { code: 'EGP' }, update: {}, create: { code: 'EGP', name: 'جنيه مصري', symbol: 'ج.م', isBase: true, isActive: true } })];
                                    case 38:
                                        _k.sent();
                                        return [4 /*yield*/, tx.currency.upsert({ where: { code: 'USD' }, update: {}, create: { code: 'USD', name: 'دولار أمريكي', symbol: '$', isBase: false, isActive: true } })];
                                    case 39:
                                        _k.sent();
                                        return [4 /*yield*/, tx.currency.upsert({ where: { code: 'AED' }, update: {}, create: { code: 'AED', name: 'درهم إماراتي', symbol: 'د.إ', isBase: false, isActive: true } })];
                                    case 40:
                                        _k.sent();
                                        return [4 /*yield*/, tx.currency.upsert({ where: { code: 'EUR' }, update: {}, create: { code: 'EUR', name: 'يورو', symbol: '€', isBase: false, isActive: true } })];
                                    case 41:
                                        _k.sent();
                                        return [4 /*yield*/, tx.currency.upsert({ where: { code: 'SDG' }, update: {}, create: { code: 'SDG', name: 'جنيه سوداني', symbol: 'ج.س', isBase: false, isActive: true } })];
                                    case 42:
                                        _k.sent();
                                        return [4 /*yield*/, tx.currency.findUnique({ where: { code: 'USD' } })];
                                    case 43:
                                        usdCurrency = _k.sent();
                                        if (!usdCurrency) return [3 /*break*/, 45];
                                        return [4 /*yield*/, tx.exchangeRate.create({ data: { currencyId: usdCurrency.id, rate: 50.0, date: new Date() } })];
                                    case 44:
                                        _k.sent();
                                        _k.label = 45;
                                    case 45: return [4 /*yield*/, tx.currency.findUnique({ where: { code: 'SDG' } })];
                                    case 46:
                                        sdgCurrency = _k.sent();
                                        if (!sdgCurrency) return [3 /*break*/, 48];
                                        return [4 /*yield*/, tx.exchangeRate.create({ data: { currencyId: sdgCurrency.id, rate: 0.09, date: new Date() } })];
                                    case 47:
                                        _k.sent();
                                        _k.label = 48;
                                    case 48:
                                        console.log('✅ Currencies created\n');
                                        // ─────────────────────────────────────
                                        // 6. CHART OF ACCOUNTS
                                        // ─────────────────────────────────────
                                        console.log('📊 Creating chart of accounts...');
                                        chartOfAccounts = [
                                            // Level 1
                                            { id: COA.ASSETS_ROOT, code: '1', name: 'الأصول', type: prisma_2.AccountType.ASSET, normalBalance: prisma_2.NormalBalance.DEBIT, level: 1, isGroup: true, parentId: null, companyId: company.id, isActive: true },
                                            { id: COA.LIABILITIES_ROOT, code: '2', name: 'الخصوم', type: prisma_2.AccountType.LIABILITY, normalBalance: prisma_2.NormalBalance.CREDIT, level: 1, isGroup: true, parentId: null, companyId: company.id, isActive: true },
                                            { id: COA.EQUITY_ROOT, code: '3', name: 'حقوق الملكية', type: prisma_2.AccountType.EQUITY, normalBalance: prisma_2.NormalBalance.CREDIT, level: 1, isGroup: true, parentId: null, companyId: company.id, isActive: true },
                                            { id: COA.REVENUE_ROOT, code: '4', name: 'الإيرادات', type: prisma_2.AccountType.REVENUE, normalBalance: prisma_2.NormalBalance.CREDIT, level: 1, isGroup: true, parentId: null, companyId: company.id, isActive: true },
                                            { id: COA.EXPENSE_ROOT, code: '5', name: 'المصروفات', type: prisma_2.AccountType.EXPENSE, normalBalance: prisma_2.NormalBalance.DEBIT, level: 1, isGroup: true, parentId: null, companyId: company.id, isActive: true },
                                            // Level 2
                                            { id: COA.CURRENT_ASSETS, code: '11', name: 'الأصول المتداولة', type: prisma_2.AccountType.ASSET, normalBalance: prisma_2.NormalBalance.DEBIT, level: 2, isGroup: true, parentId: COA.ASSETS_ROOT, companyId: company.id, isActive: true },
                                            { id: COA.FIXED_ASSETS, code: '12', name: 'الأصول الثابتة', type: prisma_2.AccountType.ASSET, normalBalance: prisma_2.NormalBalance.DEBIT, level: 2, isGroup: true, parentId: COA.ASSETS_ROOT, companyId: company.id, isActive: true },
                                            { id: COA.CURRENT_LIABILITIES, code: '21', name: 'الخصوم المتداولة', type: prisma_2.AccountType.LIABILITY, normalBalance: prisma_2.NormalBalance.CREDIT, level: 2, isGroup: true, parentId: COA.LIABILITIES_ROOT, companyId: company.id, isActive: true },
                                            { id: COA.LONG_TERM_LIABILITIES, code: '22', name: 'الخصوم طويلة الأجل', type: prisma_2.AccountType.LIABILITY, normalBalance: prisma_2.NormalBalance.CREDIT, level: 2, isGroup: true, parentId: COA.LIABILITIES_ROOT, companyId: company.id, isActive: true },
                                            { id: COA.SALES_REVENUE, code: '41', name: 'إيرادات المبيعات', type: prisma_2.AccountType.REVENUE, normalBalance: prisma_2.NormalBalance.CREDIT, level: 2, isGroup: true, parentId: COA.REVENUE_ROOT, companyId: company.id, isActive: true },
                                            { id: COA.SERVICE_REVENUE, code: '42', name: 'إيرادات الخدمات', type: prisma_2.AccountType.REVENUE, normalBalance: prisma_2.NormalBalance.CREDIT, level: 2, isGroup: true, parentId: COA.REVENUE_ROOT, companyId: company.id, isActive: true },
                                            { id: COA.OPERATING_EXPENSES, code: '51', name: 'المصروفات التشغيلية', type: prisma_2.AccountType.EXPENSE, normalBalance: prisma_2.NormalBalance.DEBIT, level: 2, isGroup: true, parentId: COA.EXPENSE_ROOT, companyId: company.id, isActive: true },
                                            { id: COA.COGS_GROUP, code: '52', name: 'تكلفة البضاعة المباعة', type: prisma_2.AccountType.COGS, normalBalance: prisma_2.NormalBalance.DEBIT, level: 2, isGroup: true, parentId: COA.EXPENSE_ROOT, companyId: company.id, isActive: true },
                                            // Level 3
                                            { id: COA.CASH, code: '111', name: 'الصندوق', type: prisma_2.AccountType.CASH, normalBalance: prisma_2.NormalBalance.DEBIT, level: 3, isGroup: false, parentId: COA.CURRENT_ASSETS, companyId: company.id, isActive: true },
                                            { id: COA.BANK, code: '112', name: 'البنك', type: prisma_2.AccountType.BANK, normalBalance: prisma_2.NormalBalance.DEBIT, level: 3, isGroup: false, parentId: COA.CURRENT_ASSETS, companyId: company.id, isActive: true },
                                            { id: COA.AR, code: '113', name: 'العملاء — حسابات القبض', type: prisma_2.AccountType.RECEIVABLE, normalBalance: prisma_2.NormalBalance.DEBIT, level: 3, isGroup: false, parentId: COA.CURRENT_ASSETS, companyId: company.id, isActive: true },
                                            { id: COA.INVENTORY_ACCOUNT, code: '114', name: 'المخزون', type: prisma_2.AccountType.ASSET, normalBalance: prisma_2.NormalBalance.DEBIT, level: 3, isGroup: false, parentId: COA.CURRENT_ASSETS, companyId: company.id, isActive: true },
                                            { id: COA.VAT_RECEIVABLE, code: '115', name: 'ضريبة القيمة المضافة — مدخلات', type: prisma_2.AccountType.ASSET, normalBalance: prisma_2.NormalBalance.DEBIT, level: 3, isGroup: false, parentId: COA.CURRENT_ASSETS, companyId: company.id, isActive: true },
                                            { id: COA.PREPAID_EXPENSES, code: '121', name: 'مصروفات مدفوعة مقدماً', type: prisma_2.AccountType.ASSET, normalBalance: prisma_2.NormalBalance.DEBIT, level: 3, isGroup: false, parentId: COA.FIXED_ASSETS, companyId: company.id, isActive: true },
                                            { id: COA.FIXED_ASSETS_ACCOUNT, code: '122', name: 'الأصول الثابتة — صافي', type: prisma_2.AccountType.ASSET, normalBalance: prisma_2.NormalBalance.DEBIT, level: 3, isGroup: false, parentId: COA.FIXED_ASSETS, companyId: company.id, isActive: true },
                                            { id: COA.AP, code: '211', name: 'الموردون — حسابات الدفع', type: prisma_2.AccountType.PAYABLE, normalBalance: prisma_2.NormalBalance.CREDIT, level: 3, isGroup: false, parentId: COA.CURRENT_LIABILITIES, companyId: company.id, isActive: true },
                                            { id: COA.VAT_PAYABLE, code: '212', name: 'ضريبة القيمة المضافة — مخرجات', type: prisma_2.AccountType.LIABILITY, normalBalance: prisma_2.NormalBalance.CREDIT, level: 3, isGroup: false, parentId: COA.CURRENT_LIABILITIES, companyId: company.id, isActive: true },
                                            { id: COA.ACCRUED_LIABILITIES, code: '213', name: 'مستحقات الدفع', type: prisma_2.AccountType.LIABILITY, normalBalance: prisma_2.NormalBalance.CREDIT, level: 3, isGroup: false, parentId: COA.CURRENT_LIABILITIES, companyId: company.id, isActive: true },
                                            { id: COA.CAPITAL, code: '311', name: 'رأس المال', type: prisma_2.AccountType.EQUITY, normalBalance: prisma_2.NormalBalance.CREDIT, level: 3, isGroup: false, parentId: COA.EQUITY_ROOT, companyId: company.id, isActive: true },
                                            { id: COA.RETAINED_EARNINGS, code: '312', name: 'الأرباح المحتجزة', type: prisma_2.AccountType.EQUITY, normalBalance: prisma_2.NormalBalance.CREDIT, level: 3, isGroup: false, parentId: COA.EQUITY_ROOT, companyId: company.id, isActive: true },
                                            { id: COA.SALES_ACCOUNT, code: '411', name: 'إيرادات المبيعات', type: prisma_2.AccountType.REVENUE, normalBalance: prisma_2.NormalBalance.CREDIT, level: 3, isGroup: false, parentId: COA.SALES_REVENUE, companyId: company.id, isActive: true },
                                            { id: COA.SERVICE_ACCOUNT, code: '421', name: 'إيرادات الخدمات', type: prisma_2.AccountType.REVENUE, normalBalance: prisma_2.NormalBalance.CREDIT, level: 3, isGroup: false, parentId: COA.SERVICE_REVENUE, companyId: company.id, isActive: true },
                                            { id: COA.COGS_ACCOUNT, code: '521', name: 'تكلفة البضاعة المباعة', type: prisma_2.AccountType.COGS, normalBalance: prisma_2.NormalBalance.DEBIT, level: 3, isGroup: false, parentId: COA.COGS_GROUP, companyId: company.id, isActive: true },
                                            { id: COA.SALARIES_EXPENSE, code: '511', name: 'مصروفات الرواتب والأجور', type: prisma_2.AccountType.EXPENSE, normalBalance: prisma_2.NormalBalance.DEBIT, level: 3, isGroup: false, parentId: COA.OPERATING_EXPENSES, companyId: company.id, isActive: true },
                                            { id: COA.RENT_EXPENSE, code: '512', name: 'مصروفات الإيجار', type: prisma_2.AccountType.EXPENSE, normalBalance: prisma_2.NormalBalance.DEBIT, level: 3, isGroup: false, parentId: COA.OPERATING_EXPENSES, companyId: company.id, isActive: true },
                                            { id: COA.UTILITIES_EXPENSE, code: '513', name: 'مصروفات المرافق', type: prisma_2.AccountType.EXPENSE, normalBalance: prisma_2.NormalBalance.DEBIT, level: 3, isGroup: false, parentId: COA.OPERATING_EXPENSES, companyId: company.id, isActive: true },
                                            { id: COA.MARKETING_EXPENSE, code: '514', name: 'مصروفات التسويق والإعلان', type: prisma_2.AccountType.EXPENSE, normalBalance: prisma_2.NormalBalance.DEBIT, level: 3, isGroup: false, parentId: COA.OPERATING_EXPENSES, companyId: company.id, isActive: true },
                                            { id: COA.DEPRECIATION_EXPENSE, code: '515', name: 'مصروفات الإهلاك', type: prisma_2.AccountType.EXPENSE, normalBalance: prisma_2.NormalBalance.DEBIT, level: 3, isGroup: false, parentId: COA.OPERATING_EXPENSES, companyId: company.id, isActive: true },
                                        ];
                                        sortedAccounts = chartOfAccounts.sort(function (a, b) { return a.level - b.level; });
                                        _e = 0, sortedAccounts_1 = sortedAccounts;
                                        _k.label = 49;
                                    case 49:
                                        if (!(_e < sortedAccounts_1.length)) return [3 /*break*/, 53];
                                        account = sortedAccounts_1[_e];
                                        return [4 /*yield*/, tx.chartOfAccount.findFirst({ where: { companyId: company.id, code: account.code } })];
                                    case 50:
                                        exists = _k.sent();
                                        if (!!exists) return [3 /*break*/, 52];
                                        return [4 /*yield*/, tx.chartOfAccount.create({ data: account })];
                                    case 51:
                                        _k.sent();
                                        _k.label = 52;
                                    case 52:
                                        _e++;
                                        return [3 /*break*/, 49];
                                    case 53:
                                        console.log('✅ Chart of accounts created\n');
                                        // ─────────────────────────────────────
                                        // 7. JOURNALS
                                        // ─────────────────────────────────────
                                        console.log('📓 Creating journals...');
                                        journals = [
                                            { id: JOURNALS.SALE, name: 'يومية المبيعات', type: prisma_2.JournalType.SALE, companyId: company.id },
                                            { id: JOURNALS.PURCHASE, name: 'يومية المشتريات', type: prisma_2.JournalType.PURCHASE, companyId: company.id },
                                            { id: JOURNALS.CASH, name: 'يومية الصندوق', type: prisma_2.JournalType.CASH, companyId: company.id },
                                            { id: JOURNALS.BANK, name: 'يومية البنك', type: prisma_2.JournalType.BANK, companyId: company.id },
                                            { id: JOURNALS.GENERAL, name: 'يومية عامة', type: prisma_2.JournalType.GENERAL, companyId: company.id },
                                        ];
                                        _f = 0, journals_1 = journals;
                                        _k.label = 54;
                                    case 54:
                                        if (!(_f < journals_1.length)) return [3 /*break*/, 58];
                                        journal = journals_1[_f];
                                        return [4 /*yield*/, tx.journal.findFirst({ where: { name: journal.name, companyId: journal.companyId } })];
                                    case 55:
                                        exists = _k.sent();
                                        if (!!exists) return [3 /*break*/, 57];
                                        return [4 /*yield*/, tx.journal.create({ data: journal })];
                                    case 56:
                                        _k.sent();
                                        _k.label = 57;
                                    case 57:
                                        _f++;
                                        return [3 /*break*/, 54];
                                    case 58:
                                        console.log('✅ Journals created\n');
                                        // ─────────────────────────────────────
                                        // 8. TAXES
                                        // ─────────────────────────────────────
                                        console.log('🧾 Creating taxes...');
                                        taxes = [
                                            {
                                                id: (0, crypto_1.randomUUID)(),
                                                name: 'ضريبة القيمة المضافة 14%',
                                                rate: 14,
                                                taxType: prisma_2.TaxType.PERCENTAGE,
                                                scope: prisma_2.TaxScope.BOTH,
                                                isActive: true,
                                                companyId: company.id,
                                                etaType: 'T1',
                                                etaSubtype: 'V001',
                                                zatcaType: null,
                                                salesAccountId: COA.VAT_PAYABLE,
                                                purchaseAccountId: COA.VAT_RECEIVABLE,
                                            },
                                            {
                                                id: (0, crypto_1.randomUUID)(),
                                                name: 'معفى من الضريبة 0%',
                                                rate: 0,
                                                taxType: prisma_2.TaxType.PERCENTAGE,
                                                scope: prisma_2.TaxScope.BOTH,
                                                isActive: true,
                                                companyId: company.id,
                                                etaType: 'T1',
                                                etaSubtype: 'V002',
                                                zatcaType: null,
                                                salesAccountId: COA.VAT_PAYABLE,
                                                purchaseAccountId: COA.VAT_RECEIVABLE,
                                            },
                                        ];
                                        _g = 0, taxes_1 = taxes;
                                        _k.label = 59;
                                    case 59:
                                        if (!(_g < taxes_1.length)) return [3 /*break*/, 63];
                                        tax = taxes_1[_g];
                                        return [4 /*yield*/, tx.tax.findFirst({ where: { name: tax.name, companyId: tax.companyId } })];
                                    case 60:
                                        exists = _k.sent();
                                        if (!!exists) return [3 /*break*/, 62];
                                        return [4 /*yield*/, tx.tax.create({ data: tax })];
                                    case 61:
                                        _k.sent();
                                        _k.label = 62;
                                    case 62:
                                        _g++;
                                        return [3 /*break*/, 59];
                                    case 63:
                                        console.log('✅ Taxes created\n');
                                        // ─────────────────────────────────────
                                        // 9. PAYMENT TERMS
                                        // ─────────────────────────────────────
                                        console.log('💳 Creating payment terms...');
                                        paymentTerms = [
                                            {
                                                id: PT.IMMEDIATE,
                                                name: 'فوري',
                                                companyId: company.id,
                                                lines: [{ id: (0, crypto_1.randomUUID)(), value: 100, valueType: 'PERCENT', days: 0 }],
                                            },
                                            {
                                                id: PT.NET30,
                                                name: 'صافي 30 يوم',
                                                companyId: company.id,
                                                lines: [{ id: (0, crypto_1.randomUUID)(), value: 100, valueType: 'PERCENT', days: 30 }],
                                            },
                                            {
                                                id: PT.NET60,
                                                name: 'صافي 60 يوم',
                                                companyId: company.id,
                                                lines: [{ id: (0, crypto_1.randomUUID)(), value: 100, valueType: 'PERCENT', days: 60 }],
                                            },
                                            {
                                                id: PT.HALF,
                                                name: '50% مقدم — 50% عند الاستلام',
                                                companyId: company.id,
                                                lines: [
                                                    { id: (0, crypto_1.randomUUID)(), value: 50, valueType: 'PERCENT', days: 0 },
                                                    { id: (0, crypto_1.randomUUID)(), value: 50, valueType: 'PERCENT', days: 30 },
                                                ],
                                            },
                                        ];
                                        _h = 0, paymentTerms_1 = paymentTerms;
                                        _k.label = 64;
                                    case 64:
                                        if (!(_h < paymentTerms_1.length)) return [3 /*break*/, 68];
                                        term = paymentTerms_1[_h];
                                        return [4 /*yield*/, tx.paymentTerm.findFirst({ where: { name: term.name, companyId: term.companyId } })];
                                    case 65:
                                        exists = _k.sent();
                                        if (!!exists) return [3 /*break*/, 67];
                                        return [4 /*yield*/, tx.paymentTerm.create({
                                                data: {
                                                    id: term.id,
                                                    name: term.name,
                                                    companyId: term.companyId,
                                                    lines: { create: term.lines },
                                                },
                                            })];
                                    case 66:
                                        _k.sent();
                                        _k.label = 67;
                                    case 67:
                                        _h++;
                                        return [3 /*break*/, 64];
                                    case 68:
                                        console.log('✅ Payment terms created\n');
                                        // ─────────────────────────────────────
                                        // 10. SETTINGS
                                        // ─────────────────────────────────────
                                        console.log('⚙️  Creating settings...');
                                        return [4 /*yield*/, tx.companySettings.upsert({
                                                where: { companyId: company.id },
                                                update: {},
                                                create: {
                                                    id: (0, crypto_1.randomUUID)(),
                                                    companyId: company.id,
                                                    defaultCurrency: 'EGP',
                                                    fiscalYearStart: 1,
                                                    country: 'EG',
                                                    taxIncludedInPrice: false,
                                                    etaEnabled: false,
                                                    etaEnvironment: 'sandbox',
                                                    zatcaEnabled: false,
                                                },
                                            })];
                                    case 69:
                                        _k.sent();
                                        return [4 /*yield*/, tx.accountingSettings.upsert({
                                                where: { companyId: company.id },
                                                update: {},
                                                create: {
                                                    id: (0, crypto_1.randomUUID)(),
                                                    companyId: company.id,
                                                    method: 'ACCRUAL',
                                                    taxMethod: 'EXCLUSIVE',
                                                    multiCurrency: true,
                                                    journalEntriesEnabled: true,
                                                    defaultSalesAccount: COA.SALES_ACCOUNT,
                                                    defaultCOGSAccount: COA.COGS_ACCOUNT,
                                                    defaultExpenseAccount: COA.OPERATING_EXPENSES,
                                                    defaultARAccount: COA.AR,
                                                    defaultAPAccount: COA.AP,
                                                    defaultCashAccount: COA.CASH,
                                                    defaultBankAccount: COA.BANK,
                                                    defaultSaleJournalId: JOURNALS.SALE,
                                                    defaultPurchaseJournalId: JOURNALS.PURCHASE,
                                                    defaultCashJournalId: JOURNALS.CASH,
                                                    defaultBankJournalId: JOURNALS.BANK,
                                                },
                                            })];
                                    case 70:
                                        _k.sent();
                                        return [4 /*yield*/, tx.salesSettings.upsert({
                                                where: { companyId: company.id },
                                                update: {},
                                                create: {
                                                    id: (0, crypto_1.randomUUID)(),
                                                    companyId: company.id,
                                                    taxEnabled: true,
                                                    multiCurrency: true,
                                                    allowDiscounts: true,
                                                    quotationsEnabled: true,
                                                    deliveryEnabled: true,
                                                    salesReturnsEnabled: true,
                                                    requireApproval: false,
                                                },
                                            })];
                                    case 71:
                                        _k.sent();
                                        return [4 /*yield*/, tx.purchasingSettings.upsert({
                                                where: { companyId: company.id },
                                                update: {},
                                                create: {
                                                    id: (0, crypto_1.randomUUID)(),
                                                    companyId: company.id,
                                                    taxEnabled: true,
                                                    rfqEnabled: true,
                                                    purchaseReturnsEnabled: true,
                                                    landedCostsEnabled: false,
                                                    threeWayMatching: false,
                                                    requireApproval: false,
                                                },
                                            })];
                                    case 72:
                                        _k.sent();
                                        return [4 /*yield*/, tx.inventorySettings.upsert({
                                                where: { companyId: company.id },
                                                update: {},
                                                create: {
                                                    id: (0, crypto_1.randomUUID)(),
                                                    companyId: company.id,
                                                    valuationMethod: 'FIFO',
                                                    trackLotNumbers: false,
                                                    trackSerialNumbers: false,
                                                    trackExpiryDates: false,
                                                    allowNegativeStock: false,
                                                    enableLowStockAlert: true,
                                                },
                                            })];
                                    case 73:
                                        _k.sent();
                                        return [4 /*yield*/, tx.logisticsSettings.upsert({
                                                where: { companyId: company.id },
                                                update: {},
                                                create: {
                                                    id: (0, crypto_1.randomUUID)(),
                                                    companyId: company.id,
                                                    localDeliveryEnabled: true,
                                                    exportEnabled: false,
                                                    storageEnabled: true,
                                                    vehicleManagement: false,
                                                },
                                            })];
                                    case 74:
                                        _k.sent();
                                        console.log('✅ All settings created\n');
                                        // ─────────────────────────────────────
                                        // 11. DOCUMENT SEQUENCES
                                        // ─────────────────────────────────────
                                        console.log('🔢 Creating document sequences...');
                                        sequences = [
                                            { module: 'sales', docType: 'quotation', prefix: 'QUO' },
                                            { module: 'sales', docType: 'order', prefix: 'SO' },
                                            { module: 'sales', docType: 'invoice', prefix: 'INV' },
                                            { module: 'sales', docType: 'delivery', prefix: 'DEL' },
                                            { module: 'sales', docType: 'return', prefix: 'SRET' },
                                            { module: 'purchasing', docType: 'rfq', prefix: 'RFQ' },
                                            { module: 'purchasing', docType: 'order', prefix: 'PO' },
                                            { module: 'purchasing', docType: 'receipt', prefix: 'GRN' },
                                            { module: 'purchasing', docType: 'bill', prefix: 'BILL' },
                                            { module: 'purchasing', docType: 'return', prefix: 'PRET' },
                                            { module: 'inventory', docType: 'adjustment', prefix: 'ADJ' },
                                            { module: 'inventory', docType: 'transfer', prefix: 'TRF' },
                                            { module: 'logistics', docType: 'shipment', prefix: 'SHP' },
                                            { module: 'logistics', docType: 'storage', prefix: 'STR' },
                                            { module: 'accounting', docType: 'journal-entry', prefix: 'JE' },
                                            { module: 'accounting', docType: 'fiscal-year', prefix: 'FY' },
                                        ];
                                        _j = 0, sequences_1 = sequences;
                                        _k.label = 75;
                                    case 75:
                                        if (!(_j < sequences_1.length)) return [3 /*break*/, 78];
                                        seq = sequences_1[_j];
                                        return [4 /*yield*/, tx.documentSequence.upsert({
                                                where: { companyId_module_docType: { companyId: company.id, module: seq.module, docType: seq.docType } },
                                                update: {},
                                                create: __assign(__assign({ id: (0, crypto_1.randomUUID)(), companyId: company.id }, seq), { padding: 5, nextNumber: 1 }),
                                            })];
                                    case 76:
                                        _k.sent();
                                        _k.label = 77;
                                    case 77:
                                        _j++;
                                        return [3 /*break*/, 75];
                                    case 78:
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
                                        return [2 /*return*/];
                                }
                            });
                        }); }, { timeout: 60000 })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) { console.error('❌ Seed failed:', e); process.exit(1); })
    .finally(function () { return prisma.$disconnect(); });
