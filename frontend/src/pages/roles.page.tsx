import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Tag, Drawer, Checkbox, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, KeyOutlined } from '@ant-design/icons';
import {
  useAssignPermission, useCreateRole, usePermissions,
  useRemovePermission, useRoles,
} from '../core/hooks/use-rbac.hook';

export default function RolesPage() {
  const [open, setOpen] = useState(false);
  const [permDrawer, setPermDrawer] = useState<{ open: boolean; role: any }>({
    open: false, role: null,
  });
  const [form] = Form.useForm();

  const { data: rolesData, isLoading } = useRoles();
  const roles = rolesData?.data ?? [];  // ✅ paginated response

  const { data: permissions } = usePermissions();
  const createRole = useCreateRole();
  const assignPermission = useAssignPermission();
  const removePermission = useRemovePermission();

  const handleSubmit = async (values: any) => {
    await createRole.mutateAsync(values);
    setOpen(false);
    form.resetFields();
  };

  const currentRole = roles.find((r: any) => r.id === permDrawer.role?.id);
const currentPermIds =
  currentRole?.rolePermissions?.map((rp: any) => rp.permission.id) ?? [];

  const handleTogglePermission = async (permId: string, checked: boolean) => {
    if (checked) {
      await assignPermission.mutateAsync({ roleId: permDrawer.role.id, permissionId: permId });
    } else {
      await removePermission.mutateAsync({ roleId: permDrawer.role.id, permissionId: permId });
    }
  };

  const groupedPermissions = (permissions ?? []).reduce((acc: any, perm: any) => {
    if (!acc[perm.module]) acc[perm.module] = [];
    acc[perm.module].push(perm);
    return acc;
  }, {});

  const columns = [
    { title: 'اسم الدور', dataIndex: 'name', key: 'name' },
    {
      title: 'الوصف', dataIndex: 'description', key: 'description',
      render: (v: string) => v || '—',
    },
    {
      title: 'عدد الصلاحيات', key: 'perms',
      render: (_: any, r: any) => (
        <Tag color="blue">{r.rolePermissions?.length ?? 0}</Tag>
      ),
    },
    {
      title: 'عدد المستخدمين', key: 'users',
      render: (_: any, r: any) => (
        <Tag color="green">{r._count?.userRoles ?? 0}</Tag>
      ),
    },
    {
      title: 'إجراءات', key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button
            icon={<KeyOutlined />}
            size="small"
            onClick={() => setPermDrawer({ open: true, role: record })}
          >
            الصلاحيات
          </Button>
          <Popconfirm title="تأكيد التعطيل؟" onConfirm={() => {}}>
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>الأدوار والصلاحيات</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          دور جديد
        </Button>
      </div>

      <Table
        dataSource={roles}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{
          total: rolesData?.meta?.total,
          pageSize: rolesData?.meta?.limit,
          current: rolesData?.meta?.page,
        }}
      />

      <Modal
        title="دور جديد"
        open={open}
        onCancel={() => { setOpen(false); form.resetFields(); }}
        onOk={() => form.submit()}
        confirmLoading={createRole.isPending}
        okText="حفظ"
        cancelText="إلغاء"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="اسم الدور" rules={[{ required: true, message: 'مطلوب' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="الوصف">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
  title={`صلاحيات: ${permDrawer.role?.name}`}
  open={permDrawer.open}
  onClose={() => setPermDrawer({ open: false, role: null })}
  width={400}
>
  {Object.entries(groupedPermissions).map(([module, perms]: any) => (
    <div key={module} style={{ marginBottom: 24 }}>
      <Tag color="blue" style={{ marginBottom: 8 }}>
{({ inventory: 'المخزون', sales: 'المبيعات', purchasing: 'المشتريات', accounting: 'المحاسبة', core: 'الإعدادات' } as Record<string, string>)[module] ?? module}      </Tag>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {perms.map((perm: any) => (
          <Checkbox
            key={perm.id}
            checked={currentPermIds.includes(perm.id)}
            onChange={(e) => handleTogglePermission(perm.id, e.target.checked)}
          >
            {perm.description || perm.name}
          </Checkbox>
        ))}
      </div>
    </div>
  ))}
</Drawer>
    </div>
  );
}