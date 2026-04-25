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