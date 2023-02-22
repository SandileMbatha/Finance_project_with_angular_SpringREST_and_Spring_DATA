import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewportScroller } from '@angular/common';

import { Customer } from '../../../models/customer';
import { Investment } from 'src/app/models/finance/investment';
import { PropertyBond } from 'src/app/models/finance/debt/property-bond';
import { CarFinance } from 'src/app/models/finance/debt/car-finance';
import { PageData } from 'src/app/models/page-data';
import { NotificationService } from 'src/app/services/notification.service';
import { CustomerDataService } from '../../../services/customer-data.service';
import { InvestmentDataService } from '../../../services/investment-data.service';
import { PropertyBondDataService } from '../../../services/property-bond-data.service';
import { CarFinanceDataService } from '../../../services/car-finance-data.service';
import { CustomerSharedService } from '../../../services/customer-shared.service';
import { TableData } from '../../../models/table-data';
import { IOUtils } from '../../../models/ioutils';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
})
export class CustomerDetailsComponent implements OnInit {
  public customer?: Customer;

  public investmentTableData: TableData = {
    headers: [
      'Name',
      'Initial Deposit (R)',
      'Contribution (R)',
      'Term (Months)',
      'Rate (%)',
    ],
    items: [],
    routerLinkPaths: [],
    emptyTableMessage: 'No Investments Available',
    editAction: true,
    deleteAction: true,
    pageTable: true,
  };

  public propertyBondTableData: TableData = {
    headers: [
      'Name',
      'Property Price (R)',
      'Initial Deposit (R)',
      'Repayment (R)',
      'Term (Months)',
      'Rate (%)',
    ],
    items: [],
    routerLinkPaths: [],
    emptyTableMessage: 'No Property Bonds Available',
    editAction: true,
    deleteAction: true,
    pageTable: true,
  };

  public carFinanceTableData: TableData = {
    headers: [
      'Name',
      'Car Price (R)',
      'Initial Deposit (R)',
      'Repayment (R)',
      'Term (Months)',
      'Rate (%)',
    ],
    items: [],
    routerLinkPaths: [],
    emptyTableMessage: 'No Car Finances Available',
    editAction: true,
    deleteAction: true,
    pageTable: true,
  };

  public investmentPageData: PageData = {
    currentPage: 1,
    totalItems: 0,
    pageSize: 3,
    pageSizes: [3, 6, 9, 12],
  };

  public propertyBondPageData: PageData = {
    currentPage: 1,
    totalItems: 0,
    pageSize: 3,
    pageSizes: [3, 6, 9, 12],
  };

  public carFinancePageData: PageData = {
    currentPage: 1,
    totalItems: 0,
    pageSize: 3,
    pageSizes: [3, 6, 9, 12],
  };

  public invPaginateId: string = 'invPage';
  public pbPaginateId: string = 'pbPage';
  public cfPaginateId: string = 'cfPage';

  constructor(
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private customerDataService: CustomerDataService,
    private investmentDataService: InvestmentDataService,
    private propertyBondDataService: PropertyBondDataService,
    private carFinanceService: CarFinanceDataService,
    private sharedService: CustomerSharedService,
    private vps: ViewportScroller,
    private navigationService: NavigationService
  ) {}

  ngOnInit() {
    this.getCustomer();
  }

  public getInvestmentService(): InvestmentDataService {
    return this.investmentDataService;
  }

  public getCarFinanceService(): CarFinanceDataService {
    return this.carFinanceService;
  }

  public getPropertBondService(): PropertyBondDataService {
    return this.propertyBondDataService;
  }

  public getCustomer(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.customerDataService
      .getCustomer(id)
      .subscribe((storedCustomer) => this.initializePage(storedCustomer));
  }

  public getInvestmentsPaginated(): void {
    if (this.customer?.customerNum) {
      this.investmentDataService
        .getInvestmentsForCustomerPaginated(
          this.customer?.customerNum,
          this.investmentPageData.currentPage - 1,
          this.investmentPageData.pageSize
        )
        .subscribe((investmentPage) => {
          this.loadInvestments(investmentPage['content']);
          this.investmentPageData.totalItems = investmentPage['totalElements'];
        });
    }
  }

  public getPropertyBondsPaginated(): void {
    if (this.customer?.customerNum) {
      this.propertyBondDataService
        .getPropertyBondsForCustomerPaginated(
          this.customer?.customerNum,
          this.propertyBondPageData.currentPage - 1,
          this.propertyBondPageData.pageSize
        )
        .subscribe((propertyBondPage) => {
          this.loadPropertyBonds(propertyBondPage['content']);
          this.propertyBondPageData.totalItems =
            propertyBondPage['totalElements'];
        });
    }
  }

  public getCarFinancesPaginated(): void {
    if (this.customer?.customerNum) {
      this.carFinanceService
        .getCarFinancesForCustomerPaginated(
          this.customer?.customerNum,
          this.carFinancePageData.currentPage - 1,
          this.carFinancePageData.pageSize
        )
        .subscribe((carFinancePage) => {
          this.loadCarFinances(carFinancePage['content']);
          this.carFinancePageData.totalItems = carFinancePage['totalElements'];
        });
    }
  }

  public scrollDown(): void {
    this.vps.scrollToPosition([0, window.innerHeight]);
  }

  public scrollUp(): void {
    this.vps.scrollToPosition([window.innerHeight, 0]);
  }

  private initializePage(storedCustomer: Customer): void {
    this.customer = storedCustomer;
    this.sharedService.setCurrentCustomer(this.customer);
    this.getInvestmentsPaginated();
    this.getPropertyBondsPaginated();
    this.getCarFinancesPaginated();
  }

  private loadInvestments(investments: Investment[]): void {
    this.investmentTableData.items = [];
    this.investmentTableData.routerLinkPaths = [];

    for (let investment of investments) {
      this.investmentTableData.items?.push([
        investment.name,
        IOUtils.formatMoney(investment.initialDeposit),
        IOUtils.formatMoney(investment.monthlyContribution),
        investment.term.toString(),
        IOUtils.formatWithThreeDecimals(investment.rate),
      ]);

      this.investmentTableData.routerLinkPaths.push(
        '/customers/' +
          this.customer?.customerNum +
          '/investments/' +
          investment.financeNum
      );
    }
  }

  private loadPropertyBonds(propertyBonds: PropertyBond[]): void {
    this.propertyBondTableData.items = [];
    this.propertyBondTableData.routerLinkPaths = [];

    for (let propertyBond of propertyBonds) {
      this.propertyBondTableData.items?.push([
        propertyBond.name,
        IOUtils.formatMoney(propertyBond.price),
        IOUtils.formatMoney(propertyBond.initialDeposit),
        IOUtils.formatMoney(propertyBond.monthlyRepayment),
        propertyBond.term.toString(),
        IOUtils.formatWithThreeDecimals(propertyBond.rate),
      ]);

      this.propertyBondTableData.routerLinkPaths.push(
        '/customers/' +
          this.customer?.customerNum +
          '/property-bonds/' +
          propertyBond.financeNum
      );
    }
  }

  private loadCarFinances(carFinances: CarFinance[]): void {
    this.carFinanceTableData.items = [];
    this.carFinanceTableData.routerLinkPaths = [];

    for (let carFinance of carFinances) {
      this.carFinanceTableData.items?.push([
        carFinance.name,
        IOUtils.formatMoney(carFinance.price),
        IOUtils.formatMoney(carFinance.initialDeposit),
        IOUtils.formatMoney(carFinance.monthlyRepayment),
        carFinance.term.toString(),
        IOUtils.formatWithThreeDecimals(carFinance.rate),
      ]);

      this.carFinanceTableData.routerLinkPaths.push(
        '/customers/' +
          this.customer?.customerNum +
          '/car-finances/' +
          carFinance.financeNum
      );
    }
  }

  public onInvestmentsNewPageRequested(page: number): void {
    this.investmentPageData.currentPage = page;
    this.getInvestmentsPaginated();
  }

  public onInvestmentsNewPageSizeRequested(pageSize: number): void {
    this.investmentPageData.currentPage = 1;
    this.investmentPageData.pageSize = pageSize;
    this.getInvestmentsPaginated();
  }

  public onPropertyBondsNewPageRequested(page: number): void {
    this.propertyBondPageData.currentPage = page;
    this.getPropertyBondsPaginated();
  }

  public onPropertyBondsNewPageSizeRequested(pageSize: number): void {
    this.propertyBondPageData.currentPage = 1;
    this.propertyBondPageData.pageSize = pageSize;
    this.getPropertyBondsPaginated();
  }

  public onCarFinancesNewPageRequested(page: number): void {
    this.carFinancePageData.currentPage = page;
    this.getCarFinancesPaginated();
  }

  public onCarFinancesNewPageSizeRequested(pageSize: number): void {
    this.carFinancePageData.currentPage = 1;
    this.carFinancePageData.pageSize = pageSize;
    this.getCarFinancesPaginated();
  }

  public onDeleteInvestment(): void {
    this.getInvestmentsPaginated();
    this.notificationService.showSuccessMessage(
      'Investment deleted successfully.'
    );
  }

  public onDeletePropertBond(): void {
    this.getPropertyBondsPaginated();
    this.notificationService.showSuccessMessage(
      'Property Bond deleted successfully.'
    );
  }

  public onDeleteCarFinance(): void {
    this.getCarFinancesPaginated();
    this.notificationService.showSuccessMessage(
      'Car Finance deleted successfully.'
    );
  }

  update(event: Event) {
    this.navigationService.goToUpdatePage();
  }
}
