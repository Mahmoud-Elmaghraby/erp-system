import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Form, Input, Modal, Select, Table, Typography } from 'antd';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { useCreateShippingOption, useShippingOptions } from '../../../../hooks/useShippingOptions';

interface ShippingOption {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

const { Text } = Typography;

export default function ShippingOptionsManagePage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { data: options = [], isLoading } = useShippingOptions();
  const createShippingOption = useCreateShippingOption();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleCreate = async () => {
    const values = await form.validateFields();
    await createShippingOption.mutateAsync(values);
    setIsAddModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'الاسم',
      dataIndex: 'name',
      key: 'name',
      align: 'right' as const,
    },
    {
      title: 'الحالة',
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
      render: (status: ShippingOption['status']) =>
        status === 'active' ? 'نشط' : 'غير نشط',
    },
  ];

  return (
    <div dir="rtl" style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: "'Cairo', 'Tajawal', sans-serif" }}>
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0', padding: '12px 24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 8 }}>
          <Button
            size="large"
            type="primary"
            icon={<PlusOutlined />}
            style={{ backgroundColor: '#001529', borderColor: '#001529', borderRadius: 4, fontWeight: 'bold', padding: '0 20px' }}
            onClick={() => {
              setIsAddModalOpen(true);
              form.setFieldsValue({ status: 'active' });
            }}
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
          bodyStyle={{ minHeight: 220 }}
        >
          {options.length === 0 ? (
            <div style={{ minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#001529', fontSize: 20, fontWeight: 700 }}>
                لا يوجد خيارات الشحن أضيفت حتى الآن
              </Text>
            </div>
          ) : (
            <Table
              loading={isLoading}
              dataSource={options}
              columns={columns}
              rowKey="id"
              pagination={false}
            />
          )}
        </Card>
      </div>

      <Modal
        title="إضافة خيار شحن"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        onOk={handleCreate}
        okText="حفظ"
        cancelText="إلغاء"
        confirmLoading={createShippingOption.isPending}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="اسم الخيار" rules={[{ required: true, message: 'يرجى إدخال الاسم' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="الحالة">
            <Select
              options={[
                { value: 'active', label: 'نشط' },
                { value: 'inactive', label: 'غير نشط' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
