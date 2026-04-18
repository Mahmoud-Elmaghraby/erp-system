import { useState, useRef, useEffect } from 'react';
import { Switch, Select, Input, Radio, Button, Divider } from 'antd';
import {
  FileTextOutlined,
  TagsOutlined,
  CreditCardOutlined,
  InboxOutlined,
  CalculatorOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

/* ────── sidebar sections ────── */
interface SideSection {
  key: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const sideSections: SideSection[] = [
  {
    key: 'issuance',
    icon: <FileTextOutlined />,
    title: 'إصدار الفاتورة',
    description: 'إدارة إعدادات إنشاء الفاتورة وطريقة عرضها ومشاركتها مع العملاء.',
  },
  {
    key: 'pricing',
    icon: <TagsOutlined />,
    title: 'التسعير والخصومات',
    description: 'التحكم في قواعد تسعير العناصر، وإدخال الخصومات، والحدود المسموح بها.',
  },
  {
    key: 'payment',
    icon: <CreditCardOutlined />,
    title: 'الدفع والائتمان',
    description: 'تهيئة سلوك الدفع التلقائي وإدارة رصيد العميل والأرصدة المستحقة.',
  },
  {
    key: 'availability',
    icon: <InboxOutlined />,
    title: 'قيود توفر وصلاحية المخزون',
    description: 'تحكم في توفر المنتجات والخدمات للفوترة وسلوكها ضمن عملية البيع.',
  },
  {
    key: 'accounting',
    icon: <CalculatorOutlined />,
    title: 'القيود المحاسبية',
    description: 'تحكم في كيفية إدخال أوصاف قيود اليومية للفواتير داخل نظام المحاسبة.',
  },
];

/* ────── reusable field components ────── */
function FieldRow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: '#f4f6f8',
      border: '1px solid #e8ecf0',
      borderRadius: 8,
      padding: '18px 20px',
      marginBottom: 14,
    }}>
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontWeight: 600, fontSize: 15, color: '#1f2937', marginBottom: 4 }}>
      {children}
    </div>
  );
}

function FieldDesc({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7, marginTop: 6 }}>
      {children}
    </div>
  );
}

function ToggleRow({ label, checked, onChange, children }: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  children?: React.ReactNode;
}) {
  return (
    <FieldRow>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <FieldLabel>{label}</FieldLabel>
        <Switch checked={checked} onChange={onChange} />
      </div>
      {children}
    </FieldRow>
  );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <>
      <h3 style={{ textAlign: 'center', fontSize: 20, marginBottom: 6 }}>{title}</h3>
      <p style={{ textAlign: 'center', color: '#6b7280', fontSize: 14, marginBottom: 28 }}>
        {description}
      </p>
    </>
  );
}

/* ────── component ────── */
export default function InvoiceSettingsPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('issuance');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const contentRef = useRef<HTMLDivElement | null>(null);

  /* ── state for all the settings ── */
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState('000001');
  const [manualNumberEdit, setManualNumberEdit] = useState(true);
  const [invoiceMethod, setInvoiceMethod] = useState('print_email');
  const [freeItemEntry, setFreeItemEntry] = useState(true);
  const [priceDisplay, setPriceDisplay] = useState('hide');
  const [copyNotes, setCopyNotes] = useState(false);
  const [previewBeforeSave, setPreviewBeforeSave] = useState(true);
  const [customStatuses, setCustomStatuses] = useState(false);
  const [profitTab, setProfitTab] = useState(false);
  const [decimalDisplay, setDecimalDisplay] = useState<'always' | 'never' | 'auto'>('auto');
  const [socialShare, setSocialShare] = useState(true);

  /* pricing & discounts */
  const [discountMethod, setDiscountMethod] = useState('total_and_line');
  const [maxDiscountEnabled, setMaxDiscountEnabled] = useState(false);
  const [advancedPricing, setAdvancedPricing] = useState(true);
  const [minPriceTax, setMinPriceTax] = useState<'includes_tax' | 'excludes_tax'>('includes_tax');
  const [sellBelowCost, setSellBelowCost] = useState(false);
  const [changePriceList, setChangePriceList] = useState(false);
  const [salesAdjustments, setSalesAdjustments] = useState(false);

  /* payment */
  const [defaultPaid, setDefaultPaid] = useState(false);
  const [autoPayFromBalance, setAutoPayFromBalance] = useState(true);
  const [debitNotes, setDebitNotes] = useState(false);

  /* availability */
  const [restrictedCategories, setRestrictedCategories] = useState<string[]>([]);
  const [salesNature, setSalesNature] = useState<'products' | 'services' | 'both'>('products');

  /* accounting */
  const [customJournalDesc, setCustomJournalDesc] = useState(true);

  /* scroll spy */
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;
    const handleScroll = () => {
      let current = 'issuance';
      for (const sec of sideSections) {
        const el = sectionRefs.current[sec.key];
        if (el) {
          const rect = el.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          if (rect.top - containerRect.top <= 100) current = sec.key;
        }
      }
      setActiveSection(current);
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (key: string) => {
    setActiveSection(key);
    sectionRefs.current[key]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* radio option helper */
  const radioOptionStyle = (isSelected: boolean, position: 'top' | 'middle' | 'bottom'): React.CSSProperties => ({
    border: '1px solid #e8ecf0',
    borderTop: position !== 'top' ? 'none' : undefined,
    borderRadius: position === 'top' ? '8px 8px 0 0' : position === 'bottom' ? '0 0 8px 8px' : undefined,
    padding: '14px 16px',
    background: isSelected ? '#eef5fa' : 'transparent',
  });

  return (
    <div style={{ padding: 24 }} dir="rtl">
      {/* top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>إعدادات الفواتير</h2>
        <Button onClick={() => navigate('/sales/settings')} type="text" style={{ color: '#6b7280' }}>
          تجاهل
        </Button>
      </div>

      <div style={{ display: 'flex', gap: 0 }}>
        {/* ─── SIDEBAR ─── */}
        <div style={{
          width: 260,
          minWidth: 260,
          background: '#fff',
          borderLeft: '1px solid #e8ecf0',
          position: 'sticky',
          top: 0,
          alignSelf: 'flex-start',
          maxHeight: 'calc(100vh - 160px)',
          overflowY: 'auto',
        }}>
          {sideSections.map((s) => {
            const isActive = activeSection === s.key;
            return (
              <div
                key={s.key}
                onClick={() => scrollTo(s.key)}
                style={{
                  padding: '14px 18px',
                  cursor: 'pointer',
                  borderRight: isActive ? '3px solid #5b8fa8' : '3px solid transparent',
                  background: isActive ? '#eef5fa' : 'transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 16, color: isActive ? '#5b8fa8' : '#6b7280' }}>{s.icon}</span>
                  <span style={{ fontWeight: 600, fontSize: 14, color: isActive ? '#1f2937' : '#374151' }}>{s.title}</span>
                </div>
                <div style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.6 }}>{s.description}</div>
              </div>
            );
          })}
        </div>

        {/* ─── CONTENT ─── */}
        <div ref={contentRef} style={{
          flex: 1,
          padding: '0 32px 40px',
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 160px)',
          background: '#fff',
        }}>

          {/* ════════ إصدار الفاتورة ════════ */}
          <div ref={(el) => { sectionRefs.current['issuance'] = el; }} style={{ paddingTop: 32, paddingBottom: 16 }}>
            <SectionHeader title="إصدار الفاتورة" description="إدارة إعدادات إنشاء الفاتورة وطريقة عرضها ومشاركتها مع العملاء." />

            <FieldRow>
              <FieldLabel>الرقم التسلسلي للفاتورة التالية</FieldLabel>
              <Input
                value={nextInvoiceNumber}
                onChange={(e) => setNextInvoiceNumber(e.target.value)}
                style={{ maxWidth: 260, marginTop: 8 }}
                addonBefore={<SettingOutlined />}
                placeholder="000001"
              />
              <FieldDesc>الرقم الذي سيخصصه النظام للعنصر.</FieldDesc>
            </FieldRow>

            <ToggleRow label="تعديل رقم الفاتورة يدوياً" checked={manualNumberEdit} onChange={setManualNumberEdit}>
              <FieldDesc>
                {manualNumberEdit ? 'مسموح' : 'غير مسموح'} — يسمح للمستخدمين بتعيين أو تعديل رقم الفاتورة يدوياً أثناء الإنشاء.
              </FieldDesc>
            </ToggleRow>

            <FieldRow>
              <FieldLabel>طريقة الفوترة</FieldLabel>
              <Select
                value={invoiceMethod}
                onChange={setInvoiceMethod}
                style={{ width: '100%', maxWidth: 380, marginTop: 8 }}
              >
                <Select.Option value="print_email">طباعة وإرسال عبر البريد الإلكتروني معاً</Select.Option>
                <Select.Option value="print">طباعة فقط</Select.Option>
                <Select.Option value="email">إرسال بالبريد الإلكتروني فقط</Select.Option>
              </Select>
              <FieldDesc>اختر طريقة إرسال الفواتير للعملاء.</FieldDesc>
            </FieldRow>

            <ToggleRow label="الإدخال الحر و تعديل بيانات الأصناف في الفاتورة" checked={freeItemEntry} onChange={setFreeItemEntry}>
              <FieldDesc>
                {freeItemEntry ? 'مسموح' : 'غير مسموح'} — يسمح للمستخدمين بتعديل المنتجات يدوياً أو إدخال منتجات غير مسجلة عند إنشاء الفاتورة. هذا إعداد عام. يمكن إدارة الصلاحيات من خلال إعدادات أدوار الموظفين والصلاحيات.
              </FieldDesc>
            </ToggleRow>

            <FieldRow>
              <FieldLabel>عرض الحد الأدنى للسعر وآخر سعر بيع لكل صنف</FieldLabel>
              <Select
                value={priceDisplay}
                onChange={setPriceDisplay}
                style={{ width: '100%', maxWidth: 380, marginTop: 8 }}
              >
                <Select.Option value="hide">إخفاء الحد الأدنى وآخر سعر بيع</Select.Option>
                <Select.Option value="show">عرض الحد الأدنى وآخر سعر بيع</Select.Option>
              </Select>
              <FieldDesc>
                تحكم في طريقة عرض هذه القيم أثناء إنشاء الفواتير. هذه المعلومات مرجعية فقط ولا تظهر للعملاء أو في نسخة الفاتورة النهائية.
                يتم تحديد السعر الأدنى لكل صنف من خلال صفحة تعديل المنتج أو الخدمة.
              </FieldDesc>
            </FieldRow>

            <ToggleRow label="نسخ الملاحظات/الشروط عند تحويل عرض سعر أو أمر بيع إلى فاتورة" checked={copyNotes} onChange={setCopyNotes}>
              <FieldDesc>
                {copyNotes ? 'مفعّل' : 'مقفل'} — يقوم النظام تلقائياً بنقل الملاحظات والشروط من عرض السعر أو أمر البيع إلى الفاتورة أثناء التحويل.
              </FieldDesc>
            </ToggleRow>

            <ToggleRow label="معاينة الفاتورة قبل الحفظ" checked={previewBeforeSave} onChange={setPreviewBeforeSave}>
              <FieldDesc>
                {previewBeforeSave ? 'مفعّل' : 'مقفل'} — يتيح للمستخدمين معاينة النسخة القابلة للطباعة من الفاتورة قبل الحفظ.
              </FieldDesc>
            </ToggleRow>

            <ToggleRow label="حالات الفاتورة المخصصة" checked={customStatuses} onChange={setCustomStatuses}>
              <FieldDesc>
                {customStatuses ? 'مفعّل' : 'مقفل'} — أنشئ حالات مخصصة تناسب سير العمل لديك، مثل "قيد التسليم" أو "قيد المراجعة"، وقم بتعيينها إلى الفواتير.
                يمكن استخدام هذه الحالات في التصفية والبحث عن الفواتير و التقارير.
              </FieldDesc>
            </ToggleRow>

            <ToggleRow label="تبويب الربح في الفاتورة (لا يظهر للعملاء)" checked={profitTab} onChange={setProfitTab}>
              <FieldDesc>
                {profitTab ? 'مفعّل' : 'مقفل'} — تفعيل تبويب الربح في صفحة الفاتورة، ويكون مرئياً فقط للمستخدمين المصرح لهم.
                يتم احتساب الربح بناءً على متوسط تكلفة المنتج في فواتير الشراء. يمكن التحكم بمن يمكنه رؤية التبويب من خلال إعدادات أدوار الموظفين والصلاحيات.
              </FieldDesc>
            </ToggleRow>

            <FieldRow>
              <FieldLabel>عرض الأصفار في الأرقام العشرية</FieldLabel>
              <Radio.Group
                value={decimalDisplay}
                onChange={(e) => setDecimalDisplay(e.target.value)}
                style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 0 }}
              >
                <div style={radioOptionStyle(decimalDisplay === 'always', 'top')}>
                  <Radio value="always">عرض الأصفار دائماً</Radio>
                  <div style={{ fontSize: 13, color: '#9ca3af', marginRight: 24 }}>إظهار دائماً (مثل 10.00)</div>
                </div>
                <div style={radioOptionStyle(decimalDisplay === 'never', 'middle')}>
                  <Radio value="never">إخفاء الأصفار دائماً</Radio>
                  <div style={{ fontSize: 13, color: '#9ca3af', marginRight: 24 }}>إخفاء دائماً (مثل 10)</div>
                </div>
                <div style={radioOptionStyle(decimalDisplay === 'auto', 'bottom')}>
                  <Radio value="auto">تلقائي (حسب القيمة)</Radio>
                  <div style={{ fontSize: 13, color: '#9ca3af', marginRight: 24 }}>إظهار الأصفار للقيم الأقل من 1000 فقط (مثل 100.00) وإخفاؤها للقيم 1000 أو أكثر (مثل 1000)</div>
                </div>
              </Radio.Group>
              <FieldDesc>تحكم في كيفية عرض الأصفار في الأرقام العشرية.</FieldDesc>
            </FieldRow>

            <ToggleRow label="إرسال الفواتير عبر وسائل التواصل الاجتماعي" checked={socialShare} onChange={setSocialShare}>
              <FieldDesc>
                {socialShare ? 'مسموح' : 'غير مسموح'} — يمكنك مشاركة الفواتير مع عملائك عبر وسائل التواصل الاجتماعي.
                كما يمكنك دائماً مشاركتها عبر الرسالة النصية أو البريد الإلكتروني بشكل افتراضي.
              </FieldDesc>
            </ToggleRow>
          </div>

          {/* ════════ التسعير والخصومات ════════ */}
          <Divider />
          <div ref={(el) => { sectionRefs.current['pricing'] = el; }} style={{ paddingTop: 16, paddingBottom: 16 }}>
            <SectionHeader title="التسعير والخصومات" description="التحكم في قواعد تسعير العناصر، وإدخال الخصومات، والحدود المسموح بها." />

            <FieldRow>
              <FieldLabel>طريقة تطبيق الخصومات</FieldLabel>
              <Select
                value={discountMethod}
                onChange={setDiscountMethod}
                style={{ width: '100%', maxWidth: 380, marginTop: 8 }}
              >
                <Select.Option value="total_and_line">خصم على إجمالي الفاتورة ولكل بند معاً</Select.Option>
                <Select.Option value="total_only">خصم على إجمالي الفاتورة فقط</Select.Option>
                <Select.Option value="line_only">خصم على كل بند فقط</Select.Option>
              </Select>
              <FieldDesc>
                حدد طريقة إدخال الخصومات — سواء على إجمالي الفاتورة أو لكل بند أو كلاهما. هذا إعداد عام يحدد طريقة الإدخال، استخدم{' '}
                <a href="#" style={{ color: '#5b8fa8' }}>الصلاحيات والأدوار</a> لتحديد من يمكنه تطبيق الخصومات.
              </FieldDesc>
            </FieldRow>

            <ToggleRow label="الحد الأقصى لنسبة الخصم" checked={maxDiscountEnabled} onChange={setMaxDiscountEnabled}>
              <FieldDesc>
                {maxDiscountEnabled ? 'مفعّل' : 'مقفل'} — أنشئ سياسة لتعديل الحد الأقصى لنسبة الخصم المسموح بها لكل مستخدم.
                استخدم صفحة الصلاحيات والأدوار للتحكم بمن يمكنه تطبيق الخصومات.
              </FieldDesc>
            </ToggleRow>

            <ToggleRow label="خيارات التسعير المتقدمة" checked={advancedPricing} onChange={setAdvancedPricing}>
              <FieldDesc>
                {advancedPricing ? 'مفعّل' : 'مقفل'} — فعّل حقول التسعير المتقدمة مثل الحد الأدنى للسعر، وقيم الخصم، وهوامش الربح لكل منتج.
                ستظهر هذه الحقول في صفحة إضافة/تعديل المنتج أو الخدمة، ويتم تطبيقها على العناصر المحددة داخل الفواتير.
              </FieldDesc>
            </ToggleRow>

            <FieldRow>
              <FieldLabel>احتساب الحد الأدنى لسعر البيع</FieldLabel>
              <Radio.Group
                value={minPriceTax}
                onChange={(e) => setMinPriceTax(e.target.value)}
                style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 0 }}
              >
                <div style={radioOptionStyle(minPriceTax === 'includes_tax', 'top')}>
                  <Radio value="includes_tax">يشمل الضريبة</Radio>
                  <div style={{ fontSize: 13, color: '#9ca3af', marginRight: 24 }}>الحد الأدنى للسعر سيشمل الضريبة. لا يمكن للمستخدم البيع بأقل من إجمالي (السعر + الضريبة).</div>
                </div>
                <div style={radioOptionStyle(minPriceTax === 'excludes_tax', 'bottom')}>
                  <Radio value="excludes_tax">لا يشمل الضريبة</Radio>
                  <div style={{ fontSize: 13, color: '#9ca3af', marginRight: 24 }}>سيُطبَّق الحد الأدنى على السعر فقط بدون الضريبة. الضريبة لا تؤثر على الحد الأدنى للسعر.</div>
                </div>
              </Radio.Group>
              <FieldDesc>
                حدد ما إذا كانت الضريبة مضمنة في الحد الأدنى للسعر بشكل افتراضي لجميع العناصر. الحد الأدنى لسعر البيع: عند تعيينه لمنتج أو خدمة،
                لا يمكن إصدار فاتورة بيع بسعر أقل من الحد الأدنى المحدد.
              </FieldDesc>
            </FieldRow>

            <ToggleRow label="البيع بأقل من سعر متوسط التكلفة" checked={sellBelowCost} onChange={setSellBelowCost}>
              <FieldDesc>
                {sellBelowCost ? 'مفعّل' : 'مقفل'} — اسمح أو امنع بيع المنتجات بسعر أقل من متوسط تكلفتها. يتم حساب متوسط التكلفة تلقائياً بناءً على أسعار الشراء التراكمية في فواتير الشراء الأخيرة لكل صنف.
              </FieldDesc>
            </ToggleRow>

            <ToggleRow label="تغيير قائمة الأسعار عند إنشاء الفواتير" checked={changePriceList} onChange={setChangePriceList}>
              <FieldDesc>
                {changePriceList ? 'مفعّل' : 'مقفل'} — اختر قائمة أسعار مختلفة عن المحددة مسبقاً للعميل أثناء إنشاء الفاتورة. تتيح لك القوائم بتحديد أسعار بيع مختلفة مثل "جملة" أو "تجزئة" بناءً على القائمة المحددة.
              </FieldDesc>
            </ToggleRow>

            <ToggleRow label="تسوية المبيعات" checked={salesAdjustments} onChange={setSalesAdjustments}>
              <FieldDesc>
                {salesAdjustments ? 'مفعّل' : 'مقفل'} — تتيح تسويات المبيعات إضافة مبلغ أو طرحه من إجمالي الفاتورة بقيمة موجبة أو سالبة أثناء إنشائها مع إمكانية إدخال تسمية مخصصة
                وربطها بحساب محاسبي. لإضافة تسويات إضافية مرتبطة بحسابات محددة و تسميات مخصصة مسبقاً على نفس الفاتورة، "إدارة تسويات المبيعات الإضافية".
              </FieldDesc>
            </ToggleRow>
          </div>

          {/* ════════ الدفع والائتمان ════════ */}
          <Divider />
          <div ref={(el) => { sectionRefs.current['payment'] = el; }} style={{ paddingTop: 16, paddingBottom: 16 }}>
            <SectionHeader title="الدفع والائتمان" description="تهيئة سلوك الدفع التلقائي وإدارة رصيد العميل والأرصدة المستحقة." />

            <ToggleRow label="إجعل الفواتير مدفوعة بالفعل افتراضياً" checked={defaultPaid} onChange={setDefaultPaid}>
              <FieldDesc>
                {defaultPaid ? 'مفعّل' : 'مقفل'} — بتحديد الفواتير كمدفوعة إفتراضياً، يمكنك اختيار وسيلة الدفع و الخزينة أثناء إنشاء معاملة دفع تلقائية. ويمكنك إلغاء هذه العلامة يدوياً أثناء إنشاء الفاتورة.
              </FieldDesc>
            </ToggleRow>

            <ToggleRow label="دفع الفاتورة تلقائياً في حالة وجود رصيد للعميل" checked={autoPayFromBalance} onChange={setAutoPayFromBalance}>
              <FieldDesc>
                {autoPayFromBalance ? 'مفعّل' : 'مقفل'} — قم باستخدام الرصيد المتاح للعميل تلقائياً لسداد الفواتير الجديدة كلياً أو جزئياً.
              </FieldDesc>
            </ToggleRow>

            <ToggleRow label="اشعار مدين" checked={debitNotes} onChange={setDebitNotes}>
              <FieldDesc>
                {debitNotes ? 'مفعّل' : 'مقفل'} — قم بإصدار إشعارات المدين لتسجيل زيادة في المديونية أو لتعديل فواتير سابقة تم إصدارها بقيمة أقل، أو لإضافة رسوم إضافية. ترتبط إشعارات المدين بالفاتورة الأصلية وتحدث الرصيد المستحق على العميل.
              </FieldDesc>
            </ToggleRow>
          </div>

          {/* ════════ قيود توفر وصلاحية المخزون ════════ */}
          <Divider />
          <div ref={(el) => { sectionRefs.current['availability'] = el; }} style={{ paddingTop: 16, paddingBottom: 16 }}>
            <SectionHeader title="قيود توفر وصلاحية المخزون" description="تحكم في توفر المنتجات و الخدمات للفوترة وسلوكها ضمن عملية البيع." />

            <FieldRow>
              <FieldLabel>منع بيع و إصدار الفواتير لفئات منتجات و خدمات محددة</FieldLabel>
              <Select
                mode="multiple"
                value={restrictedCategories}
                onChange={setRestrictedCategories}
                style={{ width: '100%', marginTop: 8 }}
                placeholder="اختر الفئات..."
              >
                <Select.Option value="electronics">الإلكترونيات</Select.Option>
                <Select.Option value="furniture">الأثاث</Select.Option>
                <Select.Option value="food">المواد الغذائية</Select.Option>
                <Select.Option value="services">الخدمات</Select.Option>
              </Select>
              <FieldDesc>
                حدد الفئات التي يمنع استخدامها في عمليات البيع أو الفوترة. تحكم في قائمة العناصر غير المخصصة للبيع بحسب احتياجات العمل أو قواعد التحكم في المخزون.
              </FieldDesc>
            </FieldRow>

            <FieldRow>
              <FieldLabel>طبيعة مبيعات النشاط</FieldLabel>
              <Radio.Group
                value={salesNature}
                onChange={(e) => setSalesNature(e.target.value)}
                style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 0 }}
              >
                <div style={radioOptionStyle(salesNature === 'products', 'top')}>
                  <Radio value="products">المنتجات فقط</Radio>
                  <div style={{ fontSize: 13, color: '#9ca3af', marginRight: 24 }}>نشاطك يقدّم منتجات فقط، يمكن تتبع كمياتها وإدارتها كوحدات في المخزون، وإصدار أذون لتسجيل الحركات المخزنية الواردة والصادرة وفقاً لإعدادات المخزون.</div>
                </div>
                <div style={radioOptionStyle(salesNature === 'services', 'middle')}>
                  <Radio value="services">الخدمات فقط</Radio>
                  <div style={{ fontSize: 13, color: '#9ca3af', marginRight: 24 }}>نشاطك يقدّم خدمات فقط، يمكن تحديد مدة لها واستخدامها في المحاورات، والمشاريع.</div>
                </div>
                <div style={radioOptionStyle(salesNature === 'both', 'bottom')}>
                  <Radio value="both">منتجات وخدمات</Radio>
                  <div style={{ fontSize: 13, color: '#9ca3af', marginRight: 24 }}>نشاطك يقدّم منتجات وخدمات معاً.</div>
                </div>
              </Radio.Group>
              <FieldDesc>
                حدد ما إذا كان نشاطك التجاري بيع منتجات، أو خدمات أو كلاهما. يتحكم هذا الإعداد في ما يمكن إضافته إلى المخزون. يمكن تحديث هذا الإعداد لاحقاً دون التأثير على العناصر أو السجلات الحالية.
              </FieldDesc>
            </FieldRow>
          </div>

          {/* ════════ القيود المحاسبية ════════ */}
          <Divider />
          <div ref={(el) => { sectionRefs.current['accounting'] = el; }} style={{ paddingTop: 16, paddingBottom: 16 }}>
            <SectionHeader title="القيود المحاسبية" description="تحكم في كيفية إدخال أوصاف قيود اليومية للفواتير داخل نظام المحاسبة." />

            <ToggleRow label="وصف مخصص لقيود اليومية" checked={customJournalDesc} onChange={setCustomJournalDesc}>
              <FieldDesc>
                {customJournalDesc ? 'مسموح' : 'غير مسموح'} — افتراضياً، يتم استخدام رقم الفاتورة كوصف للقيد اليومي (مثال: فاتورة #2136). فعّل هذا الخيار لتخصيص الوصف باستخدام متغيرات ونصوص تحدّدها بنفسك.
              </FieldDesc>
            </ToggleRow>
          </div>

          <div style={{ height: 40 }} />
        </div>
      </div>
    </div>
  );
}
