import React from 'react';
import { Descriptions, Tag, Button, Card, Space, Typography } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { ChartOfAccount } from '../../../types/chart-of-accounts.types';

const { Title } = Typography;

interface AccountDetailsProps {
  account: ChartOfAccount | null;
  onEdit: () => void;
  onAddChild: () => void;
}

export const AccountDetails: React.FC<AccountDetailsProps> = ({ account, onEdit, onAddChild }) => {
  if (!account) return null;

  return (
    <Card 
      title={<Title level={4} style={{ margin: 0 }}>{account.name}</Title>}
      extra={<Tag color={account.isActive ? 'success' : 'error'}>{account.isActive ? 'نشط' : 'موقوف'}</Tag>}
      bordered
    >
      <Descriptions column={2} layout="vertical">
        <Descriptions.Item label="كود الحساب">{account.code}</Descriptions.Item>
        <Descriptions.Item label="النوع">
          <Tag color="blue">{account.isGroup ? 'تجميعي (Group)' : 'فرعي (Posting)'}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="تصنيف الحساب">{account.category}</Descriptions.Item>
        <Descriptions.Item label="طبيعة الحساب (Normal Balance)">{account.normalBalance}</Descriptions.Item>
        {account.role && <Descriptions.Item label="الدور">{account.role}</Descriptions.Item>}
      </Descriptions>

      <Space style={{ marginTop: '20px' }}>
        <Button type="primary" icon={<EditOutlined />} onClick={onEdit}>
          تعديل الحساب
        </Button>
        {account.isGroup && (
          <Button icon={<PlusOutlined />} onClick={onAddChild}>
            إضافة حساب فرعي
          </Button>
        )}
      </Space>
    </Card>
  );
};