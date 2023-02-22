import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { CustomerSharedService } from './customer-shared.service';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private customerPath: string = 'customers';

  private investmentPath: string = 'investments';
  private propertyBondPath: string = 'property-bonds';
  private carFinancePath: string = 'car-finances';

  private newInvestmentPath: string = 'new-investment';
  private newPropertyBondPath: string = 'new-property-bond';
  private newCarFinancePath: string = 'new-car-finance';

  private eventPath: string = 'events';
  private depositPath: string = 'deposit';
  private withdrawPath: string = 'withdraw';
  private changeAmountPath: string = 'change-amount';
  private changeRatePath: string = 'change-rate';
  private increaseAmountPath: string = 'increase-amount';

  private taxCalculatorPath: string = 'taxes';

  constructor(
    private router: Router,
    private customerSharedService: CustomerSharedService,
    private location: Location
  ) {}

  public goToHomePage(): void {
    this.router.navigate(['/']);
  }

  public onHomePage(): boolean {
    return this.router.url === '/' + this.customerPath;
  }

  public goToTaxCalculator(): void {
    this.router.navigate(['/' + this.taxCalculatorPath]);
  }

  public goToCarFinancePage(financeNum: number): void {
    this.router.navigate([
      '/' +
        this.customerPath +
        '/' +
        this.customerSharedService.getCurrentCustomer()?.customerNum +
        '/' +
        this.carFinancePath +
        '/' +
        financeNum,
    ]);
  }

  public goToInvestmentPage(financeNum: number): void {
    this.router.navigate([
      '/' +
        this.customerPath +
        '/' +
        this.customerSharedService.getCurrentCustomer()?.customerNum +
        '/' +
        this.investmentPath +
        '/' +
        financeNum,
    ]);
  }

  public gotToPropertyBondPage(financeNum: number): void {
    this.router.navigate([
      '/' +
        this.customerPath +
        '/' +
        this.customerSharedService.getCurrentCustomer()?.customerNum +
        '/' +
        this.propertyBondPath +
        '/' +
        financeNum,
    ]);
  }

  public onCustomerDetailsPage(): boolean {
    return this.router.url.endsWith(
      '/' +
        this.customerPath +
        '/' +
        this.customerSharedService.getCurrentCustomer()?.customerNum
    );
  }

  public goBack(): void {
    let urlParts = this.router.url.split('/');
    urlParts.pop();

    while (!this.isValidPage(urlParts) && urlParts.length > 1) {
      urlParts.pop();
    }

    this.router.navigate([urlParts.join('/')]);
  }

  public goBackHistory(): void {
    this.location.back();
  }

  public goToUpdatePage(): void {
    this.router.navigate([this.router.url + '/update']);
  }

  public getCreateInvestmentPath(): string {
    return (
      '/' +
      this.customerPath +
      '/' +
      this.customerSharedService.getCurrentCustomer()?.customerNum +
      '/' +
      this.investmentPath +
      '/' +
      this.newInvestmentPath
    );
  }

  public getCreatePropertyBondPath(): string {
    return (
      '/' +
      this.customerPath +
      '/' +
      this.customerSharedService.getCurrentCustomer()?.customerNum +
      '/' +
      this.propertyBondPath +
      '/' +
      this.newPropertyBondPath
    );
  }

  public getCreateCarFinancePath(): string {
    return (
      '/' +
      this.customerPath +
      '/' +
      this.customerSharedService.getCurrentCustomer()?.customerNum +
      '/' +
      this.carFinancePath +
      '/' +
      this.newCarFinancePath
    );
  }

  public goToPath(path: string): void {
    this.router.navigate([path]);
  }

  public goToDepositPage(): void {
    this.router.navigate([this.router.url + '/' + this.depositPath]);
  }

  public goToWithdrawPage(): void {
    this.router.navigate([this.router.url + '/' + this.withdrawPath]);
  }

  public goToChangeAmountPage(): void {
    this.router.navigate([this.router.url + '/' + this.changeAmountPath]);
  }

  public goToChangeRatePage(): void {
    this.router.navigate([this.router.url + '/' + this.changeRatePath]);
  }

  public goToIncreaseAmountPage(): void {
    this.router.navigate([this.router.url + '/' + this.increaseAmountPath]);
  }

  public onDepositPage(): boolean {
    return this.router.url.includes(this.depositPath);
  }

  public onWithdrawPage(): boolean {
    return this.router.url.includes(this.withdrawPath);
  }

  public onChangeAmountPage(): boolean {
    return this.router.url.includes(this.changeAmountPath);
  }

  public onChangeRatePage(): boolean {
    return this.router.url.includes(this.changeRatePath);
  }

  public onIncreaseAmountPage(): boolean {
    return this.router.url.includes(this.increaseAmountPath);
  }

  public getCustomerNumFromPath(): number {
    let arr = this.router.url.split('/');
    return Number(arr[2]);
  }

  public getFinanceNumFromPath(): number {
    let arr = this.router.url.split('/');
    return Number(arr[4]);
  }

  public onUpdateEventPage(): boolean {
    return (
      this.router.url.includes(this.eventPath) &&
      this.router.url.endsWith('update')
    );
  }

  public onInvestmentPage(): boolean {
    return this.router.url.includes(this.investmentPath);
  }

  public onPropertyBondPage(): boolean {
    return this.router.url.includes(this.propertyBondPath);
  }

  public onCarFinancePage(): boolean {
    return this.router.url.includes(this.carFinancePath);
  }

  private isValidPage(urlParts: string[]): boolean {
    const urlEnd = urlParts[urlParts.length - 1];
    const urlBeforeEnd = urlParts[urlParts.length - 2];

    if (
      (!isNaN(Number(urlEnd)) && urlBeforeEnd !== this.eventPath) ||
      urlEnd === this.customerPath
    ) {
      return true;
    }

    return false;
  }
}
