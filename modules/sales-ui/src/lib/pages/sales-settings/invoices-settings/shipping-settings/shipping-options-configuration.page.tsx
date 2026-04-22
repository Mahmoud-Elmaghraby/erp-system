import React, { useEffect, useState } from 'react';
import { Button, Card, Select, Typography } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useShippingConfig, useUpdateShippingConfig } from '../../../../hooks/useShippingOptions';

const { Title, Text } = Typography;

export default function ShippingOptionsConfigurationPage() {
  const navigate = useNavigate();
  const { data: shippingConfig } = useShippingConfig();
  const updateShippingConfig = useUpdateShippingConfig();

  const [codFeeItem, setCodFeeItem] = useState<string | undefined>(undefined);

  useEffect(() => {
    setCodFeeItem(shippingConfig?.codFeeItemId ?? undefined);
  }, [shippingConfig]);

  const handleSave = async () => {
    await updateShippingConfig.mutateAsync({ codFeeItemId: codFeeItem ?? null });
    navigate('/sales/settings/shipping-options/manage');
  };

  return (
    <div dir="rtl" style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: "'Cairo', 'Tajawal', sans-serif" }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          backgroundColor: '#fff',
          padding: '12px 24px',
          borderBottom: '1px solid #e0e0e0',
          marginBottom: 24,
          gap: 8,
        }}
      >
        <Button
          size="large"
          type="primary"
          icon={<SaveOutlined />}
          style={{ backgroundColor: '#001529', borderColor: '#001529', borderRadius: 4, fontWeight: 'bold', padding: '0 24px' }}
          onClick={handleSave}
          loading={updateShippingConfig.isPending}
        >
          حفظ
        </Button>
        <Button
          size="large"
          onClick={() => navigate('/sales/settings/shipping-options/manage')}
          style={{ borderColor: '#001529', color: '#001529', borderRadius: 4, fontWeight: 'bold', padding: '0 24px' }}
        >
          إلغاء
        </Button>
        <Button
          size="large"
          icon={<CloseOutlined />}
          onClick={() => navigate('/sales/settings/shipping-options/manage')}
          style={{ borderColor: '#001529', color: '#001529', borderRadius: 4 }}
        />
      </div>

      <div style={{ padding: '0 24px', maxWidth: 1000, margin: '0 auto' }}>
        <Card
          bordered={false}
          style={{ borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          bodyStyle={{ padding: 24 }}
        >
          <div style={{ textAlign: 'right', marginBottom: 20 }}>
            <Title level={4} style={{ color: '#001529', margin: 0, fontWeight: 700 }}>
              إعدادات خيارات الشحن
            </Title>
            <Text style={{ color: '#64748b', fontSize: 14 }}>
              قم بتحديد الصنف المستخدم لرسوم الدفع عند الاستلام.
            </Text>
          </div>

          <div style={{ maxWidth: 560 }}>
            <div style={{ textAlign: 'right', marginBottom: 8, color: '#0f172a', fontSize: 14, fontWeight: 600 }}>
              رسوم الدفع عند الاستلام <span style={{ color: '#dc2626' }}>*</span>
            </div>

            <Select
              size="large"
              style={{ width: '100%' }}
              value={codFeeItem}
              onChange={setCodFeeItem}
              placeholder="اختر الصنف"
              options={[{ value: 'cod-fee-item', label: 'رسوم الدفع عند الاستلام' }]}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
