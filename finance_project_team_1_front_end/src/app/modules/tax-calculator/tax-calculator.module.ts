import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { TaxCalculatorRoutingModule } from './tax-calculator-routing.module';
import { DeductableExpensesComponent } from './stepper/deductable-expenses/deductable-expenses.component';
import { IncomeComponent } from './stepper/income/income.component';
import { LessPayablesComponent } from './stepper/less-payables/less-payables.component';
import { PersonalInformationComponent } from './stepper/personal-information/personal-information.component';
import { TaxSummaryComponent } from './stepper/tax-summary/tax-summary.component';
import { TaxCalculatorComponent } from './tax-calculator/tax-calculator.component';

@NgModule({
  declarations: [
    TaxCalculatorComponent,
    PersonalInformationComponent,
    IncomeComponent,
    DeductableExpensesComponent,
    LessPayablesComponent,
    TaxSummaryComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatStepperModule,
    MatIconModule,
    MatSelectModule,
    TaxCalculatorRoutingModule,
  ],
})
export class TaxCalculatorModule {}
