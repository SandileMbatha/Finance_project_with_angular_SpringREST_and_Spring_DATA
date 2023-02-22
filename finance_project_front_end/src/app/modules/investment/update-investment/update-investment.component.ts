import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from 'src/app/models/customer';
import { CustomerSharedService } from 'src/app/services/customer-shared.service';
import { InvestmentDataService } from 'src/app/services/investment-data.service';
import { investmentNameExist } from 'src/app/validators/finance.validator';
import { asyncMoneyValidator } from 'src/app/validators/money.validator';
import { asyncPercentageValidator } from 'src/app/validators/percentage.validator';
import { asyncTermValidator } from 'src/app/validators/term.validator';

@Component({
  selector: 'app-update-investment',
  templateUrl: './update-investment.component.html',
  styleUrls: ['./update-investment.component.scss'],
})
export class UpdateInvestmentComponent implements OnInit {
  public title: string = 'Update Investment';
  public submitButtonText: string = 'Save';

  public updateInvestmentForm: FormGroup = new FormGroup({
    customer: new FormControl(),
    financeNum: new FormControl(),
    name: new FormControl('', [Validators.required], [this.investmentNameExist()]),
    initialDeposit: new FormControl('', [Validators.required], [asyncMoneyValidator()]),
    monthlyContribution: new FormControl('', [Validators.required], [asyncMoneyValidator()]),
    term: new FormControl('', [Validators.required], [asyncTermValidator()]),
    rate: new FormControl('', [Validators.required], [asyncPercentageValidator()]),
  });

  public customer?: Customer;
  public path: string = '/';
  public cust_id: any;
  public inv_id: any;

  constructor(
    private route: ActivatedRoute,
    private investmentService: InvestmentDataService,
    private sharedService: CustomerSharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCustomer();
    this.inv_id = this.route.snapshot.params['id'];
    this.cust_id = this.customer?.customerNum;
    this.updateInvestmentForm.controls['customer'].setValue(this.customer);
    this.updateInvestmentForm.controls['financeNum'].setValue(this.inv_id);
    this.investmentService.getInvestment(this.cust_id, this.inv_id).subscribe({
      next: (returnedInvestment) => {
        this.updateInvestmentForm.controls['name'].setValue(
          returnedInvestment.name
        );
        this.updateInvestmentForm.controls['initialDeposit'].setValue(
          this.removeParse(returnedInvestment.initialDeposit.value)
        );
        this.updateInvestmentForm.controls['monthlyContribution'].setValue(
          this.removeParse(returnedInvestment.monthlyContribution.value)
        );
        this.updateInvestmentForm.controls['term'].setValue(
          returnedInvestment.term
        );
        this.updateInvestmentForm.controls['rate'].setValue(
          returnedInvestment.rate
        );
      },
    });
  }

  public investmentNameExist(){
    let custID = this.router.url.split('/')[2];
    return investmentNameExist(+custID, this.investmentService);
  }

  public removeParse(value: string): string {
    return value.split('.')[0];
  }

  public getCustomer(): void {
    this.customer = this.sharedService.getCurrentCustomer();
    this.path = '/customers/' + this.customer?.customerNum;
  }
}
