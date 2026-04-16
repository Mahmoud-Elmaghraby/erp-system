import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useBranches, useCreateBranch, useDeactivateBranch, useUpdateBranch } from '../core/hooks/use-branches.hook';

export default function BranchesPage() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const { data, isLoading } = useBranches();
  const branches = data?.data ?? [];  // ✅ paginated response

  const createBranch = useCreateBranch();
  const updateBranch = useUpdateBranch();
  const deactivateBranch = useDeactivateBranch();

  const handleOpen = (record?: any) => {
    setEditingId(record?.id ?? null);
    form.setFieldsValue(record ?? {});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    form.resetFields();
    setEditingId(null);
  };

  const handleSubmit = async (values: any) => {
    if (editingId) {
      await updateBranch.mutateAsync({ id: editingId, data: values });
    } else {
      await createBranch.mutateAsync(values);
    }
    handleClose();
  };

  const columns = [
    { title: 'اسم الفرع', dataIndex: 'name', key: 'name' },
    {
      title: 'العنوان', dataIndex: 'address', key: 'address',
      render: (v: string) => v || '—',
    },
    {
      title: 'الهاتف', dataIndex: 'phone', key: 'phone',
      render: (v: string) => v || '—',
    },
    {
      title: 'الحالة', dataIndex: 'isActive', key: 'isActive',
      render: (v: boolean) => (
        <Tag color={v ? 'green' : 'red'}>{v ? 'نشط' : 'معطل'}</Tag>
      ),
    },
    {
      title: 'إجراءات', key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => handleOpen(record)} />
          <Popconfirm
            title="تأكيد التعطيل؟"
            onConfirm={() => deactivateBranch.mutate(record.id)}
          >
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>الفروع</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpen()}>
          فرع جديد
        </Button>
      </div>

      <Table
        dataSource={branches}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{
          total: data?.meta?.total,
          pageSize: data?.meta?.limit,
          current: data?.meta?.page,
        }}
      />

      <Modal
        title={editingId ? 'تعديل فرع' : 'فرع جديد'}
        open={open}
        onCancel={handleClose}
        onOk={() => form.submit()}
        confirmLoading={createBranch.isPending || updateBranch.isPending}
        okText="حفظ"
        cancelText="إلغاء"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="اسم الفرع" rules={[{ required: true, message: 'مطلوب' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label="العنوان">
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="الهاتف">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}