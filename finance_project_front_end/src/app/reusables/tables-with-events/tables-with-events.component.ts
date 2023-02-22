import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { PageData } from 'src/app/models/page-data';
import { ActivatedRoute } from '@angular/router';
import { Customer } from 'src/app/models/customer';
import { TableData } from 'src/app/models/table-data';
import { CustomerSharedService } from 'src/app/services/customer-shared.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-tables-with-events',
  templateUrl: './tables-with-events.component.html',
  styleUrls: ['./tables-with-events.component.scss'],
})
export class TablesWithEventsComponent implements OnInit {
  @Input() public financeTableData: TableData = {
    headers: [],
    items: [],
    routerLinkPaths: [],
    emptyTableMessage: '',
    editAction: true,
    deleteAction: true,
    pageTable: false,
  };

  @Input() public eventTableData: TableData = {
    headers: [],
    items: [],
    routerLinkPaths: [],
    emptyTableMessage: '',
    editAction: true,
    deleteAction: true,
    clickableRows: false,
  };

  @Input() public pageData: PageData = {
    currentPage: 1,
    totalItems: 0,
    pageSize: 3,
    pageSizes: [3, 6, 9, 12],
  };

  @Output() public newPageRequested = new EventEmitter<number>();
  @Output() public newPageSizeRequested = new EventEmitter<number>();
  @Output() public deleteItem = new EventEmitter<void>();
  @Input() public service: any;
  @Input() public withdrawButton: boolean = true;

  public customer?: Customer;
  cust_id: number | undefined;
  inv_id: any;

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      const chng = changes[propName];
    }
  }

  constructor(
    private route: ActivatedRoute,
    private sharedService: CustomerSharedService,
    private navigationService: NavigationService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.getCustomer();
    this.inv_id = this.route.snapshot.params['iId'];
    this.cust_id = this.customer?.customerNum;
    this.pageData.totalItems = this.financeTableData.items.length;
    this.financeTableData.clickableRows = false;
    this.eventTableData.clickableRows = false;
  }

  public getCustomer(): void {
    this.customer = this.sharedService.getCurrentCustomer();
  }

  deposit(event: Event) {
    this.navigationService.goToDepositPage();
  }

  withdraw(event: Event) {
    this.navigationService.goToWithdrawPage();
  }

  changeAmount(event: Event) {
    this.navigationService.goToChangeAmountPage();
  }

  changeRate(event: Event) {
    this.navigationService.goToChangeRatePage();
  }

  increaseAmount(event: Event) {
    this.navigationService.goToIncreaseAmountPage();
  }

  onNewPageRequested(page: number) {
    this.newPageRequested.emit(page);
  }

  onNewPageSizeRequested(pageSize: number) {
    this.newPageSizeRequested.emit(pageSize);
  }

  onDeleteItem() {
    this.notificationService.showSuccessMessage('Event deleted successfully.');
    this.deleteItem.emit();
  }
}
