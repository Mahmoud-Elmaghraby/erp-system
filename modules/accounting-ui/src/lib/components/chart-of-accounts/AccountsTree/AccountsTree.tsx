import React, { useMemo } from 'react';
import { Tree, Spin, Empty } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { ChartOfAccount } from '../../../types/chart-of-accounts.types';

interface AccountsTreeProps {
  accounts: ChartOfAccount[];
  isLoading: boolean;
  selectedAccountId?: string | null;
  onSelectAccount: (account: ChartOfAccount) => void;
}

export const AccountsTree: React.FC<AccountsTreeProps> = ({
  accounts,
  isLoading,
  selectedAccountId,
  onSelectAccount,
}) => {
  // تحويل الشجرة بتاعتنا لـ DataNode الخاص بـ Ant Design
  const treeData = useMemo(() => {
    // 1️⃣ حماية أساسية: لو الـ accounts مش مصفوفة، نرجع مصفوفة فاضية
    if (!Array.isArray(accounts)) {
      console.warn('Expected "accounts" to be an array, but received:', accounts);
      return [];
    }

    const mapNode = (acc: ChartOfAccount): DataNode => ({
      title: `${acc.code} - ${acc.name}`,
      key: acc.id,
      isLeaf: !acc.isGroup,
      ...acc,
      // 2️⃣ حماية إضافية للـ children
      children: Array.isArray(acc.children) && acc.children.length > 0 
        ? acc.children.map(mapNode) 
        : undefined,
    });
    
    return accounts.map(mapNode);
  }, [accounts]);

  // 3️⃣ حل تحذير Antd باستخدام description بدل tip
  if (isLoading) return <Spin style={{ display: 'block', marginTop: '2rem' }} description="جاري تحميل الحسابات..." />;
  
  // 4️⃣ التأكد إنها مصفوفة قبل ما نเชيك على الـ length
  if (!Array.isArray(accounts) || accounts.length === 0) return <Empty description="لا توجد حسابات حتى الآن" />;

  return (
    <Tree
      treeData={treeData}
      selectedKeys={selectedAccountId ? [selectedAccountId] : []}
      onSelect={(selectedKeys, info) => {
        if (selectedKeys.length > 0) {
          onSelectAccount(info.node as unknown as ChartOfAccount);
        }
      }}
      showLine
      defaultExpandAll
      style={{ padding: '10px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #f0f0f0' }}
    />
  );
};