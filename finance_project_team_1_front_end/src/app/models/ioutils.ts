import { Money } from './money';

export class IOUtils {
  public static toRands(money: Money): string {
    return 'R ' + this.formatMoney(money);
  }

  public static toPercentage(value: number): string {
    return this.formatWithThreeDecimals(value) + ' %';
  }

  public static formatMoney(money: Money): string {
    return this.formatStringAsMoney(money.value);
  }

  public static formatStringAsMoney(value: string): string {
    let parts: string[] = this.formatNumber(value);
    return parts.length === 2 ? parts.join('.') : parts[0].concat('.00');
  }

  public static formatWithThreeDecimals(value: number): string {
    let parts: string[] = this.formatNumber(value.toString());

    if (parts.length === 2) {
      let decimalValue: number = parseFloat(parts.join('.'));
      return decimalValue.toFixed(3);
    }

    return parts[0].concat('.000');
  }

  private static formatNumber(value: string): string[] {
    let parts: string[] = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return parts;
  }
}
