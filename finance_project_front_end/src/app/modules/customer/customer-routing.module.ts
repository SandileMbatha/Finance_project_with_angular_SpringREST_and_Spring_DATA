import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateCustomerComponent } from './create-customer/create-customer.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { UpdateCustomerComponent } from './update-component/update-customer.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CustomerListComponent,
      },
      {
        path: 'register',
        component: CreateCustomerComponent,
      },
      {
        path: ':id',
        component: CustomerDetailsComponent,
      },
      {
        path: ':id/update',
        component: UpdateCustomerComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
