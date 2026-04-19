import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Form, Input, Select, Checkbox, Button, Space, Card, Row, Col } from 'antd';
import { 
  ChartOfAccount, AccountCategory, NormalBalance, AccountRole, CreateAccountPayload
} from '../../../types/chart-of-accounts.types';
import { useCreateAccount, useUpdateAccount } from '../../../hooks/use-chart-of-accounts';

interface AccountFormProps {
  initialData?: ChartOfAccount | null; 
  parentId?: string | null; 
  onSuccess: () => void;
  onCancel: () => void;
}

export const AccountForm: React.FC<AccountFormProps> = ({ initialData, parentId, onSuccess, onCancel }) => {
  const isEditMode = !!initialData;
  const { mutate: createAccount, isPending: isCreating } = useCreateAccount();
  const { mutate: updateAccount, isPending: isUpdating } = useUpdateAccount();
  const isPending = isCreating || isUpdating;

  const { handleSubmit, control, reset, formState: { errors } } = useForm<CreateAccountPayload>({
    defaultValues: {
      code: '', name: '', category: AccountCategory.ASSET, normalBalance: NormalBalance.DEBIT, isGroup: false, parentId: parentId || undefined,
    }
  });

useEffect(() => {
    if (isEditMode && initialData) {
      reset({
        code: initialData.code,
        name: initialData.name,
        category: initialData.category,
        normalBalance: initialData.normalBalance,
        isGroup: initialData.isGroup,
        // السر هنا: بنحول الـ null لـ undefined
        role: initialData.role || undefined, 
        parentId: initialData.parentId || undefined,
      });
    } else {
      reset({ parentId: parentId || undefined });
    }
  }, [isEditMode, initialData, parentId, reset]);

  const onSubmit = (data: CreateAccountPayload) => {
    if (isEditMode && initialData) {
      updateAccount({ id: initialData.id, data }, { onSuccess });
    } else {
      createAccount(data, { onSuccess });
    }
  };

  return (
    <Card title={isEditMode ? 'تعديل الحساب' : 'إضافة حساب جديد'}>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="كود الحساب" validateStatus={errors.code ? 'error' : ''} help={errors.code?.message}>
              <Controller
                name="code" control={control} rules={{ required: 'كود الحساب مطلوب' }}
                render={({ field }: any) => <Input {...field} disabled={isEditMode} placeholder="مثال: 1001" />}
              />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item label="اسم الحساب" validateStatus={errors.name ? 'error' : ''} help={errors.name?.message}>
              <Controller
                name="name" control={control} rules={{ required: 'اسم الحساب مطلوب' }}
                render={({ field }: any) => <Input {...field} placeholder="مثال: البنك الأهلي" />}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="تصنيف الحساب">
              <Controller
                name="category" control={control}
                render={({ field }: any) => (
                  <Select {...field} options={[
                    { label: 'أصول (Asset)', value: AccountCategory.ASSET },
                    { label: 'خصوم (Liability)', value: AccountCategory.LIABILITY },
                    { label: 'حقوق ملكية (Equity)', value: AccountCategory.EQUITY },
                    { label: 'إيرادات (Revenue)', value: AccountCategory.REVENUE },
                    { label: 'مصروفات (Expense)', value: AccountCategory.EXPENSE },
                  ]} />
                )}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="طبيعة الحساب (Normal Balance)">
              <Controller
                name="normalBalance" control={control}
                render={({ field }: any) => (
                  <Select {...field} options={[
                    { label: 'مدين (Debit)', value: NormalBalance.DEBIT },
                    { label: 'دائن (Credit)', value: NormalBalance.CREDIT },
                  ]} />
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16} align="middle">
          <Col span={12}>
            <Form.Item label="دور الحساب (اختياري)">
              <Controller
                name="role" control={control}
                render={({ field }: any) => (
                  <Select {...field} allowClear placeholder="بدون دور مخصص" options={[
                    { label: 'صندوق (Cash)', value: AccountRole.CASH },
                    { label: 'بنك (Bank)', value: AccountRole.BANK },
                    { label: 'عملاء (AR)', value: AccountRole.ACCOUNTS_RECEIVABLE },
                    { label: 'موردين (AP)', value: AccountRole.ACCOUNTS_PAYABLE },
                  ]} />
                )}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item valuePropName="checked">
              <Controller
                name="isGroup" control={control}
                render={({ field: { value, onChange } }: any) => (
                  <Checkbox checked={value} onChange={e => onChange(e.target.checked)}>
                    هذا الحساب تجميعي (Group Account)
                  </Checkbox>
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ marginTop: '1rem', marginBottom: 0 }}>
          <Space>
            <Button type="primary" htmlType="submit" loading={isPending}>حفظ البيانات</Button>
            <Button onClick={onCancel} disabled={isPending}>إلغاء</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};