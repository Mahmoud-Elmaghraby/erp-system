import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, Typography, Button, Table, Dropdown, MenuProps, 
  Select, Input, Radio, Alert, Space, Modal, Form, InputNumber, Empty
} from 'antd';
import {
  ArrowRightOutlined,
  PlusOutlined,
  SaveOutlined,
  CloseOutlined,
  DownOutlined,
  UploadOutlined,
  DownloadOutlined,
  SyncOutlined,
  SettingOutlined,
  ExclamationCircleOutlined 
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Option } = Select;

// Types
interface PriceList {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

export default function PriceListsSettingsPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  // State
  const [isAdding, setIsAdding] = useState(false);
  const [isBulkUpdateModalVisible, setIsBulkUpdateModalVisible] = useState(false);
  const [priceLists, setPriceLists] = useState<PriceList[]>([]);
  const [alertMsg, setAlertMsg] = useState<{type: 'error' | 'success', text: string} | null>(null);

  // Bulk Update State
  const [sourceType, setSourceType] = useState('BASE_PRICE');
  const [adjustmentType, setAdjustmentType] = useState('VALUE');
  
  // Handlers
  const handleAddClick = () => {
    setIsAdding(true);
    setAlertMsg(null);
    form.resetFields();
    form.setFieldsValue({ status: 'active' });
  };
  
  const handleCancelAdd = () => {
    setIsAdding(false);
    form.resetFields();
  };
  
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setPriceLists([
        ...priceLists,
        {
          id: Math.random().toString(36).substr(2, 9),
          name: values.name,
          status: values.status
        }
      ]);
      setIsAdding(false);
      form.resetFields();
    } catch (error) {
      console.log('Validation failed:', error);
    }
  };
  
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'import' && priceLists.length === 0) {
      setAlertMsg({ type: 'error', text: 'لا يمكن الاستيراد قبل إنشاء قائمة أسعار واحدة على الأقل.' });
      return;
    }
    if (e.key === 'export' && priceLists.length === 0) {
      setAlertMsg({ type: 'error', text: 'لاتوجد عناصر للتصدير' });
      return;
    }
    console.log('click', e);
  };

  const menuProps = {
    items: [
      { key: 'import', icon: <UploadOutlined />, label: 'إستيراد' },
      { key: 'export', icon: <DownloadOutlined />, label: 'تصدير' },
    ],
    onClick: handleMenuClick,
  };

  const columns: ColumnsType<PriceList> = [
    {
      title: 'الاسم',
      dataIndex: 'name',
      key: 'name',
      align: 'right',
    },
    {
      title: 'الحالة',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => (
        <span style={{ 
          color: status === 'active' ? '#b6922e' : '#8c8c8c', // matching typical yellow/orange or green for active, but let's use the UI look
          backgroundColor: status === 'active' ? '#fffbe6' : '#f5f5f5', 
          padding: '4px 12px', 
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          {status === 'active' ? 'نشط' : 'غير نشط'}
        </span>
      )
    },
  ];

  return (
    <div dir="rtl" style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: "'Cairo', 'Tajawal', sans-serif" }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, padding: '12px 24px', backgroundColor: '#fff', borderRadius: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Title level={3} style={{ margin: 0, color: '#001529', fontSize: 24 }}>إعدادات قوائم الأسعار</Title>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {isAdding ? (
            <>
              <Button size="large" type="primary" style={{ backgroundColor: '#001529', borderColor: '#001529', borderRadius: 4, padding: '0 24px' }} icon={<SaveOutlined />} onClick={handleSave}>
                إصدار وحفظ
              </Button>
              <Button size="large" icon={<CloseOutlined />} onClick={handleCancelAdd} style={{ borderColor: '#001529', color: '#001529', borderRadius: 4, padding: '0 24px' }}>
                إلغاء
              </Button>
            </>
          ) : (
            <>
              <Dropdown.Button 
                size="large"
                menu={menuProps} 
                placement="bottomRight"
                style={{ backgroundColor: '#fff', borderColor: '#001529', color: '#001529', borderRadius: 4 }}
                onClick={() => setIsBulkUpdateModalVisible(true)}
                icon={<DownOutlined />}
              >
                تحديث جماعي
              </Dropdown.Button>
              <Button 
                size="large"
                type="primary" 
                style={{ backgroundColor: '#001529', borderColor: '#001529', borderRadius: 4, padding: '0 24px' }} 
                icon={<PlusOutlined />}
                onClick={handleAddClick}
              >
                أضف قائمة أسعار
              </Button>
            </>
          )}
        </div>
      </div>

      <div>
        {/* Alerts */}
        {alertMsg && (
          <Alert 
            message={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', fontSize: 16}}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#be123c' }}>
                  <ExclamationCircleOutlined />
                  <span>{alertMsg.text}</span>
                </div>
              </div>
            }
            type="error"
            closable
            onClose={() => setAlertMsg(null)}
            closeIcon={<CloseOutlined style={{ color: '#be123c', border: '1px solid #fca5a5', borderRadius: '50%', padding: 4 }} />}
            style={{ 
              marginBottom: 24, 
              borderRadius: 0, 
              backgroundColor: '#ffe4e6', 
              borderColor: '#f43f5e',
              padding: '12px 16px'
            }} 
          />
        )}

      {/* Main Content */}
      {isAdding ? (
        <Card bordered={false} style={{ borderRadius: 8, maxWidth: 800, margin: '0 auto', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Title level={5} style={{ color: '#001529', marginBottom: 24 }}>تفاصيل قائمة الأسعار</Title>
          <Form form={form} layout="vertical">
            <div style={{ display: 'flex', gap: 16 }}>
              <Form.Item 
                name="name" 
                label="اسم القائمة" 
                rules={[{ required: true, message: 'يرجى إدخال اسم القائمة' }]}
                style={{ flex: 1 }}
              >
                <Input placeholder="أدخل اسم القائمة..." size="large" />
              </Form.Item>
              <Form.Item 
                name="status" 
                label="الحالة" 
                style={{ flex: 1 }}
              >
                <Select size="large">
                  <Option value="active">نشط</Option>
                  <Option value="inactive">غير نشط</Option>
                </Select>
              </Form.Item>
            </div>
          </Form>
        </Card>
      ) : (
        <Card bordered={false} style={{ borderRadius: 8, minHeight: 400, display: 'flex', flexDirection: 'column', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} bodyStyle={{ padding: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Table 
            dataSource={priceLists} 
            columns={columns} 
            rowKey="id" 
            pagination={false}
            locale={{
              emptyText: (
                <div style={{ padding: '100px 0', fontSize: 16, color: '#001529', fontWeight: 'bold' }}>
                  لا يوجد قوائم الأسعار أضيفت حتي الآن
                </div>
              )
            }}
          />
        </Card>
      )}

      {/* Bulk Update Modal */}
      <Modal
        title={<span style={{ color: '#001529', fontSize: 20, fontWeight: 'bold' }}>التحديث الجماعي للأسعار</span>}
        open={isBulkUpdateModalVisible}
        onCancel={() => setIsBulkUpdateModalVisible(false)}
        width={700}
        footer={
          <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
            <Button size="large" type="primary" style={{ backgroundColor: '#001529', borderColor: '#001529', borderRadius: 4, padding: '0 40px', fontWeight: 'bold' }} onClick={() => setIsBulkUpdateModalVisible(false)}>
              تطبيق التحديث
            </Button>
            <Button size="large" onClick={() => setIsBulkUpdateModalVisible(false)} style={{ borderRadius: 4, padding: '0 40px' }}>
              إلغاء
            </Button>
          </div>
        }
      >
        <Form layout="vertical" style={{ marginTop: 32 }}>
          <Form.Item label={<span style={{ fontSize: 16 }}>تحديث بناءً على (النوع):</span>}>
            <Radio.Group value={sourceType} onChange={(e) => setSourceType(e.target.value)}>
              <Space direction="vertical" size="large">
                <Radio value="BASE_PRICE" style={{ fontSize: 18 }}>سعر البيع الأساسي</Radio>
                <Radio value="OTHER_LIST" style={{ fontSize: 18 }}>قائمة أسعار أخرى</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          {sourceType === 'OTHER_LIST' && (
            <Form.Item label={<span style={{ fontSize: 16 }}>اختر القائمة المصدرية:</span>} style={{ marginTop: 24 }}>
              <Select size="large" placeholder="اختر قائمة الأسعار..." style={{ height: 48, fontSize: 16 }} options={priceLists.map(p => ({ label: p.name, value: p.id }))} />
            </Form.Item>
          )}

          <Form.Item label={<span style={{ fontSize: 16 }}>معيار التعديل (المعدل):</span>} style={{ marginTop: 32 }}>
            <Radio.Group value={adjustmentType} onChange={(e) => setAdjustmentType(e.target.value)} style={{ marginBottom: 16, display: 'flex', gap: 32 }}>
              <Radio value="VALUE" style={{ fontSize: 18 }}>قيمة ثابتة (مبلغ)</Radio>
              <Radio value="PERCENTAGE" style={{ fontSize: 18 }}>نسبة مئوية (%)</Radio>
            </Radio.Group>
            <InputNumber 
              size="large"
              style={{ width: '100%', fontSize: 16, padding: '4px 0' }} 
              placeholder={adjustmentType === 'VALUE' ? 'مثال: أدخل 10 للزيادة أو -5 للنقصان...' : 'مثال: أدخل 15 لزيادة 15%...'}
            />
          </Form.Item>
        </Form>
      </Modal>
      </div>
    </div>
  );
}
