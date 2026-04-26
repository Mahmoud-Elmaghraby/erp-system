import React, { useState } from 'react';
import { Table, Button, Space, Typography, Tag, Dropdown, MenuProps, message } from 'antd';
import { 
  PlusOutlined, 
  MoreOutlined, 
  FileExcelOutlined, 
  CopyOutlined, 
  FilePdfOutlined, 
  DeleteOutlined, 
  StopOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

export default function PriceListsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Dummy data for the UI
  const [priceLists, setPriceLists] = useState([
    { id: '1', name: 'قائمة أسعار الجملة', status: 'active', itemsCount: 150, lastUpdated: '2026-04-20' },
    { id: '2', name: 'تسعيرة كبار العملاء', status: 'active', itemsCount: 45, lastUpdated: '2026-04-22' },
    { id: '3', name: 'عروض رمضان', status: 'inactive', itemsCount: 300, lastUpdated: '2026-03-10' },
  ]);

  const handleAction = (key: string, record: any) => {
    switch (key) {
      case 'export':
        message.success(`تم تصدير قائمة ${record.name} كملف CSV`);
        break;
      case 'copy':
        message.success(`تم نسخ قائمة ${record.name}`);
        break;
      case 'pdf':
        message.success(`تم حفظ قائمة ${record.name} كملف PDF`);
        break;
      case 'disable':
        message.success(`تم تعطيل قائمة ${record.name}`);
        setPriceLists(prev => prev.map(p => p.id === record.id ? { ...p, status: 'inactive' } : p));
        break;
      case 'delete':
        message.success(`تم حذف قائمة ${record.name}`);
        setPriceLists(prev => prev.filter(p => p.id !== record.id));
        break;
    }
  };

  const columns = [
    {
      title: 'اسم القائمة',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <a onClick={() => navigate(`/inventory/price-lists/${record.id}/edit`)} style={{ fontWeight: 500 }}>
          {text}
        </a>
      ),
    },
    {
      title: 'الحالة',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? 'نشط' : 'معطل'}
        </Tag>
      ),
    },
    {
      title: 'عدد المنتجات',
      dataIndex: 'itemsCount',
      key: 'itemsCount',
    },
    {
      title: 'آخر تحديث',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
    },
    {
      title: 'إجراءات',
      key: 'actions',
      render: (_: any, record: any) => {
        const items: MenuProps['items'] = [
          { key: 'export', label: 'تصدير CSV', icon: <FileExcelOutlined /> },
          { key: 'copy', label: 'إنشاء نسخة', icon: <CopyOutlined /> },
          { key: 'pdf', label: 'حفظ كـ PDF', icon: <FilePdfOutlined /> },
          { key: 'disable', label: 'تعطيل القائمة', icon: <StopOutlined />, danger: true },
          { type: 'divider' },
          { key: 'delete', label: 'حذف', icon: <DeleteOutlined />, danger: true },
        ];
        return (
          <Space>
            <Button size="small" onClick={() => navigate(`/inventory/price-lists/${record.id}/edit`)}>
              تعديل
            </Button>
            <Dropdown menu={{ items, onClick: ({ key }) => handleAction(key, record) }} trigger={['click']}>
              <Button size="small" icon={<MoreOutlined />} />
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>قوائم الأسعار (Price Lists)</Title>
          <Typography.Text type="secondary">إدارة وتخصيص أسعار المنتجات لشرائح مختلفة</Typography.Text>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => navigate('/inventory/price-lists/new')}
        >
          إضافة قائمة أسعار
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={priceLists} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}
