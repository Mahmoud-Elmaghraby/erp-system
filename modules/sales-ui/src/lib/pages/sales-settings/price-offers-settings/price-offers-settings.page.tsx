import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Form, Input, Select, InputNumber, Row, Col, Checkbox, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SaveOutlined, PlusOutlined, ArrowRightOutlined, FileExclamationOutlined } from '@ant-design/icons';
import { useCreatePriceOffer, usePriceOffers } from '../../../hooks/usePriceOffers';

const { Title } = Typography;


interface OfferRecord {
  id: string;
  name: string;
  validFrom?: string | null;
  validTo?: string | null;
  discountValue: number;
  isActive: boolean;
}

export default function PriceOffersSettingsPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isAdding, setIsAdding] = useState(false);
  const { data: offers = [], isLoading } = usePriceOffers();
  const createPriceOffer = useCreatePriceOffer();

  const columns: ColumnsType<OfferRecord> = [
    {
      title: 'الاسم',
      dataIndex: 'name',
      key: 'name',
      align: 'right',
    },
    {
      title: 'صالح من',
      dataIndex: 'validFrom',
      key: 'validFrom',
      align: 'center',
      render: (value) => value || '-',
    },
    {
      title: 'صالح حتى',
      dataIndex: 'validTo',
      key: 'validTo',
      align: 'center',
      render: (value) => value || '-',
    },
    {
      title: 'قيمة الخصم',
      dataIndex: 'discountValue',
      key: 'discountValue',
      align: 'center',
      render: (value) => value ?? 0,
    },
    {
      title: 'الحالة',
      dataIndex: 'isActive',
      key: 'isActive',
      align: 'center',
      render: (value) => (value ? 'نشط' : 'غير نشط'),
    },
  ];

  const startAdding = () => {
    form.resetFields();
    form.setFieldsValue({
      requiredQty: 0,
      isActive: true,
      type: 'item-discount',
      discountType: 'fixed',
      unitType: 'all',
    });
    setIsAdding(true);
  };

  const handleSaveOffer = async () => {
    const values = await form.validateFields();

    const normalizeDate = (value?: string): string | undefined => {
      if (!value) {
        return undefined;
      }

      const isIsoDate = /^\d{4}-\d{2}-\d{2}$/.test(value);
      return isIsoDate ? value : undefined;
    };

    await createPriceOffer.mutateAsync({
      name: values.name,
      validFrom: normalizeDate(values.validFrom),
      validTo: normalizeDate(values.validTo),
      requiredQty: Number(values.requiredQty || 0),
      type: values.type,
      discountValue: Number(values.discountValue || 0),
      discountType: values.discountType,
      customerScope: values.customer,
      unitType: values.unitType,
      isActive: Boolean(values.isActive),
    });

    setIsAdding(false);
    form.resetFields();
  };

  if (!isAdding) {
    return (
      <div dir="rtl" style={{ padding: '24px 16px', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: "'Cairo', 'Tajawal', sans-serif" }}>
        <Card
          bordered={false}
          style={{ borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          bodyStyle={{ padding: 0 }}
        >
          <div style={{ backgroundColor: '#edf1f5', borderBottom: '1px solid #dbe3ec', minHeight: 22 }} />

          <div style={{ padding: '32px 16px' }}>
            {offers.length === 0 ? (
              <div style={{ minHeight: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#001529', fontSize: 22, fontWeight: 700, marginBottom: 20 }}>
                      لم يتم إضافة أي سجلات بعد
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                      <Button
                        type="link"
                        icon={<ArrowRightOutlined />}
                        onClick={() => navigate('/sales/settings')}
                        style={{ color: '#1677ff', fontSize: 16, height: 'auto', padding: 0 }}
                      >
                        الانتقال إلى الصفحة السابقة
                      </Button>
                      <Button
                        type="link"
                        icon={<PlusOutlined />}
                        onClick={startAdding}
                        style={{ color: '#001529', fontSize: 16, height: 'auto', padding: 0 }}
                      >
                        أضف عرض
                      </Button>
                    </div>
                  </div>

                  <FileExclamationOutlined style={{ color: '#94a3b8', fontSize: 96 }} />
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={startAdding}
                    style={{ backgroundColor: '#001529', borderColor: '#001529', borderRadius: 4, fontWeight: 'bold' }}
                  >
                    أضف عرض
                  </Button>
                </div>

                <Table loading={isLoading} columns={columns} dataSource={offers} rowKey="id" pagination={false} />
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div dir="rtl" style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: "'Cairo', 'Tajawal', sans-serif" }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fff',
          padding: '12px 24px',
          borderBottom: '1px solid #e0e0e0',
          marginBottom: 20,
        }}
      >
        <Title level={3} style={{ margin: 0, color: '#001529', fontWeight: 700 }}>
          أضف عرض
        </Title>

        <Button
          size="large"
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSaveOffer}
          loading={createPriceOffer.isPending}
          style={{ backgroundColor: '#001529', borderColor: '#001529', borderRadius: 4, fontWeight: 'bold', padding: '0 24px' }}
        >
          حفظ
        </Button>
      </div>

      <div style={{ padding: '0 24px 24px' }}>
        <Form form={form} layout="vertical">
          <Card
            bordered={false}
            style={{ borderRadius: 0, border: '1px solid #d8dee7', marginBottom: 16 }}
            bodyStyle={{ padding: 0 }}
          >
            <div style={{ backgroundColor: '#edf1f5', borderBottom: '1px solid #d8dee7', padding: '14px 20px', textAlign: 'right' }}>
              <span style={{ color: '#7a80b0', fontSize: 16, fontWeight: 700 }}>تفاصيل العرض</span>
            </div>

            <div style={{ padding: '16px 10px 6px' }}>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="name"
                    label={<span style={{ color: '#7a80b0', fontSize: 14, fontWeight: 700 }}>الاسم</span>}
                    rules={[{ required: true, message: 'يرجى إدخال الاسم' }]}
                  >
                    <Input size="large" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="validFrom" label={<span style={{ color: '#7a80b0', fontSize: 14, fontWeight: 700 }}>صالح من</span>}>
                    <Input size="large" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="validTo" label={<span style={{ color: '#7a80b0', fontSize: 14, fontWeight: 700 }}>صالح حتى</span>}>
                    <Input size="large" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="requiredQty"
                    label={<span style={{ color: '#7a80b0', fontSize: 14, fontWeight: 700 }}>الكمية المطلوبة لتطبيق العرض</span>}
                  >
                    <InputNumber size="large" style={{ width: '100%' }} min={0} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="type"
                    label={<span style={{ color: '#7a80b0', fontSize: 14, fontWeight: 700 }}>النوع</span>}
                  >
                    <Select
                      size="large"
                      options={[{ label: 'خصم على البند', value: 'item-discount' }]}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="discountValue"
                    label={<span style={{ color: '#7a80b0', fontSize: 14, fontWeight: 700 }}>قيمة الخصم</span>}
                    rules={[{ required: true, message: 'يرجى إدخال قيمة الخصم' }]}
                  >
                    <InputNumber size="large" style={{ width: '100%' }} min={0} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="discountType"
                    label={<span style={{ color: '#7a80b0', fontSize: 14, fontWeight: 700 }}>نوع الخصم</span>}
                  >
                    <Select
                      size="large"
                      options={[{ label: 'خصم حقيقي', value: 'fixed' }]}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="customer" label={<span style={{ color: '#7a80b0', fontSize: 14, fontWeight: 700 }}>العملاء</span>}>
                    <Select
                      size="large"
                      options={[{ label: 'الكل', value: 'all' }]}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="isActive" valuePropName="checked" style={{ marginTop: 36 }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Checkbox style={{ color: '#7a80b0', fontSize: 14, fontWeight: 700 }}>نشط</Checkbox>
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Card>

          <Card
            bordered={false}
            style={{ borderRadius: 0, border: '1px solid #d8dee7' }}
            bodyStyle={{ padding: 0 }}
          >
            <div style={{ backgroundColor: '#edf1f5', borderBottom: '1px solid #d8dee7', padding: '14px 20px', textAlign: 'right' }}>
              <span style={{ color: '#7a80b0', fontSize: 16, fontWeight: 700 }}>تفاصيل وحدات العرض</span>
            </div>

            <div style={{ padding: '16px 10px 10px' }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="unitType"
                    label={<span style={{ color: '#7a80b0', fontSize: 14, fontWeight: 700 }}>نوع الوحدة</span>}
                  >
                    <Select size="large" options={[{ label: 'الكل', value: 'all' }]} />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Card>
        </Form>
      </div>
    </div>
  );
}