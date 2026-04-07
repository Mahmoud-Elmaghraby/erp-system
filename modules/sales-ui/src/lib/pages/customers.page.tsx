import { useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useCustomers, useCreateCustomer, useDeleteCustomer } from '../hooks/useCustomers';
import CustomerTable from '../components/customers/customer-table';
import CustomerForm from '../components/customers/customer-form';

export default function CustomersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: customers, isLoading } = useCustomers();
  const createMutation = useCreateCustomer();
  const deleteMutation = useDeleteCustomer();

  return (
    <div dir="rtl">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>العملاء</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          إضافة عميل
        </Button>
      </div>
      <CustomerTable
        data={customers || []}
        loading={isLoading}
        onDelete={(id) => deleteMutation.mutate(id)}
      />
      <CustomerForm
        open={isModalOpen}
        loading={createMutation.isPending}
        onSubmit={(values) => createMutation.mutate(values, { onSuccess: () => setIsModalOpen(false) })}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
}