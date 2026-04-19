// import { useState } from 'react';
// import { Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message, Tag, InputNumber, Divider } from 'antd';
// import { PlusOutlined, CheckOutlined, CloseOutlined, MinusCircleOutlined } from '@ant-design/icons';
// import { useJournalEntries, useCreateJournalEntry, usePostJournalEntry, useCancelJournalEntry } from '../hooks/useJournalEntries';
// import { useJournals } from '../hooks/useJournals';
// import { useAccounts } from '../hooks/accounts.hooks';
// const { Option } = Select;

// const stateColors: Record<string, string> = {
//   DRAFT: 'default', POSTED: 'green', CANCELLED: 'red',
// };

// const stateLabels: Record<string, string> = {
//   DRAFT: 'مسودة', POSTED: 'مرحّل', CANCELLED: 'ملغي',
// };

// export default function JournalEntriesPage() {
//   const [open, setOpen] = useState(false);
//   const [form] = Form.useForm();

//   const { data: entries, isLoading } = useJournalEntries();
//   const { data: journals } = useJournals();
//   const { accounts } = useAccounts();
//   const createEntry = useCreateJournalEntry();
//   const postEntry = usePostJournalEntry();
//   const cancelEntry = useCancelJournalEntry();

//   const handleSubmit = async () => {
//     const values = await form.validateFields();
//     await createEntry.mutateAsync({
//       ...values,
//       date: new Date(values.date).toISOString(),
//       items: values.items.map((item: any) => ({
//         ...item,
//         debit: item.debit ?? 0,
//         credit: item.credit ?? 0,
//       })),
//     });
//     message.success('تم إنشاء القيد المحاسبي');
//     setOpen(false);
//     form.resetFields();
//   };

//   const columns = [
//     { title: 'المرجع', dataIndex: 'reference', key: 'reference' },
//     {
//       title: 'التاريخ', dataIndex: 'date', key: 'date',
//       render: (v: string) => new Date(v).toLocaleDateString('ar-EG'),
//     },
//     {
//       title: 'الحالة', dataIndex: 'state', key: 'state',
//       render: (v: string) => <Tag color={stateColors[v]}>{stateLabels[v]}</Tag>,
//     },
//     {
//       title: 'إجمالي مدين', dataIndex: 'items', key: 'debit',
//       render: (items: any[]) =>
//         items?.reduce((s, i) => s + Number(i.debit), 0).toFixed(2),
//     },
//     {
//       title: 'إجمالي دائن', dataIndex: 'items', key: 'credit',
//       render: (items: any[]) =>
//         items?.reduce((s, i) => s + Number(i.credit), 0).toFixed(2),
//     },
//     {
//       title: 'إجراءات', key: 'actions',
//       render: (_: any, record: any) => (
//         <Space>
//           {record.state === 'DRAFT' && (
//             <>
//               <Popconfirm title="ترحيل القيد؟" onConfirm={() => postEntry.mutateAsync(record.id).then(() => message.success('تم الترحيل'))}>
//                 <Button icon={<CheckOutlined />} size="small" type="primary">ترحيل</Button>
//               </Popconfirm>
//               <Popconfirm title="إلغاء القيد؟" onConfirm={() => cancelEntry.mutateAsync(record.id).then(() => message.success('تم الإلغاء'))}>
//                 <Button icon={<CloseOutlined />} size="small" danger>إلغاء</Button>
//               </Popconfirm>
//             </>
//           )}
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div style={{ padding: 24 }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
//         <h2 style={{ margin: 0 }}>القيود المحاسبية</h2>
//         <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>قيد جديد</Button>
//       </div>
//       <Table columns={columns} dataSource={entries} loading={isLoading} rowKey="id" />
//       <Modal
//         title="قيد محاسبي جديد"
//         open={open} onOk={handleSubmit} onCancel={() => setOpen(false)}
//         confirmLoading={createEntry.isPending}
//         okText="حفظ" cancelText="إلغاء" width={800}
//       >
//         <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
//           <Form.Item name="reference" label="المرجع" rules={[{ required: true, message: 'مطلوب' }]}>
//             <Input placeholder="JE-00001" />
//           </Form.Item>
//           <Form.Item name="date" label="التاريخ" rules={[{ required: true, message: 'مطلوب' }]}>
//             <Input type="date" />
//           </Form.Item>
//           <Form.Item name="journalId" label="دفتر اليومية" rules={[{ required: true, message: 'مطلوب' }]}>
//             <Select placeholder="اختر دفتر اليومية">
//               {journals?.map((j: any) => (
//                 <Option key={j.id} value={j.id}>{j.name}</Option>
//               ))}
//             </Select>
//           </Form.Item>

//           <Divider>بنود القيد</Divider>

//           <Form.List name="items" initialValue={[{ name: '', debit: 0, credit: 0, accountId: '' }]}>
//             {(fields, { add, remove }) => (
//               <>
//                 {fields.map(({ key, name, ...rest }) => (
//                   <Space key={key} align="baseline" style={{ display: 'flex', marginBottom: 8 }} wrap>
//                     <Form.Item {...rest} name={[name, 'accountId']} label="الحساب" rules={[{ required: true, message: 'مطلوب' }]}>
//                       <Select placeholder="اختر الحساب" style={{ width: 200 }}>
//                         {accounts?.map((a: any) => (
//                           <Option key={a.id} value={a.id}>{a.code} - {a.name}</Option>
//                         ))}
//                       </Select>
//                     </Form.Item>
//                     <Form.Item {...rest} name={[name, 'name']} label="البيان" rules={[{ required: true, message: 'مطلوب' }]}>
//                       <Input placeholder="وصف البند" style={{ width: 160 }} />
//                     </Form.Item>
//                     <Form.Item {...rest} name={[name, 'debit']} label="مدين">
//                       <InputNumber min={0} precision={2} style={{ width: 100 }} />
//                     </Form.Item>
//                     <Form.Item {...rest} name={[name, 'credit']} label="دائن">
//                       <InputNumber min={0} precision={2} style={{ width: 100 }} />
//                     </Form.Item>
//                     <MinusCircleOutlined onClick={() => remove(name)} style={{ color: 'red', marginTop: 8 }} />
//                   </Space>
//                 ))}
//                 <Button type="dashed" onClick={() => add({ name: '', debit: 0, credit: 0, accountId: '' })} icon={<PlusOutlined />}>
//                   إضافة بند
//                 </Button>
//               </>
//             )}
//           </Form.List>
//         </Form>
//       </Modal>
//     </div>
//   );
// }