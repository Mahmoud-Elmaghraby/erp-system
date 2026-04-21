import {
  Form,
  Input,
  Button,
  ConfigProvider,
  Typography,
} from 'antd';
import { useLogin } from '../../core/hooks/use-login.hook';
import './login.page.css';

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();

  const handleSubmit = ({ email, password }: LoginFormValues) => {
    login({ email, password });
  };

  return (
    <div className="erp-login-page">
      <section className="erp-login-visual">
        <div className="erp-login-overlay" />

      </section>

      <section className="erp-login-form-section">
        <div className="erp-login-logo-container">
          <span className="erp-login-typographic-logo">ussol</span>
        </div>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#1890ff',
              borderRadius: 10,
            },
            components: {
              Input: {
                colorBgContainer: '#1f1f1f',
                colorBorder: '#595959',
                colorText: '#f5f5f5',
                colorTextPlaceholder: '#8c8c8c',
                activeBorderColor: '#1890ff',
                hoverBorderColor: '#6b6b6b',
              },
            },
          }}
        >
          <div className="erp-login-form-card">
            <Typography.Title level={2} className="erp-login-form-title">
              تسجيل الدخول
            </Typography.Title>

            <Form<LoginFormValues>
              layout="vertical"
              requiredMark
              onFinish={handleSubmit}
            >
              <Form.Item
                label="البريد الإلكتروني"
                name="email"
                rules={[
                  { required: true, message: 'ادخل البريد الإلكتروني' },
                  { type: 'email', message: 'بريد إلكتروني غير صحيح' },
                ]}
              >
                <Input type="email" size="large" placeholder="name@company.com" />
              </Form.Item>

              <Form.Item
                label="كلمة المرور"
                name="password"
                rules={[{ required: true, message: 'ادخل كلمة المرور' }]}
              >
                <Input.Password size="large" placeholder="••••••••" />
              </Form.Item>

              <Form.Item style={{ marginTop: 18, marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isPending}
                  block
                  size="large"
                  className="erp-login-submit"
                >
                  دخول
                </Button>
              </Form.Item>
            </Form>
          </div>
        </ConfigProvider>

        <div className="erp-login-copyright">© 2026 جميع الحقوق محفوظة</div>
      </section>
    </div>
  );
}