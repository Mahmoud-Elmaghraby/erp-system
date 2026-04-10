import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, InputNumber, Tag, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTaxes, useCreateTax, useUpdateTax, useDeleteTax } from '../hooks/useTaxes';

const { Option } = Select;

export default function TaxesPage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();

  const { data: taxes, isLoading } = useTaxes();
  const createTax = useCreateTax();
  const updateTax = useUpdateTax();
  const deleteTax = useDeleteTax();

  const openCreate = () => { setEditing(null); form.resetFields(); setOpen(true); };
  const openEdit = (record: any) => { setEditing(record); form.setFieldsValue(record); setOpen(true); };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (editing) {
      await updateTax.mutateAsync({ id: editing.id, data: values });
      message.success('تم تحديث الضريبة');
    } else {
      await createTax.mutateAsync(values);
      message.success('تم إضافة الضريبة');
    }
    setOpen(false);
  };

  const columns = [
    { title: 'الاسم', dataIndex: 'name', key: 'name' },
    { title: 'النسبة %', dataIndex: 'rate', key: 'rate', render: (v: number) => `${v}%` },
    {
      title: 'النوع', dataIndex: 'taxType', key: 'taxType',
      render: (v: string) => (
        <Tag color="blue">
          {v === 'PERCENTAGE' ? 'نسبة مئوية' : v === 'FIXED' ? 'مبلغ ثابت' : 'بدون'}
        </Tag>
      ),
    },
    {
      title: 'النطاق', dataIndex: 'scope', key: 'scope',
      render: (v: string) => (
        <Tag color="green">
          {v === 'SALES' ? 'مبيعات' : v === 'PURCHASES' ? 'مشتريات' : 'الاثنان'}
        </Tag>
      ),
    },
    { title: 'كود ETA', dataIndex: 'etaType', key: 'etaType' },
    { title: 'كود ZATCA', dataIndex: 'zatcaType', key: 'zatcaType' },
    {
      title: 'إجراءات', key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(record)} />
          <Popconfirm title="هل أنت متأكد؟" onConfirm={() => deleteTax.mutateAsync(record.id).then(() => message.success('تم الحذف'))}>
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>الضرائب</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>إضافة ضريبة</Button>
      </div>
      <Table columns={columns} dataSource={taxes} loading={isLoading} rowKey="id" />
      <Modal
        title={editing ? 'تعديل ضريبة' : 'إضافة ضريبة'}
        open={open} onOk={handleSubmit} onCancel={() => setOpen(false)}
        confirmLoading={createTax.isPending || updateTax.isPending}
        okText="حفظ" cancelText="إلغاء"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="الاسم" rules={[{ required: true, message: 'مطلوب' }]}>
            <Input placeholder="ضريبة القيمة المضافة 14%" />
          </Form.Item>
          <Form.Item name="rate" label="النسبة %" rules={[{ required: true, message: 'مطلوب' }]}>
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="taxType" label="نوع الضريبة" rules={[{ required: true, message: 'مطلوب' }]}>
            <Select placeholder="اختر النوع">
              <Option value="PERCENTAGE">نسبة مئوية</Option>
              <Option value="FIXED">مبلغ ثابت</Option>
              <Option value="NONE">بدون ضريبة</Option>
            </Select>
          </Form.Item>
          <Form.Item name="scope" label="النطاق" rules={[{ required: true, message: 'مطلوب' }]}>
            <Select placeholder="اختر النطاق">
              <Option value="SALES">مبيعات</Option>
              <Option value="PURCHASES">مشتريات</Option>
              <Option value="BOTH">الاثنان</Option>
            </Select>
          </Form.Item>
          <Form.Item name="etaType" label="كود ETA (مصر)">
            <Input placeholder="T1" />
          </Form.Item>
          <Form.Item name="etaSubtype" label="الكود الفرعي ETA">
            <Input placeholder="V001" />
          </Form.Item>
          <Form.Item name="zatcaType" label="كود ZATCA (السعودية)">
            <Input placeholder="S" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}