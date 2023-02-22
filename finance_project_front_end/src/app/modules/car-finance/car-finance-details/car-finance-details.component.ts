import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewportScroller } from '@angular/common';

import { CarFinance } from '../../../models/finance/debt/car-finance';
import { CarFinanceDataService } from '../../../services/car-finance-data.service';
import { FinanceEvent } from '../../../models/finance/finance-event';
import { IOUtils } from '../../../models/ioutils';
import { Money } from '../../../models/money';
import { CustomerSharedService } from '../../../services/customer-shared.service';
import { TableData } from '../../../models/table-data';
import { CardData } from 'src/app/models/card-data';
import { PageData } from 'src/app/models/page-data';

@Component({
  selector: 'app-car-finance-details',
  templateUrl: './car-finance-details.component.html',
  styleUrls: ['./car-finance-details.component.scss'],
})
export class CarFinanceDetailsComponent implements OnInit {
  public carFinance?: CarFinance;

  public eventTableData: TableData = {
    headers: ['Month', 'Type', 'Amount'],
    items: [],
    routerLinkPaths: [],
    emptyTableMessage: 'No Events Yet',
    editAction: true,
    deleteAction: true,
  };

  public monthTableData: TableData = {
    headers: [
      'Month',
      'Balance (B) (R)',
      'Deposit (R)',
      'Interest (E) (R)',
      'Rate (E) (%)',
      'Repayment (R)',
      'Balance (E) (R)',
    ],
    items: [],
    routerLinkPaths: [],
    emptyTableMessage: 'Nothing To See Yet',
    editAction: false,
    deleteAction: false,
    columnWidth: new Map<number, number>([
      [1, 6],
      [5, 10],
    ]),
    pageTable: true,
  };

  public detailsCardData: CardData = {
    header: 'Details',
    rows: [],
    editButton: true,
  };

  public summaryCardData: CardData = {
    header: 'Summary',
    rows: [],
  };

  public pageData: PageData = {
    currentPage: 1,
    totalItems: 0,
    pageSize: 12,
    pageSizes: [12, 24, 36, 120],
  };

  constructor(
    private route: ActivatedRoute,
    private carFinanceDataService: CarFinanceDataService,
    private sharedService: CustomerSharedService,
    private vps: ViewportScroller
  ) {}

  ngOnInit() {
    this.getCarFinance();
  }

  public getCarFinanceService() {
    return this.carFinanceDataService;
  }

  ngAfterViewInit() {
    this.fillMonthTableData();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      const chng = changes[propName];
    }
  }

  public getCarFinance(): void {
    const id: number = Number(this.route.snapshot.paramMap.get('id'));
    const cId: number = Number(this.route.snapshot.paramMap.get('cId'));
    this.carFinanceDataService
      .getCarFinance(id, cId)
      .subscribe((storedCarFinance) => this.initializePage(storedCarFinance));
  }

  private fillDetailsCardData(): void {
    if (this.carFinance) {
      this.detailsCardData.rows?.push({
        label: 'Car Price:',
        value: this.toRands(this.carFinance.price),
      });

      this.detailsCardData.rows?.push({
        label: 'Initial Deposit:',
        value: this.toRands(this.carFinance.initialDeposit),
      });

      this.detailsCardData.rows?.push({
        label: 'Term (Months):',
        value: this.carFinance.term.toString(),
      });

      this.detailsCardData.rows?.push({
        label: 'Interest Rate:',
        value: this.toPercentage(this.carFinance.rate),
      });

      this.detailsCardData.rows?.push({
        label: 'Initial Monthly Repayment:',
        value: this.toRands(this.carFinance.monthlyRepayment),
      });

      this.detailsCardData.rows?.push({
        label: 'Balloon Payment:',
        value: this.toRands(this.carFinance.balloonPayment),
      });
    }
  }

  private fillSummaryCardData(): void {
    if (this.carFinance) {
      this.summaryCardData.rows?.push({
        label: 'Completed In (Months):',
        value: this.carFinance.actualTerm.toString(),
      });

      this.summaryCardData.rows?.push({
        label: 'Total Deposits:',
        value: this.toRands(this.carFinance.totalDeposits),
      });

      this.summaryCardData.rows?.push({
        label: 'Total Interest Paid:',
        value: this.toRands(this.carFinance.totalInterest),
      });

      this.summaryCardData.rows?.push({
        label: 'Total Repayments:',
        value: this.toRands(this.carFinance.totalMonthlyRepayments),
      });

      this.summaryCardData.rows?.push({
        label: 'Closing Balance:',
        value: this.toRands(this.carFinance.finalClosingBalance),
      });
    }
  }

  private fillEventTableData(): void {
    if (this.carFinance) {
      this.eventTableData.items = [];
      this.eventTableData.routerLinkPaths = [];
      for (let event of this.carFinance.events) {
        this.eventTableData.items?.push([
          event.month.toString(),
          event.eventType,
          this.getEventAmount(event),
        ]);

        this.eventTableData.routerLinkPaths.push(
          '/customers/' +
            this.route.snapshot.paramMap.get('id') +
            '/car-finances/' +
            this.carFinance.financeNum +
            '/events/' +
            event.eventNum
        );
      }
    }
  }

  private fillMonthTableData(): void {
    if (this.carFinance) {
      this.monthTableData.items = [];
      for (let monthDetails of this.carFinance.monthlyDetails) {
        this.monthTableData.items?.push([
          monthDetails.month.toString(),
          IOUtils.formatMoney(monthDetails.openingBalance),
          IOUtils.formatMoney(monthDetails.deposit),
          IOUtils.formatMoney(monthDetails.interest),
          IOUtils.formatWithThreeDecimals(monthDetails.annualInterestRate),
          IOUtils.formatMoney(monthDetails.monthlyDeposit),
          IOUtils.formatMoney(monthDetails.closingBalance),
        ]);
      }
    }
  }

  public toRands(money: Money): string {
    return IOUtils.toRands(money);
  }

  public toPercentage(value: number): string {
    return IOUtils.toPercentage(value);
  }

  public getEventAmount(event: FinanceEvent): string {
    if (event.eventType === 'Change Rate') {
      return IOUtils.formatWithThreeDecimals(event.amount);
    }

    return IOUtils.formatStringAsMoney(event.amount.toString());
  }

  public scrollDown(): void {
    this.vps.scrollToPosition([0, window.innerHeight]);
  }

  public scrollUp(): void {
    this.vps.scrollToPosition([window.innerHeight, 0]);
  }

  public getClosingBalances(): number[] {
    const closingBalances: number[] = [];
    if (this.carFinance) {
      for (let monthDetails of this.carFinance.monthlyDetails) {
        closingBalances.push(+monthDetails.closingBalance.value);
      }
    }
    return closingBalances;
  }

  public getMonths(): number[] {
    const months: number[] = [];
    if (this.carFinance) {
      for (let monthDetails of this.carFinance.monthlyDetails) {
        months.push(monthDetails.month);
      }
    }
    return months;
  }

  private initializePage(storedCarFinance: CarFinance): void {
    this.carFinance = storedCarFinance;
    this.sharedService.setCurrentCustomer(this.carFinance.customer);
    this.fillDetailsCardData();
    this.fillSummaryCardData();
    this.fillEventTableData();
    this.fillMonthTableData();
  }

  public onNewPageRequested(page: number): void {
    this.pageData.currentPage = page;
  }

  public onNewPageSizeRequested(pageSize: number): void {
    this.pageData.currentPage = 1;
    this.pageData.pageSize = pageSize;
  }

  onDeleteItem() {
    this.getCarFinance();
  }
}
