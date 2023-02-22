import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared.module';
import { InvestmentRoutingModule } from './investment-routing.module';
import { CreateInvestmentComponent } from './create-investment/create-investment.component';
import { UpdateInvestmentComponent } from './update-investment/update-investment.component';

@NgModule({
  declarations: [CreateInvestmentComponent, UpdateInvestmentComponent],
  imports: [CommonModule, ReactiveFormsModule, InvestmentRoutingModule, SharedModule],
})
export class InvestmentModule {}
