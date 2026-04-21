import { Table, Button, Space, Tag, InputNumber, Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DollarOutlined } from '@ant-design/icons';
import { useState } from 'react';

interface InvoiceRow {
  id: string;
  invoiceNumber: string;
  status: string;
  totalAmount: number;
  paidAmount: number;
}

interface Props {
  data: InvoiceRow[];
  loading: boolean;
  onPay: (id: string, amount: number) => void;
}

const statusColors: Record<string, string> = {
  UNPAID: 'red',
  PAID: 'green',
  PARTIAL: 'orange',
};

const statusLabels: Record<string, string> = {
  UNPAID: 'غير مدفوعة',
  PAID: 'مدفوعة',
  PARTIAL: 'مدفوعة جزئياً',
};

export default function InvoiceTable({ data, loading, onPay }: Props) {
  const [payModal, setPayModal] = useState<{ open: boolean; id: string; amount: number }>({
    open: false, id: '', amount: 0
  });

  const columns: ColumnsType<InvoiceRow> = [
    { title: 'رقم الفاتورة', dataIndex: 'invoiceNumber', key: 'invoiceNumber' },
    {
      title: 'الحالة',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>,
    },
    { title: 'الإجمالي', dataIndex: 'totalAmount', key: 'totalAmount',
      render: (v: number) => `${Number(v).toFixed(2)} ج.م` },
    { title: 'المدفوع', dataIndex: 'paidAmount', key: 'paidAmount',
      render: (v: number) => `${Number(v).toFixed(2)} ج.م` },
    {
      title: 'إجراءات',
      key: 'actions',
      render: (_: unknown, record: InvoiceRow) => (
        <Space>
          {record.status !== 'PAID' && (
            <Button
              type="primary"
              icon={<DollarOutlined />}
              size="small"
              onClick={() => setPayModal({ open: true, id: record.id, amount: 0 })}
            >
              دفع
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />
      <Modal
        title="تسجيل دفع"
        open={payModal.open}
        onCancel={() => setPayModal({ open: false, id: '', amount: 0 })}
        onOk={() => { onPay(payModal.id, payModal.amount); setPayModal({ open: false, id: '', amount: 0 }); }}
        okText="تأكيد"
        cancelText="إلغاء"
      >
        <InputNumber
          placeholder="المبلغ"
          min={0}
          style={{ width: '100%' }}
          onChange={(v) => setPayModal(prev => ({ ...prev, amount: v || 0 }))}
        />
      </Modal>
    </>
  );
}