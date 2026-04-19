import { useState } from 'react';
import { Button, Dropdown, Switch, Select, Modal, Input, InputNumber } from 'antd';
import {
  PlusOutlined,
  EllipsisOutlined,
  EditOutlined,
  CodeOutlined,
  CopyOutlined,
  DeleteOutlined,
  FileAddOutlined,
  SaveOutlined,
  CloseOutlined,
  SettingOutlined,
  FontSizeOutlined,
  PictureOutlined,
  BankOutlined,
  UserOutlined,
  CarOutlined,
  TableOutlined,
  AppstoreAddOutlined,
  TagOutlined,
  FileTextOutlined,
  ColumnHeightOutlined,
  FontColorsOutlined,
  MessageOutlined,
  BoldOutlined,
  ItalicOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  LinkOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

/* ────── types ────── */
interface InvoiceTemplate {
  id: string;
  name: string;
  createdAt: string;
  isDefault: boolean;
  documentType: string;
  htmlContent: string;
}

/* ────── sidebar tab definitions ────── */
type SidebarTab =
  | 'template' | 'title' | 'logo' | 'business' | 'client'
  | 'shipping' | 'columns' | 'extra_fields' | 'labels'
  | 'intro' | 'footer' | 'formatting' | 'notes';

const sidebarTabs: { key: SidebarTab; label: string; icon: React.ReactNode }[] = [
  { key: 'template',     label: 'بيانات القالب',   icon: <SettingOutlined /> },
  { key: 'title',        label: 'مسمى',            icon: <FontSizeOutlined /> },
  { key: 'logo',         label: 'الشعار',          icon: <PictureOutlined /> },
  { key: 'business',     label: 'بيانات العمل',    icon: <BankOutlined /> },
  { key: 'client',       label: 'بيانات العميل',   icon: <UserOutlined /> },
  { key: 'shipping',     label: 'معلومات الشحن',   icon: <CarOutlined /> },
  { key: 'columns',      label: 'أعمدة البنود',    icon: <TableOutlined /> },
  { key: 'extra_fields', label: 'الحقول الإضافية', icon: <AppstoreAddOutlined /> },
  { key: 'labels',       label: 'المسميات',        icon: <TagOutlined /> },
  { key: 'intro',        label: 'المقدمة',         icon: <FileTextOutlined /> },
  { key: 'footer',       label: 'التذييل',         icon: <ColumnHeightOutlined /> },
  { key: 'formatting',   label: 'التنسيق',         icon: <FontColorsOutlined /> },
  { key: 'notes',        label: 'الملاحظات',       icon: <MessageOutlined /> },
];

/* map tab → which preview section gets highlighted */
const tabToHighlight: Record<SidebarTab, string | null> = {
  template: null,
  title: 'title',
  logo: 'logo',
  business: 'company',
  client: 'client',
  shipping: null,
  columns: 'items',
  extra_fields: null,
  labels: null,
  intro: 'intro',
  footer: 'footer',
  formatting: null,
  notes: 'notes',
};

/* ────── mock data ────── */
const defaultHtmlTemplate = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Invoice Template</title>
  </head>
  <style type="text/css">
    @media print {
      body { max-width: 90% !important; width: 90% !important; margin: 0 auto !important; background: #fff; padding: 0 !important; }
      body > div > div.invoice-inner { margin: 10px auto !important; }
      .invoice-wrap { margin: auto !important; width: 100% !important; }
    }
    * { margin: 0; padding: 0; }
    body { background: #ffffff; font: 12px Arial, Helvetica, sans-serif; }
    .invoice-wrap { margin: 0 auto; background: #FFF; color: #000; }
    .invoice-inner { margin: 0 30px; padding: 20px 0; }
    .listing-table th { background-color: #e5e5e5; border-bottom: 1px solid #555555; border-top: 1px solid #555555; font-weight: bold; text-align: left; padding: 6px 4px; }
    .listing-table td { border-bottom: 1px solid #555555; text-align: left; padding: 5px 6px; vertical-align: top; }
    .total-table td { border-left: 1px solid #555555; }
    .total-table tr td:last-child { text-align: right !important; }
    .total-row { background-color: #e5e5e5; border-bottom: 1px solid #555555; border-top: 1px solid #555555; font-weight: bold; }
    .row-items { margin: 5px 0; display: block; }
    .bold_title { font-weight: bold; }
    .strong_tag { font-weight: bold; }
    .big_title { font-size: 18px; font-weight: 100; }
    .notes-block { margin: 50px 0 0 0; }
    tr, td, th { page-break-inside: avoid !important; }
    .qr-code { margin-top: 10px; text-align: center; }
    #label_unit_price { width: 30px; }
  </style>
  <body>
    <div class="invoice-wrap">
      {%html_sticky_header%}
      <div class="invoice-inner">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="left" valign="top">
              <h2 class="big_title">Invoice</h2>
              <div class="row-items"><strong>Invoice No:</strong> {%invoice_number%}</div>
              <div class="row-items"><strong>Date:</strong> {%invoice_date%}</div>
            </td>
            <td align="right" valign="top">
              {%company_logo%}
              <div class="row-items">{%company_name%}</div>
            </td>
          </tr>
        </table>
        <br />
        <table class="listing-table" width="100%" cellspacing="0" cellpadding="0">
          <thead><tr><th>Item</th><th>Description</th><th>Qty</th><th>Price</th><th>Balance</th></tr></thead>
          <tbody>{%invoice_items%}</tbody>
        </table>
        <br />
        <table class="total-table" width="50%" align="right">
          <tr><td><strong>Items Total</strong></td><td>{%items_total%}</td></tr>
          <tr class="total-row"><td><strong>Total</strong></td><td>{%total%}</td></tr>
          <tr><td><strong>Paid</strong></td><td>{%paid%}</td></tr>
          <tr><td><strong>Balance Due</strong></td><td>{%balance_due%}</td></tr>
        </table>
        <div class="notes-block"><p>{%notes%}</p></div>
        <div class="qr-code">{%qr_code_image%}</div>
      </div>
    </div>
  </body>
</html>`;

const initialTemplates: InvoiceTemplate[] = [
  {
    id: '1',
    name: 'Receipt',
    createdAt: '18/04/2026',
    isDefault: true,
    documentType: 'فاتورة بيع',
    htmlContent: defaultHtmlTemplate,
  },
];

/* ────── quantity/price display options ────── */
const qtyPriceOptions = [
  { value: 'qty_before_price', label: 'إظهار الكمية قبل سعر الوحدة' },
  { value: 'price_before_qty', label: 'إظهار سعر الوحدة قبل الكمية' },
  { value: 'qty_before_price_2', label: 'إظهار الكمية قبل سعر الوحده' },
  { value: 'hide_both', label: 'اخفاء سعر الوحده والكمية' },
];

/* ────── highlight color ────── */
const HIGHLIGHT = '#fdf6e3';

/* ────── component ────── */
export default function InvoiceDesignsPage() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<InvoiceTemplate[]>(initialTemplates);

  /* editor state */
  const [editingTemplate, setEditingTemplate] = useState<InvoiceTemplate | null>(null);
  const [editorMode, setEditorMode] = useState<'visual' | 'html' | null>(null);
  const [activeTab, setActiveTab] = useState<SidebarTab>('template');

  /* editor form fields */
  const [editName, setEditName] = useState('');
  const [editIsDefault, setEditIsDefault] = useState(false);
  const [editShowCurrency, setEditShowCurrency] = useState(true);
  const [editShowPaidRemaining, setEditShowPaidRemaining] = useState(true);
  const [editShowShipping, setEditShowShipping] = useState(false);
  const [editQtyPriceOption, setEditQtyPriceOption] = useState('qty_before_price');
  const [editHtml, setEditHtml] = useState('');

  /* title fields */
  const [titleInvoice, setTitleInvoice] = useState('Invoice');
  const [titleEstimate, setTitleEstimate] = useState('Estimate');
  const [titleCreditNote, setTitleCreditNote] = useState('Credit Note');
  const [titleRefundReceipt, setTitleRefundReceipt] = useState('Refund Receipt');
  const [titleDebitNote, setTitleDebitNote] = useState('Debit Note');

  /* logo fields */
  const [logoWidth, setLogoWidth] = useState(150);
  const [logoHeight, setLogoHeight] = useState(150);

  /* business data */
  const [businessContent, setBusinessContent] = useState(
    '{%business_name%}\nCompany Register: Lama\n{%address%}\n{%tax_id%}, {%business%}\n{%postal_code%}\n{%phone%}'
  );

  /* client data */
  const [clientContent, setClientContent] = useState(
    '{%client_organization%}\n{%client_first_name%}\n{%client_last_name%}\n{%client_postcode%}\n{%client_city%}\n{%client_address%}\n{%client_business_registration_info_1%}\n{%client_business_registration_info_2%}'
  );

  /* shipping data */
  const [shippingContent, setShippingContent] = useState(
    '{%client_secondary_name%}\n{%client_secondary_address%}\n{%client_secondary_city%}\n{%client_secondary_postcode%}'
  );

  /* column config */
  const [columnConfig, setColumnConfig] = useState([
    { titleEn: 'Item name', field: 'item' },
    { titleEn: 'Description', field: 'description' },
    { titleEn: '', field: '' },
    { titleEn: '', field: '' },
  ]);

  /* extra fields */
  const [extraFields, setExtraFields] = useState<Record<string, boolean>>({
    custom_field: true,
    po_no: false,
    status: false,
    total: false,
    due_after: false,
    due_date: false,
    paid: false,
    balance_due: false,
    next_payment: false,
    discount: false,
    order_source: false,
  });

  /* labels */
  const [labelsMap, setLabelsMap] = useState<Record<string, string>>({
    item_name: 'Item name',
    description: 'Description',
    price: 'Price',
    qty: 'Qty',
    subtotal: 'Subtotal',
    items_total: 'Items Total',
    paid_label: 'Paid',
    balance_due: 'Balance Due',
    total: 'Total',
    status: 'Status',
    due_after: 'Due After',
    due_date: 'Due Date',
    next_payment: 'Next Payment',
    from_date: 'From Date',
    to_date: 'To Date',
    discount: 'Discount',
    ship_to: 'Ship To',
    shipping: 'Shipping',
    po_no: 'Po No',
    to: 'To',
    order_source: 'Order Source',
  });

  /* footer / intro / notes */
  const [introContent, setIntroContent] = useState('');
  const [footerContent, setFooterContent] = useState('');
  const [notesContent, setNotesContent] = useState('{%invoice_notes%}');

  /* formatting */
  const [formatting, setFormatting] = useState({
    fontFamily: 'System Fonts',
    fontSize: '9pt',
    tableBorderColor: '#e5e5e5',
    tableHeaderBg: '#1e88e5',
    tableHeaderTextColor: '#ffffff',
    tableRow1Color: '#ffffff',
    tableRow2Color: '#f9f9f9',
    customCss: '',
    paperSize: 'أخرى',
    paperHeight: 8,
    paperWidth: null as number | null,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
  });

  /* delete confirm */
  const [deleteId, setDeleteId] = useState<string | null>(null);

  /* ── open editor ── */
  const openEditor = (template: InvoiceTemplate, mode: 'visual' | 'html') => {
    setEditingTemplate(template);
    setEditorMode(mode);
    setEditName(template.name);
    setEditIsDefault(template.isDefault);
    setEditHtml(template.htmlContent);
    setEditShowCurrency(true);
    setEditShowPaidRemaining(true);
    setEditShowShipping(false);
    setEditQtyPriceOption('qty_before_price');
    setActiveTab('template');
  };

  /* ── save ── */
  const handleSave = () => {
    if (!editingTemplate) return;
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === editingTemplate.id
          ? { ...t, name: editName, isDefault: editIsDefault, htmlContent: editHtml }
          : editIsDefault ? { ...t, isDefault: false } : t
      )
    );
    setEditorMode(null);
    setEditingTemplate(null);
  };

  /* ── copy ── */
  const handleCopy = (template: InvoiceTemplate) => {
    const newTemplate: InvoiceTemplate = {
      ...template,
      id: String(Date.now()),
      name: `${template.name} - نسخة`,
      isDefault: false,
      createdAt: new Date().toLocaleDateString('en-GB'),
    };
    setTemplates((prev) => [...prev, newTemplate]);
  };

  /* ── delete ── */
  const handleDelete = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    setDeleteId(null);
  };

  /* ── new design ── */
  const handleNewDesign = () => {
    const newTemplate: InvoiceTemplate = {
      id: String(Date.now()),
      name: 'تصميم جديد',
      createdAt: new Date().toLocaleDateString('en-GB'),
      isDefault: false,
      documentType: 'فاتورة بيع',
      htmlContent: defaultHtmlTemplate,
    };
    setTemplates((prev) => [...prev, newTemplate]);
    openEditor(newTemplate, 'visual');
  };

  /* ── dropdown menu per card ── */
  const getMenuItems = (template: InvoiceTemplate) => [
    { key: 'edit', icon: <EditOutlined style={{ color: '#d4a639' }} />, label: 'تعديل', onClick: () => openEditor(template, 'visual') },
    { key: 'edit-html', icon: <CodeOutlined style={{ color: '#d4a639' }} />, label: 'تعديل HTML', onClick: () => openEditor(template, 'html') },
    { key: 'add-voucher', icon: <FileAddOutlined style={{ color: '#d4a639' }} />, label: 'أضف الى نماذج القسائم' },
    { type: 'divider' as const },
    { key: 'copy', icon: <CopyOutlined style={{ color: '#5b8fa8' }} />, label: 'نسخ', onClick: () => handleCopy(template) },
    { key: 'delete', icon: <DeleteOutlined style={{ color: '#e74c3c' }} />, label: 'حذف', danger: true, onClick: () => setDeleteId(template.id) },
  ];

  /* ── highlight helper ── */
  const hl = (section: string): React.CSSProperties => {
    const highlighted = tabToHighlight[activeTab];
    return highlighted === section ? { background: HIGHLIGHT, transition: 'background 0.3s' } : {};
  };

  /* ── render sidebar content panel ── */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'template':
        return (
          <>
            <PanelTitle>عدل بيانات القالب</PanelTitle>
            <FieldLabel required>القالب</FieldLabel>
            <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="اسم القالب" style={{ marginBottom: 16 }} />
            <SettingToggle label="اجعل هذا التصميم هو التصميم الأساسي" checked={editIsDefault} onChange={setEditIsDefault} />
            <SettingToggle label="لا تظهر علامة العملة في سعر البنود" checked={editShowCurrency} onChange={setEditShowCurrency} />
            <SettingToggle label="أظهر دائما المبلغ المدفوع والمبلغ المستحق" checked={editShowPaidRemaining} onChange={setEditShowPaidRemaining} />
            <SettingToggle label="إضافة بيانات الشحن (عنوان ثانوي) للفاتورة" checked={editShowShipping} onChange={setEditShowShipping} />
            <div style={{ marginTop: 16 }}>
              <FieldLabel>خيارات الكمية وسعر الوحدة</FieldLabel>
              <Select value={editQtyPriceOption} onChange={setEditQtyPriceOption} style={{ width: '100%' }} options={qtyPriceOptions} />
            </div>
          </>
        );

      case 'title':
        return (
          <>
            <PanelTitle>تعديل عنوان الفاتورة</PanelTitle>
            <FieldLabel>عنوان الفاتورة</FieldLabel>
            <Input value={titleInvoice} onChange={(e) => setTitleInvoice(e.target.value)} style={{ marginBottom: 12 }} />
            <FieldLabel>عنوان عروض الأسعار</FieldLabel>
            <Input value={titleEstimate} onChange={(e) => setTitleEstimate(e.target.value)} style={{ marginBottom: 12 }} />
            <FieldLabel>عنوان إشعار دائن</FieldLabel>
            <Input value={titleCreditNote} onChange={(e) => setTitleCreditNote(e.target.value)} style={{ marginBottom: 12 }} />
            <FieldLabel>عنوان إيصال الاسترجاع</FieldLabel>
            <Input value={titleRefundReceipt} onChange={(e) => setTitleRefundReceipt(e.target.value)} style={{ marginBottom: 12 }} />
            <FieldLabel>عنوان الاستلام المبدئي</FieldLabel>
            <Input value={titleDebitNote} onChange={(e) => setTitleDebitNote(e.target.value)} style={{ marginBottom: 12 }} />
          </>
        );

      case 'logo':
        return (
          <>
            <PanelTitle>تعديل الشعار</PanelTitle>
            {/* Logo preview */}
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ width: 120, height: 90, border: '1px solid #ccc', background: '#e0e0e0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#888' }}>
                Your Logo
              </div>
            </div>
            <FieldLabel>شعار الفاتورة</FieldLabel>
            <div style={{ marginBottom: 16 }}>
              <input type="file" accept="image/*" style={{ fontSize: 12 }} />
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>الامتدادات المسموح بها jpg, png, gif المقاس مفضل 150 × 150</div>
            </div>
            <FieldLabel>عرض الشعار</FieldLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <InputNumber value={logoWidth} onChange={(v) => setLogoWidth(v || 150)} min={20} max={500} style={{ width: 80 }} />
              <input type="color" defaultValue="#5b8fa8" style={{ width: 28, height: 28, border: 'none', cursor: 'pointer' }} />
            </div>
            <FieldLabel>طول الشعار</FieldLabel>
            <InputNumber value={logoHeight} onChange={(v) => setLogoHeight(v || 150)} min={20} max={500} style={{ width: 80 }} />
          </>
        );

      case 'business':
        return (
          <>
            <PanelTitle>تعديل بيانات العمل</PanelTitle>
            <RichEditorToolbar />
            <Input.TextArea
              value={businessContent}
              onChange={(e) => setBusinessContent(e.target.value)}
              rows={6}
              style={{ fontFamily: 'monospace', fontSize: 12, marginBottom: 12, direction: 'ltr' }}
            />
            <FieldLabel>الكلمات المساعدة</FieldLabel>
            <TagsList tags={['اسم الشركة / الؤول', 'اسم الشركة الآخر', 'سجل الشركة', 'الاسم المختار', 'العنوان ١', 'العنوان ٢', 'عنوان الشركة 1', 'عنوان الشركة 2', 'مدينة الشركة', 'البريد الالكتروني للشركة']} />
            <div style={{ marginTop: 12, fontSize: 12, color: '#5b8fa8', cursor: 'pointer' }}>
              <FileTextOutlined /> دليل المتغيرات الكامل
            </div>
          </>
        );

      case 'client':
        return (
          <>
            <PanelTitle>تعديل بيانات العميل</PanelTitle>
            <RichEditorToolbar />
            <Input.TextArea
              value={clientContent}
              onChange={(e) => setClientContent(e.target.value)}
              rows={6}
              style={{ fontFamily: 'monospace', fontSize: 12, marginBottom: 12, direction: 'ltr' }}
            />
            <FieldLabel>الكلمات المساعدة</FieldLabel>
            <TagsList tags={['شركة العميل', 'اسم العميل الأول', 'اسم العميل الأخير', 'هاتف العميل', 'عنوان العميل', 'عنوان العميل الكامل', 'بريد العميل', 'مدينة العميل', 'الرمز البريدي']} />
            <div style={{ marginTop: 12, fontSize: 12, color: '#5b8fa8', cursor: 'pointer' }}>
              <FileTextOutlined /> دليل المتغيرات الكامل
            </div>
          </>
        );

      case 'shipping':
        return (
          <>
            <PanelTitle>تعديل معلومات الشحن</PanelTitle>
            <RichEditorToolbar />
            <Input.TextArea
              value={shippingContent}
              onChange={(e) => setShippingContent(e.target.value)}
              rows={5}
              style={{ fontFamily: 'monospace', fontSize: 12, marginBottom: 12, direction: 'ltr' }}
            />
            <FieldLabel>الكلمات المساعدة</FieldLabel>
            <TagsList tags={['بريد العميل', 'اسم العميل الأول', 'اسم العميل الأخير', 'هاتف العميل', 'عنوان العميل الأول', 'عنوان العميل الكامل', 'بريد العميل', 'الرمز البريدي']} />
            <div style={{ marginTop: 12, fontSize: 12, color: '#5b8fa8', cursor: 'pointer' }}>
              <FileTextOutlined /> دليل المتغيرات الكامل
            </div>
          </>
        );

      case 'columns': {
        const fieldOptions = [
          { value: '', label: 'أختر الحقل' },
          { value: 'serial', label: 'الرقم التسلسلي' },
          { value: 'product_image', label: 'صورة المنتج' },
          { value: 'item', label: 'البند' },
          { value: 'description', label: 'الوصف' },
          { value: 'product_code', label: 'كود المنتج' },
          { value: 'barcode', label: 'باركود' },
          { value: 'brand', label: 'الماركة' },
          { value: 'category', label: 'التصنيف' },
          { value: 'tax1_name', label: 'Tax1 Name' },
          { value: 'tax1_value', label: 'Tax1 Value' },
          { value: 'tax1_percent', label: 'Tax1 Percent' },
          { value: 'tax2_name', label: 'Tax2 Name' },
          { value: 'tax2_value', label: 'Tax2 Value' },
          { value: 'tax2_percent', label: 'Tax2 Percent' },
          { value: 'warehouse', label: 'المستودع' },
          { value: 'subtotal', label: 'المجموع' },
          { value: 'sales_person', label: 'مسئول مبيعات' },
          { value: 'account', label: 'الحساب' },
          { value: 'cost_center', label: 'مركز التكلفة' },
          { value: 'item_code_input', label: 'Item Code Input' },
          { value: 'item_type_input', label: 'Item Type Input' },
        ];
        return (
          <>
            <PanelTitle>تعديل أعمدة البنود</PanelTitle>
            <div style={{ display: 'flex', gap: 4, fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8, borderBottom: '1px solid #e8ecf0', paddingBottom: 8 }}>
              <div style={{ flex: 1 }}>العنوان</div>
              <div style={{ flex: 1 }}>الحقل</div>
            </div>
            {columnConfig.map((col, i) => (
              <div key={i} style={{ display: 'flex', gap: 4, marginBottom: 8, alignItems: 'center' }}>
                <Input
                  size="small"
                  style={{ flex: 1 }}
                  value={col.titleEn}
                  onChange={(e) => {
                    const updated = [...columnConfig];
                    updated[i] = { ...updated[i], titleEn: e.target.value };
                    setColumnConfig(updated);
                  }}
                  placeholder="العنوان"
                />
                <Select
                  size="small"
                  style={{ flex: 1 }}
                  value={col.field || undefined}
                  placeholder="أختر الحقل"
                  options={fieldOptions.filter((o) => o.value !== '')}
                  allowClear
                  onChange={(val) => {
                    const updated = [...columnConfig];
                    updated[i] = { ...updated[i], field: val || '' };
                    setColumnConfig(updated);
                  }}
                />
              </div>
            ))}
          </>
        );
      }

      case 'extra_fields': {
        const fieldLabels: Record<string, string> = {
          custom_field: 'حقل مخصص / مخصصة',
          po_no: 'Po No',
          status: 'Status',
          total: 'Total',
          due_after: 'Due After',
          due_date: 'Due Date',
          paid: 'Paid',
          balance_due: 'Balance Due',
          next_payment: 'Next Payment',
          discount: 'Discount',
          order_source: 'Order Source',
        };

        const menuItems = Object.keys(extraFields).map((key) => ({
          key,
          label: (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <span>{fieldLabels[key]}</span>
              {extraFields[key] && <span style={{ color: '#0ebc7f', fontSize: 16 }}>✔</span>}
            </div>
          ),
        }));

        return (
          <>
            <PanelTitle>تعديل الحقول الإضافية</PanelTitle>
            <Dropdown
              trigger={['click']}
              menu={{
                items: menuItems,
                onClick: (e) => setExtraFields((prev) => ({ ...prev, [e.key]: !prev[e.key] })),
              }}
              placement="bottomRight"
            >
              <Button
                type="primary"
                style={{
                  width: '100%',
                  background: '#00a3e0',
                  borderColor: '#00a3e0',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 8,
                  fontWeight: 600,
                  fontSize: 14,
                  height: 38,
                }}
              >
                <PlusOutlined /> إضافة حقول أخرى
              </Button>
            </Dropdown>
          </>
        );
      }

      case 'labels':
        return (
          <>
            <PanelTitle>تعديل تغيير المسميات</PanelTitle>
            <div style={{ maxHeight: 500, overflowY: 'auto' }}>
              {Object.entries(labelsMap).map(([key, value]) => {
                const arMap: Record<string, string> = {
                  item_name: 'اسم', description: 'الوصف', price: 'سعر',
                  qty: 'الكمية', subtotal: 'المجموع', items_total: 'الإجمالي',
                  paid_label: 'المبلغ المستحق', balance_due: 'المبلغ المستحق',
                  total: 'الإجمالي', status: 'حالة الدفع',
                  due_after: 'مستحقة الدفع بعد', due_date: 'تاريخ الاستحقاق',
                  next_payment: 'القسط القادم', from_date: 'التاريخ من',
                  to_date: 'التاريخ الى', discount: 'الخصم',
                  ship_to: 'مستلم/ف الشحن', shipping: 'الشحن',
                  po_no: 'رقم الأمر', to: 'الى', order_source: 'مصدر الطلب',
                };
                return (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, borderBottom: '1px solid #f0f0f0', paddingBottom: 10 }}>
                    <div style={{ flex: 1, textAlign: 'right', fontSize: 12, color: '#6b7280' }}>{arMap[key] || key}</div>
                    <Input
                      size="small"
                      value={value}
                      onChange={(e) => setLabelsMap((prev) => ({ ...prev, [key]: e.target.value }))}
                      style={{ flex: 1, textAlign: 'left', fontSize: 12 }}
                    />
                  </div>
                );
              })}
            </div>
          </>
        );

      case 'intro':
        return (
          <>
            <PanelTitle>تعديل المقدمة</PanelTitle>
            <FieldLabel>Sticky Header</FieldLabel>
            <RichEditorToolbar />
            <Input.TextArea
              value={introContent}
              onChange={(e) => setIntroContent(e.target.value)}
              rows={6}
              style={{ fontFamily: 'monospace', fontSize: 12, marginBottom: 12, direction: 'ltr' }}
            />
            <FieldLabel>الكلمات المساعدة</FieldLabel>
            <TagsList tags={['اسم الشركة الأول', 'اسم الشركة الأخير', 'مدير الشركة', 'الاسم التجاري', 'بريد الشركة', 'عنوان الشركة 1', 'عنوان الشركة 2', 'مدينة الشركة', 'محافظة الشركة', 'الرمز البريدي للشركة']} />
            <div style={{ marginTop: 12, fontSize: 12, color: '#5b8fa8', cursor: 'pointer' }}>
              <FileTextOutlined /> دليل المتغيرات الكامل
            </div>
          </>
        );

      case 'footer':
        return (
          <>
            <PanelTitle>تعديل التذييل</PanelTitle>
            <FieldLabel>Sticky Footer</FieldLabel>
            <RichEditorToolbar />
            <Input.TextArea
              value={footerContent}
              onChange={(e) => setFooterContent(e.target.value)}
              rows={6}
              style={{ fontFamily: 'monospace', fontSize: 12, marginBottom: 12, direction: 'ltr' }}
            />
            <FieldLabel>الكلمات المساعدة</FieldLabel>
            <TagsList tags={['اسم الشركة الأول', 'اسم الشركة الأخير', 'مدير الشركة', 'الاسم التجاري', 'بريد الشركة', 'عنوان الشركة 1', 'عنوان الشركة 2', 'مدينة الشركة', 'محافظة الشركة', 'الرمز البريدي للشركة']} />
            <div style={{ marginTop: 12, fontSize: 12, color: '#5b8fa8', cursor: 'pointer' }}>
              <FileTextOutlined /> دليل المتغيرات الكامل
            </div>
          </>
        );

      case 'notes':
        return (
          <>
            <PanelTitle>تعديل ملاحظة</PanelTitle>
            <RichEditorToolbar />
            <Input.TextArea
              value={notesContent}
              onChange={(e) => setNotesContent(e.target.value)}
              rows={6}
              style={{ fontFamily: 'monospace', fontSize: 12, marginBottom: 12, direction: 'ltr' }}
            />
            <FieldLabel>الكلمات المساعدة</FieldLabel>
            <TagsList tags={['اسم الشركة الأول', 'اسم الشركة الأخير', 'مدير الشركة', 'الاسم التجاري', 'بريد الشركة', 'عنوان الشركة 1', 'عنوان الشركة 2', 'مدينة الشركة', 'محافظة الشركة', 'الرمز البريدي للشركة']} />
            <div style={{ marginTop: 12, fontSize: 12, color: '#5b8fa8', cursor: 'pointer' }}>
              <FileTextOutlined /> دليل المتغيرات الكامل
            </div>
          </>
        );

      case 'formatting': {
        const updateFmt = (key: string, val: any) => setFormatting(p => ({ ...p, [key]: val }));
        return (
          <>
            <PanelTitle>تعديل التنسيق</PanelTitle>
            
            <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8, marginTop: 16 }}>الخط الافتراضي</div>
            <FieldLabel>الخط</FieldLabel>
            <Select size="small" style={{ width: '100%', marginBottom: 12 }} value={formatting.fontFamily} onChange={(v) => updateFmt('fontFamily', v)} options={[{ value: 'System Fonts', label: 'System Fonts' }]} />
            <FieldLabel>الحجم</FieldLabel>
            <Select size="small" style={{ width: '100%', marginBottom: 24 }} value={formatting.fontSize} onChange={(v) => updateFmt('fontSize', v)} options={[{ value: '9pt', label: '9pt' }]} />

            <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>تنسيق جدول البنود</div>
            <FieldLabel>لون الحدود</FieldLabel>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
               <Input size="small" value={formatting.tableBorderColor} onChange={(e) => updateFmt('tableBorderColor', e.target.value)} style={{ flex: 1 }} />
               <input type="color" value={formatting.tableBorderColor} onChange={(e) => updateFmt('tableBorderColor', e.target.value)} style={{ width: 28, height: 28, padding: 0, border: 'none', cursor: 'pointer' }} />
            </div>
            
            <FieldLabel>لون خلفية العنوان</FieldLabel>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
               <Input size="small" value={formatting.tableHeaderBg} onChange={(e) => updateFmt('tableHeaderBg', e.target.value)} style={{ flex: 1 }} />
               <input type="color" value={formatting.tableHeaderBg} onChange={(e) => updateFmt('tableHeaderBg', e.target.value)} style={{ width: 28, height: 28, padding: 0, border: 'none', cursor: 'pointer' }} />
            </div>

            <FieldLabel>لون نص العنوان</FieldLabel>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
               <Input size="small" value={formatting.tableHeaderTextColor} onChange={(e) => updateFmt('tableHeaderTextColor', e.target.value)} style={{ flex: 1 }} />
               <input type="color" value={formatting.tableHeaderTextColor} onChange={(e) => updateFmt('tableHeaderTextColor', e.target.value)} style={{ width: 28, height: 28, padding: 0, border: 'none', cursor: 'pointer' }} />
            </div>

            <FieldLabel>لون الصف الأول</FieldLabel>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
               <Input size="small" value={formatting.tableRow1Color} onChange={(e) => updateFmt('tableRow1Color', e.target.value)} style={{ flex: 1 }} />
               <input type="color" value={formatting.tableRow1Color} onChange={(e) => updateFmt('tableRow1Color', e.target.value)} style={{ width: 28, height: 28, padding: 0, border: 'none', cursor: 'pointer' }} />
            </div>

            <FieldLabel>لون الصف الثاني</FieldLabel>
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
               <Input size="small" value={formatting.tableRow2Color} onChange={(e) => updateFmt('tableRow2Color', e.target.value)} style={{ flex: 1 }} />
               <input type="color" value={formatting.tableRow2Color} onChange={(e) => updateFmt('tableRow2Color', e.target.value)} style={{ width: 28, height: 28, padding: 0, border: 'none', cursor: 'pointer' }} />
            </div>

            <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>كود التنسيق</div>
            <Input.TextArea rows={4} value={formatting.customCss} onChange={(e) => updateFmt('customCss', e.target.value)} placeholder="Add css code without <style> tag" style={{ marginBottom: 24, fontSize: 12, fontFamily: 'monospace', direction: 'ltr' }} />

            <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>حجم الورق</div>
            <Select size="small" style={{ width: '100%', marginBottom: 12 }} value={formatting.paperSize} onChange={(v) => updateFmt('paperSize', v)} options={[{ value: 'أخرى', label: 'أخرى' }]} />
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              <div style={{ flex: 1 }}>
                <FieldLabel>Height (cm)</FieldLabel>
                <InputNumber size="small" style={{ width: '100%' }} value={formatting.paperHeight} onChange={(v) => updateFmt('paperHeight', v || 8)} />
              </div>
              <div style={{ flex: 1 }}>
                <FieldLabel>Width (cm)</FieldLabel>
                <InputNumber size="small" style={{ width: '100%' }} value={formatting.paperWidth} onChange={(v) => updateFmt('paperWidth', v)} />
              </div>
            </div>

            <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>هامش الصفحة</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>أعلى (cm)</div>
                <InputNumber size="small" style={{ width: '100%', textAlign: 'center' }} value={formatting.marginTop} onChange={(v) => updateFmt('marginTop', v || 0)} />
              </div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>أسفل (cm)</div>
                <InputNumber size="small" style={{ width: '100%', textAlign: 'center' }} value={formatting.marginBottom} onChange={(v) => updateFmt('marginBottom', v || 0)} />
              </div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>يسار (cm)</div>
                <InputNumber size="small" style={{ width: '100%', textAlign: 'center' }} value={formatting.marginLeft} onChange={(v) => updateFmt('marginLeft', v || 0)} />
              </div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>يمين (cm)</div>
                <InputNumber size="small" style={{ width: '100%', textAlign: 'center' }} value={formatting.marginRight} onChange={(v) => updateFmt('marginRight', v || 0)} />
              </div>
            </div>
          </>
        );
      }

      default:
        return (
          <>
            <PanelTitle>تعديل {sidebarTabs.find((t) => t.key === activeTab)?.label}</PanelTitle>
            <div style={{ fontSize: 13, color: '#9ca3af', padding: '24px 0', textAlign: 'center' }}>
              قريباً...
            </div>
          </>
        );
    }
  };

  /* ═══════════════ EDITOR VIEW ═══════════════ */
  if (editorMode && editingTemplate) {
    return (
      <div dir="rtl" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
        {/* Top bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 24px',
          borderBottom: '1px solid #e8ecf0',
          background: '#fff',
        }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} style={{ background: '#27ae60' }}>
              حفظ
            </Button>
            <Button icon={<CloseOutlined />} onClick={() => { setEditorMode(null); setEditingTemplate(null); }}>
              إلغاء
            </Button>
          </div>
          <h3 style={{ margin: 0, fontSize: 17 }}>منشئ تصاميم الفواتير</h3>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* ─── Main content area ─── */}
          <div style={{
            flex: 1,
            background: '#e8ecf0',
            overflow: 'auto',
            padding: 24,
            display: 'flex',
            justifyContent: 'center',
            alignItems: editorMode === 'html' ? 'stretch' : 'flex-start',
          }}>
            {editorMode === 'visual' ? (
              /* ── Invoice preview ── */
              <div style={{
                background: '#fff',
                width: 380,
                minHeight: 600,
                boxShadow: '0 2px 16px rgba(0,0,0,0.1)',
                padding: '30px 40px',
                fontSize: 12,
                fontFamily: 'Arial, Helvetica, sans-serif',
                border: '1px dashed #ccc',
              }}>
                {/* sticky_header */}
                <div style={{ ...hl('intro'), fontSize: 10, color: '#999', fontStyle: 'italic', padding: '4px 0', marginBottom: 8 }}>
                  {'{%sticky_header%}'}
                </div>

                {/* Invoice title */}
                <div style={{ ...hl('title'), padding: '4px 0', marginBottom: 12 }}>
                  <h2 style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', textDecoration: 'underline', margin: 0 }}>{titleInvoice}</h2>
                </div>

                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 16, ...hl('logo'), padding: '8px 0' }}>
                  <div style={{
                    width: 130,
                    height: 100,
                    border: '1px solid #ccc',
                    background: '#e0e0e0',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    color: '#888',
                  }}>
                    Your Logo
                  </div>
                </div>

                {/* Company info */}
                <div style={{ textAlign: 'center', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc', padding: '10px 0', marginBottom: 12, ...hl('company') }}>
                  <div style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 4 }}>Lama</div>
                  <div style={{ color: '#c0392b', fontSize: 11, lineHeight: 1.6 }}>
                    Company Register: Lama<br />
                    Gamal Abd El-Nasir Rd, Sidi Beshr Bahri<br />
                    Montaza 2, 21500 الأسكندرية
                  </div>
                </div>

                {/* Client info */}
                <div style={{ borderBottom: '1px solid #ccc', padding: '10px 0', marginBottom: 12, ...hl('client') }}>
                  <div style={{ color: '#5b8fa8', fontSize: 11, lineHeight: 1.7 }}>
                    <span style={{ textDecoration: 'underline', fontWeight: 'bold' }}>شركة العميل</span><br />
                    <span style={{ color: '#c0392b' }}>اسم العميل الأول اسم العميل الأخير</span><br />
                    <span style={{ color: '#c0392b' }}>الرمز البريدي</span><br />
                    <span style={{ color: '#c0392b' }}>المدينة المنطقة</span><br />
                    Client Business Info 1<br />
                    Client Business Info 2
                  </div>
                </div>

                {/* Invoice detail fields */}
                <table style={{ fontSize: 12, marginBottom: 6, borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr><td style={{ fontWeight: 'bold', paddingRight: 20, paddingBottom: 3 }}>Invoice No</td><td style={{ paddingBottom: 3 }}>#000000</td></tr>
                    <tr><td style={{ fontWeight: 'bold', paddingRight: 20, paddingBottom: 3 }}>Refunded Invoice No</td><td style={{ paddingBottom: 3 }}>#000000</td></tr>
                    <tr><td style={{ fontWeight: 'bold', paddingRight: 20, paddingBottom: 3 }}>Invoice Date</td><td style={{ paddingBottom: 3 }}>19/04/2026</td></tr>
                  </tbody>
                </table>
                <div style={{ fontSize: 10, color: '#5b8fa8', textDecoration: 'underline', marginBottom: 14, cursor: 'pointer' }}>
                  إضافة حقول أخرى
                </div>

                {/* Items table */}
                <div style={{ ...hl('items') }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, marginBottom: 12 }}>
                    <thead>
                      <tr style={{ background: '#e5e5e5', borderTop: '1px solid #555', borderBottom: '1px solid #555' }}>
                        <th style={{ padding: '6px 4px', textAlign: 'left', fontWeight: 'bold' }}>Item name</th>
                        <th style={{ padding: '6px 4px', textAlign: 'left', fontWeight: 'bold' }}>Description</th>
                        <th style={{ padding: '6px 4px', textAlign: 'left', fontWeight: 'bold' }}>Qty</th>
                        <th style={{ padding: '6px 4px', textAlign: 'left', fontWeight: 'bold' }}>Price</th>
                        <th style={{ padding: '6px 4px', textAlign: 'left', fontWeight: 'bold' }}>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '5px 4px', borderBottom: '1px solid #555' }}>Demo Item</td>
                        <td style={{ padding: '5px 4px', borderBottom: '1px solid #555' }}>Demo Product Description</td>
                        <td style={{ padding: '5px 4px', borderBottom: '1px solid #555' }}>1</td>
                        <td style={{ padding: '5px 4px', borderBottom: '1px solid #555' }}>200.00</td>
                        <td style={{ padding: '5px 4px', borderBottom: '1px solid #555' }}>200.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div style={{ fontSize: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #eee' }}>
                    <strong>Items Total</strong>
                    <span>200.00 ج.م</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '2px solid #555', fontWeight: 'bold' }}>
                    <strong>Total</strong>
                    <span style={{ color: '#c0392b', fontWeight: 'bold' }}>200.00 ج.م</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #eee' }}>
                    <strong>Paid</strong>
                    <span>0.00 ج.م</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #eee' }}>
                    <strong>Balance Due</strong>
                    <span>200.00 ج.م</span>
                  </div>
                </div>

                {/* Notes */}
                <div style={{ marginTop: 30, borderTop: '1px solid #ccc', paddingTop: 8, ...hl('notes') }}>
                  <div style={{ fontSize: 11, textDecoration: 'underline', marginBottom: 4 }}>ملاحظات الفاتورة</div>
                </div>

                {/* QR code */}
                <div style={{ marginTop: 20, textAlign: 'center', fontSize: 11, color: '#999' }}>
                  {'{%sa_qr_code_image%}'}
                </div>

                {/* sticky_footer */}
                <div style={{ fontSize: 10, color: '#999', fontStyle: 'italic', marginTop: 16, borderTop: '1px dashed #ddd', paddingTop: 8, ...hl('footer') }}>
                  {'{%sticky_footer%}'}
                </div>
              </div>
            ) : (
              /* ── HTML editor ── */
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ textAlign: 'left', marginBottom: 8, fontWeight: 600, fontSize: 15, color: '#374151' }}>
                  HTML
                </div>
                <Input.TextArea
                  value={editHtml}
                  onChange={(e) => setEditHtml(e.target.value)}
                  style={{
                    flex: 1,
                    fontFamily: 'Consolas, "Courier New", monospace',
                    fontSize: 13,
                    lineHeight: 1.6,
                    background: '#fff',
                    borderRadius: 6,
                    direction: 'ltr',
                  }}
                />
              </div>
            )}
          </div>

          {/* ═══ RIGHT SIDEBAR (visual mode only) ═══ */}
          {editorMode === 'visual' && (
            <div style={{ display: 'flex', borderRight: '1px solid #e8ecf0' }}>
              {/* ─── Content panel ─── */}
              <div style={{
                width: 260,
                background: '#fff',
                padding: '16px 14px',
                overflowY: 'auto',
                borderLeft: '1px solid #e8ecf0',
              }}>
                {renderTabContent()}
              </div>

              {/* ─── Tab navigation (rightmost column) ─── */}
              <div style={{
                width: 130,
                minWidth: 130,
                background: '#f4f6f8',
                overflowY: 'auto',
                paddingTop: 4,
              }}>
                {sidebarTabs.map((tab) => (
                  <div
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '10px 10px',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: activeTab === tab.key ? 600 : 400,
                      color: activeTab === tab.key ? '#fff' : '#374151',
                      background: activeTab === tab.key ? '#5b8fa8' : 'transparent',
                      borderRadius: 4,
                      margin: '2px 4px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ fontSize: 14 }}>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom bar (save/cancel for visual) */}
        {editorMode === 'visual' && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            gap: 10,
            padding: '10px 24px',
            background: '#fff',
            borderTop: '1px solid #e8ecf0',
          }}>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} style={{ background: '#27ae60' }}>
              حفظ
            </Button>
            <Button onClick={() => { /* reset */ }}>
              إرجاع
            </Button>
          </div>
        )}
      </div>
    );
  }

  /* ═══════════════ LIST VIEW ═══════════════ */
  return (
    <div dir="rtl" style={{ padding: '24px 32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>تصميمات الفواتير وعروض الأسعار</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleNewDesign} style={{ background: '#27ae60', borderColor: '#27ae60' }}>
          تصميم جديد
        </Button>
      </div>

      {/* Template cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {templates.map((template) => (
          <div
            key={template.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#f4f6f8',
              borderRadius: 8,
              padding: '16px 20px',
              border: '1px solid #e8ecf0',
              transition: 'box-shadow 0.2s',
            }}
          >
            {/* Three-dot menu */}
            <Dropdown menu={{ items: getMenuItems(template) }} trigger={['click']} placement="bottomRight">
              <Button type="text" icon={<EllipsisOutlined style={{ fontSize: 20 }} />} style={{ marginLeft: 16, color: '#6b7280' }} />
            </Dropdown>

            {/* Template info */}
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontWeight: 600, fontSize: 16, color: '#1f2937', marginBottom: 4, textDecoration: 'underline' }}>
                {template.name}
              </div>
              <div style={{ fontSize: 13, color: '#5b8fa8', marginBottom: 2 }}>
                أنشأت في: {template.createdAt}
              </div>
              {template.isDefault && (
                <div style={{ fontSize: 13, color: '#6b7280' }}>
                  افتراضي: {template.documentType}
                </div>
              )}
            </div>

            {/* Preview thumbnail */}
            <div style={{
              width: 70, height: 90, background: '#fff', border: '1px solid #dfe3e8', borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: '#aaa',
              flexShrink: 0, overflow: 'hidden', padding: 4,
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 7, fontWeight: 'bold', marginBottom: 2 }}>Invoice</div>
                <div style={{ width: 20, height: 16, border: '1px dashed #ccc', margin: '0 auto 3px', fontSize: 5 }}>Logo</div>
                <div style={{ height: 1, background: '#e5e5e5', margin: '2px 0' }} />
                <div style={{ height: 1, background: '#e5e5e5', margin: '2px 0' }} />
                <div style={{ height: 1, background: '#e5e5e5', margin: '2px 0' }} />
                <div style={{ marginTop: 4, fontSize: 5 }}>QR</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirmation modal */}
      <Modal
        title="تأكيد الحذف"
        open={!!deleteId}
        onOk={() => deleteId && handleDelete(deleteId)}
        onCancel={() => setDeleteId(null)}
        okText="حذف"
        cancelText="إلغاء"
        okButtonProps={{ danger: true }}
      >
        <p style={{ fontSize: 15 }}>هل أنت متأكد من حذف هذا التصميم؟ لا يمكن التراجع عن هذا الإجراء.</p>
      </Modal>
    </div>
  );
}

/* ═══════════════ SUB-COMPONENTS ═══════════════ */

function SettingToggle({ label, checked, onChange }: {
  label: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 12, padding: '12px 0', borderBottom: '1px solid #f0f0f0',
    }}>
      <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{label}</span>
      <Switch checked={checked} onChange={onChange} size="small" />
    </div>
  );
}

function PanelTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 15, fontWeight: 600, color: '#1f2937', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #e8ecf0' }}>
      {children}
    </div>
  );
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <div style={{ fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
      {children}
      {required && <span style={{ color: '#c0392b', marginRight: 2 }}>*</span>}
    </div>
  );
}

function RichEditorToolbar() {
  const btnStyle: React.CSSProperties = {
    padding: '4px 6px', cursor: 'pointer', background: 'transparent', border: '1px solid #d9d9d9',
    borderRadius: 3, fontSize: 13, color: '#374151', display: 'inline-flex', alignItems: 'center',
  };
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 8, padding: '6px 0', borderBottom: '1px solid #f0f0f0' }}>
      <button style={btnStyle}><BoldOutlined /></button>
      <button style={btnStyle}><ItalicOutlined /></button>
      <Select defaultValue="12pt" size="small" style={{ width: 64 }} options={[
        { value: '10pt', label: '10pt' }, { value: '12pt', label: '12pt' },
        { value: '14pt', label: '14pt' }, { value: '16pt', label: '16pt' },
      ]} />
      <button style={btnStyle}><AlignRightOutlined /></button>
      <button style={btnStyle}><AlignCenterOutlined /></button>
      <button style={btnStyle}><AlignLeftOutlined /></button>
      <button style={btnStyle}><LinkOutlined /></button>
      <button style={btnStyle}><UnorderedListOutlined /></button>
    </div>
  );
}

function TagsList({ tags }: { tags: string[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 180, overflowY: 'auto' }}>
      {tags.map((tag) => (
        <div
          key={tag}
          style={{
            fontSize: 12, color: '#374151', padding: '4px 8px', background: '#f4f6f8',
            borderRadius: 4, cursor: 'pointer', transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => { (e.target as HTMLElement).style.background = '#e8ecf0'; }}
          onMouseLeave={(e) => { (e.target as HTMLElement).style.background = '#f4f6f8'; }}
        >
          {tag}
        </div>
      ))}
    </div>
  );
}
