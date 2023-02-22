import { Debt } from './debt';
import { Money } from '../../money';

export interface PropertyBond extends Debt {
  totalWithdraws: Money;
  totalCosts: Money;
  bondCosts: Money;
  legalCosts: Money;
  transferCosts: Money;
}
