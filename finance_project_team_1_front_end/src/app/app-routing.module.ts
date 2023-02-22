import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'customers',
    pathMatch: 'full',
  },
  {
    path: 'customers',
    loadChildren: () =>
      import('./modules/customer/customer.module').then(
        (m) => m.CustomerModule
      ),
  },
  {
    path: 'customers/:id/investments',
    loadChildren: () =>
      import('./modules/investment/investment.module').then(
        (m) => m.InvestmentModule
      ),
  },
  {
    path: 'customers/:id/property-bonds',
    loadChildren: () =>
      import('./modules/property-bond/property-bond.module').then(
        (m) => m.PropertyBondModule
      ),
  },
  {
    path: 'customers/:id/car-finances',
    loadChildren: () =>
      import('./modules/car-finance/car-finance.module').then(
        (m) => m.CarFinanceModule
      ),
  },
  {
    path: 'taxes',
    loadChildren: () =>
      import('./modules/tax-calculator/tax-calculator.module').then(
        (m) => m.TaxCalculatorModule
      ),
  },
  {
    path: '404',
    component: PageNotFoundComponent,
  },
  {
    path: '**',
    redirectTo: '404',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
