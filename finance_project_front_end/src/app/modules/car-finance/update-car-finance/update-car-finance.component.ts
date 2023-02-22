import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from 'src/app/models/customer';
import { CarFinanceDataService } from 'src/app/services/car-finance-data.service';
import { CustomerSharedService } from 'src/app/services/customer-shared.service';
import { asyncballoonValidator, asyncMoneyValidator } from 'src/app/validators/money.validator';
import { asyncPercentageValidator } from 'src/app/validators/percentage.validator';
import { asyncTermValidator } from 'src/app/validators/term.validator';

@Component({
  selector: 'app-update-car-finance',
  templateUrl: './update-car-finance.component.html',
  styleUrls: ['./update-car-finance.component.scss'],
})
export class UpdateCarFinanceComponent implements OnInit {
  public title: string = 'Update Car Finance';
  public submitButtonText: string = 'Save';

  public updateCarFinanceForm: FormGroup = new FormGroup({
    customer: new FormControl(),
    financeNum: new FormControl(),
    name: new FormControl(null, [Validators.required]),
    price: new FormControl(null, [Validators.required],[asyncMoneyValidator()]),
    initialDeposit: new FormControl(null, [Validators.required],[asyncMoneyValidator()]),
    term: new FormControl(null, [Validators.required],[asyncTermValidator()]),
    rate: new FormControl(null, [Validators.required], [asyncPercentageValidator()]),
    balloonPayment: new FormControl(null, [Validators.required], [asyncballoonValidator()]),
  });

  public customer?: Customer;
  public carFinanceId: any;
  public customerId: any;

  constructor(
    private sharedService: CustomerSharedService,
    private carFinanceService: CarFinanceDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.getCustomer();
    this.carFinanceId = this.route.snapshot.params['cId'];
    this.customerId = this.customer?.customerNum;
    this.updateCarFinanceForm.controls['customer'].setValue(this.customer);
    this.updateCarFinanceForm.controls['financeNum'].setValue(
      this.carFinanceId
    );
    this.carFinanceService
      .getCarFinance(this.customerId, this.carFinanceId)
      .subscribe({
        next: (returnedCarFinance) => {
          this.updateCarFinanceForm.controls['name'].setValue(
            returnedCarFinance.name
          );
          this.updateCarFinanceForm.controls['price'].setValue(
            this.removeParse(returnedCarFinance.price.value)
          );
          this.updateCarFinanceForm.controls['initialDeposit'].setValue(
            this.removeParse(returnedCarFinance.initialDeposit.value)
          );
          this.updateCarFinanceForm.controls['term'].setValue(
            returnedCarFinance.term + ''
          );
          this.updateCarFinanceForm.controls['rate'].setValue(
            returnedCarFinance.rate + ''
          );
          this.updateCarFinanceForm.controls['balloonPayment'].setValue(
            this.removeParse(returnedCarFinance.balloonPayment.value)
          );
        },
      });
  }

  public getCustomer(): void {
    this.customer = this.sharedService.getCurrentCustomer();
  }

  public removeParse(value: string): string {
    return value.split('.')[0];
  }
}
