import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Tag, Table, Modal, Form, InputNumber, Space, Popconfirm, Tabs, } from 'antd';
import { ArrowRightOutlined, CheckOutlined, InboxOutlined, DollarOutlined } from '@ant-design/icons';
import { usePurchaseOrder, useConfirmPurchaseOrder } from '../hooks/usePurchaseOrders';
import { usePurchaseReceipts, useCreatePurchaseReceipt } from '../hooks/usePurchaseReceipts';
import { useVendorBills, useCreateVendorBill, usePayVendorBill } from '../hooks/useVendorBills';

const statusColors: Record<string, string> = {
  DRAFT: 'orange', CONFIRMED: 'blue',
  PARTIALLY_RECEIVED: 'purple', FULLY_RECEIVED: 'green', CANCELLED: 'red',
};

const statusLabels: Record<string, string> = {
  DRAFT: 'مسودة', CONFIRMED: 'مؤكد',
  PARTIALLY_RECEIVED: 'استلام جزئي', FULLY_RECEIVED: 'مستلم بالكامل', CANCELLED: 'ملغي',
};

export default function PurchaseOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [receiptForm] = Form.useForm();
  const [payForm] = Form.useForm();

  const { data: order, isLoading } = usePurchaseOrder(id!);
  const { data: receipts } = usePurchaseReceipts(id!);
  const { data: bills } = useVendorBills(id!);
  const confirmMutation = useConfirmPurchaseOrder();
  const createReceiptMutation = useCreatePurchaseReceipt();
  const createBillMutation = useCreateVendorBill();
  const payBillMutation = usePayVendorBill();

  const orderItemColumns = [
    { title: 'المنتج', dataIndex: 'productId', key: 'productId' },
    { title: 'الكمية', dataIndex: 'quantity', key: 'quantity', render: (v: any) => Number(v) },
    { title: 'سعر الوحدة', dataIndex: 'unitCost', key: 'unitCost', render: (v: any) => `${Number(v).toFixed(2)}` },
    { title: 'الإجمالي', dataIndex: 'total', key: 'total', render: (v: any) => `${Number(v).toFixed(2)}` },
    { title: 'المستلم', dataIndex: 'receivedQty', key: 'receivedQty', render: (v: any) => Number(v) },
  ];

  const receiptColumns = [
    { title: 'رقم الاستلام', dataIndex: 'receiptNumber', key: 'receiptNumber' },
    { title: 'التاريخ', dataIndex: 'createdAt', key: 'createdAt', render: (d: string) => new Date(d).toLocaleDateString('ar-EG') },
  ];

  const billColumns = [
    { title: 'رقم الفاتورة', dataIndex: 'billNumber', key: 'billNumber' },
    {
      title: 'الحالة',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => <Tag color={s === 'PAID' ? 'green' : s === 'PARTIAL' ? 'orange' : 'red'}>
        {s === 'PAID' ? 'مدفوع' : s === 'PARTIAL' ? 'جزئي' : 'غير مدفوع'}
      </Tag>,
    },
    { title: 'الإجمالي', dataIndex: 'totalAmount', key: 'totalAmount', render: (v: any) => `${Number(v).toFixed(2)}` },
    { title: 'المدفوع', dataIndex: 'paidAmount', key: 'paidAmount', render: (v: any) => `${Number(v).toFixed(2)}` },
    {
      title: 'إجراءات',
      key: 'actions',
      render: (_: any, record: any) => (
        record.status !== 'PAID' && (
          <Button icon={<DollarOutlined />} size="small" onClick={() => { setSelectedBill(record); setIsPayModalOpen(true); }}>
            دفع
          </Button>
        )
      ),
    },
  ];

  const handleCreateReceipt = (values: any) => {
    createReceiptMutation.mutate(
      { orderId: id, warehouseId: order?.warehouseId, items: values.items },
      { onSuccess: () => { setIsReceiptModalOpen(false); receiptForm.resetFields(); } }
    );
  };

  const handlePay = (values: any) => {
    payBillMutation.mutate(
      { id: selectedBill.id, amount: values.amount },
      { onSuccess: () => { setIsPayModalOpen(false); payForm.resetFields(); } }
    );
  };

  if (isLoading) return <div>جاري التحميل...</div>;

  return (
    <div dir="rtl">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <Button icon={<ArrowRightOutlined />} onClick={() => navigate('/purchasing/orders')}>رجوع</Button>
        <h2 style={{ margin: 0 }}>أمر الشراء: {order?.orderNumber}</h2>
        <Tag color={statusColors[order?.status]}>{statusLabels[order?.status]}</Tag>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Space size="large">
          <div><strong>المورد:</strong> {order?.supplier?.name}</div>
          <div><strong>الإجمالي:</strong> {Number(order?.totalAmount).toFixed(2)} {order?.currency}</div>
          <div><strong>التاريخ:</strong> {new Date(order?.createdAt).toLocaleDateString('ar-EG')}</div>
        </Space>
      </Card>

      <Space style={{ marginBottom: 16 }}>
        {order?.status === 'DRAFT' && (
          <Popconfirm title="هل أنت متأكد من تأكيد أمر الشراء؟" onConfirm={() => confirmMutation.mutate(id!)} okText="نعم" cancelText="لا">
            <Button type="primary" icon={<CheckOutlined />} loading={confirmMutation.isPending}>تأكيد الأمر</Button>
          </Popconfirm>
        )}
        {(order?.status === 'CONFIRMED' || order?.status === 'PARTIALLY_RECEIVED') && (
          <Button icon={<InboxOutlined />} onClick={() => setIsReceiptModalOpen(true)}>تسجيل استلام</Button>
        )}
        {order?.status !== 'DRAFT' && (
          <Button icon={<DollarOutlined />} onClick={() => createBillMutation.mutate({ orderId: id })}>
            إنشاء فاتورة مورد
          </Button>
        )}
      </Space>

      <Tabs items={[
        {
          key: 'items',
          label: 'الأصناف',
          children: <Table columns={orderItemColumns} dataSource={order?.items || []} rowKey="id" />,
        },
        {
          key: 'receipts',
          label: `الاستلامات (${receipts?.length || 0})`,
          children: <Table columns={receiptColumns} dataSource={receipts || []} rowKey="id" />,
        },
        {
          key: 'bills',
          label: `الفواتير (${bills?.length || 0})`,
          children: <Table columns={billColumns} dataSource={bills || []} rowKey="id" />,
        },
      ]} />

      <Modal
        title="تسجيل استلام"
        open={isReceiptModalOpen}
        onCancel={() => setIsReceiptModalOpen(false)}
        onOk={() => receiptForm.submit()}
        confirmLoading={createReceiptMutation.isPending}
        okText="تسجيل"
        cancelText="إلغاء"
      >
        <Form form={receiptForm} layout="vertical" onFinish={handleCreateReceipt} dir="rtl">
          <Form.List name="items" initialValue={order?.items?.map((i: any) => ({ productId: i.productId, receivedQty: i.quantity - i.receivedQty }))}>
            {(fields) => fields.map(({ key, name }) => (
              <Space key={key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                <Form.Item name={[name, 'productId']} hidden><InputNumber /></Form.Item>
                <span>{order?.items?.[name]?.productId}</span>
                <Form.Item name={[name, 'receivedQty']} label="الكمية المستلمة">
                  <InputNumber min={0} max={order?.items?.[name]?.quantity - order?.items?.[name]?.receivedQty} />
                </Form.Item>
              </Space>
            ))}
          </Form.List>
        </Form>
      </Modal>

      <Modal
        title="تسجيل دفع"
        open={isPayModalOpen}
        onCancel={() => setIsPayModalOpen(false)}
        onOk={() => payForm.submit()}
        confirmLoading={payBillMutation.isPending}
        okText="دفع"
        cancelText="إلغاء"
      >
        <Form form={payForm} layout="vertical" onFinish={handlePay} dir="rtl">
          <Form.Item label={`المبلغ (المتبقي: ${Number(selectedBill?.totalAmount) - Number(selectedBill?.paidAmount)})`} name="amount" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={0} max={Number(selectedBill?.totalAmount) - Number(selectedBill?.paidAmount)} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}