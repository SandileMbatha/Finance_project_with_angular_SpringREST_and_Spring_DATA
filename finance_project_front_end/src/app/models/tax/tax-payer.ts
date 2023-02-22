import { Money } from '../money';
import { Expense } from './expense';
import { Income } from './income';

export interface TaxPayer {
  age: number;
  taxYear: number;
  income: Income[];
  expenses: Expense[];
  medicalCredits: Money;
}
