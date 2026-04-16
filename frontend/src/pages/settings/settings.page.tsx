import { Tabs, Form, Switch, Select, InputNumber, Button, Card, Spin, message } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { moduleSettingsApi } from '../../core/api/core.api';

function ModuleSettingsForm({ moduleData }: { moduleData: any }) {
  const [form] = Form.useForm();
  const qc = useQueryClient();

  const initialValues: Record<string, any> = {};
  for (const setting of moduleData.settings) {
    initialValues[setting.key] = setting.value ?? setting.default;
  }

  const update = useMutation({
    mutationFn: (values: any) => moduleSettingsApi.update(moduleData.module, values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['module-settings'] });
      message.success(`تم حفظ إعدادات ${moduleData.label}`);
    },
    onError: () => message.error('حدث خطأ'),
  });

  const renderField = (setting: any) => {
    switch (setting.type) {
      case 'boolean':
        return (
          <Form.Item
            key={setting.key}
            name={setting.key}
            label={setting.label}
            valuePropName="checked"
            tooltip={setting.description}
          >
            <Switch />
          </Form.Item>
        );
      case 'select':
        return (
          <Form.Item
            key={setting.key}
            name={setting.key}
            label={setting.label}
            tooltip={setting.description}
          >
            <Select
              style={{ maxWidth: 300 }}
              options={setting.options?.map((o: any) => ({ label: o.label, value: o.value }))}
            />
          </Form.Item>
        );
      case 'number':
        return (
          <Form.Item
            key={setting.key}
            name={setting.key}
            label={setting.label}
            tooltip={setting.description}
          >
            <InputNumber
              style={{ width: '100%', maxWidth: 200 }}
              min={setting.min}
              max={setting.max}
            />
          </Form.Item>
        );
      default:
        return null;
    }
  };

  const groups = moduleData.settings.reduce((acc: any, s: any) => {
    const group = s.group || 'عام';
    if (!acc[group]) acc[group] = [];
    acc[group].push(s);
    return acc;
  }, {});

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={(v) => update.mutate(v)}
    >
      {Object.entries(groups).map(([group, settings]: any) => (
        <Card key={group} title={group} style={{ marginBottom: 16 }}>
          {settings.map(renderField)}
        </Card>
      ))}
      <Button type="primary" htmlType="submit" loading={update.isPending} size="large">
        حفظ إعدادات {moduleData.label}
      </Button>
    </Form>
  );
}

export default function SettingsPage() {
  const { data: modules, isLoading } = useQuery({
    queryKey: ['module-settings'],
    queryFn: moduleSettingsApi.getAll,
  });

  if (isLoading) return (
    <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />
  );

  const tabItems = modules?.map((mod: any) => ({
    key: mod.module,
    label: mod.label,
    children: <ModuleSettingsForm moduleData={mod} />,
  })) || [];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>إعدادات الموديولات</h2>
      <Tabs items={tabItems} tabPosition="right" />
    </div>
  );
}