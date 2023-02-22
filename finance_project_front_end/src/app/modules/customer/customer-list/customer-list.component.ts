import { Component, OnInit } from '@angular/core';

import { CustomerDataService } from '../../../services/customer-data.service';
import { CustomerSharedService } from '../../../services/customer-shared.service';
import { TableData } from '../../../models/table-data';
import { Customer } from 'src/app/models/customer';
import { PageData } from 'src/app/models/page-data';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit {
  public customerTableData: TableData = {
    headers: ['ID Number', 'First Name', 'Last Name', 'Date of Birth'],
    items: [],
    routerLinkPaths: [],
    emptyTableMessage: 'No Customers Registered',
    editAction: true,
    deleteAction: true,
    pageTable: true,
  };

  public pageData: PageData = {
    currentPage: 1,
    totalItems: 0,
    pageSize: 3,
    pageSizes: [3, 6, 9, 12],
  };

  constructor(
    private notificationService: NotificationService,
    private customerService: CustomerDataService,
    private sharedService: CustomerSharedService
  ) {}

  ngOnInit() {
    this.getCustomersPaginated();
    this.sharedService.setCurrentCustomer(undefined);
  }

  public getCustomerService(): CustomerDataService {
    return this.customerService;
  }

  public getCustomersPaginated(): void {
    this.customerService
      .getCustomersPaginated(
        this.pageData.currentPage - 1,
        this.pageData.pageSize
      )
      .subscribe((customerPage) => {
        this.loadCustomers(customerPage['content']);
        this.pageData.totalItems = customerPage['totalElements'];
      });
  }

  public register(): string {
    return '/customers/register';
  }

  private loadCustomers(customers: Customer[]): void {
    this.customerTableData.items = [];
    this.customerTableData.routerLinkPaths = [];

    for (let customer of customers) {
      this.customerTableData.items?.push([
        customer.idNumber,
        customer.name,
        customer.surname,
        customer.dateOfBirth,
      ]);

      this.customerTableData.routerLinkPaths.push(
        '/customers/' + customer.customerNum
      );
    }
  }

  public onNewPageRequested(page: number): void {
    this.pageData.currentPage = page;
    this.getCustomersPaginated();
  }

  public onNewPageSizeRequested(pageSize: number): void {
    this.pageData.currentPage = 1;
    this.pageData.pageSize = pageSize;
    this.getCustomersPaginated();
  }

  public onDeleteCustomer(): void {
    this.getCustomersPaginated();
    this.notificationService.showSuccessMessage(
      'Customer deleted successfully.'
    );
  }
}
