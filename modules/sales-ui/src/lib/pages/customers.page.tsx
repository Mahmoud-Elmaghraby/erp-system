import { useState } from 'react';
import { Button, Input, Space } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useCustomers, useCreateCustomer, useUpdateCustomer, useDeleteCustomer } from '../hooks/useCustomers';
import CustomerTable from '../components/customers/customer-table';
import CustomerForm from '../components/customers/customer-form';

export default function CustomersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [search, setSearch] = useState('');

  const { data: customers, isLoading } = useCustomers();
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();
  const deleteMutation = useDeleteCustomer();

  const filtered = (customers as any[] ?? []).filter((c: any) =>
    !search ||
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  const handleEdit = (record: any) => {
    setEditingCustomer(record);
    setIsModalOpen(true);
  };

  const handleSubmit = (values: any) => {
    if (editingCustomer) {
      updateMutation.mutate(
        { id: editingCustomer.id, data: values },
        { onSuccess: () => { setIsModalOpen(false); setEditingCustomer(null); } }
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: () => { setIsModalOpen(false); }
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div style={{ padding: 24 }} dir="rtl">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>العملاء</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingCustomer(null); setIsModalOpen(true); }}>
          إضافة عميل
        </Button>
      </div>

      <Space style={{ marginBottom: 16 }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="بحث بالاسم أو الإيميل أو الهاتف..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
      </Space>

      <CustomerTable
        data={filtered}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={(id) => deleteMutation.mutate(id)}
      />

      <CustomerForm
        open={isModalOpen}
        loading={isPending}
        initialValues={editingCustomer}
        onSubmit={handleSubmit}
        onCancel={() => { setIsModalOpen(false); setEditingCustomer(null); }}
      />
    </div>
  );
}