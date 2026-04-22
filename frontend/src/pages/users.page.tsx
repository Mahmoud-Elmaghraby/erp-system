import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useBranches } from '../core/hooks/use-branches.hook';
import { useCreateUser, useDeactivateUser, useUpdateUser, useUsers } from '../core/hooks/use-users.hook';

export default function UsersPage() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const { data: usersData, isLoading } = useUsers();
  const users = usersData?.data ?? [];  // ✅ paginated response

  const { data: branchesData } = useBranches();
  const branches = branchesData?.data ?? [];  // ✅ paginated response

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deactivateUser = useDeactivateUser();

  const handleOpen = (record?: any) => {
    setEditingId(record?.id ?? null);
    form.setFieldsValue(record ? { name: record.name, branchId: record.branchId } : {});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    form.resetFields();
    setEditingId(null);
  };

  const handleSubmit = async (values: any) => {
    if (editingId) {
      await updateUser.mutateAsync({ id: editingId, data: values });
    } else {
      await createUser.mutateAsync(values);
    }
    handleClose();
  };

  const columns = [
    { title: 'الاسم', dataIndex: 'name', key: 'name' },
    { title: 'البريد الإلكتروني', dataIndex: 'email', key: 'email' },
    {
      title: 'الفرع', dataIndex: 'branchId', key: 'branchId',
      render: (branchId: string) =>
        branches.find((b: any) => b.id === branchId)?.name || '—',
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
            title="تأكيد تعطيل المستخدم؟"
            onConfirm={() => deactivateUser.mutate(record.id)}
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
        <h2 style={{ margin: 0 }}>المستخدمون</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpen()}>
          مستخدم جديد
        </Button>
      </div>

      <Table
        dataSource={users}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{
          total: usersData?.meta?.total,
          pageSize: usersData?.meta?.limit,
          current: usersData?.meta?.page,
        }}
      />

      <Modal
        title={editingId ? 'تعديل مستخدم' : 'مستخدم جديد'}
        open={open}
        onCancel={handleClose}
        onOk={() => form.submit()}
        confirmLoading={createUser.isPending || updateUser.isPending}
        okText="حفظ"
        cancelText="إلغاء"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="الاسم" rules={[{ required: true, message: 'مطلوب' }]}>
            <Input />
          </Form.Item>
          {!editingId && (
            <>
              <Form.Item
                name="email"
                label="البريد الإلكتروني"
                rules={[{ required: true, type: 'email', message: 'بريد غير صحيح' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label="كلمة المرور"
                rules={[{ required: true, min: 8, message: 'كلمة المرور لا تقل عن 8 أحرف' }]}
              >
                <Input.Password />
              </Form.Item>
            </>
          )}
          {editingId && (
            <Form.Item name="password" label="كلمة المرور الجديدة (اختياري)">
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item name="branchId" label="الفرع">
            <Select allowClear placeholder="اختر فرع">
              {branches.map((b: any) => (
                <Select.Option key={b.id} value={b.id}>{b.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}