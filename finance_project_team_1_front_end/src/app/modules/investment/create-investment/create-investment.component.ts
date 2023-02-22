import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomerSharedService } from '../../../services/customer-shared.service';
import { InvestmentDataService } from '../../../services/investment-data.service';
import { Customer } from '../../../models/customer';
import { Investment } from '../../../models/finance/investment';
import { alphaOnly } from 'src/app/validators/id-number.validator';
import { NotificationService } from 'src/app/services/notification.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { asyncMoneyValidator} from 'src/app/validators/money.validator';
import { Router } from '@angular/router';
import { asyncTermValidator} from 'src/app/validators/term.validator';
import { asyncPercentageValidator} from 'src/app/validators/percentage.validator';
import { alphabetsWithWhiteSpaces } from 'src/app/validators/general.validator';
import { investmentNameExist } from 'src/app/validators/finance.validator';

@Component({
  selector: 'app-create-investment',
  templateUrl: './create-investment.component.html',
  styleUrls: ['./create-investment.component.scss'],
})
export class CreateInvestmentComponent implements OnInit {
  @Input() public title: string = 'Create New Investment';
  @Input() public submitButtonText: string = 'Create';
  @Input() public updateInvestment: boolean = false;


  @Input() public investmentForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required], [this.investmentNameExist()]),
    initialDeposit: new FormControl('', [Validators.required], [asyncMoneyValidator()]),
    monthlyContribution: new FormControl('', [Validators.required], [asyncMoneyValidator()]),
    term: new FormControl('', [Validators.required], [asyncTermValidator()]),
    rate: new FormControl('', [Validators.required], [asyncPercentageValidator()]),
  });

  public customer?: Customer;
  public path?: string;
  public formValid: boolean = true;
  public errorMessage: string = 'Please enter a valid name.';

  constructor(
    private sharedService: CustomerSharedService,
    private investmentService: InvestmentDataService,
    private notificationService: NotificationService,
    private navigationService: NavigationService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.getCustomer();
  }

  public onClear(): void {
    this.investmentForm.reset();
  }

  public onCancel(): void {
    this.navigationService.goBack();
  }

  public onSubmit(): void {
    this.formValid = false;
    if (this.investmentForm.valid) {
      this.formValid = true;
      let investment = this.convertFormToInvestment();
      const custId = this.customer?.customerNum;
      this.investmentService
        .getInvestmentsForCustomer(custId)
        .subscribe((investments) => {
          if (!this.investmentExists(investment, investments)) {
            this.persistInvestment(investment);
          } else {
            this.errorMessage = 'You already have an Investment by that name.';
            this.investmentForm.controls['name'].setErrors({ incorrect: true });
          }
        });
    }
  }

  public getCustomer(): void {
    this.customer = this.sharedService.getCurrentCustomer();
    this.path = '/customers/' + this.customer?.customerNum;
  }

  public alphaOnly(event: any) {
    return alphaOnly(event);
  }

  public alphabetsWithWhiteSpaces(FormControl: FormControl){
    return alphabetsWithWhiteSpaces(FormControl)
  }

  public onTextChanged(event: any): void {
    this.errorMessage = 'Please enter a valid name.';
  }

  public investmentNameExist(){
    let custID = this.router.url.split('/')[2];
    return investmentNameExist(+custID, this.investmentService);
  }

  private persistInvestment(investment: Investment) {
    if (this.updateInvestment) {
      this.investmentService.update(investment).subscribe({
        next: () => this.updateSuccess(),
        error: (error) => this.notificationService.showErrorMessage(error),
      });
    } else {
      this.investmentService.save(investment).subscribe({
        next: (returnedInvestment) => this.creationSuccess(returnedInvestment),
        error: (error) => this.notificationService.showErrorMessage(error),
      });
    }
  }

  private creationSuccess(returnedInvestment: Investment): void {
    this.notificationService.showSuccessMessage(
      'Investment successfully saved.'
    );
    this.navigationService.goToInvestmentPage(returnedInvestment.financeNum);
  }

  private updateSuccess(): void {
    this.notificationService.showSuccessMessage(
      'Investment successfully updated.'
    );
    this.navigationService.goBack();
  }

  private investmentExists(
    newInvestment: Investment,
    investments: Investment[]
  ): boolean {
    for (let investment of investments) {
      if (newInvestment.name === investment.name) {
        if (
          !this.updateInvestment ||
          (this.updateInvestment &&
            newInvestment.financeNum !== investment.financeNum)
        ) {
          return true;
        }
      }
    }
    return false;
  }

  private convertFormToInvestment(): Investment {
    let investment: Investment = {
      customer: undefined as any,
      name: '',
      initialDeposit: undefined as any,
      term: 0,
      rate: 0,
      financeNum: 0,
      monthlyDetails: [],
      events: [],
      totalDeposits: undefined as any,
      totalWithdraws: undefined as any,
      totalInterest: undefined as any,
      monthlyContribution: undefined as any,
      totalMonthlyContribution: undefined as any,
      finalAmount: undefined as any,
    };
    Object.assign(investment, this.investmentForm.value);
    investment.customer = this.customer as Customer;
    return investment;
  }
}
