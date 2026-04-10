import { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  DashboardOutlined,
  ShopOutlined,
  InboxOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShoppingCartOutlined,
  SettingOutlined,
  ShoppingOutlined,
  AccountBookOutlined, // ✅
} from '@ant-design/icons';
import { authStore } from '../../core/auth/auth.store';

const { Header, Sider, Content } = Layout;

const menuItems = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: 'الرئيسية',
  },
  {
    key: '/inventory',
    icon: <InboxOutlined />,
    label: 'المخزون',
    children: [
      { key: '/inventory/products', label: 'المنتجات' },
      { key: '/inventory/warehouses', label: 'المخازن' },
      { key: '/inventory/stock', label: 'المخزون الحالي' },
      { key: '/inventory/stock-movements', label: 'سجل الحركات' },
      { key: '/inventory/adjustments', label: 'تسوية المخزون' },
      { key: '/inventory/reordering-rules', label: 'قواعد إعادة الطلب' },
      { key: '/inventory/traceability', label: 'تتبع المنتجات' },
      { key: '/inventory/valuation', label: 'تقييم المخزون' },
      { key: '/inventory/categories', label: 'التصنيفات' },
      { key: '/inventory/units', label: 'وحدات القياس' },
    ],
  },
  {
    key: '/sales',
    icon: <ShoppingCartOutlined />,
    label: 'المبيعات',
    children: [
      { key: '/sales/orders', label: 'أوامر البيع' },
      { key: '/sales/invoices', label: 'فواتير البيع' },
      { key: '/sales/customers', label: 'العملاء' },
    ],
  },
  {
    key: '/purchasing',
    icon: <ShoppingOutlined />,
    label: 'المشتريات',
    children: [
      { key: '/purchasing/orders', label: 'أوامر الشراء' },
      { key: '/purchasing/suppliers', label: 'الموردين' },
    ],
  },
  {
    key: '/accounting',                          // ✅
    icon: <AccountBookOutlined />,
    label: 'المحاسبة',
    children: [
      { key: '/accounting/taxes', label: 'الضرائب' },
      { key: '/accounting/payment-terms', label: 'شروط الدفع' },
      { key: '/accounting/chart-of-accounts', label: 'دليل الحسابات' },
    ],
  },
  {
    key: '/branches',
    icon: <ShopOutlined />,
    label: 'الفروع',
  },
  {
    key: '/settings',
    icon: <SettingOutlined />,
    label: 'الإعدادات',
    children: [
      { key: '/settings/general', label: 'إعدادات عامة' },
      { key: '/settings/currencies', label: 'العملات' },
      { key: '/settings/sequences', label: 'تسلسل المستندات' },
      { key: '/settings/modules', label: 'إعدادات الموديولات' },
    ],
  },
];

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await authStore.logout();
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'تسجيل الخروج',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }} dir="rtl">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ background: '#001529' }}
        width={220}
      >
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: collapsed ? 14 : 18, fontWeight: 'bold' }}>
          {collapsed ? 'ERP' : 'نظام ERP'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={['/inventory', '/sales', '/purchasing', '/accounting', '/settings']}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <Dropdown menu={{ items: userMenuItems }} placement="bottomLeft">
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar icon={<UserOutlined />} />
              <span>مدير النظام</span>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ margin: 24, background: '#fff', padding: 24, borderRadius: 8 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}