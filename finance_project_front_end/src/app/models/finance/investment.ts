import { Finance } from './finance';
import { Money } from '../money';

export interface Investment extends Finance {
  monthlyContribution: Money;
  totalMonthlyContribution: Money;
  totalWithdraws: Money;
  finalAmount: Money;
}
