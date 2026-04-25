<<<<<<< HEAD
import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message, Tag, TreeSelect } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useChartOfAccounts, useCreateAccount, useDeleteAccount, useUpdateAccount } from '../hooks/useChartOfAccounts';

const { Option } = Select;

const typeColors: Record<string, string> = {
  ASSET: 'blue', LIABILITY: 'red', EQUITY: 'purple',
  REVENUE: 'green', EXPENSE: 'orange', COGS: 'volcano',
  BANK: 'geekblue', CASH: 'cyan', RECEIVABLE: 'gold', PAYABLE: 'magenta',
};

const typeLabels: Record<string, string> = {
  ASSET: 'أصول', LIABILITY: 'خصوم', EQUITY: 'حقوق ملكية',
  REVENUE: 'إيرادات', EXPENSE: 'مصروفات', COGS: 'تكلفة مبيعات',
  BANK: 'بنك', CASH: 'صندوق', RECEIVABLE: 'عملاء', PAYABLE: 'موردون',
};

export default function ChartOfAccountsPage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();

  const { data: accountsData, isLoading } = useChartOfAccounts();
  const accounts = accountsData?.data ?? accountsData ?? [];

  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();
  const deleteAccount = useDeleteAccount();

  const openCreate = () => { setEditing(null); form.resetFields(); setOpen(true); };
  const openEdit = (record: any) => {
    setEditing(record);
    form.setFieldsValue(record);
    setOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (editing) {
      await updateAccount.mutateAsync({ id: editing.id, data: values });
      message.success('تم تحديث الحساب');
    } else {
      await createAccount.mutateAsync(values);
      message.success('تم إضافة الحساب');
    }
    setOpen(false);
  };

  const columns = [
    { title: 'الكود', dataIndex: 'code', key: 'code', width: 80 },
    { title: 'الاسم', dataIndex: 'name', key: 'name' },
    {
      title: 'النوع', dataIndex: 'type', key: 'type',
      render: (v: string) => <Tag color={typeColors[v]}>{typeLabels[v]}</Tag>,
    },
    {
      title: 'الرصيد الطبيعي', dataIndex: 'normalBalance', key: 'normalBalance',
      render: (v: string) => <Tag color={v === 'DEBIT' ? 'blue' : 'green'}>{v === 'DEBIT' ? 'مدين' : 'دائن'}</Tag>,
    },
    {
      title: 'مجموعة', dataIndex: 'isGroup', key: 'isGroup',
      render: (v: boolean) => v ? <Tag color="purple">مجموعة</Tag> : <Tag>تفصيلي</Tag>,
    },
    {
      title: 'الحالة', dataIndex: 'isActive', key: 'isActive',
      render: (v: boolean) => <Tag color={v ? 'green' : 'red'}>{v ? 'نشط' : 'غير نشط'}</Tag>,
    },
    {
      title: 'إجراءات', key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(record)} />
          <Popconfirm title="هل أنت متأكد؟" onConfirm={() => deleteAccount.mutateAsync(record.id).then(() => message.success('تم الحذف'))}>
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>دليل الحسابات</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>إضافة حساب</Button>
      </div>
      <Table columns={columns} dataSource={accounts} loading={isLoading} rowKey="id" />
      <Modal
        title={editing ? 'تعديل حساب' : 'إضافة حساب'}
        open={open} onOk={handleSubmit} onCancel={() => setOpen(false)}
        confirmLoading={createAccount.isPending || updateAccount.isPending}
        okText="حفظ" cancelText="إلغاء"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="code" label="كود الحساب" rules={[{ required: true }]}>
            <Input placeholder="111" />
          </Form.Item>
          <Form.Item name="name" label="اسم الحساب" rules={[{ required: true }]}>
            <Input placeholder="الصندوق" />
          </Form.Item>
          <Form.Item name="type" label="نوع الحساب" rules={[{ required: true }]}>
            <Select placeholder="اختر النوع">
              {Object.entries(typeLabels).map(([v, l]) => (
                <Option key={v} value={v}>{l}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="normalBalance" label="الرصيد الطبيعي" rules={[{ required: true }]}>
            <Select placeholder="اختر الرصيد">
              <Option value="DEBIT">مدين</Option>
              <Option value="CREDIT">دائن</Option>
            </Select>
          </Form.Item>
          <Form.Item name="parentId" label="الحساب الأب">
            <Select placeholder="اختر الحساب الأب" allowClear showSearch
              filterOption={(input, option) =>
                String(option?.children ?? '').toLowerCase().includes(input.toLowerCase())
              }>
              {accounts.filter((a: any) => a.isGroup).map((a: any) => (
                <Option key={a.id} value={a.id}>{a.code} — {a.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="isGroup" label="حساب مجموعة" valuePropName="checked">
            <Select placeholder="نوع الحساب">
              <Option value={false}>تفصيلي — يُدخل عليه قيود</Option>
              <Option value={true}>مجموعة — تجميعي فقط</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
=======
import React, { useState } from 'react';
import { Row, Col, Button, Typography, Layout, Empty, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAccountsTree } from '../hooks/use-chart-of-accounts';
import { ChartOfAccount } from '../types/chart-of-accounts.types';
import { AccountsTree } from '../components/chart-of-accounts/AccountsTree/AccountsTree';
import { AccountDetails } from '../components/chart-of-accounts/AccountDetails/AccountDetails';
import { AccountForm } from '../components/chart-of-accounts/AccountForm/AccountForm';

const { Title } = Typography;
const { Content } = Layout;

type ViewMode = 'details' | 'create' | 'edit' | 'idle';

export const ChartOfAccountsPage: React.FC = () => {
  const { data: accountsTree, isLoading, error } = useAccountsTree();
  const [selectedAccount, setSelectedAccount] = useState<ChartOfAccount | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('idle');

  const handleSelectAccount = (account: ChartOfAccount) => {
    setSelectedAccount(account);
    setViewMode('details');
  };

  if (error) return <Typography.Text type="danger">حدث خطأ أثناء جلب الدليل المحاسبي.</Typography.Text>;

  return (
    <Content style={{ padding: '24px', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>الدليل المحاسبي</Title>
        </Col>
        <Col>

          <Button type="primary" icon={<PlusOutlined />} style={{ backgroundColor: '#FF0000', color: 'white' }} onClick={() => { setSelectedAccount(null); setViewMode('create'); }}>
            إضافة حساب رئيسي
          </Button>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* العمود الأيمن - الشجرة */}
        <Col xs={24} md={10} lg={8}>
          <AccountsTree 
            accounts={accountsTree || []} 
            isLoading={isLoading} 
            selectedAccountId={selectedAccount?.id}
            onSelectAccount={handleSelectAccount}
          />
        </Col>

        {/* العمود الأيسر - مساحة العمل */}
        <Col xs={24} md={14} lg={16}>
          {viewMode === 'idle' && (
            <Card style={{ textAlign: 'center', padding: '40px 0' }}>
              <Empty description="اختر حساباً من الشجرة أو قم بإضافة حساب جديد" />
            </Card>
          )}

          {viewMode === 'details' && (
            <AccountDetails 
              account={selectedAccount} 
              onEdit={() => setViewMode('edit')}
              onAddChild={() => setViewMode('create')}
            />
          )}

          {(viewMode === 'create' || viewMode === 'edit') && (
            <AccountForm 
              initialData={viewMode === 'edit' ? selectedAccount : null}
              parentId={viewMode === 'create' ? selectedAccount?.id : null}
              onSuccess={() => setViewMode(selectedAccount ? 'details' : 'idle')}
              onCancel={() => setViewMode(selectedAccount ? 'details' : 'idle')}
            />
          )}
        </Col>
      </Row>
    </Content>
  );
};
>>>>>>> main
