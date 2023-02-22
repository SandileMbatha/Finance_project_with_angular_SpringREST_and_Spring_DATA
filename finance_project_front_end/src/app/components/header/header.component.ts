import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

import { Customer } from '../../models/customer';
import { NavigationService } from '../../services/navigation.service';
import { CustomerSharedService } from '../../services/customer-shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(
    private navigationService: NavigationService,
    private sharedService: CustomerSharedService,
  ) {}

  ngOnInit() {
    $('body').on('mouseup', function (e) {
      if (!$(e.target).hasClass('dropdown-menu')) {
        $('.dropdown-menu').each(function () {
          $(this).removeClass('show');
        });
      }
    });
  }

  public getCurrentCustomer(): Customer | undefined {
    return this.sharedService.getCurrentCustomer();
  }

  public goToTaxCalculator(): void {
    this.navigationService.goToTaxCalculator();
  }

  public goBack(): void {
    this.navigationService.goBack();
  }

  public onHomePage(): boolean {
    return this.navigationService.onHomePage();
  }

  public onCustomerDetailsPage(): boolean {
    return this.navigationService.onCustomerDetailsPage();
  }

  public getCreateInvestmentPath(): string {
    return this.navigationService.getCreateInvestmentPath();
  }

  public getCreatePropertyBondPath(): string {
    return this.navigationService.getCreatePropertyBondPath();

  }

  public getCreateCarFinancePath(): string {
    return this.navigationService.getCreateCarFinancePath();

  }

  public goToHomePage(): void {
    this.navigationService.goToHomePage();
  }
}
