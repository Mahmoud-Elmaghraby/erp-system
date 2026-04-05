import { useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useCategories, useCreateCategory, useDeleteCategory } from '../hooks/useCategories';
import CategoryTable from '../components/categories/category-table';
import CategoryForm from '../components/categories/category-form';

export default function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: categories, isLoading } = useCategories();
  const createMutation = useCreateCategory();
  const deleteMutation = useDeleteCategory();

  const handleSubmit = (values: any) => {
    createMutation.mutate(values, {
      onSuccess: () => setIsModalOpen(false),
    });
  };

  return (
    <div dir="rtl">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>التصنيفات</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          إضافة تصنيف
        </Button>
      </div>
      <CategoryTable
        data={categories || []}
        loading={isLoading}
        onDelete={(id) => deleteMutation.mutate(id)}
      />
      <CategoryForm
        open={isModalOpen}
        loading={createMutation.isPending}
        categories={categories || []}
        onSubmit={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
}