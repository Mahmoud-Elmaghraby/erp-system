import { useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProducts';
import ProductTable from '../components/products/product-table';
import ProductForm from '../components/products/product-form';

export default function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const { data: products, isLoading } = useProducts();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const handleCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setEditingProduct(record);
    setIsModalOpen(true);
  };

  const handleSubmit = (values: any) => {
    if (editingProduct) {
      updateMutation.mutate(
        { id: editingProduct.id, data: values },
        { onSuccess: () => { setIsModalOpen(false); setEditingProduct(null); } }
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: () => { setIsModalOpen(false); }
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div dir="rtl">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>المنتجات</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          إضافة منتج
        </Button>
      </div>

      <ProductTable
        data={products || []}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={(id) => deleteMutation.mutate(id)}
      />

      <ProductForm
        open={isModalOpen}
        loading={isPending}
        initialValues={editingProduct}
        onSubmit={handleSubmit}
        onCancel={() => { setIsModalOpen(false); setEditingProduct(null); }}
      />
    </div>
  );
}