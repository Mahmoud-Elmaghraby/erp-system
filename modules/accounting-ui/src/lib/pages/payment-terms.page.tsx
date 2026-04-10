import { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, Popconfirm, message, Divider } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { usePaymentTerms, useCreatePaymentTerm, useUpdatePaymentTerm, useDeletePaymentTerm } from '../hooks/usePaymentTerms';

export default function PaymentTermsPage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();

  const { data: terms, isLoading } = usePaymentTerms();
  const createTerm = useCreatePaymentTerm();
  const updateTerm = useUpdatePaymentTerm();
  const deleteTerm = useDeletePaymentTerm();

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ lines: [{ value: 100, valueType: 'PERCENT', days: 0 }] });
    setOpen(true);
  };
  const openEdit = (record: any) => { setEditing(record); form.setFieldsValue(record); setOpen(true); };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (editing) {
      await updateTerm.mutateAsync({ id: editing.id, data: values });
      message.success('تم تحديث شرط الدفع');
    } else {
      await createTerm.mutateAsync(values);
      message.success('تم إضافة شرط الدفع');
    }
    setOpen(false);
  };

  const columns = [
    { title: 'الاسم', dataIndex: 'name', key: 'name' },
    {
      title: 'الأسطر', dataIndex: 'lines', key: 'lines',
      render: (lines: any[]) => (
        <span>{lines?.map((l) => `${l.value}% خلال ${l.days} يوم`).join(' + ')}</span>
      ),
    },
    {
      title: 'إجراءات', key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(record)} />
          <Popconfirm title="هل أنت متأكد؟" onConfirm={() => deleteTerm.mutateAsync(record.id).then(() => message.success('تم الحذف'))}>
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>شروط الدفع</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>إضافة شرط دفع</Button>
      </div>
      <Table columns={columns} dataSource={terms} loading={isLoading} rowKey="id" />
      <Modal
        title={editing ? 'تعديل شرط دفع' : 'إضافة شرط دفع'}
        open={open} onOk={handleSubmit} onCancel={() => setOpen(false)}
        confirmLoading={createTerm.isPending || updateTerm.isPending}
        okText="حفظ" cancelText="إلغاء" width={600}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="الاسم" rules={[{ required: true, message: 'مطلوب' }]}>
            <Input placeholder="صافي 30 يوم" />
          </Form.Item>
          <Divider>أسطر الدفع</Divider>
          <Form.List name="lines">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...rest }) => (
                  <Space key={key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                    <Form.Item {...rest} name={[name, 'value']} label="النسبة %">
                      <InputNumber min={0} max={100} />
                    </Form.Item>
                    <Form.Item {...rest} name={[name, 'days']} label="عدد الأيام">
                      <InputNumber min={0} />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} style={{ color: 'red' }} />
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add({ value: 0, valueType: 'PERCENT', days: 0 })} icon={<PlusOutlined />}>
                  إضافة سطر
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
}