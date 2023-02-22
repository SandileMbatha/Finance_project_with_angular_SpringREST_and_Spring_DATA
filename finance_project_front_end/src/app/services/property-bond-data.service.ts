import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { PropertyBond } from '../models/finance/debt/property-bond';
import { environment } from 'src/environments/environment';
import { FinanceEvent } from '../models/finance/finance-event';

@Injectable({
  providedIn: 'root',
})
export class PropertyBondDataService {
  private propertyBondsUrl = environment.apiUrl + '/customers/';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  public getPropertyBond(
    customerId: number,
    proprtyBondId: number
  ): Observable<PropertyBond> {
    return this.http.get<PropertyBond>(
      this.propertyBondsUrl + customerId + '/property-bonds/' + proprtyBondId
    );
  }

  public getFinance(
    id: number,
    proprtyBondId: number
  ): Observable<PropertyBond> {
    return this.http.get<PropertyBond>(
      this.propertyBondsUrl + id + '/property-bonds/' + proprtyBondId
    );
  }

  public getPropertyBondsForCustomer(
    customerId: number | undefined
  ): Observable<PropertyBond[]> {
    return this.http.get<PropertyBond[]>(
      this.propertyBondsUrl + customerId + '/property-bonds'
    );
  }

  public getPropertyBondsForCustomerPaginated(
    customerId: number | undefined,
    page: number,
    size: number
  ): Observable<any> {
    return this.http.get(
      this.propertyBondsUrl +
        customerId +
        '/property-bonds?page=' +
        page +
        '&size=' +
        size
    );
  }

  public save(propertyBond: PropertyBond): Observable<PropertyBond> {
    return this.http.post<PropertyBond>(
      this.propertyBondsUrl +
        propertyBond.customer.customerNum +
        '/property-bonds',
      propertyBond,
      this.httpOptions
    );
  }

  public delete(path: string): Observable<any> {
    let fullPath = this.getPath(path);
    if (path.includes('events')) {
      return this.http.delete<Event>(this.propertyBondsUrl + fullPath);
    } else {
      return this.http.delete<PropertyBond>(this.propertyBondsUrl + fullPath);
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

  public update(propertyBond: PropertyBond): Observable<PropertyBond> {
    return this.http.put<PropertyBond>(
      this.propertyBondsUrl +
        propertyBond.customer.customerNum +
        '/property-bonds/' +
        propertyBond.financeNum +
        '/update',
      propertyBond,
      this.httpOptions
    );
  }

  public updateEvent(
    proB_id: number,
    cust_id: number,
    event: FinanceEvent
  ): Observable<FinanceEvent> {
    return this.http.put<FinanceEvent>(
      this.propertyBondsUrl +
        cust_id +
        '/property-bonds/' +
        proB_id +
        '/events/' +
        event.eventNum +
        '/update',
      event,
      this.httpOptions
    );
  }

  public createEvent(
    proB_id: number,
    cust_id: number,
    value: any
  ): Observable<PropertyBond> {
    return this.http.post<PropertyBond>(
      this.propertyBondsUrl +
        cust_id +
        '/property-bonds/' +
        proB_id +
        '/events',
      value,
      this.httpOptions
    );
  }
}
