import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Customer } from '../models/customer';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerDataService {
  private customersUrl = environment.apiUrl + '/customers/';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  public getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.customersUrl);
  }

  public getCustomersPaginated(page: number, size: number): Observable<any> {
    return this.http.get(this.customersUrl + '?page=' + page + '&size=' + size);
  }

  public getCustomer(customerId: number): Observable<Customer> {
    return this.http.get<Customer>(this.customersUrl + customerId);
  }

  public save(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(
      this.customersUrl,
      customer,
      this.httpOptions
    );
  }

  public delete(path: string): Observable<Customer> {
    let customerId = path.split('/')[2];
    return this.http.delete<Customer>(this.customersUrl + customerId);
  }

  public update(customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(
      this.customersUrl + customer.customerNum + '/update',
      customer,
      this.httpOptions
    );
  }
}
