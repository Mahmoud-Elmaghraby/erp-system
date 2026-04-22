import { useState } from 'react';
import { Table, Tag, Button, Modal, Form, Input, InputNumber, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentSequencesApi } from '../../core/api/core.api';
import api from '../../core/api/axios.config';

const MODULE_LABELS: Record<string, string> = {
  sales: 'المبيعات',
  purchasing: 'المشتريات',
  inventory: 'المخزون',
  accounting: 'المحاسبة',
};

const DOC_TYPE_LABELS: Record<string, string> = {
  order: 'أمر بيع',
  invoice: 'فاتورة',
  bill: 'فاتورة واردة',
  receipt: 'إيصال',
  adjustment: 'تسوية',
  quotation: 'عرض سعر',
  rfq: 'طلب عرض',
  delivery: 'تسليم',
  return: 'مرتجع',
};

export default function DocumentSequencesPage() {
  const [editModal, setEditModal] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [form] = Form.useForm();
  const qc = useQueryClient();

  const { data: sequences, isLoading } = useQuery({
    queryKey: ['document-sequences'],
    queryFn: documentSequencesApi.getAll,
  });

  const update = useMutation({
    mutationFn: (values: any) =>
      api.patch(`/document-sequences/${selected.module}/${selected.docType}`, values)
        .then(r => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['document-sequences'] });
      message.success('تم تحديث التسلسل');
      setEditModal(false);
    },
    onError: () => message.error('حدث خطأ'),
  });

  const handleEdit = (record: any) => {
    setSelected(record);
    form.setFieldsValue({ prefix: record.prefix, padding: record.padding });
    setEditModal(true);
  };

  const columns = [
    {
      title: 'الموديول', dataIndex: 'module', key: 'module',
      render: (v: string) => <Tag color="blue">{MODULE_LABELS[v] || v}</Tag>,
    },
    {
      title: 'نوع المستند', dataIndex: 'docType', key: 'docType',
      render: (v: string) => DOC_TYPE_LABELS[v] || v,
    },
    {
      title: 'البادئة', dataIndex: 'prefix', key: 'prefix',
      render: (v: string) => <Tag>{v}</Tag>,
    },
    { title: 'عدد الأرقام', dataIndex: 'padding', key: 'padding' },
    { title: 'الرقم التالي', dataIndex: 'nextNumber', key: 'nextNumber' },
    {
      title: 'مثال', key: 'example',
      render: (_: any, r: any) => (
        <Tag color="green">
          {r.prefix}-{String(r.nextNumber).padStart(r.padding, '0')}
        </Tag>
      ),
    },
    {
      title: 'إجراءات', key: 'actions',
      render: (_: any, record: any) => (
        <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>
          تعديل
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>تسلسل المستندات</h2>
        <p style={{ color: '#666', marginTop: 4 }}>
          كل مستند بياخد رقم تسلسلي أوتوماتيك حسب الإعدادات دي.
        </p>
      </div>

      <Table
        columns={columns}
        dataSource={sequences || []}
        rowKey="id"
        loading={isLoading}
        pagination={false}
      />

      <Modal
        title="تعديل التسلسل"
        open={editModal}
        onCancel={() => setEditModal(false)}
        onOk={() => form.submit()}
        confirmLoading={update.isPending}
        okText="حفظ"
        cancelText="إلغاء"
      >
        <Form form={form} layout="vertical" onFinish={(v) => update.mutate(v)}>
          <Form.Item name="prefix" label="البادئة" rules={[{ required: true }]}>
            <Input style={{ maxWidth: 150 }} />
          </Form.Item>
          <Form.Item name="padding" label="عدد الأرقام" rules={[{ required: true }]}>
            <InputNumber min={3} max={10} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}