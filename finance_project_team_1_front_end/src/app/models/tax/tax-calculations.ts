import { Money } from '../money';

export interface TaxCalculations {
  totalTaxableIncome: Money;
  totalTaxDeductibleExpenses: Money;
  nettTaxableIncome: Money;
  taxPayable: Money;
  nettTaxPayable: Money;
}
