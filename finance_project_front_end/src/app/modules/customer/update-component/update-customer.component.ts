import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Customer } from 'src/app/models/customer';
import { CustomerDataService } from 'src/app/services/customer-data.service';
import { idValidator } from 'src/app/validators/id-number.validator';

@Component({
  selector: 'app-update-component',
  templateUrl: './update-customer.component.html',
  styleUrls: ['./update-customer.component.scss'],
})
export class UpdateCustomerComponent implements OnInit {
  public formValid: boolean = true;

  public title: string = 'Update Customer';
  public submitButtonText: string = 'Save';
  public id: any;
  public customer: Customer | undefined;

  public updateForm: FormGroup = new FormGroup({
    customerNum: new FormControl(),
    idNumber: new FormControl('', [
      Validators.required,
      this.idValidator.bind(this),
    ]),
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    dateOfBirth: new FormControl(''),
  });

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerDataService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.customerService.getCustomer(this.id).subscribe({
      next: (returnedCustomer) => {
        this.updateForm.controls['customerNum'].setValue(
          returnedCustomer.customerNum
        );
        this.updateForm.controls['idNumber'].setValue(
          returnedCustomer.idNumber
        );
        this.updateForm.controls['name'].setValue(returnedCustomer.name);
        this.updateForm.controls['surname'].setValue(returnedCustomer.surname);
        this.updateForm.controls['dateOfBirth'].setValue(
          returnedCustomer.dateOfBirth
        );
      },
    });
  }

  public idValidator(formcontrol: FormControl): { [key: string]: boolean;} {
    return idValidator(formcontrol, this.updateForm, this.customerService);
  }

}
