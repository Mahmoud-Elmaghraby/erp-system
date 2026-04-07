import { useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useOrders, useCreateOrder, useConfirmOrder } from '../hooks/useOrders';
import { useCustomers } from '../hooks/useCustomers';
import OrderTable from '../components/orders/order-table';
import OrderForm from '../components/orders/order-form';
import InvoicesPage from './invoices.page';

const BRANCH_ID = 'main';

export default function OrdersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const { data: orders, isLoading } = useOrders(BRANCH_ID);
  const { data: customers } = useCustomers();
  const createMutation = useCreateOrder();
  const confirmMutation = useConfirmOrder();

  if (selectedOrderId) {
    return (
      <div dir="rtl">
        <Button onClick={() => setSelectedOrderId(null)} style={{ marginBottom: 16 }}>
          رجوع للأوردرات
        </Button>
        <InvoicesPage orderId={selectedOrderId} />
      </div>
    );
  }

  return (
    <div dir="rtl">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>الأوردرات</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          أوردر جديد
        </Button>
      </div>
      <OrderTable
        data={orders || []}
        loading={isLoading}
        onConfirm={(id) => confirmMutation.mutate(id)}
        onViewInvoices={(id) => setSelectedOrderId(id)}
      />
      <OrderForm
        open={isModalOpen}
        loading={createMutation.isPending}
        customers={customers || []}
        products={[]}
        branchId={BRANCH_ID}
        onSubmit={(values) => createMutation.mutate(values, { onSuccess: () => setIsModalOpen(false) })}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
}