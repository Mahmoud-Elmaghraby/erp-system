import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, Typography, Button, Table, Select, Switch, Space, Input 
} from 'antd';
import {
  SaveOutlined,
  CloseOutlined,
  PlusOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Option } = Select;

interface OrderSource {
  id: string;
  name: string;
  status: string;
}

export default function OrderSourcesPage() {
  const navigate = useNavigate();

  const [sources, setSources] = useState<OrderSource[]>([]);
  const [isMandatory, setIsMandatory] = useState(false);

  const columns: ColumnsType<OrderSource> = [
    {
      title: 'الاسم *',
      dataIndex: 'name',
      key: 'name',
      align: 'right',
      render: (text) => <Input value={text} placeholder="الاسم" bordered={false} />
    },
    {
      title: 'الحالة',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: '30%',
      render: (status) => (
        <Select defaultValue={status} bordered={false} style={{ width: '100%' }}>
          <Option value="active">نشط</Option>
          <Option value="inactive">غير نشط</Option>
        </Select>
      )
    }
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
        >
          حفظ
        </Button>
        <Button 
          size="large" 
          icon={<CloseOutlined />} 
          style={{ borderColor: '#001529', color: '#001529', borderRadius: 4, fontWeight: 'bold', padding: '0 24px' }}
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
              dataSource={sources} 
              columns={columns} 
              rowKey="id" 
              pagination={false}
              bordered
              size="small"
              locale={{ emptyText: ' ' }}
              components={{
                header: {
                  cell: (props: any) => <th {...props} style={{ backgroundColor: '#f8fafc', color: '#64748b', fontWeight: 'normal' }} />
                }
              }}
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
                  onClick={() => setSources([...sources, { id: Date.now().toString(), name: '', status: 'active' }])}
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
                defaultValue="none"
              >
                <Option value="none">[لا افتراضي]</Option>
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