import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';

import { CustomerRoutingModule } from './customer-routing.module';
import { CreateCustomerComponent } from './create-customer/create-customer.component';
import { UpdateCustomerComponent } from './update-component/update-customer.component';
import { SharedModule } from '../shared.module';

@NgModule({
  declarations: [CreateCustomerComponent, UpdateCustomerComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    FontAwesomeModule,
    CustomerRoutingModule,
    SharedModule
  ],
})
export class CustomerModule {
  public constructor(library: FaIconLibrary) {
    library.addIconPacks(far, fas);
  }
}
