import { useState } from 'react';
import { Button, Input, Select, Space } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useOrders, useCreateOrder, useConfirmOrder, useCancelOrder } from '../hooks/useOrders';
import { useCustomers } from '../hooks/useCustomers';
import { useProducts } from '@org/inventory-ui'; // تأكد إن المسار ده سليم في الـ Monorepo
import OrderForm from '../components/orders/order-form';
import OrderTable from '../components/orders/order-table';

const { Option } = Select;

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
    <div style={{ padding: 24 }} dir="rtl">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>أوامر البيع</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          أمر بيع جديد
        </Button>
      </div>

      <Space style={{ marginBottom: 16 }}>
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

      {/* ✅ استخدام الـ Table النضيف بعد الـ Refactor */}
      <OrderTable 
        data={filteredOrders}
        loading={isLoading}
        onConfirm={(id) => confirmMutation.mutate(id)}
        onCancel={(id) => cancelMutation.mutate(id)}
      />

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