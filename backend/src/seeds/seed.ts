import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../../generated/prisma';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seed...');

  // Create Company
  const company = await prisma.company.upsert({
    where: { email: 'admin@erp.com' },
    update: {},
    create: {
      name: 'شركة تجريبية',
      email: 'admin@erp.com',
      phone: '01000000000',
      address: 'القاهرة، مصر',
      branches: {
        create: {
          name: 'الفرع الرئيسي',
          address: 'القاهرة، مصر',
          phone: '01000000000',
        },
      },
    },
    include: { branches: true },
  });

  console.log('✅ Company created:', company.name);

  // Create Super Admin Role
  const role = await prisma.role.upsert({
    where: { id: 'super-admin-role' },
    update: {},
    create: {
      id: 'super-admin-role',
      name: 'Super Admin',
      description: 'صلاحيات كاملة',
    },
  });

  console.log('✅ Role created:', role.name);

  // Create Permissions
const permissions = [
  { name: 'inventory.products.view', module: 'inventory', description: 'عرض المنتجات' },
  { name: 'inventory.products.create', module: 'inventory', description: 'إضافة منتج' },
  { name: 'inventory.products.edit', module: 'inventory', description: 'تعديل منتج' },
  { name: 'inventory.products.delete', module: 'inventory', description: 'حذف منتج' },
  { name: 'inventory.warehouses.view', module: 'inventory', description: 'عرض المخازن' },
  { name: 'inventory.warehouses.create', module: 'inventory', description: 'إضافة مخزن' },
  { name: 'inventory.warehouses.edit', module: 'inventory', description: 'تعديل مخزن' },
  { name: 'inventory.warehouses.delete', module: 'inventory', description: 'حذف مخزن' },
  { name: 'inventory.stock.view', module: 'inventory', description: 'عرض المخزون' },
  { name: 'inventory.stock.edit', module: 'inventory', description: 'تعديل المخزون' },
  { name: 'inventory.stock.transfer', module: 'inventory', description: 'تحويل مخزون' },
  { name: 'inventory.categories.view', module: 'inventory', description: 'عرض التصنيفات' },
  { name: 'inventory.categories.create', module: 'inventory', description: 'إضافة تصنيف' },
  { name: 'inventory.categories.delete', module: 'inventory', description: 'حذف تصنيف' },
  { name: 'inventory.units.view', module: 'inventory', description: 'عرض وحدات القياس' },
  { name: 'inventory.units.create', module: 'inventory', description: 'إضافة وحدة قياس' },
  { name: 'inventory.units.delete', module: 'inventory', description: 'حذف وحدة قياس' },
];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission,
    });
  }

  console.log('✅ Permissions created');

  // Assign all permissions to super admin role
  const allPermissions = await prisma.permission.findMany();
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
      update: {},
      create: { roleId: role.id, permissionId: permission.id },
    });
  }

  console.log('✅ Permissions assigned to role');

  // Create Admin User
  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  const branch = company.branches[0];

  const user = await prisma.user.upsert({
    where: { email: 'admin@erp.com' },
    update: {},
    create: {
      name: 'مدير النظام',
      email: 'admin@erp.com',
      password: hashedPassword,
      companyId: company.id,
      branchId: branch.id,
    },
  });

  console.log('✅ User created:', user.email);

  // Assign role to user
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId: role.id } },
    update: {},
    create: { userId: user.id, roleId: role.id },
  });

  console.log('✅ Role assigned to user');
  console.log('');
  console.log('🎉 Seed completed successfully!');
  console.log('📧 Email: admin@erp.com');
  console.log('🔑 Password: Admin@123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());