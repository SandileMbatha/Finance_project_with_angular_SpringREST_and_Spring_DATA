import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Investment } from '../models/finance/investment';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FinanceEvent } from '../models/finance/finance-event';

@Injectable({
  providedIn: 'root',
})
export class InvestmentDataService {
  private investmentsUrl = environment.apiUrl + '/customers/';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient, private router: ActivatedRoute) {}

  public getInvestment(
    customerId: number,
    investmentId: number
  ): Observable<Investment> {
    return this.http.get<Investment>(
      this.investmentsUrl + customerId + '/investments/' + investmentId
    );
  }

  public getFinance(
    customerId: number,
    investmentId: number
  ): Observable<Investment> {
    return this.http.get<Investment>(
      this.investmentsUrl + customerId + '/investments/' + investmentId
    );
  }

  public getInvestmentsForCustomer(
    customerId: number | undefined
  ): Observable<Investment[]> {
    return this.http.get<Investment[]>(
      this.investmentsUrl + customerId + '/investments'
    );
  }

  public getInvestmentsForCustomerPaginated(
    customerId: number | undefined,
    page: number,
    size: number
  ): Observable<any> {
    return this.http.get(
      this.investmentsUrl +
        customerId +
        '/investments?page=' +
        page +
        '&size=' +
        size
    );
  }

  public save(investment: Investment): Observable<Investment> {
    return this.http.post<Investment>(
      this.investmentsUrl + investment.customer.customerNum + '/investments',
      investment,
      this.httpOptions
    );
  }

  public delete(path: string): Observable<any> {
    let fullPath = this.getPath(path);
    if (path.includes('events')) {
      return this.http.delete<Event>(this.investmentsUrl + fullPath);
    } else {
      return this.http.delete<Investment>(this.investmentsUrl + fullPath);
    }
  }

  getPath(path: string): string {
    let arr = path.split('/');
    let fullPath = '';
    for (let i = 2; i < arr.length; i++) {
      if (i != arr.length - 1) {
        fullPath += arr[i] + '/';
      } else {
        fullPath += arr[i];
      }
    }
    return fullPath;
  }

  public update(investment: Investment): Observable<Investment> {
    return this.http.put<Investment>(
      this.investmentsUrl +
        investment.customer.customerNum +
        '/investments/' +
        investment.financeNum +
        '/update',
      investment,
      this.httpOptions
    );
  }

  public updateEvent(
    inv_id: number,
    cust_id: number,
    event: FinanceEvent
  ): Observable<FinanceEvent> {
    return this.http.put<FinanceEvent>(
      this.investmentsUrl +
        cust_id +
        '/investments/' +
        inv_id +
        '/events/' +
        event.eventNum +
        '/update',
      event,
      this.httpOptions
    );
  }

  public createEvent(
    inv_id: number,
    cust_id: number,
    value: any
  ): Observable<Investment> {
    return this.http.post<Investment>(
      this.investmentsUrl + cust_id + '/investments/' + inv_id + '/events',
      value,
      this.httpOptions
    );
  }
}
