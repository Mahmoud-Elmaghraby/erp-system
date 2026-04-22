import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useJournals, useCreateJournal, useUpdateJournal, useDeleteJournal } from '../hooks/useJournals';

const { Option } = Select;

const typeColors: Record<string, string> = {
  SALE: 'blue', PURCHASE: 'orange', CASH: 'green', BANK: 'purple', GENERAL: 'default',
};

const typeLabels: Record<string, string> = {
  SALE: 'مبيعات', PURCHASE: 'مشتريات', CASH: 'نقدية', BANK: 'بنك', GENERAL: 'عامة',
};

export default function JournalsPage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();

  const { data: journals, isLoading } = useJournals();
  const createJournal = useCreateJournal();
  const updateJournal = useUpdateJournal();
  const deleteJournal = useDeleteJournal();

  const openCreate = () => { setEditing(null); form.resetFields(); setOpen(true); };
  const openEdit = (record: any) => { setEditing(record); form.setFieldsValue(record); setOpen(true); };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (editing) {
      await updateJournal.mutateAsync({ id: editing.id, data: values });
      message.success('تم تحديث دفتر اليومية');
    } else {
      await createJournal.mutateAsync(values);
      message.success('تم إضافة دفتر اليومية');
    }
    setOpen(false);
  };

  const columns = [
    { title: 'الاسم', dataIndex: 'name', key: 'name' },
    {
      title: 'النوع', dataIndex: 'type', key: 'type',
      render: (v: string) => <Tag color={typeColors[v]}>{typeLabels[v]}</Tag>,
    },
    {
      title: 'إجراءات', key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(record)} />
          <Popconfirm title="هل أنت متأكد؟" onConfirm={() => deleteJournal.mutateAsync(record.id).then(() => message.success('تم الحذف'))}>
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>دفاتر اليومية</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>إضافة دفتر</Button>
      </div>
      <Table columns={columns} dataSource={journals} loading={isLoading} rowKey="id" />
      <Modal
        title={editing ? 'تعديل دفتر اليومية' : 'إضافة دفتر اليومية'}
        open={open} onOk={handleSubmit} onCancel={() => setOpen(false)}
        confirmLoading={createJournal.isPending || updateJournal.isPending}
        okText="حفظ" cancelText="إلغاء"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="الاسم" rules={[{ required: true, message: 'مطلوب' }]}>
            <Input placeholder="يومية المبيعات" />
          </Form.Item>
          <Form.Item name="type" label="النوع" rules={[{ required: true, message: 'مطلوب' }]}>
            <Select placeholder="اختر النوع">
              <Option value="SALE">مبيعات</Option>
              <Option value="PURCHASE">مشتريات</Option>
              <Option value="CASH">نقدية</Option>
              <Option value="BANK">بنك</Option>
              <Option value="GENERAL">عامة</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}