import {
  Form,
  Input,
  Button,
  ConfigProvider,
  Typography,
} from 'antd';
import { ApartmentOutlined } from '@ant-design/icons';
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

        <div className="erp-login-brand">
          <div className="erp-login-brand-mark" aria-hidden="true">
            <ApartmentOutlined />
          </div>
          <div className="erp-login-brand-text">
            <strong>ERP</strong>
            <span>Nubgha Systems</span>
          </div>
        </div>

        <div className="erp-login-visual-content">
          <Typography.Title level={2} className="erp-login-visual-title">
            منصة ERP متطورة
          </Typography.Title>
          <Typography.Paragraph className="erp-login-visual-subtitle">
            إدارة المبيعات والمخزون والمحاسبة من واجهة واحدة، بسرعة وأمان أعلى.
          </Typography.Paragraph>
        </div>
      </section>

      <section className="erp-login-form-section">
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