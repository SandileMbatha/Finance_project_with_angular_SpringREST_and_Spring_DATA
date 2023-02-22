import { Debt } from './debt';
import { Money } from '../../money';

export interface CarFinance extends Debt {
  balloonPayment: Money;
}
