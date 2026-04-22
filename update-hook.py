import re

with open('modules/sales-ui/src/lib/hooks/useInvoices.ts', 'r') as f:
    content = f.read()

new_hook = '''
export const useInvoice = (id: string) => useQuery({
  queryKey: ['invoices', id],
  queryFn: async () => {
    return await salesApi.invoices.getById(id);
  },
  enabled: !!id,
});

'''

if 'useInvoice' not in content:
    content = content.replace('export const useCreateInvoice', new_hook + 'export const useCreateInvoice')
    with open('modules/sales-ui/src/lib/hooks/useInvoices.ts', 'w') as f:
        f.write(content)
