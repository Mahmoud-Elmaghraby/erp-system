import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, ConfigProvider, Spin, Divider, Popconfirm } from 'antd';
import { 
  UpOutlined, 
  DownOutlined, 
  EditOutlined,
  DeleteOutlined,
  FlagFilled,
  ArrowRightOutlined
} from '@ant-design/icons';
import { useWarehouse, useWarehouses, useDeleteWarehouse } from '../../hooks/useWarehouses';

export default function WarehouseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: warehouse, isLoading } = useWarehouse(id as string);
  const { data: allWarehouses } = useWarehouses();
  const deleteMutation = useDeleteWarehouse();
  const [activeTab, setActiveTab] = useState('details');

  const handleDelete = () => {
    deleteMutation.mutate(id as string, {
      onSuccess: () => navigate('/inventory/warehouses')
    });
  };

  // Prev/Next navigation
  const warehouseList = Array.isArray(allWarehouses) ? allWarehouses : [];
  const currentIndex = warehouseList.findIndex((w: any) => w.id === id);
  const prevWarehouse = currentIndex > 0 ? warehouseList[currentIndex - 1] : null;
  const nextWarehouse = currentIndex < warehouseList.length - 1 ? warehouseList[currentIndex + 1] : null;

  if (isLoading) {
    return <div style={{ padding: 40, textAlign: 'center' }}><Spin size="large" /></div>;
  }

  if (!warehouse) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
        <p>لم يتم العثور على المخزن</p>
        <Button type="primary" onClick={() => navigate('/inventory/warehouses')}>
          العودة للقائمة
        </Button>
      </div>
    );
  }

  const wh = warehouse;

  const getPermissionLabel = (val: string) => {
    switch(val) {
      case 'all': return 'الكل';
      case 'specific_employee': return 'موظف محدد';
      case 'specific_role': return 'دور وظيفي محدد';
      case 'specific_branch': return 'فرع محدد';
      default: return 'الكل';
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "'Cairo', 'Tajawal', sans-serif",
          colorPrimary: '#3b82f6',
        }
      }}
    >
      <div dir="rtl" style={{ minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
        
        {/* Top Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          backgroundColor: '#ffffff',
          padding: '16px 24px',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button 
              icon={<ArrowRightOutlined />} 
              type="text"
              onClick={() => navigate('/inventory/warehouses')}
              style={{ color: '#64748b' }}
            />
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>
              {wh.name}
            </span>
            
            {(wh.isActive || wh.isPrimary) && (
              <>
                <Divider type="vertical" style={{ height: '24px', backgroundColor: '#e2e8f0', margin: 0 }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {wh.isActive && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                      <span style={{ fontWeight: 600, color: '#475569', fontSize: '14px' }}>نشط</span>
                    </div>
                  )}
                  {!wh.isActive && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                      <span style={{ fontWeight: 600, color: '#475569', fontSize: '14px' }}>غير نشط</span>
                    </div>
                  )}
                  {wh.isPrimary && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FlagFilled style={{ color: '#3b82f6', fontSize: '14px' }} />
                      <span style={{ fontWeight: 600, color: '#475569', fontSize: '14px' }}>رئيسي</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div style={{ display: 'flex', gap: '4px' }}>
            <Button 
              icon={<DownOutlined />} 
              disabled={!nextWarehouse}
              onClick={() => nextWarehouse && navigate(`/inventory/warehouses/${nextWarehouse.id}`)}
              style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0', color: nextWarehouse ? '#475569' : '#94a3b8' }} 
            />
            <Button 
              icon={<UpOutlined />} 
              disabled={!prevWarehouse}
              onClick={() => prevWarehouse && navigate(`/inventory/warehouses/${prevWarehouse.id}`)}
              style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0', color: prevWarehouse ? '#475569' : '#94a3b8' }} 
            />
          </div>
        </div>

        {/* Action Bar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-start',
          backgroundColor: '#ffffff',
          padding: '12px 24px',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button 
              icon={<EditOutlined />} 
              onClick={() => navigate(`/inventory/warehouses/${wh.id}/edit`)}
              style={{ fontWeight: 600, color: '#475569', borderColor: '#cbd5e1' }}
            >
              تعديل
            </Button>
            <Popconfirm
              title="هل أنت متأكد من حذف المخزن؟"
              description="سيتم حذف المخزن وكل المخزون المرتبط به."
              onConfirm={handleDelete}
              okText="نعم"
              cancelText="لا"
            >
              <Button 
                icon={<DeleteOutlined />} 
                danger
                style={{ fontWeight: 600 }}
                loading={deleteMutation.isPending}
              >
                حذف
              </Button>
            </Popconfirm>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: '8px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            overflow: 'hidden'
          }}>
            
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '32px', padding: '0 24px', borderBottom: '1px solid #e2e8f0' }}>
              <div 
                onClick={() => setActiveTab('details')}
                style={{
                  padding: '16px 0',
                  cursor: 'pointer',
                  fontWeight: activeTab === 'details' ? 700 : 500,
                  color: activeTab === 'details' ? '#3b82f6' : '#64748b',
                  borderBottom: activeTab === 'details' ? '2px solid #3b82f6' : '2px solid transparent',
                  fontSize: '15px'
                }}
              >
                التفاصيل
              </div>
              <div 
                onClick={() => setActiveTab('activity')}
                style={{
                  padding: '16px 0',
                  cursor: 'pointer',
                  fontWeight: activeTab === 'activity' ? 700 : 500,
                  color: activeTab === 'activity' ? '#3b82f6' : '#64748b',
                  borderBottom: activeTab === 'activity' ? '2px solid #3b82f6' : '2px solid transparent',
                  fontSize: '15px'
                }}
              >
                سجل النشاطات
              </div>
            </div>

            {/* Details Content */}
            {activeTab === 'details' && (
              <div style={{ paddingBottom: '40px' }}>
                
                {/* Section 1: Warehouse Information */}
                <div style={{ 
                  backgroundColor: '#f8fafc', 
                  padding: '12px 24px', 
                  fontWeight: 700, 
                  color: '#475569',
                  fontSize: '14px',
                  borderTop: '1px solid #e2e8f0',
                  borderBottom: '1px solid #e2e8f0',
                  marginTop: '16px'
                }}>
                  معلومات المخزن
                </div>
                
                <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                  {/* Right Column */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>الاسم</div>
                      <div style={{ color: '#1e293b', fontWeight: 600, fontSize: '15px' }}>{wh.name}</div>
                    </div>
                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>عنوان الشحن</div>
                      <div style={{ color: '#1e293b', fontWeight: 600, fontSize: '15px' }}>{wh.address || '-'}</div>
                    </div>
                  </div>
                  
                  {/* Left Column */}
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>الحالة</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ 
                          width: '8px', height: '8px', borderRadius: '50%', 
                          backgroundColor: wh.isActive ? '#22c55e' : '#ef4444' 
                        }} />
                        <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>
                          {wh.isActive ? 'نشط' : 'غير نشط'}
                        </span>
                      </div>
                      {wh.isPrimary && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FlagFilled style={{ color: '#3b82f6', fontSize: '14px' }} />
                          <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>رئيسي</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 2: Permissions */}
                <div style={{ 
                  backgroundColor: '#f8fafc', 
                  padding: '12px 24px', 
                  fontWeight: 700, 
                  color: '#475569',
                  fontSize: '14px',
                  borderTop: '1px solid #e2e8f0',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  الصلاحيات
                </div>

                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>عرض</div>
                    <div style={{ color: '#1e293b', fontWeight: 600, fontSize: '15px' }}>
                      {getPermissionLabel(wh.permissions?.view)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>إنشاء فاتورة</div>
                    <div style={{ color: '#1e293b', fontWeight: 600, fontSize: '15px' }}>
                      {getPermissionLabel(wh.permissions?.createInvoice)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>تعديل المخازن</div>
                    <div style={{ color: '#1e293b', fontWeight: 600, fontSize: '15px' }}>
                      {getPermissionLabel(wh.permissions?.updateStock)}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'activity' && (
              <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                لا توجد نشاطات مسجلة
              </div>
            )}

          </div>
        </div>

      </div>
    </ConfigProvider>
  );
}
