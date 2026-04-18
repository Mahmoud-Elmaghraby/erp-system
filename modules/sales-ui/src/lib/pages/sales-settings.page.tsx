import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  EditOutlined,
} from '@ant-design/icons';

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
    key: 'invoice-custom-fields',
    icon: <EditOutlined />,
    title: 'حقول الفواتير الإضافية',
    description: 'تحكم في الحقول الإضافية الخاصة بالفواتير بمختلف أنواع الحقول المتاحة و تفاصيلها.',
  },
  {
    key: 'price-lists',
    icon: <TagsOutlined />,
    title: 'قوائم الأسعار',
    description: 'أنشئ قوائم أسعار مختلفة للمنتجات وقم بإدارتها وتطبيقها حسب العميل أو نوع المعاملة.',
  },
  {
    key: 'order-sources',
    icon: <BarcodeOutlined />,
    title: 'مصادر الطلب',
    description: 'أنشئ مصادر طلب مخصصة لتصنيف وتتبع فواتير المبيعات وطلبات وإيصالات نقاط البيع.',
  },
  {
    key: 'shipping-options',
    icon: <CarOutlined />,
    title: 'خيارات الشحن',
    description: 'حدد طرق وأسعار الشحن والتوصيل وإعدادات خيار الدفع عند التوصيل.',
  },
  {
    key: 'promotions',
    icon: <GiftOutlined />,
    title: 'العروض',
    description: 'خصّص أنواع العروض الترويجية ومدتها ونسب الخصم وقواعد التطبيق على العملاء.',
  },
];

const quotationsCards: SettingsCard[] = [
  {
    key: 'quotation-settings',
    icon: <FormOutlined />,
    title: 'إعدادات عروض الأسعار',
    description: 'اضبط طريقة إنشاء عروض الأسعار وإدارتها وتحويلها إلى فواتير.',
  },
];

const ordersCards: SettingsCard[] = [
  {
    key: 'order-settings',
    icon: <ShoppingOutlined />,
    title: 'إعدادات أوامر البيع',
    description: 'تهيئة كيفية إنشاء أوامر البيع، وإدارتها، وتحويلها إلى فواتير.',
  },
];

/* ────── component ────── */
export default function SalesSettingsPage() {
  const navigate = useNavigate();

  return (
    <div dir="rtl" style={{ padding: '24px 32px 40px' }}>
      <h2 style={{ margin: '0 0 24px', fontSize: 20 }}>اعدادات المبيعات</h2>

      {/* ─── Section: الفواتير والمدفوعات ─── */}
      <SectionTitle>الفواتير والمدفوعات</SectionTitle>
      <CardGrid cards={invoicesAndPayments} onNavigate={navigate} />

      {/* ─── Section: عروض الأسعار ─── */}
      <SectionTitle>عروض الأسعار</SectionTitle>
      <CardGrid cards={quotationsCards} onNavigate={navigate} />

      {/* ─── Section: أوامر البيع ─── */}
      <SectionTitle>أوامر البيع</SectionTitle>
      <CardGrid cards={ordersCards} onNavigate={navigate} />
    </div>
  );
}

/* ────── sub-components ────── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 17,
      fontWeight: 600,
      color: '#5b8fa8',
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
              background: '#f4f6f8',
              borderRadius: 8,
              padding: '24px 18px',
              textAlign: 'center',
              cursor: card.path ? 'pointer' : 'default',
              border: isActive ? '2px solid #5b8fa8' : '2px solid transparent',
              boxShadow: isActive ? '0 2px 10px rgba(91,143,168,0.12)' : 'none',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 190,
            }}
          >
            <div style={{ fontSize: 30, color: '#5b8fa8', marginBottom: 12 }}>{card.icon}</div>
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8, color: '#1f2937' }}>{card.title}</div>
            <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.7 }}>{card.description}</div>
          </div>
        );
      })}
    </div>
  );
}
