import { useState } from 'react';
import { Card, Typography, Switch, Button, Space, Input, Modal, Form, Select, InputNumber } from 'antd';
import { SettingOutlined, DeleteOutlined, PlusOutlined, HolderOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function SalesOrdersSettingsPage() {
  const [isOrdersEnabled, setIsOrdersEnabled] = useState(false);
  const [isCustomStatusEnabled, setIsCustomStatusEnabled] = useState(false);
  const [isExceedQuantitiesEnabled, setIsExceedQuantitiesEnabled] = useState(false);

  const [isNumberingModalOpen, setIsNumberingModalOpen] = useState(false);
  const [isCustomStatusModalOpen, setIsCustomStatusModalOpen] = useState(false);

  return (
    <div dir="rtl" style={{ padding: '24px 16px', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: "'Cairo', 'Tajawal', sans-serif" }}>
      <style>{`
        .settings-input-group {
          display: flex;
          gap: 12px;
          margin-bottom: 8px;
        }
        .settings-box {
          border: 1px solid #d9d9d9;
          border-radius: 6px;
          padding: 8px 16px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          flex: 1;
        }
        .gray-button {
          background-color: #f5f5f5 !important;
          color: #bfbfbf !important;
          border-color: #d9d9d9 !important;
          font-weight: 600;
        }
        .blue-light-button {
          background-color: #e6f7ff !important;
          color: #001529 !important;
          border-color: transparent !important;
          font-weight: 600;
        }
        .modal-title-custom {
          text-align: center;
          margin-bottom: 24px;
        }
        .modal-title-custom h2 {
          font-size: 20px;
          color: #001529;
          margin: 0 0 8px 0;
        }
        .modal-title-custom p {
          font-size: 13px;
          color: #8c8c8c;
          margin: 0;
          font-weight: normal;
        }
      `}</style>

      <Card 
        bordered={false} 
        style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', maxWidth: 840, margin: '0 auto' }}
      >
        <div style={{ marginBottom: 32, textAlign: 'right' }}>
          <Title level={3} style={{ margin: 0, color: '#001529', fontWeight: 700 }}>
            إصدار أوامر البيع
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            تحكم بطريقة إصدار أوامر البيع وإدارتها وتحويلها إلى فواتير مبيعات.
          </Text>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

          {/* نظام أوامر البيع */}
          <div>
            <div style={{ marginBottom: 8, textAlign: 'right' }}>
              <Text strong style={{ fontSize: 16 }}>نظام أوامر البيع</Text>
            </div>
            <div className="settings-box">
              <Space>
                <Text type="secondary" style={{ fontSize: 13 }}>مفعّل</Text>
                <Switch checked={isOrdersEnabled} onChange={setIsOrdersEnabled} style={{ background: isOrdersEnabled ? '#73d13d' : '#bfbfbf' }} />
              </Space>
            </div>
            <div style={{ marginTop: 8, textAlign: 'right' }}>
              <Text type="secondary" style={{ fontSize: 13, color: '#8c8c8c' }}>
                فعّل نظام أوامر البيع وأضفه إلى دورة سير عمل المبيعات، واسمح للمستخدمين بإنشاء وإدارة عروض الأسعار، ومشاركتها مع العملاء، وتحويلها لاحقاً إلى فواتير.
              </Text>
            </div>
          </div>

          {isOrdersEnabled && (
            <>
              {/* الرقم التسلسلي لأمر البيع التالي */}
              <div>
                <div style={{ marginBottom: 8, textAlign: 'right' }}>
                  <Text strong style={{ fontSize: 16 }}>الرقم التسلسلي لأمر البيع التالي</Text>
                </div>
                <div className="settings-input-group">
                  <Button className="gray-button" icon={<SettingOutlined />} style={{ color: '#595959' }} onClick={() => setIsNumberingModalOpen(true)}>
                    إعدادات الترقيم المتسلسل
                  </Button>
                  <Input value="00001" style={{ flex: 1, textAlign: 'right', background: '#fafafa', color: '#595959' }} disabled />
                </div>
                <div style={{ marginTop: 8, textAlign: 'right' }}>
                  <Text type="secondary" style={{ fontSize: 13, color: '#8c8c8c' }}>
                    الرقم الذي سيخصصه النظام للعنصر.
                  </Text>
                </div>
              </div>

              {/* حالات امر البيع المخصصة */}
              <div>
                <div style={{ marginBottom: 8, textAlign: 'right' }}>
                  <Text strong style={{ fontSize: 16 }}>حالات امر البيع المخصصة</Text>
                </div>
                <div className="settings-input-group">
                   <Button className={isCustomStatusEnabled ? "blue-light-button" : "gray-button"} icon={<SettingOutlined />} disabled={!isCustomStatusEnabled} onClick={() => setIsCustomStatusModalOpen(true)}>
                    إدارة الحالات المخصصة
                  </Button>
                  <div className="settings-box">
                    <Space>
                      <Text type="secondary" style={{ fontSize: 13 }}>مفعّل</Text>
                      <Switch checked={isCustomStatusEnabled} onChange={setIsCustomStatusEnabled} style={{ background: isCustomStatusEnabled ? '#73d13d' : '#bfbfbf' }} />
                    </Space>
                  </div>
                </div>
                <div style={{ marginTop: 8, textAlign: 'right' }}>
                  <Text type="secondary" style={{ fontSize: 13, color: '#8c8c8c' }}>
                    أنشئ حالات مخصصة تناسب سير العمل لديك، مثل "بانتظار تأكيد الطلب" أو "مؤكّد"، وقم بتعيينها إلى أوامر البيع. يمكن استخدام هذه الحالات في التصفية والبحث عن اوامر البيع و التقارير.
                  </Text>
                </div>
              </div>

              {/* السماح بإصدار فاتورة بكميات بنود تتجاوز الكميات المحددة في أمر البيع */}
              <div>
                <div style={{ marginBottom: 8, textAlign: 'right' }}>
                  <Text strong style={{ fontSize: 16 }}>السماح بإصدار فاتورة بكميات بنود تتجاوز الكميات المحددة في أمر البيع</Text>
                </div>
                <div className="settings-box">
                  <Space>
                    <Text type="secondary" style={{ fontSize: 13 }}>مسموح</Text>
                    <Switch checked={isExceedQuantitiesEnabled} onChange={setIsExceedQuantitiesEnabled} style={{ background: isExceedQuantitiesEnabled ? '#73d13d' : '#bfbfbf' }} />
                  </Space>
                </div>
                <div style={{ marginTop: 8, textAlign: 'right' }}>
                  <Text type="secondary" style={{ fontSize: 13, color: '#8c8c8c' }}>
                    يمكنك أيضًا إصدار فاتورة بكميات أقل من أمر البيع. عند التعطيل، لا يمكنك تجاوز الكميات المطلوبة في أمر البيع.
                  </Text>
                </div>
              </div>
            </>
          )}

        </div>
      </Card>

      {/* numbering modal */}
      <Modal
        open={isNumberingModalOpen}
        onCancel={() => setIsNumberingModalOpen(false)}
        footer={null}
        closeIcon={<span style={{ fontSize: 20 }}>×</span>}
        width={500}
        bodyStyle={{ padding: '32px 24px 24px', direction: 'rtl' }}
      >
        <div className="modal-title-custom">
          <h2>الترقيم التلقائي لـ</h2>
          <p>تحكم في إعدادات وتنسيق الترقيم التلقائي.</p>
        </div>
        <Form layout="vertical" dir="rtl">
          <Form.Item label="الرقم التالي" extra="الرقم الذي سيقوم النظام بتعيينه للعنصر التالي.">
            <Input defaultValue="00001" style={{ textAlign: 'right' }} />
          </Form.Item>
          <Form.Item label="تنسيق الترقيم" extra="اختر الصيغة المراد استخدامها في إنشاء الترقيم (أرقام، حروف، أو مزيج منهما).">
            <Select defaultValue="1" style={{ textAlign: 'right' }} options={[{ value: '1', label: 'الأرقام الرقمية (0, 1, 2, ...)' }]} />
          </Form.Item>
          <Form.Item label="عدد الأرقام" extra="حدد عدد الخانات للرقم التسلسلي. إذا كان الرقم أقل من هذا العدد، يضاف أصفار من اليسار. مثال: لو العدد 5 والرقم الحالي 3، سيظهر 00003.">
            <InputNumber defaultValue={5} style={{ width: '100%', textAlign: 'right' }} />
          </Form.Item>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                  <Text>مفعّل</Text>
                  <Switch defaultChecked style={{ background: '#bfbfbf' }} />
                </Space>
                <Text strong>غير مكرر</Text>
              </div>
              <div style={{ textAlign: 'right', marginTop: 4 }}>
                <Text type="secondary" style={{ fontSize: 13 }}>تأكد من أن يكون كل رقم في التسلسل فريدًا وغير مكرر.</Text>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                  <Text>مفعّل</Text>
                  <Switch defaultChecked style={{ background: '#bfbfbf' }} />
                </Space>
                <Text strong>بادئة</Text>
              </div>
              <div style={{ textAlign: 'right', marginTop: 4 }}>
                <Text type="secondary" style={{ fontSize: 13 }}>الرموز أو الأحرف التي تظهر قبل رقم المستند لتمييزه. يمكن أن تكون ثابتة مثل INV-001 أو متغيرة حسب السنة أو الشهر مثل 2025-001 أو APR-001. في حالة البادئة الثابتة أدخل فقط الحروف (مثل: INV). في حالة البادئة المتغيرة استخدم دليل المتغيرات لإضافة الصيغة المناسبة.</Text>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
            <Button type="primary" size="large" style={{ backgroundColor: '#10b981', flex: 1 }} onClick={() => setIsNumberingModalOpen(false)}>حفظ</Button>
            <Button size="large" style={{ backgroundColor: '#e2e8f0', color: '#1f2937', border: 'none', flex: 1, fontWeight: 500 }} onClick={() => setIsNumberingModalOpen(false)}>تجاهل</Button>
          </div>
        </Form>
      </Modal>

      {/* custom statuses modal */}
      <Modal
        open={isCustomStatusModalOpen}
        onCancel={() => setIsCustomStatusModalOpen(false)}
        footer={null}
        closeIcon={<span style={{ fontSize: 20 }}>×</span>}
        width={600}
        bodyStyle={{ paddingTop: 40, paddingBottom: 24, direction: 'rtl' }}
      >
        <div style={{ position: 'absolute', top: 16, right: 16 }}>
             <h3>إدارة الحالات المخصصة</h3>
        </div>

        {/* Row 1 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: 16 }}>
          <div style={{ width: 44, border: '1px solid #d9d9d9', borderLeft: 'none', height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HolderOutlined style={{ fontSize: 18, color: '#001529' }} />
          </div>
          <div style={{ flex: 1, border: '1px solid #d9d9d9', borderRight: 'none', borderLeft: 'none', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex' }}>
              <Input bordered={false} style={{ flex: 1, height: 34, borderLeft: '1px solid #d9d9d9', borderRadius: 0, textAlign: 'right', background: '#fff' }} />
              <div style={{ width: 50, borderBottom: '1px solid #d9d9d9', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <div style={{ width: 14, height: 14, background: '#fff' }} />
              </div>
            </div>
            
            <div style={{ backgroundColor: '#fdfdfd', borderTop: '1px solid #f0f0f0', padding: '8px 12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 4 }}>
                  {['#ffffff', '#e5e7eb', '#9ca3af', '#4b5563', '#1f2937', '#1e3a8a', '#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#10b981', '#34d399', '#a3e635', '#facc15', '#fef08a', '#eab308', '#f59e0b', '#dc2626', '#b91c1c', '#991b1b', '#d946ef', '#c026d3', '#9333ea', '#7e22ce'].map(color => (
                    <div key={color} style={{ aspectRatio: '1', backgroundColor: color, border: '1px solid #d9d9d9', cursor: 'pointer' }} />
                  ))}
                </div>
            </div>
            
          </div>
          <div style={{ width: 44, border: '1px solid #d9d9d9', borderRight: 'none', height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DeleteOutlined style={{ color: '#ef4444', cursor: 'pointer', fontSize: 16 }} />
          </div>
        </div>

        {/* Add Row Button */}
        <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: -1 }}>
          <div style={{ width: 44, border: '1px solid #d9d9d9', borderLeft: 'none', height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e6f7ff', borderColor: '#bae0ff', cursor: 'pointer' }}>
            <PlusOutlined style={{ color: '#096dd9', fontSize: 16 }} />
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ width: 44 }} />
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 60 }}>
          <Button type="primary" size="large" style={{ backgroundColor: '#10b981', flex: 1 }} onClick={() => setIsCustomStatusModalOpen(false)}>حفظ</Button>
          <Button size="large" style={{ backgroundColor: '#e2e8f0', color: '#1f2937', border: 'none', flex: 1, fontWeight: 500 }} onClick={() => setIsCustomStatusModalOpen(false)}>تجاهل</Button>
        </div>
      </Modal>

    </div>
  );
}