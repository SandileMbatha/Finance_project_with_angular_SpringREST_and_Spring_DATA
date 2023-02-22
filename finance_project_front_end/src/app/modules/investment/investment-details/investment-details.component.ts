import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { Investment } from '../../../models/finance/investment';
import { InvestmentDataService } from '../../../services/investment-data.service';
import { IOUtils } from '../../../models/ioutils';
import { Money } from '../../../models/money';
import { CustomerSharedService } from '../../../services/customer-shared.service';
import { TableData } from '../../../models/table-data';
import { FinanceEvent } from '../../../models/finance/finance-event';
import { CardData } from 'src/app/models/card-data';
import { Customer } from 'src/app/models/customer';
import { PageData } from 'src/app/models/page-data';

@Component({
  selector: 'app-investment-details',
  templateUrl: './investment-details.component.html',
  styleUrls: ['./investment-details.component.scss'],
})
export class InvestmentDetailsComponent implements OnInit {
  public investment?: Investment;
  public path: string = '';
  public customer?: Customer;

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
      'Withdraw (R)',
      'Contribution (R)',
      'Interest (E) (R)',
      'Rate (E) (%)',
      'Balance (E) (R)',
    ],
    items: [],
    routerLinkPaths: [],
    emptyTableMessage: 'Nothing To See Yet',
    editAction: false,
    deleteAction: false,
    columnWidth: new Map<number, number>([
      [1, 6],
      [7, 10],
    ]),
    pageTable: true,
  };

  public pageData: PageData = {
    currentPage: 1,
    totalItems: 0,
    pageSize: 12,
    pageSizes: [12, 24, 36, 120],
  };

  public detailsCardData: CardData = {
    header: 'Details',
    rows: [],
    editButton: true,
  };

  public summaryCardData: CardData = {
    header: 'Summary',
    rows: [],
    editButton: false,
  };

  constructor(
    private route: ActivatedRoute,
    private investmentDataService: InvestmentDataService,
    private sharedService: CustomerSharedService,
    private vps: ViewportScroller
  ) {}

  ngOnInit() {
    this.getInvestment();
  }

  public getInvestmentService() {
    return this.investmentDataService;
  }

  public getInvestment(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const iId = Number(this.route.snapshot.paramMap.get('iId'));

    this.investmentDataService
      .getInvestment(id, iId)
      .subscribe((storedInvestment) => this.initializePage(storedInvestment));
  }

  private fillDetailsCardData(): void {
    if (this.investment) {
      this.detailsCardData.rows?.push({
        label: 'Initial Deposit:',
        value: this.toRands(this.investment.initialDeposit),
      });

      this.detailsCardData.rows?.push({
        label: 'Monthly Contribution:',
        value: this.toRands(this.investment.monthlyContribution),
      });

      this.detailsCardData.rows?.push({
        label: 'Term (Months):',
        value: this.investment.term.toString(),
      });

      this.detailsCardData.rows?.push({
        label: 'Interest Rate:',
        value: this.toPercentage(this.investment.rate),
      });
    }
  }

  private fillSummaryCardData(): void {
    if (this.investment) {
      this.summaryCardData.rows?.push({
        label: 'Total Deposits:',
        value: this.toRands(this.investment.totalDeposits),
      });

      this.summaryCardData.rows?.push({
        label: 'Total Withdrawals:',
        value: this.toRands(this.investment.totalWithdraws),
      });

      this.summaryCardData.rows?.push({
        label: 'Total Interest Earned:',
        value: this.toRands(this.investment.totalInterest),
      });

      this.summaryCardData.rows?.push({
        label: 'Total Monthly Contributions:',
        value: this.toRands(this.investment.totalMonthlyContribution),
      });

      this.summaryCardData.rows?.push({
        label: 'Closing Balance:',
        value: this.toRands(this.investment.finalAmount),
      });
    }
  }

  private fillEventTableData(): void {
    this.eventTableData.items = [];
    this.eventTableData.routerLinkPaths = [];
    if (this.investment) {
      for (let event of this.investment.events) {
        this.eventTableData.items?.push([
          event.month.toString(),
          event.eventType,
          this.getEventAmount(event),
        ]);

        this.eventTableData.routerLinkPaths.push(
          '/customers/' +
            this.route.snapshot.paramMap.get('id') +
            '/investments/' +
            this.investment.financeNum +
            '/events/' +
            event.eventNum
        );
      }
    }
  }

  private fillMonthTableData(): void {
    if (this.investment) {
      this.monthTableData.items = [];
      for (let monthDetails of this.investment.monthlyDetails) {
        this.monthTableData.items?.push([
          monthDetails.month.toString(),
          IOUtils.formatMoney(monthDetails.openingBalance),
          IOUtils.formatMoney(monthDetails.deposit),
          IOUtils.formatMoney(monthDetails.withdraw),
          IOUtils.formatMoney(monthDetails.monthlyDeposit),
          IOUtils.formatMoney(monthDetails.interest),
          IOUtils.formatWithThreeDecimals(monthDetails.annualInterestRate),
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
    if (this.investment) {
      for (let monthDetails of this.investment.monthlyDetails) {
        closingBalances.push(+monthDetails.closingBalance.value);
      }
    }
    return closingBalances;
  }

  public getMonths(): number[] {
    const months: number[] = [];
    if (this.investment) {
      for (let monthDetails of this.investment.monthlyDetails) {
        months.push(monthDetails.month);
      }
    }
    return months;
  }

  private initializePage(storedInvestment: Investment): void {
    this.investment = storedInvestment;
    this.sharedService.setCurrentCustomer(this.investment.customer);
    this.fillDetailsCardData();
    this.fillSummaryCardData();
    this.fillEventTableData();
    this.fillMonthTableData();
  }

  onNewPageRequested(page: number) {
    this.pageData.currentPage = page;
  }

  onNewPageSizeRequested(pageSize: number) {
    this.pageData.currentPage = 1;
    this.pageData.pageSize = pageSize;
  }

  onDeleteItem() {
    this.getInvestment();
  }
}
