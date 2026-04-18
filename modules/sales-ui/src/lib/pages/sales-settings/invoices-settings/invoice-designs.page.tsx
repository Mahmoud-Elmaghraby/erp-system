import { useState } from 'react';
import { Button, Dropdown, Switch, Select, Modal, Input } from 'antd';
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
          <thead>
            <tr>
              <th>Item</th>
              <th>Description</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {%invoice_items%}
          </tbody>
        </table>
        <br />
        <table class="total-table" width="50%" align="right">
          <tr><td><strong>Items Total</strong></td><td>{%items_total%}</td></tr>
          <tr class="total-row"><td><strong>Total</strong></td><td>{%total%}</td></tr>
          <tr><td><strong>Paid</strong></td><td>{%paid%}</td></tr>
          <tr><td><strong>Balance Due</strong></td><td>{%balance_due%}</td></tr>
        </table>
        <div class="notes-block">
          <p>{%notes%}</p>
        </div>
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
  { value: 'qty_before_price', label: 'اظهار الكمية قبل سعر الوحدة' },
  { value: 'price_before_qty', label: 'اظهار سعر الوحدة قبل الكمية' },
  { value: 'qty_before_price_2', label: 'اظهار الكمية قبل سعر الوحده' },
  { value: 'hide_both', label: 'اخفاء سعر الوحده والكمية' },
];

/* ────── component ────── */
export default function InvoiceDesignsPage() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<InvoiceTemplate[]>(initialTemplates);

  /* editor state */
  const [editingTemplate, setEditingTemplate] = useState<InvoiceTemplate | null>(null);
  const [editorMode, setEditorMode] = useState<'visual' | 'html' | null>(null);

  /* editor form fields */
  const [editName, setEditName] = useState('');
  const [editIsDefault, setEditIsDefault] = useState(false);
  const [editShowCurrency, setEditShowCurrency] = useState(true);
  const [editShowPaidRemaining, setEditShowPaidRemaining] = useState(true);
  const [editShowShipping, setEditShowShipping] = useState(false);
  const [editQtyPriceOption, setEditQtyPriceOption] = useState('qty_before_price');
  const [editHtml, setEditHtml] = useState('');

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
    {
      key: 'edit',
      icon: <EditOutlined style={{ color: '#d4a639' }} />,
      label: 'تعديل',
      onClick: () => openEditor(template, 'visual'),
    },
    {
      key: 'edit-html',
      icon: <CodeOutlined style={{ color: '#d4a639' }} />,
      label: 'تعديل HTML',
      onClick: () => openEditor(template, 'html'),
    },
    {
      key: 'add-voucher',
      icon: <FileAddOutlined style={{ color: '#d4a639' }} />,
      label: 'أضف الى نماذج القسائم',
    },
    { type: 'divider' as const },
    {
      key: 'copy',
      icon: <CopyOutlined style={{ color: '#5b8fa8' }} />,
      label: 'نسخ',
      onClick: () => handleCopy(template),
    },
    {
      key: 'delete',
      icon: <DeleteOutlined style={{ color: '#e74c3c' }} />,
      label: 'حذف',
      danger: true,
      onClick: () => setDeleteId(template.id),
    },
  ];

  /* ═══════════════ EDITOR VIEW ═══════════════ */
  if (editorMode && editingTemplate) {
    return (
      <div dir="rtl" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
        {/* Top bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 24px',
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
            padding: 32,
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
                {/* sticky_header placeholder */}
                <div style={{ fontSize: 10, color: '#999', fontStyle: 'italic', marginBottom: 8 }}>
                  {'{%sticky_header%}'}
                </div>

                {/* Invoice title */}
                <h2 style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginBottom: 16, textDecoration: 'underline' }}>Invoice</h2>

                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
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
                <div style={{ textAlign: 'center', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc', padding: '10px 0', marginBottom: 12 }}>
                  <div style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 4 }}>Lama</div>
                  <div style={{ color: '#c0392b', fontSize: 11, lineHeight: 1.6 }}>
                    Company Register: Lama<br />
                    Gamal Abd El-Nasir Rd, Sidi Beshr Bahri<br />
                    Montaza 2, 21500 الأسكندرية
                  </div>
                </div>

                {/* Client info */}
                <div style={{ borderBottom: '1px solid #ccc', padding: '10px 0', marginBottom: 12 }}>
                  <div style={{ color: '#5b8fa8', fontSize: 11, lineHeight: 1.7 }}>
                    <span style={{ textDecoration: 'underline', fontWeight: 'bold' }}>شركة العميل</span><br />
                    <span style={{ color: '#c0392b' }}>اسم العميل الأول اسم العميل الأخير</span><br />
                    <span style={{ color: '#c0392b' }}>الرمز البريدي</span><br />
                    <span style={{ color: '#c0392b' }}>المدينة المنطقة</span><br />
                    Client Business Info 1<br />
                    Client Business Info 2
                  </div>
                </div>

                {/* Invoice details */}
                <table style={{ fontSize: 12, marginBottom: 6, borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: 'bold', paddingRight: 20, paddingBottom: 3 }}>Invoice No</td>
                      <td style={{ paddingBottom: 3 }}>#000000</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold', paddingRight: 20, paddingBottom: 3 }}>Refunded Invoice No</td>
                      <td style={{ paddingBottom: 3 }}>#000000</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold', paddingRight: 20, paddingBottom: 3 }}>Invoice Date</td>
                      <td style={{ paddingBottom: 3 }}>18/04/2026</td>
                    </tr>
                  </tbody>
                </table>
                <div style={{ fontSize: 10, color: '#5b8fa8', textDecoration: 'underline', marginBottom: 14, cursor: 'pointer' }}>
                  إضافة حقول أخرى
                </div>

                {/* Items table */}
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

                {/* Totals */}
                <div style={{ fontSize: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #eee' }}>
                    <strong style={{ textDecoration: 'underline' }}>Items Total</strong>
                    <span>200.00 ج.م</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '2px solid #555', fontWeight: 'bold' }}>
                    <strong style={{ textDecoration: 'underline' }}>Total</strong>
                    <span style={{ color: '#c0392b', fontWeight: 'bold' }}>200.00 ج.م</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #eee' }}>
                    <strong style={{ textDecoration: 'underline' }}>Paid</strong>
                    <span>0.00 ج.م</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #eee' }}>
                    <strong style={{ textDecoration: 'underline' }}>Balance Due</strong>
                    <span>200.00 ج.م</span>
                  </div>
                </div>

                {/* Notes */}
                <div style={{ marginTop: 30, borderTop: '1px solid #ccc', paddingTop: 8 }}>
                  <div style={{ fontSize: 11, textDecoration: 'underline', marginBottom: 4 }}>ملاحظات الفاتورة</div>
                </div>

                {/* QR code */}
                <div style={{ marginTop: 20, textAlign: 'center', fontSize: 11, color: '#999' }}>
                  {'{%sa_qr_code_image%}'}
                </div>

                {/* sticky_footer placeholder */}
                <div style={{ fontSize: 10, color: '#999', fontStyle: 'italic', marginTop: 16, borderTop: '1px dashed #ddd', paddingTop: 8 }}>
                  {'{%sticky_footer%}'}
                </div>
              </div>
            ) : (
              /* ── HTML editor (full width, no sidebar) ── */
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

          {/* ─── Settings sidebar (visual mode only) ─── */}
          {editorMode === 'visual' && (
            <div style={{
              width: 280,
              minWidth: 280,
              background: '#fff',
              borderRight: '1px solid #e8ecf0',
              padding: 20,
              overflowY: 'auto',
            }}>
              <h4 style={{ fontSize: 16, marginBottom: 20, color: '#1f2937' }}>عدل بيانات القالب</h4>

              {/* Template name */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#374151' }}>البيانات</div>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="اسم القالب"
                />
              </div>

              {/* Default toggle */}
              <SettingToggle
                label="اجعل هذا التصميم هو التصميم الاساسي"
                checked={editIsDefault}
                onChange={setEditIsDefault}
              />

              {/* Currency toggle */}
              <SettingToggle
                label="لا يدعي بقائمة العملة في سعر البيع"
                checked={editShowCurrency}
                onChange={setEditShowCurrency}
              />

              {/* Show paid/remaining */}
              <SettingToggle
                label="اظهر دائما المبلغ المدفوع والمبلغ المتبقي"
                checked={editShowPaidRemaining}
                onChange={setEditShowPaidRemaining}
              />

              {/* Shipping number */}
              <SettingToggle
                label="إضافة رقم الشحن (بوليصة الشحن) للفاتورة"
                checked={editShowShipping}
                onChange={setEditShowShipping}
              />

              {/* Qty/price options */}
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#374151' }}>خيارات الكمية وسعر الوحدة</div>
                <Select
                  value={editQtyPriceOption}
                  onChange={setEditQtyPriceOption}
                  style={{ width: '100%' }}
                  options={qtyPriceOptions}
                />
              </div>
            </div>
          )}
        </div>
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
              <Button
                type="text"
                icon={<EllipsisOutlined style={{ fontSize: 20 }} />}
                style={{ marginLeft: 16, color: '#6b7280' }}
              />
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
              width: 70,
              height: 90,
              background: '#fff',
              border: '1px solid #dfe3e8',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 8,
              color: '#aaa',
              flexShrink: 0,
              overflow: 'hidden',
              padding: 4,
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

/* ────── reusable toggle ────── */
function SettingToggle({ label, checked, onChange }: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      padding: '12px 0',
      borderBottom: '1px solid #f0f0f0',
    }}>
      <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{label}</span>
      <Switch checked={checked} onChange={onChange} size="small" />
    </div>
  );
}
