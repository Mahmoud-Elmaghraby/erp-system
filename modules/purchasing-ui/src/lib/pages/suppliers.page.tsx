import { useState } from 'react';
import { Button, Table, Space, Modal, Form, Input, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSuppliers, useCreateSupplier, useUpdateSupplier, useDeleteSupplier } from '../hooks/useSuppliers';

export default function SuppliersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
  const [form] = Form.useForm();

  const { data: suppliers, isLoading } = useSuppliers();
  const createMutation = useCreateSupplier();
  const updateMutation = useUpdateSupplier();
  const deleteMutation = useDeleteSupplier();

  const handleOpen = (supplier?: any) => {
    setEditingSupplier(supplier || null);
    form.setFieldsValue(supplier || {});
    setIsModalOpen(true);
  };

  const handleSubmit = (values: any) => {
    if (editingSupplier) {
      updateMutation.mutate({ id: editingSupplier.id, data: values }, {
        onSuccess: () => { setIsModalOpen(false); form.resetFields(); },
      });
    } else {
      createMutation.mutate(values, {
        onSuccess: () => { setIsModalOpen(false); form.resetFields(); },
      });
    }
  };

  const columns = [
    { title: 'الاسم', dataIndex: 'name', key: 'name' },
    { title: 'البريد الإلكتروني', dataIndex: 'email', key: 'email', render: (v: any) => v || '-' },
    { title: 'الهاتف', dataIndex: 'phone', key: 'phone', render: (v: any) => v || '-' },
    { title: 'العنوان', dataIndex: 'address', key: 'address', render: (v: any) => v || '-' },
    { title: 'الرقم الضريبي', dataIndex: 'taxNumber', key: 'taxNumber', render: (v: any) => v || '-' },
    {
      title: 'إجراءات',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => handleOpen(record)}>تعديل</Button>
          <Popconfirm title="هل أنت متأكد من الحذف؟" onConfirm={() => deleteMutation.mutate(record.id)} okText="نعم" cancelText="لا">
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div dir="rtl">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>الموردين</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpen()}>إضافة مورد</Button>
      </div>

      <Table columns={columns} dataSource={suppliers || []} rowKey="id" loading={isLoading} />

      <Modal
        title={editingSupplier ? 'تعديل مورد' : 'إضافة مورد جديد'}
        open={isModalOpen}
        onCancel={() => { setIsModalOpen(false); form.resetFields(); }}
        onOk={() => form.submit()}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        okText="حفظ"
        cancelText="إلغاء"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} dir="rtl">
          <Form.Item label="الاسم" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="البريد الإلكتروني" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="الهاتف" name="phone">
            <Input />
          </Form.Item>
          <Form.Item label="العنوان" name="address">
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="الرقم الضريبي" name="taxNumber">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}