export interface FinanceEvent {
  eventNum: number;
  eventType: string;
  finance: any;
  month: number;
  amount: number;
  keepRepayment: boolean;
}
