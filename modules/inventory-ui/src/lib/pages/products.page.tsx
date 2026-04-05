import { useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useProducts, useCreateProduct, useDeleteProduct } from '../hooks/useProducts';
import ProductTable from '../components/products/product-table';
import ProductForm from '../components/products/product-form';

export default function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: products, isLoading } = useProducts();
  const createMutation = useCreateProduct();
  const deleteMutation = useDeleteProduct();

  const handleSubmit = (values: any) => {
    createMutation.mutate(values, {
      onSuccess: () => setIsModalOpen(false),
    });
  };

  return (
    <div dir="rtl">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>المنتجات</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          إضافة منتج
        </Button>
      </div>
      <ProductTable
        data={products || []}
        loading={isLoading}
        onDelete={(id) => deleteMutation.mutate(id)}
      />
      <ProductForm
        open={isModalOpen}
        loading={createMutation.isPending}
        onSubmit={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
}