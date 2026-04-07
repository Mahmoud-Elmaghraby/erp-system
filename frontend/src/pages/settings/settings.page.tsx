
import { Tabs, Form, Switch, Select, InputNumber, Button, Card, message, Spin } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../core/api/axios.config';

const COMPANY_ID = 'default';

const fetchSettings = async () => {
  const response = await api.get(`/settings/${COMPANY_ID}`);
  return response.data;
};

const updateModuleSettings = async ({ module, values }: { module: string; values: any }) => {
  const response = await api.put(`/settings/${COMPANY_ID}/${module}`, values);
  return response.data;
};

const groupSettings = (settings: any[]) => {
  const groups: Record<string, any[]> = {};
  for (const setting of settings) {
    const group = setting.group || 'عام';
    if (!groups[group]) groups[group] = [];
    groups[group].push(setting);
  }
  return groups;
};

function ModuleSettingsForm({ moduleData }: { moduleData: any }) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const initialValues: Record<string, any> = {};
  for (const setting of moduleData.settings) {
    initialValues[setting.key] = setting.value ?? setting.default;
  }

  const updateMutation = useMutation({
    mutationFn: (values: any) => updateModuleSettings({ module: moduleData.module, values }),
    onSuccess: () => {
      message.success('تم حفظ الإعدادات');
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
    onError: () => message.error('حدث خطأ'),
  });

  const groups = groupSettings(moduleData.settings);

  const renderField = (setting: any) => {
    switch (setting.type) {
      case 'boolean':
        return (
          <Form.Item
            key={setting.key}
            label={setting.label}
            name={setting.key}
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
            label={setting.label}
            name={setting.key}
            tooltip={setting.description}
          >
            <Select options={setting.options?.map((o: any) => ({ label: o.label, value: o.value }))} />
          </Form.Item>
        );
      case 'number':
        return (
          <Form.Item
            key={setting.key}
            label={setting.label}
            name={setting.key}
            tooltip={setting.description}
          >
            <InputNumber style={{ width: '100%' }} min={setting.min} max={setting.max} />
          </Form.Item>
        );
      default:
        return null;
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={updateMutation.mutate}
      dir="rtl"
    >
      {Object.entries(groups).map(([group, settings]) => (
        <Card key={group} title={group} style={{ marginBottom: 16 }}>
          {settings.map(renderField)}
        </Card>
      ))}
      <Button type="primary" htmlType="submit" loading={updateMutation.isPending} size="large">
        حفظ إعدادات {moduleData.label}
      </Button>
    </Form>
  );
}

export default function SettingsPage() {
  const { data: modules, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: fetchSettings,
  });

  if (isLoading) return <Spin size="large" />;

  const tabItems = modules?.map((mod: any) => ({
    key: mod.module,
    label: mod.label,
    children: <ModuleSettingsForm moduleData={mod} />,
  })) || [];

  return (
    <div dir="rtl">
      <h2>إعدادات النظام</h2>
      <Tabs items={tabItems} tabPosition="right" />
    </div>
  );
}