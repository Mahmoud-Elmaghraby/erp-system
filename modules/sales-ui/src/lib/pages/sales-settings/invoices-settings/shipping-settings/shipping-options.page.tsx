import React, { useEffect, useState } from 'react';
import { Card, Button, Switch, Select, Typography } from 'antd';
import { SaveOutlined, SettingOutlined, ExportOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useShippingConfig, useUpdateShippingConfig } from '../../../../hooks/useShippingOptions';

const { Title, Text } = Typography;

export default function ShippingOptionsPage() {
  const navigate = useNavigate();
  const { data: shippingConfig } = useShippingConfig();
  const updateShippingConfig = useUpdateShippingConfig();

  const [isShippingEnabled, setIsShippingEnabled] = useState(true);
  const [codFeeItem, setCodFeeItem] = useState<string | undefined>(undefined);

  useEffect(() => {
    setIsShippingEnabled(shippingConfig?.isEnabled ?? true);
    setCodFeeItem(shippingConfig?.codFeeItemId ?? undefined);
  }, [shippingConfig]);

  const handleSave = async () => {
    await updateShippingConfig.mutateAsync({
      isEnabled: isShippingEnabled,
      codFeeItemId: codFeeItem ?? null,
    });
  };

  return (
    <div dir="rtl" style={{ backgroundColor: '#eef2f6', minHeight: '100vh', fontFamily: "'Cairo', 'Tajawal', sans-serif" }}>
      
      {/* Top Bar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-start', // Place buttons on the left in RTL
        backgroundColor: '#fff', 
        padding: '12px 24px', 
        borderBottom: '1px solid #e0e0e0',
        marginBottom: 32,
        gap: 8
      }}>
        <Button 
          size="large" 
          type="primary" 
          style={{ backgroundColor: '#001529', borderColor: '#001529', borderRadius: 4, fontWeight: 'bold', padding: '0 32px' }} 
          icon={<SaveOutlined />}
          onClick={handleSave}
          loading={updateShippingConfig.isPending}
        >
          حفظ
        </Button>
        <Button 
          size="large" 
          type="text"
          style={{ color: '#475569', fontWeight: 'bold', padding: '0 24px' }}
          onClick={() => navigate('/sales/settings')}
        >
          تجاهل
        </Button>
      </div>

      <div style={{ padding: '0 24px', display: 'flex', justifyContent: 'center' }}>
        <Card 
          bordered={false} 
          style={{ 
            width: '100%', 
            maxWidth: 1000, 
            borderRadius: 0, 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
          }}
          bodyStyle={{ padding: '48px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Title level={3} style={{ color: '#001529', marginBottom: 12, fontWeight: 700 }}>تهيئة خيارات التوصيل</Title>
            <Text style={{ color: '#475569', fontSize: 16 }}>حدد خيارات الشحن، رسوم التوصيل، قواعد التطبيق، وخيار الدفع عند الاستلام.</Text>
          </div>

          <div style={{ marginBottom: 48 }}>
            <Title level={5} style={{ color: '#0f172a', marginBottom: 16 }}>خيارات الشحن و التوصيل</Title>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, backgroundColor: '#f8fafc', padding: '16px 24px', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                 <span style={{ fontSize: 16, color: '#334155', fontWeight: 'bold' }}>مفعّل</span>
                 <Switch 
                   checked={isShippingEnabled} 
                   onChange={setIsShippingEnabled} 
                   style={{ backgroundColor: isShippingEnabled ? '#001529' : undefined }} 
                 />
              </div>

              {isShippingEnabled && (
                <Button 
                  size="large"
                  onClick={() => navigate('/sales/settings/shipping-options/manage')}
                  style={{ 
                    backgroundColor: '#f1f5f9', 
                    borderColor: '#e2e8f0', 
                    color: '#001529', 
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    borderRadius: 4
                  }}
                >
                  <SettingOutlined />
                  إدارة خيارات الشحن و التوصيل
                  <ExportOutlined />
                </Button>
              )}
            </div>

            <Text style={{ color: '#64748b', fontSize: 14, lineHeight: '1.8', display: 'block', textAlign: 'right' }}>
              فعّل إعدادات الشحن والتوصيل لتحديد خيارات توصيل المنتجات، بما في ذلك أسماء الخيارات، الرسوم، وقواعد التطبيق. استخدم هذه الميزة لتخصيص عملية تنفيذ الطلبات بما يتناسب مع سير عمل المبيعات لديك.
            </Text>
          </div>

          <div>
            <Title level={5} style={{ color: '#0f172a', marginBottom: 16 }}>رسوم الدفع عند الاستلام</Title>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, backgroundColor: '#fff', padding: '16px 0' }}>
              <Select 
                size="large"
                placeholder="Select Item"
                style={{ flex: 1 }}
                value={codFeeItem}
                onChange={setCodFeeItem}
                options={[{ value: 'cod-fee-item', label: 'رسوم الدفع عند الاستلام' }]}
              />

              <Button 
                size="large"
                disabled
                style={{ 
                  backgroundColor: '#f8fafc', 
                  color: '#94a3b8', 
                  borderColor: '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  borderRadius: 4
                }}
              >
                <EditOutlined />
                تهيئة الصنف المحدد
                <ExportOutlined />
              </Button>
            </div>

            <Text style={{ color: '#64748b', fontSize: 14, lineHeight: '1.8', display: 'block', textAlign: 'right' }}>
              لتهيئة رسوم الدفع عند الاستلام، أضف أولاً صنف خدمة (مثلاً: "رسوم الدفع عند الاستلام"). ثم اختره من القائمة المنسدلة. لتطبيقه، أدرجه في نموذج الفاتورة كأي منتج أو خدمة أخرى. عند حفظ الفاتورة، سيظهر باسم "رسوم الدفع عند الاستلام" أسفل الإجمالي الفرعي في صفحة معاينة الفاتورة أو الإيصال المطبوع.
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
}