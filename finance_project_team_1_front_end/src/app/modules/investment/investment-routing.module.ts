import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventComponent } from 'src/app/reusables/event/event.component';
import { CreateInvestmentComponent } from './create-investment/create-investment.component';
import { InvestmentDetailsComponent } from './investment-details/investment-details.component';
import { UpdateInvestmentComponent } from './update-investment/update-investment.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'new-investment',
        component: CreateInvestmentComponent,
      },
      {
        path: ':iId',
        component: InvestmentDetailsComponent,
      },
      {
        path: ':id/update',
        component: UpdateInvestmentComponent,
      },
      {
        path: ':iId/deposit',
        component: EventComponent,
      },
      {
        path: ':iId/withdraw',
        component: EventComponent,
      },
      {
        path: ':iId/change-amount',
        component: EventComponent,
      },
      {
        path: ':iId/increase-amount',
        component: EventComponent,
      },
      {
        path: ':iId/change-rate',
        component: EventComponent,
      },
      {
        path: ':iId/events/:eId/update',
        component: EventComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvestmentRoutingModule {}
