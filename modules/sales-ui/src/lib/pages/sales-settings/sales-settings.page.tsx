import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography } from 'antd';
import {
  FileTextOutlined,
  SettingOutlined,
  TagsOutlined,
  BarcodeOutlined,
  CarOutlined,
  GiftOutlined,
  FormOutlined,
  SnippetsOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

/* ────── card data ────── */
interface SettingsCard {
  key: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  path?: string;
}

const invoicesAndPayments: SettingsCard[] = [
  {
    key: 'invoice-settings',
    icon: <FileTextOutlined />,
    title: 'إعدادات الفواتير',
    description: 'تحكم في إعداد نموذج الفواتير وكيفية عرضها داخل النظام.',
    path: '/sales/settings/invoices',
  },
  {
    key: 'e-invoice-settings',
    icon: <SettingOutlined />,
    title: 'إعدادات الفاتورة الإلكترونية',
    description: 'قم بإعداد وربط إعدادات الفواتير والإيصالات الإلكترونية مع الهيئة المختصة بالضرائب.',
  },
  {
    key: 'invoice-designs',
    icon: <SnippetsOutlined />,
    title: 'تصميمات الفواتير وعروض الأسعار',
    description: 'صمم وخصص نماذج عرض وطباعة مستندات المبيعات المختلفة.',
    path: '/sales/settings/designs',
  },
  {
    key: 'price-lists',
    icon: <TagsOutlined />,
    title: 'قوائم الأسعار',
    description: 'أنشئ قوائم أسعار مختلفة للمنتجات وقم بإدارتها وتطبيقها حسب العميل أو نوع المعاملة.',
    path: '/sales/settings/price-lists',
  },
  {
    key: 'order-sources',
    icon: <BarcodeOutlined />,
    title: 'مصادر الطلب',
    description: 'أنشئ مصادر طلب مخصصة لتصنيف وتتبع فواتير المبيعات وطلبات وإيصالات نقاط البيع.',
    path: '/sales/settings/order-sources',
  },
  {
    key: 'shipping-options',
    icon: <CarOutlined />,
    title: 'خيارات الشحن',
    description: 'حدد طرق وأسعار الشحن والتوصيل وإعدادات خيار الدفع عند التوصيل.',
    path: '/sales/settings/shipping-options',
  },
  {
    key: 'promotions',
    icon: <GiftOutlined />,
    title: 'العروض',
    description: 'خصّص أنواع العروض الترويجية ومدتها ونسب الخصم وقواعد التطبيق على العملاء.',
    path: '/sales/settings/price-offers',
  },
];

const quotationsCards: SettingsCard[] = [
  {
    key: 'quotation-settings',
    icon: <FormOutlined />,
    title: 'إعدادات عروض الأسعار',
    description: 'اضبط طريقة إنشاء عروض الأسعار وإدارتها وتحويلها إلى فواتير.',
    path: '/sales/settings/price-offers',
  },
];

const ordersCards: SettingsCard[] = [
  {
    key: 'order-settings',
    icon: <ShoppingOutlined />,
    title: 'إعدادات أوامر البيع',
    description: 'تهيئة كيفية إنشاء أوامر البيع، وإدارتها، وتحويلها إلى فواتير.',
    path: '/sales/settings/orders',
  },
];

/* ────── component ────── */
export default function SalesSettingsPage() {
  const navigate = useNavigate();

  return (
    <div dir="rtl" style={{ padding: '24px 16px', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: "'Cairo', 'Tajawal', sans-serif" }}>
      <Card 
        bordered={false} 
        style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
        bodyStyle={{ padding: '24px 32px 40px' }}
      >
        <div style={{ marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0, color: '#001529', fontWeight: 700 }}>إعدادات المبيعات</Title>
          <Text type="secondary">تهيئة وتخصيص إعدادات عمليات البيع والفواتير</Text>
        </div>

        {/* ─── Section: الفواتير والمدفوعات ─── */}
        <SectionTitle>الفواتير والمدفوعات</SectionTitle>
        <CardGrid cards={invoicesAndPayments} onNavigate={navigate} />

        {/* ─── Section: عروض الأسعار ─── */}
        <SectionTitle>عروض الأسعار</SectionTitle>
        <CardGrid cards={quotationsCards} onNavigate={navigate} />

        {/* ─── Section: أوامر البيع ─── */}
        <SectionTitle>أوامر البيع</SectionTitle>
        <CardGrid cards={ordersCards} onNavigate={navigate} />
      </Card>
    </div>
  );
}

/* ────── sub-components ────── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 17,
      fontWeight: 700,
      color: '#001529',
      textAlign: 'right',
      margin: '32px 0 16px',
      paddingBottom: 8,
      borderBottom: '1px solid #dfe3e8',
    }}>
      {children}
    </div>
  );
}

function CardGrid({
  cards,
  onNavigate,
}: {
  cards: SettingsCard[];
  onNavigate: (path: string) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '72px 72px',
    }}>
      {cards.map((card) => {
        const isActive = hovered === card.key;
        return (
          <div
            key={card.key}
            id={`settings-card-${card.key}`}
            onMouseEnter={() => setHovered(card.key)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => card.path && onNavigate(card.path)}
            style={{
              background: '#fafafa',
              borderRadius: 12,
              padding: '24px 18px',
              textAlign: 'center',
              cursor: card.path ? 'pointer' : 'default',
              border: isActive ? '2px solid #001529' : '2px solid transparent',
              boxShadow: isActive ? '0 4px 12px rgba(0,21,41,0.1)' : 'none',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 190,
            }}
          >
            <div style={{ fontSize: 32, color: '#001529', marginBottom: 12 }}>{card.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: '#001529' }}>{card.title}</div>
            <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.7 }}>{card.description}</div>
          </div>
        );
      })}
    </div>
  );
}
