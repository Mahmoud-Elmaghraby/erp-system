import { useState } from 'react';
import { Button, Input, Select, Space, Card, Typography } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useOrders, useCreateOrder, useConfirmOrder, useCancelOrder } from '../hooks/useOrders';
import { useCustomers } from '../hooks/useCustomers';
import { useProducts } from '@org/inventory-ui'; // تأكد إن المسار ده سليم في الـ Monorepo
import OrderForm from '../components/orders/order-form';
import OrderTable from '../components/orders/order-table';

const { Option } = Select;
const { Title } = Typography;

export default function OrdersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const { data: orders, isLoading } = useOrders();
  const { data: customers } = useCustomers();
  const { data: products } = useProducts();
  
  const createMutation = useCreateOrder();
  const confirmMutation = useConfirmOrder();
  const cancelMutation = useCancelOrder();

  // فلترة البيانات
  const filteredOrders = (orders as any[] ?? []).filter((o: any) => {
    const matchSearch = !search || o.orderNumber?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ padding: '24px 16px', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: "'Cairo', 'Tajawal', sans-serif" }} dir="rtl">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0, color: '#001529', fontWeight: 700 }}>أوامر البيع</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          style={{ backgroundColor: '#001529', borderColor: '#001529', fontWeight: 600 }}
          onClick={() => setIsModalOpen(true)}
        >
          أمر بيع جديد
        </Button>
      </div>

      <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: 24 }}>
        <Space style={{ marginBottom: 0 }}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="بحث برقم الأمر..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 220 }}
            allowClear
          />
          <Select 
            placeholder="فلتر بالحالة" 
            allowClear 
            style={{ width: 160 }}
            onChange={(v) => setStatusFilter(v)}
          >
            <Option value="DRAFT">مسودة</Option>
            <Option value="CONFIRMED">مؤكد</Option>
            <Option value="DELIVERED">تم التسليم</Option>
            <Option value="CANCELLED">ملغي</Option>
          </Select>
        </Space>
      </Card>

      {/* ✅ استخدام الـ Table النضيف بعد الـ Refactor */}
      <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <OrderTable 
          data={filteredOrders}
          loading={isLoading}
          onConfirm={(id) => confirmMutation.mutate(id)}
          onCancel={(id) => cancelMutation.mutate(id)}
        />
      </Card>

      <OrderForm
        open={isModalOpen}
        loading={createMutation.isPending}
        customers={customers as any[] ?? []}
        products={products as any[] ?? []}
        onSubmit={(values) => createMutation.mutate(values, { onSuccess: () => setIsModalOpen(false) })}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
}