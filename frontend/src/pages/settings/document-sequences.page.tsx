import { Table, Tag } from 'antd';
import { useQuery } from '@tanstack/react-query';
import api from '../../core/api/axios.config';

const COMPANY_ID = 'default';

const moduleLabels: Record<string, string> = {
  sales: 'المبيعات',
  purchasing: 'المشتريات',
  inventory: 'المخزون',
};

const docTypeLabels: Record<string, string> = {
  order: 'أمر',
  invoice: 'فاتورة',
  bill: 'فاتورة واردة',
  receipt: 'إيصال',
  adjustment: 'تسوية',
};

export default function DocumentSequencesPage() {
  const { data: sequences, isLoading } = useQuery({
    queryKey: ['document-sequences'],
    queryFn: async () => (await api.get(`/document-sequences/${COMPANY_ID}`)).data,
  });

  const columns = [
    {
      title: 'الموديول',
      dataIndex: 'module',
      key: 'module',
      render: (v: string) => <Tag color="blue">{moduleLabels[v] || v}</Tag>,
    },
    {
      title: 'نوع المستند',
      dataIndex: 'docType',
      key: 'docType',
      render: (v: string) => docTypeLabels[v] || v,
    },
    { title: 'البادئة', dataIndex: 'prefix', key: 'prefix', render: (v: string) => <Tag>{v}</Tag> },
    { title: 'عدد الأرقام', dataIndex: 'padding', key: 'padding' },
    { title: 'الرقم التالي', dataIndex: 'nextNumber', key: 'nextNumber' },
    {
      title: 'مثال',
      key: 'example',
      render: (_: any, record: any) => (
        <Tag color="green">
          {record.prefix}-{String(record.nextNumber).padStart(record.padding, '0')}
        </Tag>
      ),
    },
  ];

  return (
    <div dir="rtl">
      <h2>تسلسل المستندات</h2>
      <p style={{ color: '#666', marginBottom: 16 }}>
        كل مستند بياخد رقم تسلسلي أوتوماتيك حسب الإعدادات دي.
      </p>
      <Table columns={columns} dataSource={sequences || []} rowKey="id" loading={isLoading} />
    </div>
  );
}