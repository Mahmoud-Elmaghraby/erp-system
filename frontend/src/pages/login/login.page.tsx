import { Form, Input, Button, Card, message } from 'antd';
import { useLogin } from '../../core/hooks/useAuth';

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();

  const onFinish = (values: { email: string; password: string }) => {
    login(values, {
      onError: () => message.error('البريد الإلكتروني أو كلمة المرور غلط'),
    });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <Card title="تسجيل الدخول" style={{ width: 400 }}>
        <Form layout="vertical" onFinish={onFinish} dir="rtl">
          <Form.Item label="البريد الإلكتروني" name="email" rules={[{ required: true, message: 'ادخل البريد الإلكتروني' }]}>
            <Input type="email" />
          </Form.Item>
          <Form.Item label="كلمة المرور" name="password" rules={[{ required: true, message: 'ادخل كلمة المرور' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isPending} block>
              دخول
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}