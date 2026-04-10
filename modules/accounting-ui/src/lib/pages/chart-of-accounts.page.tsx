import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useChartOfAccounts, useCreateAccount, useDeleteAccount, useUpdateAccount } from '../hooks/useChartOfAccounts';

const { Option } = Select;

const typeColors: Record<string, string> = {
  ASSET: 'blue', LIABILITY: 'red', EQUITY: 'purple',
  REVENUE: 'green', EXPENSE: 'orange', COGS: 'volcano',
};

const typeLabels: Record<string, string> = {
  ASSET: 'أصول', LIABILITY: 'خصوم', EQUITY: 'حقوق ملكية',
  REVENUE: 'إيرادات', EXPENSE: 'مصروفات', COGS: 'تكلفة مبيعات',
};

export default function ChartOfAccountsPage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();

  const { data: accounts, isLoading } = useChartOfAccounts();
  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();
  const deleteAccount = useDeleteAccount();

  const openCreate = () => { setEditing(null); form.resetFields(); setOpen(true); };
  const openEdit = (record: any) => { setEditing(record); form.setFieldsValue(record); setOpen(true); };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (editing) {
      await updateAccount.mutateAsync({ id: editing.id, data: values });
      message.success('تم تحديث الحساب');
    } else {
      await createAccount.mutateAsync(values);
      message.success('تم إضافة الحساب');
    }
    setOpen(false);
  };

  const columns = [
    { title: 'الكود', dataIndex: 'code', key: 'code', width: 100 },
    { title: 'الاسم', dataIndex: 'name', key: 'name' },
    {
      title: 'النوع', dataIndex: 'type', key: 'type',
      render: (v: string) => <Tag color={typeColors[v]}>{typeLabels[v]}</Tag>,
    },
    {
      title: 'الحالة', dataIndex: 'isActive', key: 'isActive',
      render: (v: boolean) => <Tag color={v ? 'green' : 'red'}>{v ? 'نشط' : 'غير نشط'}</Tag>,
    },
    {
      title: 'إجراءات', key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(record)} />
          <Popconfirm title="هل أنت متأكد؟" onConfirm={() => deleteAccount.mutateAsync(record.id).then(() => message.success('تم الحذف'))}>
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>دليل الحسابات</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>إضافة حساب</Button>
      </div>
      <Table columns={columns} dataSource={accounts} loading={isLoading} rowKey="id" />
      <Modal
        title={editing ? 'تعديل حساب' : 'إضافة حساب'}
        open={open} onOk={handleSubmit} onCancel={() => setOpen(false)}
        confirmLoading={createAccount.isPending || updateAccount.isPending}
        okText="حفظ" cancelText="إلغاء"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="code" label="كود الحساب" rules={[{ required: true, message: 'مطلوب' }]}>
            <Input placeholder="1000" />
          </Form.Item>
          <Form.Item name="name" label="اسم الحساب" rules={[{ required: true, message: 'مطلوب' }]}>
            <Input placeholder="النقدية والبنوك" />
          </Form.Item>
          <Form.Item name="type" label="نوع الحساب" rules={[{ required: true, message: 'مطلوب' }]}>
            <Select placeholder="اختر النوع">
              <Option value="ASSET">أصول</Option>
              <Option value="LIABILITY">خصوم</Option>
              <Option value="EQUITY">حقوق ملكية</Option>
              <Option value="REVENUE">إيرادات</Option>
              <Option value="EXPENSE">مصروفات</Option>
              <Option value="COGS">تكلفة مبيعات</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}