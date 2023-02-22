import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CarFinanceRoutingModule } from './car-finance-routing.module';
import { CreateCarFinanceComponent } from './create-car-finance/create-car-finance.component';
import { UpdateCarFinanceComponent } from './update-car-finance/update-car-finance.component';
import { SharedModule } from '../shared.module';
@NgModule({
  declarations: [CreateCarFinanceComponent, UpdateCarFinanceComponent],
  imports: [CommonModule, ReactiveFormsModule, CarFinanceRoutingModule, SharedModule],
})
export class CarFinanceModule {}
