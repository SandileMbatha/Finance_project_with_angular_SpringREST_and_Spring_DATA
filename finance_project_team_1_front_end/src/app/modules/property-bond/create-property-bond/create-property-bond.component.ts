import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Customer } from '../../../models/customer';
import { PropertyBond } from '../../../models/finance/debt/property-bond';
import { PropertyBondDataService } from '../../../services/property-bond-data.service';
import { CustomerSharedService } from '../../../services/customer-shared.service';
import { alphaOnly } from 'src/app/validators/id-number.validator';
import { NotificationService } from 'src/app/services/notification.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { Router } from '@angular/router';
import { asyncMoneyValidator } from 'src/app/validators/money.validator';
import { asyncTermValidator } from 'src/app/validators/term.validator';
import { asyncPercentageValidator } from 'src/app/validators/percentage.validator';
import { propertyBondNameExist } from 'src/app/validators/finance.validator';

@Component({
  selector: 'app-create-property-bond',
  templateUrl: './create-property-bond.component.html',
  styleUrls: ['./create-property-bond.component.scss'],
})
export class CreatePropertyBondComponent implements OnInit {
  @Input() public title: string = 'Create New Property Bond';
  @Input() public submitButtonText: string = 'Create';
  @Input() public updatePropertyBond: boolean = false;

  @Input() public propertyBondForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required], [this.propertyBondNameExist()]),
    price: new FormControl('', [Validators.required],[asyncMoneyValidator()]),
    initialDeposit: new FormControl('', [Validators.required],[asyncMoneyValidator()]),
    term: new FormControl('', [Validators.required],[asyncTermValidator()]),
    rate: new FormControl('', [Validators.required],[asyncPercentageValidator()]),
    bondCosts: new FormControl('', [Validators.required],[asyncMoneyValidator()]),
    legalCosts: new FormControl('', [Validators.required],[asyncMoneyValidator()]),
  });

  public customer?: Customer;
  public path?: string;
  public formValid: boolean = true;
  public errorMessage: string = 'Please enter a valid name.';

  constructor(
    private sharedService: CustomerSharedService,
    private propertBondService: PropertyBondDataService,
    private notificationService: NotificationService,
    private navigationService: NavigationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getCustomer();
  }

  public onClear(): void {
    this.propertyBondForm.reset();
  }

  public onCancel(): void {
    this.navigationService.goBack();
  }

  public onSubmit(): void {
    this.formValid = false;
    if (this.propertyBondForm.valid) {
      this.formValid = true;
      let propertyBond = this.convertFormToPropertyBond();
      const custId = this.customer?.customerNum;
      this.propertBondService
        .getPropertyBondsForCustomer(custId)
        .subscribe((propertyBonds) => {
          if (!this.propertyBondExists(propertyBond, propertyBonds)) {
            this.persistPropertyBond(propertyBond);
          } else {
            this.errorMessage =
              'You already have a Property Bond by that name.';
            this.propertyBondForm.controls['name'].setErrors({
              incorrect: true,
            });
          }
        });
    }
  }

  public getCustomer(): void {
    this.customer = this.sharedService.getCurrentCustomer();
    this.path = '/customers/' + this.customer?.customerNum;
  }

  public moneyValidator(control: FormControl): { [message: string]: boolean } {
    if (control.value < 0) {
      return { 'Amount cannot be less than 0!': true };
    }
    return null as any;
  }

  public termValidator(control: FormControl): { [message: string]: boolean } {
    if (control.value < 0) {
      return { 'Term cannot be less than 0!': true };
    }
    if (control.value % 1 > 0) {
      return { 'Term needs to be a whole number!': true };
    }
    return null as any;
  }

  public rateValidator(control: FormControl): { [message: string]: boolean } {
    if (control.value > 0) {
      return { 'Interet rate cannot be less than 0!': true };
    }
    if (control.value > 100) {
      return { 'Interet rate cannot be more than 100!': true };
    }
    return null as any;
  }

  public alphaOnly(event: any) {
    return alphaOnly(event);
  }

  public onTextChanged(event: any): void {
    this.errorMessage = 'Please enter a valid name.';
  }

  public propertyBondNameExist(){
    let custID = this.router.url.split('/')[2];
    return propertyBondNameExist(+custID, this.propertBondService);
  }

  private persistPropertyBond(propertyBond: PropertyBond) {
    if (this.updatePropertyBond) {
      this.propertBondService.update(propertyBond).subscribe({
        next: () => this.updateSuccess(),
        error: (error) => this.notificationService.showErrorMessage(error),
      });
    } else {
      this.propertBondService.save(propertyBond).subscribe({
        next: (returnedPropertyBond) =>
          this.creationSuccess(returnedPropertyBond),
        error: (error) => this.notificationService.showErrorMessage(error),
      });
    }
  }

  private creationSuccess(returnedPropertyBond: PropertyBond): void {
    this.notificationService.showSuccessMessage(
      'Property Bond successfully saved.'
    );
    this.navigationService.gotToPropertyBondPage(
      returnedPropertyBond.financeNum
    );
  }

  private updateSuccess(): void {
    this.notificationService.showSuccessMessage(
      'Property Bond successfully updated.'
    );
    this.navigationService.goBack();
  }

  private propertyBondExists(
    newPropertyBond: PropertyBond,
    propertyBonds: PropertyBond[]
  ): boolean {
    for (let propertyBond of propertyBonds) {
      if (newPropertyBond.name === propertyBond.name) {
        if (
          !this.updatePropertyBond ||
          (this.updatePropertyBond &&
            newPropertyBond.financeNum !== propertyBond.financeNum)
        ) {
          return true;
        }
      }
    }
    return false;
  }

  private convertFormToPropertyBond(): PropertyBond {
    let propertyBond: PropertyBond = {
      financeNum: 0,
      customer: undefined as any,
      name: '',
      initialDeposit: undefined as any,
      term: 0,
      rate: 0,
      monthlyDetails: [],
      events: [],
      totalCosts: undefined as any,
      actualTerm: undefined as any,
      totalDeposits: undefined as any,
      totalWithdraws: undefined as any,
      totalInterest: undefined as any,
      totalMonthlyRepayments: undefined as any,
      price: undefined as any,
      monthlyRepayment: undefined as any,
      bondCosts: undefined as any,
      legalCosts: undefined as any,
      transferCosts: undefined as any,
      finalClosingBalance: undefined as any,
    };
    Object.assign(propertyBond, this.propertyBondForm.value);
    propertyBond.customer = this.customer as Customer;
    return propertyBond;
  }
}
