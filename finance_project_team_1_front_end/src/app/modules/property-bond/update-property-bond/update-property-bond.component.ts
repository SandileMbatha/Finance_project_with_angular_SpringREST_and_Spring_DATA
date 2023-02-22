import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from 'src/app/models/customer';
import { CustomerSharedService } from 'src/app/services/customer-shared.service';
import { PropertyBondDataService } from 'src/app/services/property-bond-data.service';
import { asyncMoneyValidator } from 'src/app/validators/money.validator';
import { asyncTermValidator } from 'src/app/validators/term.validator';
import { asyncPercentageValidator } from 'src/app/validators/percentage.validator';
import { propertyBondNameExist } from 'src/app/validators/finance.validator';

@Component({
  selector: 'app-update-property-bond',
  templateUrl: './update-property-bond.component.html',
  styleUrls: ['./update-property-bond.component.scss'],
})
export class UpdatePropertyBondComponent implements OnInit {
  public title: string = 'Update Property Bond';
  public submitButtonText: string = 'Save';

  public updatePropertyBondForm: FormGroup = new FormGroup({
    customer: new FormControl(),
    financeNum: new FormControl(),
    name: new FormControl('', [Validators.required], [this.propertyBondNameExist()]),
    price: new FormControl('', [Validators.required],[asyncMoneyValidator()]),
    initialDeposit: new FormControl('', [Validators.required],[asyncMoneyValidator()]),
    term: new FormControl('', [Validators.required],[asyncTermValidator()]),
    rate: new FormControl('', [Validators.required],[asyncPercentageValidator()]),
    bondCosts: new FormControl('', [Validators.required],[asyncMoneyValidator()]),
    legalCosts: new FormControl('', [Validators.required],[asyncMoneyValidator()]),
  });

  public path: string = '/';
  public formValid: boolean = true;
  public errorMessage: string = '';
  public customer?: Customer;
  public propertyBondId: any;
  public customerId: any;
  public url: string = '';

  constructor(
    private route: ActivatedRoute,
    private propertyBondService: PropertyBondDataService,
    private sharedService: CustomerSharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCustomer();
    this.customerId = this.customer?.customerNum;
    this.propertyBondId = this.route.snapshot.params['pId'];
    this.updatePropertyBondForm.controls['customer'].setValue(this.customer);
    this.updatePropertyBondForm.controls['financeNum'].setValue(
      this.propertyBondId
    );
    this.propertyBondService
      .getPropertyBond(this.customerId, this.propertyBondId)
      .subscribe({
        next: (returnedPropertyBond) => {
          this.updatePropertyBondForm.controls['name'].setValue(
            returnedPropertyBond.name
          );
          this.updatePropertyBondForm.controls['price'].setValue(
            this.removeParse(returnedPropertyBond.price.value)
          );
          this.updatePropertyBondForm.controls['initialDeposit'].setValue(
            this.removeParse(returnedPropertyBond.initialDeposit.value)
          );
          this.updatePropertyBondForm.controls['term'].setValue(
            returnedPropertyBond.term + ''
          );
          this.updatePropertyBondForm.controls['rate'].setValue(
            returnedPropertyBond.rate + ''
          );
          this.updatePropertyBondForm.controls['bondCosts'].setValue(
            this.removeParse(returnedPropertyBond.bondCosts.value)
          );
          this.updatePropertyBondForm.controls['legalCosts'].setValue(
            this.removeParse(returnedPropertyBond.legalCosts.value)
          );
        },
      });
  }

  public propertyBondNameExist(){
    let custID = this.router.url.split('/')[2];
    return propertyBondNameExist(+custID, this.propertyBondService);
  }

  public getCustomer(): void {
    this.customer = this.sharedService.getCurrentCustomer();
    this.path = '/customers/' + this.customer?.customerNum;
  }

  public removeParse(value: string): string {
    return value.split('.')[0];
  }
}
