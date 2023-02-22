import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventComponent } from 'src/app/reusables/event/event.component';
import { CreatePropertyBondComponent } from './create-property-bond/create-property-bond.component';
import { PropertyBondDetailsComponent } from './property-bond-details/property-bond-details.component';
import { UpdatePropertyBondComponent } from './update-property-bond/update-property-bond.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'new-property-bond',
        component: CreatePropertyBondComponent,
      },
      {
        path: ':pId',
        component: PropertyBondDetailsComponent,
      },
      {
        path: ':pId/update',
        component: UpdatePropertyBondComponent,
      },
      {
        path: ':pId/deposit',
        component: EventComponent,
      },
      {
        path: ':pId/withdraw',
        component: EventComponent,
      },
      {
        path: ':pId/change-amount',
        component: EventComponent,
      },
      {
        path: ':pId/increase-amount',
        component: EventComponent,
      },
      {
        path: ':pId/change-rate',
        component: EventComponent,
      },
      {
        path: ':pId/events/:eId/update',
        component: EventComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PropertyBondRoutingModule {}
