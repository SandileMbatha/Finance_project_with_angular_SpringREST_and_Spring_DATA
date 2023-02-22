import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CarFinance } from '../models/finance/debt/car-finance';
import { environment } from 'src/environments/environment';
import { FinanceEvent } from '../models/finance/finance-event';

@Injectable({
  providedIn: 'root',
})
export class CarFinanceDataService {
  private carFinancesUrl = environment.apiUrl + '/customers/';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  public getCarFinance(
    customerId: number,
    carFinanceId: number
  ): Observable<CarFinance> {
    return this.http.get<CarFinance>(
      this.carFinancesUrl + customerId + '/car-finances/' + carFinanceId
    );
  }

  public getFinance(id: number, carFinanceId: number): Observable<CarFinance> {
    return this.http.get<CarFinance>(
      this.carFinancesUrl + id + '/car-finances/' + carFinanceId
    );
  }

  public getCarFinancesForCustomer(
    customerId: number | undefined
  ): Observable<CarFinance[]> {
    return this.http.get<CarFinance[]>(
      this.carFinancesUrl + customerId + '/car-finances'
    );
  }

  public getCarFinancesForCustomerPaginated(
    customerId: number | undefined,
    page: number,
    size: number
  ): Observable<any> {
    return this.http.get(
      this.carFinancesUrl +
        customerId +
        '/car-finances?page=' +
        page +
        '&size=' +
        size
    );
  }

  public save(carFinance: CarFinance): Observable<CarFinance> {
    return this.http.post<CarFinance>(
      this.carFinancesUrl + carFinance.customer.customerNum + '/car-finances',
      carFinance,
      this.httpOptions
    );
  }

  public delete(path: string): Observable<any> {
    let fullPath = this.getPath(path);
    if (path.includes('events')) {
      return this.http.delete<Event>(this.carFinancesUrl + fullPath);
    } else {
      return this.http.delete<CarFinance>(this.carFinancesUrl + fullPath);
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

  public update(carFinance: CarFinance): Observable<CarFinance> {
    return this.http.put<CarFinance>(
      this.carFinancesUrl +
        carFinance.customer.customerNum +
        '/car-finances/' +
        carFinance.financeNum +
        '/update',
      carFinance,
      this.httpOptions
    );
  }

  public updateEvent(
    carF_id: number,
    cust_id: number,
    event: FinanceEvent
  ): Observable<FinanceEvent> {
    return this.http.put<FinanceEvent>(
      this.carFinancesUrl +
        cust_id +
        '/car-finances/' +
        carF_id +
        '/events/' +
        event.eventNum +
        '/update',
      event,
      this.httpOptions
    );
  }

  public createEvent(
    carF_id: number,
    cust_id: number,
    value: any
  ): Observable<CarFinance> {
    return this.http.post<CarFinance>(
      this.carFinancesUrl + cust_id + '/car-finances/' + carF_id + '/events',
      value,
      this.httpOptions
    );
  }
}
