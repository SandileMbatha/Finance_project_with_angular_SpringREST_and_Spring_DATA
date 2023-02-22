import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NavigationService } from 'src/app/services/navigation.service';

import { PageData } from '../../models/page-data';
import { TableData } from '../../models/table-data';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() public tableData: TableData = {
    headers: [],
    items: [],
    routerLinkPaths: [],
    emptyTableMessage: '',
    editAction: false,
    deleteAction: false,
    pageTable: false,
  };

  @Input() public service: any;

  @Input() public pageData: PageData = {
    currentPage: 0,
    totalItems: 0,
    pageSize: 0,
    pageSizes: [],
  };

  @Input() public paginateId: string = 'id';

  @Output() public newPageRequested = new EventEmitter<number>();
  @Output() public newPageSizeRequested = new EventEmitter<number>();
  @Output() public deleteItem = new EventEmitter<void>();

  public includeActions: boolean = false;

  deleteClick(event: Event, path: string) {
    event.stopPropagation();
    this.service.delete(path).subscribe(() => {
      if (this.tableData.items.length === 1) {
        this.goBackOnePage();
      }
      this.deleteItem.emit();
    });
  }

  constructor(private navigationService: NavigationService) {}

  ngOnInit() {
    if (this.tableData.editAction || this.tableData.deleteAction) {
      this.includeActions = true;
    }
  }

  public getColSpan(): number {
    return this.tableData.headers.length + (this.includeActions ? 1 : 0);
  }

  public getColumnWidth(columnNumber: number): string {
    if (this.tableData.columnWidth) {
      let width: number = this.tableData.columnWidth.get(columnNumber) || 0;
      return width === 0 ? '' : width.toString() + '%';
    }
    return '';
  }

  public displayPageControls() {
    return this.pageData.pageSize < this.pageData.totalItems;
  }

  private goBackOnePage(): void {
    if (this.pageData.currentPage != 1) {
      this.newPageRequested.emit(this.pageData.currentPage - 1);
    }
  }

  update(event: Event, path: string) {
    event.stopPropagation();
    this.navigationService.goToPath(path + '/update');
  }

  public clickableRows(): boolean {
    return (
      this.tableData.clickableRows === undefined || this.tableData.clickableRows
    );
  }

  onTableSizeChange(event: any): void {
    this.newPageSizeRequested.emit(event.target.value);
  }
}
