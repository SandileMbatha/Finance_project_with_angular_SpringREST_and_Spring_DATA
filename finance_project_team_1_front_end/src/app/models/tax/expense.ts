import { Money } from '../money';

export interface Expense {
  type: string;
  amount: Money;
}
