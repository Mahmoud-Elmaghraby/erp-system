import { useEffect, useState } from 'react';
import { Card, Button, Table, Select, Switch, Input } from 'antd';
import { SaveOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  useOrderSourcesConfig,
  useSaveOrderSourcesConfig,
} from '../../../hooks/useOrderSources';

const { Option } = Select;

interface OrderSource {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

export default function OrderSourcesPage() {
  const { data, isLoading } = useOrderSourcesConfig();
  const saveOrderSources = useSaveOrderSourcesConfig();

  const [sources, setSources] = useState<OrderSource[]>([]);
  const [isMandatory, setIsMandatory] = useState(false);
  const [defaultSourceId, setDefaultSourceId] = useState<string>('none');

  useEffect(() => {
    const loadedSources = data?.sources ?? [];
    setSources(loadedSources);
    setIsMandatory(Boolean(data?.isMandatory));
    setDefaultSourceId(data?.defaultSourceId ?? 'none');
  }, [data]);

  const updateSource = (id: string, patch: Partial<OrderSource>) => {
    setSources((prev) => prev.map((source) => (source.id === id ? { ...source, ...patch } : source)));
  };

  const handleSave = async () => {
    await saveOrderSources.mutateAsync({
      sources: sources.map((source) => ({
        id: source.id.startsWith('tmp-') ? undefined : source.id,
        name: source.name,
        status: source.status,
      })),
      defaultSourceId: defaultSourceId === 'none' ? null : defaultSourceId,
      isMandatory,
    });
  };

  const handleCancel = () => {
    const loadedSources = (data?.sources ?? []) as OrderSource[];
    setSources(loadedSources);
    setIsMandatory(Boolean(data?.isMandatory));
    setDefaultSourceId(data?.defaultSourceId ?? 'none');
  };

  const columns: ColumnsType<OrderSource> = [
    {
      title: 'الاسم *',
      dataIndex: 'name',
      key: 'name',
      align: 'right',
      render: (text: string, record: OrderSource) => (
        <Input
          value={text}
          placeholder="الاسم"
          bordered={false}
          onChange={(e) => updateSource(record.id, { name: e.target.value })}
        />
      ),
    },
    {
      title: 'الحالة',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: '30%',
      render: (status: OrderSource['status'], record: OrderSource) => (
        <Select
          value={status}
          bordered={false}
          style={{ width: '100%' }}
          onChange={(value: OrderSource['status']) => updateSource(record.id, { status: value })}
        >
          <Option value="active">نشط</Option>
          <Option value="inactive">غير نشط</Option>
        </Select>
      ),
    },
  ];

  return (
    <div dir="rtl" style={{ backgroundColor: '#eef2f6', minHeight: '100vh', fontFamily: "'Cairo', 'Tajawal', sans-serif" }}>
      
      {/* Top Bar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-start', // Place buttons on the left in RTL
        backgroundColor: '#fff', 
        padding: '12px 24px', 
        borderBottom: '1px solid #e0e0e0',
        marginBottom: 24,
        gap: 8
      }}>
        <Button 
          size="large" 
          type="primary" 
          style={{ backgroundColor: '#001529', borderColor: '#001529', borderRadius: 4, fontWeight: 'bold', padding: '0 24px' }} 
          icon={<SaveOutlined />}
          loading={saveOrderSources.isPending}
          onClick={handleSave}
        >
          حفظ
        </Button>
        <Button 
          size="large" 
          icon={<CloseOutlined />} 
          style={{ borderColor: '#001529', color: '#001529', borderRadius: 4, fontWeight: 'bold', padding: '0 24px' }}
          onClick={handleCancel}
        >
          إلغاء
        </Button>
      </div>

      <div style={{ padding: '0 24px', maxWidth: 1000, margin: '0 auto' }}>
        <Card 
          bordered={false} 
          style={{ borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          headStyle={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #f1f5f9', padding: '0 24px' }}
          bodyStyle={{ padding: 24 }}
          title={<span style={{ color: '#0f172a', fontSize: 16 }}>مصادر الطلب</span>}
        >
          
          <div style={{ marginBottom: 32 }}>
            <div style={{ textAlign: 'right', marginBottom: 8, color: '#475569', fontSize: 14 }}>المصادر</div>
            <Table 
              loading={isLoading}
              dataSource={sources} 
              columns={columns} 
              rowKey="id" 
              pagination={false}
              bordered
              size="small"
              locale={{ emptyText: ' ' }}
              footer={() => (
                <div 
                  style={{ 
                    backgroundColor: '#e6f4ff', 
                    padding: '8px 16px', 
                    cursor: 'pointer', 
                    color: '#001529', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 8,
                    fontWeight: 'bold'
                  }}
                  onClick={() =>
                    setSources([
                      ...sources,
                      { id: `tmp-${Date.now().toString()}`, name: '', status: 'active' },
                    ])
                  }
                >
                  <PlusOutlined style={{ color: '#001529' }} /> إضافة
                </div>
              )}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', gap: 16 }}>
            <div style={{ width: '400px' }}>
              <div style={{ marginBottom: 8, textAlign: 'right', color: '#64748b', fontSize: 14 }}>مصدر الطلب الافتراضي</div>
              <Select 
                size="large"
                style={{ width: '100%' }} 
                value={defaultSourceId}
                onChange={(value) => setDefaultSourceId(value)}
              >
                <Option value="none">[لا افتراضي]</Option>
                {sources.map((source) => (
                  <Option key={source.id} value={source.id}>{source.name || 'بدون اسم'}</Option>
                ))}
              </Select>
            </div>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              backgroundColor: '#f8fafc', 
              padding: '8px 16px', 
              height: 40,
              gap: 12,
              borderRadius: 4
            }}>
              <span style={{ color: '#475569', fontSize: 14 }}>إلزامي</span>
              <Switch checked={isMandatory} onChange={setIsMandatory} style={{ backgroundColor: isMandatory ? '#001529' : undefined }} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}