import { useQuery } from '@tanstack/react-query';
import { salesApi } from '../api/sales.api';

export interface AccountMovement {
  id: string;
  date: string;
  reference: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface CustomerAccountStatement {
  id: string;
  code?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  openingBalance: number;
  totalDebit: number;
  totalCredit: number;
  closingBalance: number;
  movements: AccountMovement[];
  asOfDate: string;
}

export const useCustomerAccountStatement = (customerId: string) => {
  return useQuery({
    queryKey: ['customer-account-statement', customerId],
    queryFn: async () => {
      const response = await salesApi.customers.getAccountStatement(customerId);
      return response as CustomerAccountStatement;
    },
    enabled: !!customerId,
  });
};
