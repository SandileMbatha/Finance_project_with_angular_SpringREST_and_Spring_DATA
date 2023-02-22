import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Rebate } from '../models/tax/rebate';
import { TaxCalculations } from '../models/tax/tax-calculations';
import { TaxPayer } from '../models/tax/tax-payer';

@Injectable({
  providedIn: 'root',
})
export class TaxService {
  private taxesUrl = environment.apiUrl + '/taxes/';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  public getAvailableTaxYears(): Observable<number[]> {
    return this.http.get<number[]>(this.taxesUrl + 'tax-years');
  }

  public getRebates(year: Number): Observable<Rebate[]> {
    return this.http.get<Rebate[]>(this.taxesUrl + 'rebates/' + year);
  }

  public getTaxCalculations(taxPayer: TaxPayer): Observable<TaxCalculations> {
    return this.http.post<TaxCalculations>(
      this.taxesUrl,
      taxPayer,
      this.httpOptions
    );
  }
}
