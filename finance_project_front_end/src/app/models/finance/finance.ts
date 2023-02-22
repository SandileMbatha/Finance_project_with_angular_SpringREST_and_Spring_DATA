import { Customer } from "../customer";
import { FinanceEvent } from "./finance-event";
import { Money } from "../money";
import { MonthDetails } from "./month-details";

export interface Finance {
  financeNum: number;
  customer: Customer;
  name: string;
  initialDeposit: Money;
  term: number;
  rate: number;
  monthlyDetails: MonthDetails[];
  events: FinanceEvent[];
  totalDeposits: Money;
  totalInterest: Money;
}
