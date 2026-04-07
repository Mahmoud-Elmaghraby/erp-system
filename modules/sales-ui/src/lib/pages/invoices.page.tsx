import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useInvoices, useCreateInvoice, usePayInvoice } from '../hooks/useInvoices';
import InvoiceTable from '../components/invoices/invoice-table';

interface Props {
  orderId: string;
}

export default function InvoicesPage({ orderId }: Props) {
  const { data: invoices, isLoading } = useInvoices(orderId);
  const createMutation = useCreateInvoice();
  const payMutation = usePayInvoice();

  if (!orderId) return <div>اختر أوردر أولاً</div>;

  return (
    <div dir="rtl">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>الفواتير</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => createMutation.mutate({ orderId })}
          loading={createMutation.isPending}
        >
          إنشاء فاتورة
        </Button>
      </div>
      <InvoiceTable
        data={invoices || []}
        loading={isLoading}
        onPay={(id, amount) => payMutation.mutate({ id, amount })}
      />
    </div>
  );
}