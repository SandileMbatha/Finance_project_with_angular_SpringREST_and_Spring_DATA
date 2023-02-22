import { Money } from '../money';

export interface MonthDetails {
  month: number;
  openingBalance: Money;
  deposit: Money;
  withdraw: Money;
  monthlyDeposit: Money;
  annualInterestRate: number;
  interest: Money;
  closingBalance: Money;
}
