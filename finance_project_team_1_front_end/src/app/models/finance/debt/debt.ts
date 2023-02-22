import { Finance } from '../finance';
import { Money } from '../../money';

export interface Debt extends Finance {
  price: Money;
  monthlyRepayment: Money;
  totalMonthlyRepayments: Money;
  actualTerm: number;
  finalClosingBalance: Money;
}
