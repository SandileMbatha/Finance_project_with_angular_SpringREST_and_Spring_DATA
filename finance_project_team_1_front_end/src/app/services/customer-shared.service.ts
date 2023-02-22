import { Injectable } from '@angular/core';

import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root',
})
export class CustomerSharedService {
  private currentCustomer?: Customer;

  constructor() {}

  public setCurrentCustomer(customer: Customer | undefined): void {
    this.currentCustomer = customer;
  }

  public getCurrentCustomer(): Customer | undefined {
    return this.currentCustomer;
  }
}
