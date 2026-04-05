import { Form, Input, InputNumber, Modal, Select } from 'antd';

interface Props {
  open: boolean;
  loading: boolean;
  type: 'add' | 'remove' | 'transfer';
  products: any[];
  warehouses: any[];
  currentWarehouseId: string;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const titles = { add: 'إضافة مخزون', remove: 'خصم مخزون', transfer: 'تحويل مخزون' };

export default function StockForm({ open, loading, type, products, warehouses, currentWarehouseId, onSubmit, onCancel }: Props) {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    onSubmit(values);
    form.resetFields();
  };

  const productOptions = products?.map((p: any) => ({ label: p.name, value: p.id }));
  const warehouseOptions = warehouses?.filter((w: any) => w.id !== currentWarehouseId)
    .map((w: any) => ({ label: w.name, value: w.id }));

  return (
    <Modal
      title={titles[type]}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText="تأكيد"
      cancelText="إلغاء"
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} dir="rtl">
        <Form.Item label="المنتج" name="productId" rules={[{ required: true }]}>
          <Select options={productOptions} />
        </Form.Item>
        {type === 'transfer' && (
          <Form.Item label="المخزن المستلم" name="toWarehouseId" rules={[{ required: true }]}>
            <Select options={warehouseOptions} />
          </Form.Item>
        )}
        <Form.Item label="الكمية" name="quantity" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} min={1} />
        </Form.Item>
        {type !== 'transfer' && (
          <Form.Item label="السبب" name="reason">
            <Input />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}