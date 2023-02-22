import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup} from '@angular/forms';
import { CarFinance } from '../../../models/finance/debt/car-finance';
import { CarFinanceDataService } from '../../../services/car-finance-data.service';
import { Customer } from '../../../models/customer';
import { CustomerSharedService } from '../../../services/customer-shared.service';
import { alphaOnly } from 'src/app/validators/id-number.validator';
import { NotificationService } from 'src/app/services/notification.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { Router } from '@angular/router';
import { asyncballoonValidator, asyncMoneyValidator} from 'src/app/validators/money.validator';
import { asyncTermValidator } from 'src/app/validators/term.validator';
import { asyncPercentageValidator} from 'src/app/validators/percentage.validator';
import { carFinanceNameExist } from 'src/app/validators/finance.validator';

@Component({
  selector: 'app-create-car-finance',
  templateUrl: './create-car-finance.component.html',
  styleUrls: ['./create-car-finance.component.scss'],
})
export class CreateCarFinanceComponent implements OnInit {
  @Input() public title: string = 'Create New Car Finance';
  @Input() public submitButtonText: string = 'Create';
  @Input() public updateCarFinance: boolean = false;

  @Input() public carFinanceForm = new FormGroup({
    name: new FormControl(null, [Validators.required], [this.carFinanceNameExist()]),
    price: new FormControl(null, [Validators.required],[asyncMoneyValidator()]),
    initialDeposit: new FormControl(null, [Validators.required],[asyncMoneyValidator()]),
    term: new FormControl(null, [Validators.required],[asyncTermValidator()]),
    rate: new FormControl(null, [Validators.required], [asyncPercentageValidator()]),
    balloonPayment: new FormControl(null, [Validators.required], [asyncballoonValidator()]),
  });

  public customer?: Customer;
  public formValid: boolean = true;
  public errorMessage: string = 'Please enter a valid name.';

  constructor(
    private sharedService: CustomerSharedService,
    private carFinanceService: CarFinanceDataService,
    private notificationService: NotificationService,
    private navigationService: NavigationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getCustomer();
  }

  public onClear(): void {
    this.carFinanceForm.reset();
  }

  public onCancel(): void {
    this.navigationService.goBack();
  }

  public onSubmit(): void {
    this.formValid = false;
    if (this.carFinanceForm.valid) {
      this.formValid = true;
      let carFinance = this.convertFormToCarFinance();
      const custId = this.customer?.customerNum;
      this.carFinanceService
        .getCarFinancesForCustomer(custId)
        .subscribe((carFinances) => {
          if (!this.carFinanceExists(carFinance, carFinances)) {
            this.persistCarFinance(carFinance);
          } else {
            this.errorMessage = 'You already have a Car Finance by that name.';
            this.carFinanceForm.controls['name'].setErrors({ incorrect: true });
          }
        });
    }
  }

  public getCustomer(): void {
    this.customer = this.sharedService.getCurrentCustomer();
  }

  public alphaOnly(event: any) {
    return alphaOnly(event);
  }

  public onTextChanged(event: any): void {
    this.errorMessage = 'Please enter a valid name.';
  }

  private persistCarFinance(carFinance: CarFinance) {
    if (this.updateCarFinance) {
      this.carFinanceService.update(carFinance).subscribe({
        next: () => this.updateSuccess(),
        error: (error) => this.notificationService.showErrorMessage(error),
      });
    } else {
      this.carFinanceService.save(carFinance).subscribe({
        next: (returnedCarFinance) => this.creationSuccess(returnedCarFinance),
        error: (error) => this.notificationService.showErrorMessage(error),
      });
    }
  }

  private creationSuccess(returnedCarFinance: CarFinance): void {
    this.notificationService.showSuccessMessage(
      'Car Finance successfully saved.'
    );
    this.navigationService.goToCarFinancePage(returnedCarFinance.financeNum);
  }

  private updateSuccess(): void {
    this.notificationService.showSuccessMessage(
      'Car Finance successfully updated.'
    );
    this.navigationService.goBack();
  }

  public carFinanceNameExist(){
    let custID = this.router.url.split('/')[2];
    return carFinanceNameExist(+custID, this.carFinanceService);
  }


  private carFinanceExists(
    newCarFinance: CarFinance,
    carFinances: CarFinance[]
  ): boolean {
    for (let carFinance of carFinances) {
      if (newCarFinance.name === carFinance.name) {
        if (
          !this.updateCarFinance ||
          (this.updateCarFinance &&
            newCarFinance.financeNum !== carFinance.financeNum)
        ) {
          return true;
        }
      }
    }

    return false;
  }

  private convertFormToCarFinance(): CarFinance {
    let carFinance: CarFinance = {
      financeNum: 0,
      customer: undefined as any,
      name: '',
      initialDeposit: undefined as any,
      term: 0,
      rate: 0,
      monthlyDetails: [],
      events: [],
      actualTerm: 0,
      totalDeposits: undefined as any,
      totalInterest: undefined as any,
      totalMonthlyRepayments: undefined as any,
      price: undefined as any,
      monthlyRepayment: undefined as any,
      balloonPayment: undefined as any,
      finalClosingBalance: undefined as any,
    };
    Object.assign(carFinance, this.carFinanceForm.value);
    carFinance.customer = this.customer as Customer;
    return carFinance;
  }

}
