import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventComponent } from 'src/app/reusables/event/event.component';
import { CarFinanceDetailsComponent } from './car-finance-details/car-finance-details.component';
import { CreateCarFinanceComponent } from './create-car-finance/create-car-finance.component';
import { UpdateCarFinanceComponent } from './update-car-finance/update-car-finance.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'new-car-finance',
        component: CreateCarFinanceComponent,
      },
      {
        path: ':cId',
        component: CarFinanceDetailsComponent,
      },
      {
        path: ':cId/update',
        component: UpdateCarFinanceComponent,
      },
      {
        path: ':cId/deposit',
        component: EventComponent,
      },
      {
        path: ':cId/withdraw',
        component: EventComponent,
      },
      {
        path: ':cId/change-amount',
        component: EventComponent,
      },
      {
        path: ':cId/increase-amount',
        component: EventComponent,
      },
      {
        path: ':cId/change-rate',
        component: EventComponent,
      },
      {
        path: ':cId/events/:eId/update',
        component: EventComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarFinanceRoutingModule {}
