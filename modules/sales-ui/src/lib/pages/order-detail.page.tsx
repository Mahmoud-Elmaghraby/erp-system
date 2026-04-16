import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Table, Button, Modal, Form, Input, InputNumber, Tabs, Tag, Popconfirm, message, Select, Descriptions, Space } from 'antd';
import { PlusOutlined, CheckOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { salesApi } from '../api/sales.api';
import { useDeliveries, useCreateDelivery, useConfirmDelivery } from '../hooks/useDeliveries';
import { useSalesReturns, useCreateSalesReturn, useConfirmSalesReturn } from '../hooks/useSalesReturns';
import { useInvoices, useCreateInvoice, usePayInvoice } from '../hooks/useInvoices';

const { Option } = Select;
const WAREHOUSE_ID = 'main';
const BRANCH_ID = 'main';

const statusColors: Record<string, string> = {
  DRAFT: 'default', CONFIRMED: 'blue', DELIVERED: 'green', CANCELLED: 'red',
};
const statusLabels: Record<string, string> = {
  DRAFT: 'مسودة', CONFIRMED: 'مؤكد', DELIVERED: 'تم التسليم', CANCELLED: 'ملغي',
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [deliveryForm] = Form.useForm();
  const [returnForm] = Form.useForm();
  const [payForm] = Form.useForm();

  const { data: order } = useQuery({
    queryKey: ['orders', id],
    queryFn: () => salesApi.orders.getById(id!),
    enabled: !!id,
  });

  const { data: deliveries } = useDeliveries(id!);
  const { data: returns } = useSalesReturns(id!);
  const { data: invoices } = useInvoices(id!);

  const createDelivery = useCreateDelivery();
  const confirmDelivery = useConfirmDelivery();
  const createReturn = useCreateSalesReturn();
  const confirmReturn = useConfirmSalesReturn();
  const createInvoice = useCreateInvoice();
  const payInvoice = usePayInvoice();

  const handleCreateDelivery = async () => {
    const values = await deliveryForm.validateFields();
    await createDelivery.mutateAsync({
      orderId: id,
      branchId: BRANCH_ID,
      warehouseId: WAREHOUSE_ID,
      items: order?.items?.map((i: any) => ({
        productId: i.productId,
        quantity: Number(i.quantity),
      })) ?? [],
      ...values,
    });
    message.success('تم إنشاء التسليم');
    setDeliveryOpen(false);
  };

  const handleCreateReturn = async () => {
    const values = await returnForm.validateFields();
    await createReturn.mutateAsync({
      orderId: id,
      ...values,
      items: order?.items?.map((i: any) => ({
        productId: i.productId,
        quantity: Number(i.quantity),
        unitPrice: Number(i.unitPrice),
      })) ?? [],
    });
    message.success('تم إنشاء المرتجع');
    setReturnOpen(false);
  };

  const handlePay = async () => {
    const values = await payForm.validateFields();
    await payInvoice.mutateAsync({ id: selectedInvoice.id, data: values });
    message.success('تم تسجيل الدفع');
    setPayOpen(false);
    payForm.resetFields();
  };

  // Items columns
  const itemColumns = [
    { title: 'المنتج', dataIndex: 'productId', key: 'productId' },
    { title: 'الكمية', dataIndex: 'quantity', key: 'quantity',
      render: (v: number) => Number(v) },
    { title: 'سعر الوحدة', dataIndex: 'unitPrice', key: 'unitPrice',
      render: (v: number) => `${Number(v).toFixed(2)} ج.م` },
    { title: 'الإجمالي', dataIndex: 'total', key: 'total',
      render: (v: number) => `${Number(v).toFixed(2)} ج.م` },
  ];

  const invoiceColumns = [
    { title: 'الرقم', dataIndex: 'invoiceNumber', key: 'invoiceNumber' },
    { title: 'الإجمالي', dataIndex: 'totalAmount', key: 'totalAmount',
      render: (v: number) => `${Number(v).toFixed(2)} ج.م` },
    { title: 'المدفوع', dataIndex: 'paidAmount', key: 'paidAmount',
      render: (v: number) => `${Number(v).toFixed(2)} ج.م` },
    { title: 'الحالة', dataIndex: 'status', key: 'status',
      render: (v: string) => (
        <Tag color={v === 'PAID' ? 'green' : v === 'PARTIAL' ? 'orange' : 'red'}>
          {v === 'PAID' ? 'مدفوع' : v === 'PARTIAL' ? 'جزئي' : 'غير مدفوع'}
        </Tag>
      )},
    { title: 'إجراءات', key: 'actions',
      render: (_: any, record: any) => record.status !== 'PAID' && (
        <Button size="small" type="primary"
          onClick={() => { setSelectedInvoice(record); setPayOpen(true); }}>
          دفع
        </Button>
      ),
    },
  ];

  const deliveryColumns = [
    { title: 'الرقم', dataIndex: 'deliveryNumber', key: 'deliveryNumber' },
    { title: 'الحالة', dataIndex: 'status', key: 'status',
      render: (v: string) => (
        <Tag color={v === 'DONE' ? 'green' : v === 'CONFIRMED' ? 'blue' : 'default'}>
          {v === 'DRAFT' ? 'مسودة' : v === 'CONFIRMED' ? 'مؤكد' : 'مكتمل'}
        </Tag>
      )},
    { title: 'إجراءات', key: 'actions',
      render: (_: any, record: any) => record.status === 'DRAFT' && (
        <Popconfirm title="تأكيد التسليم؟" onConfirm={() =>
          confirmDelivery.mutateAsync(record.id).then(() => message.success('تم التأكيد'))
        }>
          <Button icon={<CheckOutlined />} size="small" type="primary">تأكيد</Button>
        </Popconfirm>
      ),
    },
  ];

  const returnColumns = [
    { title: 'الرقم', dataIndex: 'returnNumber', key: 'returnNumber' },
    { title: 'السبب', dataIndex: 'reason', key: 'reason' },
    { title: 'الإجمالي', dataIndex: 'totalAmount', key: 'totalAmount',
      render: (v: number) => `${Number(v).toFixed(2)} ج.م` },
    { title: 'الحالة', dataIndex: 'status', key: 'status',
      render: (v: string) => (
        <Tag color={v === 'CONFIRMED' ? 'green' : v === 'CANCELLED' ? 'red' : 'default'}>
          {v === 'DRAFT' ? 'مسودة' : v === 'CONFIRMED' ? 'مؤكد' : 'ملغي'}
        </Tag>
      )},
    { title: 'إجراءات', key: 'actions',
      render: (_: any, record: any) => record.status === 'DRAFT' && (
        <Popconfirm title="تأكيد المرتجع؟" onConfirm={() =>
          confirmReturn.mutateAsync(record.id).then(() => message.success('تم التأكيد'))
        }>
          <Button icon={<CheckOutlined />} size="small" type="primary">تأكيد</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowRightOutlined />} onClick={() => navigate('/sales/orders')}>
          رجوع
        </Button>
      </Space>

      <Card style={{ marginBottom: 16 }}>
        <Descriptions title={`أمر بيع: ${order?.orderNumber ?? ''}`} bordered column={3}>
          <Descriptions.Item label="الحالة">
            <Tag color={statusColors[order?.status]}>{statusLabels[order?.status]}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="الإجمالي">
            {Number(order?.totalAmount ?? 0).toFixed(2)} ج.م
          </Descriptions.Item>
          <Descriptions.Item label="التاريخ">
            {order?.createdAt ? new Date(order.createdAt).toLocaleDateString('ar-EG') : '—'}
          </Descriptions.Item>
          <Descriptions.Item label="ملاحظات" span={3}>
            {order?.notes ?? '—'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Tabs items={[
        {
          key: 'items',
          label: `البنود (${order?.items?.length ?? 0})`,
          children: (
            <Table columns={itemColumns} dataSource={order?.items ?? []} rowKey="id" />
          ),
        },
        {
          key: 'invoices',
          label: `الفواتير (${invoices?.length ?? 0})`,
          children: (
            <>
              {order?.status === 'CONFIRMED' && (
                <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 12 }}
                  onClick={() => createInvoice.mutateAsync({ orderId: id })
                    .then(() => message.success('تم إنشاء الفاتورة'))}>
                  إنشاء فاتورة
                </Button>
              )}
              <Table columns={invoiceColumns} dataSource={invoices} rowKey="id" />
            </>
          ),
        },
        {
          key: 'deliveries',
          label: `التسليمات (${deliveries?.length ?? 0})`,
          children: (
            <>
              {order?.status === 'CONFIRMED' && (
                <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 12 }}
                  onClick={() => setDeliveryOpen(true)}>
                  إنشاء تسليم
                </Button>
              )}
              <Table columns={deliveryColumns} dataSource={deliveries} rowKey="id" />
            </>
          ),
        },
        {
          key: 'returns',
          label: `المرتجعات (${returns?.length ?? 0})`,
          children: (
            <>
              {(order?.status === 'CONFIRMED' || order?.status === 'DELIVERED') && (
                <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 12 }}
                  onClick={() => setReturnOpen(true)}>
                  إنشاء مرتجع
                </Button>
              )}
              <Table columns={returnColumns} dataSource={returns} rowKey="id" />
            </>
          ),
        },
      ]} />

      {/* Delivery Modal */}
      <Modal title="إنشاء تسليم" open={deliveryOpen} onOk={handleCreateDelivery}
        onCancel={() => setDeliveryOpen(false)} okText="حفظ" cancelText="إلغاء">
        <Form form={deliveryForm} layout="vertical">
          <Form.Item name="deliveryDate" label="تاريخ التسليم">
            <Input type="date" />
          </Form.Item>
          <Form.Item name="notes" label="ملاحظات">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Return Modal */}
      <Modal title="إنشاء مرتجع" open={returnOpen} onOk={handleCreateReturn}
        onCancel={() => setReturnOpen(false)} okText="حفظ" cancelText="إلغاء">
        <Form form={returnForm} layout="vertical">
          <Form.Item name="reason" label="السبب" rules={[{ required: true, message: 'مطلوب' }]}>
            <Input placeholder="سبب الإرجاع" />
          </Form.Item>
          <Form.Item name="notes" label="ملاحظات">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Pay Modal */}
      <Modal title="تسجيل دفع" open={payOpen} onOk={handlePay}
        onCancel={() => { setPayOpen(false); payForm.resetFields(); }}
        okText="دفع" cancelText="إلغاء">
        <Form form={payForm} layout="vertical">
          <Form.Item name="amount" label="المبلغ" rules={[{ required: true, message: 'مطلوب' }]}>
            <InputNumber min={0} precision={2} style={{ width: '100%' }}
              max={selectedInvoice
                ? Number(selectedInvoice.totalAmount) - Number(selectedInvoice.paidAmount)
                : undefined} />
          </Form.Item>
          <Form.Item name="paymentMethod" label="طريقة الدفع" rules={[{ required: true, message: 'مطلوب' }]}>
            <Select>
              <Option value="CASH">نقدي</Option>
              <Option value="BANK_TRANSFER">تحويل بنكي</Option>
              <Option value="CHEQUE">شيك</Option>
              <Option value="CARD">بطاقة</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}