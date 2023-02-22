import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaxCalculatorComponent } from './tax-calculator/tax-calculator.component';

const routes: Routes = [
  {
    path: '',
    component: TaxCalculatorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaxCalculatorRoutingModule {}
