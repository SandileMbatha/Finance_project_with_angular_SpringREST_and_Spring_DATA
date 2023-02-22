import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewportScroller } from '@angular/common';

import { PropertyBond } from '../../../models/finance/debt/property-bond';
import { PropertyBondDataService } from '../../../services/property-bond-data.service';
import { CustomerSharedService } from '../../../services/customer-shared.service';
import { TableData } from '../../../models/table-data';
import { FinanceEvent } from '../../../models/finance/finance-event';
import { IOUtils } from '../../../models/ioutils';
import { Money } from '../../../models/money';
import { CardData } from 'src/app/models/card-data';
import { PageData } from 'src/app/models/page-data';

@Component({
  selector: 'app-property-bond-details',
  templateUrl: './property-bond-details.component.html',
  styleUrls: ['./property-bond-details.component.scss'],
})
export class PropertyBondDetailsComponent implements OnInit {
  public propertyBond?: PropertyBond;

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
      [6, 10],
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
    editButton: false,
  };

  public pageData: PageData = {
    currentPage: 1,
    totalItems: 0,
    pageSize: 12,
    pageSizes: [12, 24, 36, 120],
  };

  constructor(
    private route: ActivatedRoute,
    private propertyBondDataService: PropertyBondDataService,
    private sharedService: CustomerSharedService,
    private vps: ViewportScroller
  ) {}

  ngOnInit() {
    this.getPropertyBond();
  }

  public getPropertyBondService() {
    return this.propertyBondDataService;
  }

  public getPropertyBond(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const pId = Number(this.route.snapshot.paramMap.get('pId'));

    this.propertyBondDataService
      .getPropertyBond(id, pId)
      .subscribe((storedPropertyBond) =>
        this.initializePage(storedPropertyBond)
      );
  }

  private fillDetailsCardData(): void {
    if (this.propertyBond) {
      this.detailsCardData.rows?.push({
        label: 'Property Price:',
        value: this.toRands(this.propertyBond.price),
      });

      this.detailsCardData.rows?.push({
        label: 'Initial Deposit:',
        value: this.toRands(this.propertyBond.initialDeposit),
      });

      this.detailsCardData.rows?.push({
        label: 'Term (Months):',
        value: this.propertyBond.term.toString(),
      });

      this.detailsCardData.rows?.push({
        label: 'Interest Rate:',
        value: this.toPercentage(this.propertyBond.rate),
      });

      this.detailsCardData.rows?.push({
        label: 'Initial Monthly Repayment:',
        value: this.toRands(this.propertyBond.monthlyRepayment),
      });

      this.detailsCardData.rows?.push({
        label: 'Bond Costs:',
        value: this.toRands(this.propertyBond.bondCosts),
      });

      this.detailsCardData.rows?.push({
        label: 'Legal Costs:',
        value: this.toRands(this.propertyBond.legalCosts),
      });

      this.detailsCardData.rows?.push({
        label: 'Transfer Costs:',
        value: this.toRands(this.propertyBond.transferCosts),
      });
    }
  }

  private fillSummaryCardData(): void {
    if (this.propertyBond) {
      this.summaryCardData.rows?.push({
        label: 'Total Costs:',
        value: this.toRands(this.propertyBond.totalCosts),
      });

      this.summaryCardData.rows?.push({
        label: 'Completed In (Months):',
        value: this.propertyBond.actualTerm.toString(),
      });

      this.summaryCardData.rows?.push({
        label: 'Total Deposits:',
        value: this.toRands(this.propertyBond.totalDeposits),
      });

      this.summaryCardData.rows?.push({
        label: 'Total Withdraws:',
        value: this.toRands(this.propertyBond.totalWithdraws),
      });

      this.summaryCardData.rows?.push({
        label: 'Total Interest Paid:',
        value: this.toRands(this.propertyBond.totalInterest),
      });

      this.summaryCardData.rows?.push({
        label: 'Total Repayments:',
        value: this.toRands(this.propertyBond.totalMonthlyRepayments),
      });

      this.summaryCardData.rows?.push({
        label: 'Closing Balance:',
        value: this.toRands(this.propertyBond.finalClosingBalance),
      });
    }
  }

  private fillEventTableData(): void {
    if (this.propertyBond) {
      this.eventTableData.items = [];
      this.eventTableData.routerLinkPaths = [];
      for (let event of this.propertyBond.events) {
        this.eventTableData.items?.push([
          event.month.toString(),
          event.eventType,
          this.getEventAmount(event),
        ]);

        this.eventTableData.routerLinkPaths.push(
          '/customers/' +
            this.route.snapshot.paramMap.get('id') +
            '/property-bonds/' +
            this.propertyBond.financeNum +
            '/events/' +
            event.eventNum
        );
      }
    }
  }

  private fillMonthTableData(): void {
    if (this.propertyBond) {
      this.monthTableData.items = [];
      for (let monthDetails of this.propertyBond.monthlyDetails) {
        this.monthTableData.items?.push([
          monthDetails.month.toString(),
          IOUtils.formatMoney(monthDetails.openingBalance),
          IOUtils.formatMoney(monthDetails.deposit),
          IOUtils.formatMoney(monthDetails.withdraw),
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
    if (this.propertyBond) {
      for (let monthDetails of this.propertyBond.monthlyDetails) {
        closingBalances.push(+monthDetails.closingBalance.value);
      }
    }
    return closingBalances;
  }

  public getMonths(): number[] {
    const months: number[] = [];
    if (this.propertyBond) {
      for (let monthDetails of this.propertyBond.monthlyDetails) {
        months.push(monthDetails.month);
      }
    }
    return months;
  }

  private initializePage(storedPropertyBond: PropertyBond): void {
    this.propertyBond = storedPropertyBond;
    this.sharedService.setCurrentCustomer(this.propertyBond.customer);
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
    this.getPropertyBond();
  }
}
