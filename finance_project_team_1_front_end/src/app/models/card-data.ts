import { CardRow } from './card-row';

export interface CardData {
  header: string;
  rows?: CardRow[];
  editButton?: boolean;
}
