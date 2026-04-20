import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Typography } from 'antd';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';

const { Text } = Typography;

export default function ShippingOptionsManagePage() {
  const navigate = useNavigate();

  return (
    <div dir="rtl" style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: "'Cairo', 'Tajawal', sans-serif" }}>
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0', padding: '12px 24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 8 }}>
          <Button
            size="large"
            type="primary"
            icon={<PlusOutlined />}
            style={{ backgroundColor: '#001529', borderColor: '#001529', borderRadius: 4, fontWeight: 'bold', padding: '0 20px' }}
          >
            أضف خيار شحن
          </Button>

          <Button
            size="large"
            icon={<SettingOutlined />}
            onClick={() => navigate('/sales/settings/shipping-options/configuration')}
            style={{ borderColor: '#001529', color: '#001529', borderRadius: 4 }}
          />
        </div>
      </div>

      <div style={{ padding: '0 24px' }}>
        <Card
          bordered={false}
          style={{ borderRadius: 8, minHeight: 240, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          bodyStyle={{ minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: '#001529', fontSize: 20, fontWeight: 700 }}>
            لا يوجد خيارات الشحن أضيفت حتى الآن
          </Text>
        </Card>
      </div>
    </div>
  );
}
