import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Tag, Popconfirm, message, Collapse, Badge } from 'antd';
import { PlusOutlined, LockOutlined, CheckOutlined } from '@ant-design/icons';
import { useFiscalYears, useCreateFiscalYear, useCloseFiscalYear, useLockFiscalYear, useUpdatePeriodStatus } from '../hooks/useFiscalYears';

const { Panel } = Collapse;

const yearStatusColors: Record<string, string> = {
  OPEN: 'green', CLOSED: 'orange', LOCKED: 'red',
};
const yearStatusLabels: Record<string, string> = {
  OPEN: 'مفتوحة', CLOSED: 'مقفولة', LOCKED: 'مقفولة نهائياً',
};
const periodStatusColors: Record<string, string> = {
  OPEN: 'green', SOFT_LOCKED: 'orange', HARD_LOCKED: 'red',
};
const periodStatusLabels: Record<string, string> = {
  OPEN: 'مفتوحة', SOFT_LOCKED: 'مقفولة مؤقتاً', HARD_LOCKED: 'مقفولة نهائياً',
};

export default function FiscalYearsPage() {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const { data: yearsData, isLoading } = useFiscalYears();
  const years = yearsData?.data ?? yearsData ?? [];

  const createYear  = useCreateFiscalYear();
  const closeYear   = useCloseFiscalYear();
  const lockYear    = useLockFiscalYear();
  const updatePeriod = useUpdatePeriodStatus();

  const handleSubmit = async () => {
    const values = await form.validateFields();
    await createYear.mutateAsync(values);
    message.success('تم إنشاء السنة المالية');
    setOpen(false);
    form.resetFields();
  };

  const columns = [
    { title: 'الاسم', dataIndex: 'name', key: 'name' },
    {
      title: 'من', dataIndex: 'startDate', key: 'startDate',
      render: (v: string) => new Date(v).toLocaleDateString('ar-EG'),
    },
    {
      title: 'إلى', dataIndex: 'endDate', key: 'endDate',
      render: (v: string) => new Date(v).toLocaleDateString('ar-EG'),
    },
    {
      title: 'الحالة', dataIndex: 'status', key: 'status',
      render: (v: string) => <Tag color={yearStatusColors[v]}>{yearStatusLabels[v]}</Tag>,
    },
    {
      title: 'الفترات', dataIndex: 'periods', key: 'periods',
      render: (periods: any[]) => <Badge count={periods?.length ?? 0} color="blue" />,
    },
    {
      title: 'إجراءات', key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          {record.status === 'OPEN' && (
            <Popconfirm title="إقفال السنة المالية؟" onConfirm={() =>
              closeYear.mutateAsync(record.id).then(() => message.success('تم الإقفال'))
            }>
              <Button icon={<CheckOutlined />} size="small">إقفال</Button>
            </Popconfirm>
          )}
          {record.status === 'CLOSED' && (
            <Popconfirm title="قفل السنة نهائياً؟ لن يمكن التراجع!" onConfirm={() =>
              lockYear.mutateAsync(record.id).then(() => message.success('تم القفل النهائي'))
            }>
              <Button icon={<LockOutlined />} size="small" danger>قفل نهائي</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>السنوات المالية</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          سنة مالية جديدة
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={years}
        loading={isLoading}
        rowKey="id"
        expandable={{
          expandedRowRender: (record: any) => (
            <Collapse ghost>
              <Panel header={`الفترات المحاسبية (${record.periods?.length ?? 0})`} key="periods">
                <Table
                  size="small"
                  dataSource={record.periods ?? []}
                  rowKey="id"
                  pagination={false}
                  columns={[
                    { title: 'الفترة', dataIndex: 'name', key: 'name' },
                    {
                      title: 'من', dataIndex: 'startDate', key: 'startDate',
                      render: (v: string) => new Date(v).toLocaleDateString('ar-EG'),
                    },
                    {
                      title: 'إلى', dataIndex: 'endDate', key: 'endDate',
                      render: (v: string) => new Date(v).toLocaleDateString('ar-EG'),
                    },
                    {
                      title: 'الحالة', dataIndex: 'status', key: 'status',
                      render: (v: string) => (
                        <Tag color={periodStatusColors[v]}>{periodStatusLabels[v]}</Tag>
                      ),
                    },
                    {
                      title: 'إجراءات', key: 'actions',
                      render: (_: any, period: any) => (
                        <Space>
                          {period.status !== 'OPEN' && (
                            <Button size="small" onClick={() =>
                              updatePeriod.mutateAsync({ periodId: period.id, status: 'OPEN' })
                                .then(() => message.success('تم فتح الفترة'))
                            }>فتح</Button>
                          )}
                          {period.status === 'OPEN' && (
                            <Button size="small" onClick={() =>
                              updatePeriod.mutateAsync({ periodId: period.id, status: 'SOFT_LOCKED' })
                                .then(() => message.success('تم قفل الفترة'))
                            }>قفل مؤقت</Button>
                          )}
                          {period.status !== 'HARD_LOCKED' && (
                            <Popconfirm title="قفل نهائي؟ لن يمكن التراجع!" onConfirm={() =>
                              updatePeriod.mutateAsync({ periodId: period.id, status: 'HARD_LOCKED' })
                                .then(() => message.success('تم القفل النهائي'))
                            }>
                              <Button size="small" danger>قفل نهائي</Button>
                            </Popconfirm>
                          )}
                        </Space>
                      ),
                    },
                  ]}
                />
              </Panel>
            </Collapse>
          ),
        }}
      />

      <Modal
        title="سنة مالية جديدة"
        open={open} onOk={handleSubmit} onCancel={() => setOpen(false)}
        confirmLoading={createYear.isPending}
        okText="إنشاء" cancelText="إلغاء"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="الاسم" rules={[{ required: true }]}>
            <Input placeholder="السنة المالية 2027" />
          </Form.Item>
          <Form.Item name="startDate" label="تاريخ البداية" rules={[{ required: true }]}>
            <Input type="date" />
          </Form.Item>
          <Form.Item name="endDate" label="تاريخ النهاية" rules={[{ required: true }]}>
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}