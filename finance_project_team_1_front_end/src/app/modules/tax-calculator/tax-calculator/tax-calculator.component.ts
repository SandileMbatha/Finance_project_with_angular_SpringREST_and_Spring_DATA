import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Expense } from '../../../models/tax/expense';
import { Income } from '../../../models/tax/income';
import { TaxCalculations } from '../../../models/tax/tax-calculations';
import { TaxPayer } from '../../../models/tax/tax-payer';
import { TaxService } from '../../../services/tax.service';
import { alphaOnly } from '../../../validators/id-number.validator';
import { IOUtils } from '../../../models/ioutils';
import { Rebate } from 'src/app/models/tax/rebate';
import { Money } from 'src/app/models/money';
import { NavigationService } from 'src/app/services/navigation.service';
import { CustomerSharedService } from 'src/app/services/customer-shared.service';

@Component({
  selector: 'app-tax-calculator',
  templateUrl: './tax-calculator.component.html',
  styleUrls: ['./tax-calculator.component.scss'],
})
export class TaxCalculatorComponent implements OnInit {
  private taxCalculations?: TaxCalculations;

  private rebates: Rebate[] = [];

  public pathTo: string = '/taxes';

  public availableTaxYears: number[] = [];

  public taxForm: FormGroup = new FormGroup({
    // Personal Information
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    age: new FormControl('60', Validators.required),
    taxYear: new FormControl('2022', Validators.required),

    //Income:
    salary: new FormControl('', Validators.required),
    bonuses: new FormControl(''),
    interestReceived: new FormControl(''),
    dividends: new FormControl(''),
    totalCapitalGains: new FormControl(''),

    //Expenses
    retirementFund: new FormControl(''),
    travelAllowance: new FormControl(''),

    //Less Tax Payables
    medicalCredits: new FormControl(''),
  });

  constructor(
    private taxService: TaxService,
    private navigationService: NavigationService,
    private customerSharedService: CustomerSharedService
  ) {}

  ngOnInit(): void {
    this.customerSharedService.setCurrentCustomer(undefined);
    this.getAvailableTaxYears();
    this.getRebates();
  }

  public getAvailableTaxYears(): void {
    if (this.availableTaxYears.length === 0) {
      this.taxService
        .getAvailableTaxYears()
        .subscribe(
          (returnedTaxYears) => (this.availableTaxYears = returnedTaxYears)
        );
    }
  }

  private getRebates(): void {
    let selectedTaxYear = this.taxForm.get('taxYear')?.value;
    this.taxService.getRebates(selectedTaxYear).subscribe((returnedRebates) => {
      this.rebates = returnedRebates;
    });
  }

  public getPrimaryRebate(): string {
    if (this.rebates.length === 0) {
      this.getRebates();
    }

    if (this.rebates.length > 0) {
      return this.rebates[0].amount.value;
    }

    return '0.00';
  }

  public getSecondaryRebate(): string {
    if (this.rebates.length > 0) {
      if (this.taxForm.get('age')?.value >= this.rebates[1].minimumAge) {
        return this.rebates[1].amount.value;
      }
    }

    return '0.00';
  }

  public getTertiaryRebate(): string {
    if (this.rebates.length > 0) {
      if (this.taxForm.get('age')?.value >= this.rebates[2].minimumAge) {
        return this.rebates[2].amount.value;
      }
    }

    return '0.00';
  }

  public totalRebate(): string {
    let total = 0;
    total += +this.getPrimaryRebate();
    total += +this.getSecondaryRebate();
    total += +this.getTertiaryRebate();
    return this.formatMoneyLabel(total.toString());
  }

  public getMoneyAmount(formControlName: string): Money {
    return this.taxForm.get(formControlName)?.value === ''
      ? { value: '0.00' }
      : { value: this.taxForm.get(formControlName)?.value };
  }

  public getAllIncome(): Income[] {
    return [
      { type: 'Salary', amount: this.getMoneyAmount('salary') },
      {
        type: 'Bonuses',
        amount: this.getMoneyAmount('bonuses'),
      },
      {
        type: 'InterestReceived',
        amount: this.getMoneyAmount('interestReceived'),
      },
      {
        type: 'Dividends',
        amount: this.getMoneyAmount('dividends'),
      },
      {
        type: 'TotalCapitalGains',
        amount: this.getMoneyAmount('totalCapitalGains'),
      },
    ];
  }

  public totalIncome(): string {
    let total: number = 0;
    for (let income of this.getAllIncome()) {
      total += +income.amount;
    }
    return this.formatMoneyLabel(total.toFixed(2).toString());
  }

  public getAllExpenses(): Expense[] {
    return [
      {
        type: 'RetirementFund',
        amount: this.getMoneyAmount('retirementFund'),
      },
      {
        type: 'TravelAllowance',
        amount: this.getMoneyAmount('travelAllowance'),
      },
    ];
  }

  public totalExpenses(): string {
    let total: number = 0;
    for (let expense of this.getAllExpenses()) {
      total += +expense.amount;
    }
    return this.formatMoneyLabel(total.toFixed(2).toString());
  }

  public totalTaxableIncome(): string {
    if (this.taxCalculations !== undefined) {
      return this.formatMoneyLabel(
        this.taxCalculations?.totalTaxableIncome.value.toString()
      );
    }
    return '0.00';
  }

  public totalDeductableExpenses(): string {
    if (this.taxCalculations !== undefined) {
      return this.formatMoneyLabel(
        this.taxCalculations?.totalTaxDeductibleExpenses.value.toString()
      );
    }
    return '0.00';
  }

  public nettTaxableIncome(): string {
    if (this.taxCalculations !== undefined) {
      return this.formatMoneyLabel(
        this.taxCalculations?.nettTaxableIncome.value.toString()
      );
    }
    return '0.00';
  }

  public taxPayable(): string {
    if (this.taxCalculations !== undefined) {
      return this.formatMoneyLabel(
        this.taxCalculations?.taxPayable.value.toString()
      );
    }
    return '0.00';
  }

  public totalLessPayables(): string {
    let total: number = 0;

    total += +this.getMoneyAmount('medicalCredits').value;
    total += +this.getPrimaryRebate();
    total += +this.getSecondaryRebate();
    total += +this.getTertiaryRebate();

    return this.formatMoneyLabel(total.toString());
  }

  public nettTaxPayable(): string {
    if (this.taxCalculations !== undefined) {
      return this.formatMoneyLabel(
        this.taxCalculations?.nettTaxPayable.value.toString()
      );
    }
    return '0.00';
  }

  public getTaxPayer(): TaxPayer {
    return {
      age: this.taxForm.get('age')?.value,
      taxYear: this.taxForm.get('taxYear')?.value,
      income: this.getAllIncome(),
      expenses: this.getAllExpenses(),
      medicalCredits: this.getMoneyAmount('medicalCredits'),
    };
  }

  public formatMoneyLabel(str: string): string {
    return IOUtils.formatStringAsMoney(str);
  }

  public alphaOnly(event: any) {
    return alphaOnly(event);
  }

  public onFocus(event: any) {
    event.target.select();
  }

  public onClear(): void {
    this.taxForm.reset();
  }

  public onCancel(): void {
    this.navigationService.goToHomePage();
  }

  public onSubmit(): void {
    if (this.taxForm.valid) {
      this.taxService
        .getTaxCalculations(this.getTaxPayer())
        .subscribe(
          (returnedTaxCalculations) =>
            (this.taxCalculations = returnedTaxCalculations)
        );
    }
  }
}
