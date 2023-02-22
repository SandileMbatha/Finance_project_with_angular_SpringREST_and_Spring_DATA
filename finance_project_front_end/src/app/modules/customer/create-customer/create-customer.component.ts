import { Component, Input, OnInit } from '@angular/core';
import {FormGroup,FormControl,Validators,} from '@angular/forms';
import { CustomerDataService } from '../../../services/customer-data.service';
import { alphaOnly, idValidator } from 'src/app/validators/id-number.validator';
import { NotificationService } from 'src/app/services/notification.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { Customer } from 'src/app/models/customer';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss'],
})
export class CreateCustomerComponent implements OnInit {
  @Input() public title: string = 'Register Customer';
  @Input() public submitButtonText: string = 'Register';
  @Input() public updateCustomer: boolean = false;

  @Input() public customerForm: FormGroup = new FormGroup({
      idNumber: new FormControl('', [Validators.required, this.idValidator.bind(this)]),
      name: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required),
      dateOfBirth: new FormControl(''),
  });

  public formValid: boolean = true;
  public errorMessage: string = 'Please enter a valid ID number.';

  constructor(
    private customerService: CustomerDataService,
    private notificationService: NotificationService,
    private navigationService: NavigationService
  ) {}

  ngOnInit() {

  }
  public onlyNumber(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  public alphaOnly(event: any) {
    return alphaOnly(event);
  }

  public onClear(): void {
    const keys: string[] = Object.keys(this.customerForm.controls);
    for(let i = keys.length-1; i >= 0; i--){
      this.customerForm.controls[keys[i]].reset();
    }
  }

  public onCancel(): void {
    this.navigationService.goBackHistory();
  }

  public onSubmit(): void {
    if (this.customerForm.valid) {
      let customer = this.customerForm.value;
      this.customerService.getCustomers().subscribe((customers) => {
        if (!this.customerExists(customer, customers)) {
          this.persistCustomer(customer);
        } else {
          this.errorMessage = 'ID Number already exists.';
          this.customerForm.controls['idNumber'].setErrors({ incorrect: true });
        }
      });
    }
  }

  public idValidator(formcontrol: FormControl): { [key: string]: boolean;} {
    return idValidator(formcontrol, this.customerForm, this.customerService);
  }

  public onTextChanged(event: any): void {
    this.errorMessage = 'Please enter a valid ID number.';
  }

  private persistCustomer(customer: Customer) {
    if (this.updateCustomer) {
      this.customerService.update(customer).subscribe({
        next: () => this.updateSuccess(),
        error: (error) => this.notificationService.showErrorMessage(error),
      });
    } else {
      this.customerService.save(customer).subscribe({
        next: (savedCustomer) => this.creationSuccess(),
        error: (error) => this.notificationService.showErrorMessage(error),
      });
    }
  }

  private creationSuccess(): void {
    this.notificationService.showSuccessMessage(
      'Customer successfully registered.'
    );
    this.navigationService.goToHomePage();
  }

  private updateSuccess(): void {
    this.notificationService.showSuccessMessage(
      'Customer successfully updated.'
    );
    this.navigationService.goToHomePage();
  }

  private customerExists(
    newCustomer: Customer,
    customers: Customer[]
  ): boolean {
    for (let customer of customers) {
      if (newCustomer.idNumber === customer.idNumber) {
        if (
          !this.updateCustomer ||
          (this.updateCustomer &&
            newCustomer.customerNum !== customer.customerNum)
        ) {
          return true;
        }
      }
    }
    return false;
  }
}
