import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrModule } from 'ngx-toastr';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomerSharedService } from './services/customer-shared.service';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { InvestmentDetailsComponent } from './modules/investment/investment-details/investment-details.component';
import { PropertyBondDetailsComponent } from './modules/property-bond/property-bond-details/property-bond-details.component';
import { CarFinanceDetailsComponent } from './modules/car-finance/car-finance-details/car-finance-details.component';
import { TablesWithEventsComponent } from './reusables/tables-with-events/tables-with-events.component';
import { DetailsCardComponent } from './reusables/details-card/details-card.component';
import { ChartComponent } from './reusables/chart/chart.component';
import { TableComponent } from './reusables/table/table.component';
import { CustomerListComponent } from './modules/customer/customer-list/customer-list.component';
import { CustomerDetailsComponent } from './modules/customer/customer-details/customer-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EventComponent } from './reusables/event/event.component';
import { FormTemplateComponent } from './reusables/form-template/form-template.component';
import { ValidatorTemplateComponent } from './reusables/validator-template/validator-template.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    PageNotFoundComponent,
    CustomerListComponent,
    CustomerDetailsComponent,
    InvestmentDetailsComponent,
    PropertyBondDetailsComponent,
    CarFinanceDetailsComponent,
    TableComponent,
    TablesWithEventsComponent,
    DetailsCardComponent,
    ChartComponent,
    EventComponent,
    FormTemplateComponent,
    ValidatorTemplateComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    FontAwesomeModule,
    ToastrModule.forRoot(),
    LoggerModule.forRoot({
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.ERROR,
    }),
  ],

  exports: [EventComponent],
  providers: [CustomerSharedService],
  bootstrap: [AppComponent],
})
export class AppModule {
  public constructor(library: FaIconLibrary) {
    library.addIconPacks(far, fas);
  }
}
