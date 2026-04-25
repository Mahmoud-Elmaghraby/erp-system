import React, { useState } from 'react';
import { ChartOfAccount } from '../../../types/chart-of-accounts.types';

// واجهة الـ Props الخاصة بالمكون
interface AccountTreeNodeProps {
  account: ChartOfAccount;
  level?: number;
  selectedAccountId?: string | null;
  onSelectAccount: (account: ChartOfAccount) => void;
}

export const AccountTreeNode: React.FC<AccountTreeNodeProps> = ({
  account,
  level = 0,
  selectedAccountId,
  onSelectAccount,
}) => {
  // حالة فتح وقفل الحساب التجميعي
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const hasChildren = account.children && account.children.length > 0;
  const isSelected = selectedAccountId === account.id;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // عشان ما يعملش Select للحساب وإنت بتفتحه وتقفله بس
    if (account.isGroup) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleSelect = () => {
    onSelectAccount(account);
  };

  return (
    <div className="account-tree-node">
      {/* السطر الخاص بالحساب نفسه */}
      <div
        onClick={handleSelect}
        style={{
          // التدرج في المسافة بناءً على المستوى
          paddingInlineStart: `${level * 20}px`,
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          paddingTop: '8px',
          paddingBottom: '8px',
          backgroundColor: isSelected ? '#e6f7ff' : 'transparent',
          borderLeft: isSelected ? '3px solid #1890ff' : '3px solid transparent',
        }}
        className="hover-bg-gray-100 transition-colors"
      >
        {/* أيقونة الفتح والقفل (تظهر فقط للحسابات التجميعية) */}
        <span
          onClick={handleToggle}
          style={{
            width: '24px',
            display: 'inline-block',
            textAlign: 'center',
            cursor: account.isGroup ? 'pointer' : 'default',
            color: '#8c8c8c'
          }}
        >
          {account.isGroup ? (isExpanded ? '▼' : '▶') : '•'}
        </span>

        {/* كود واسم الحساب */}
        <div style={{ display: 'flex', gap: '8px', fontWeight: account.isGroup ? '600' : '400' }}>
          <span style={{ color: '#595959' }}>{account.code}</span>
          <span>{account.name}</span>
        </div>

        {/* بادج صغير يوضح حالة الحساب (لو حابب تضيفه) */}
        {!account.isActive && (
          <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#ff4d4f', border: '1px solid #ff4d4f', padding: '0 4px', borderRadius: '4px' }}>
            موقوف
          </span>
        )}
      </div>

      {/* الـ Recursive Rendering: لو الحساب مفتوح وعنده ولاد، ارسمهم بنفس المكون */}
      {isExpanded && hasChildren && (
        <div className="account-children">
          {account.children!.map((childAccount) => (
            <AccountTreeNode
              key={childAccount.id}
              account={childAccount}
              level={level + 1}
              selectedAccountId={selectedAccountId}
              onSelectAccount={onSelectAccount}
            />
          ))}
        </div>
      )}
    </div>
  );
};