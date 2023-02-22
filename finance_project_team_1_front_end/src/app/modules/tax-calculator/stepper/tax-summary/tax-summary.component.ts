import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tax-summary',
  templateUrl: './tax-summary.component.html',
  styleUrls: ['./tax-summary.component.scss'],
})
export class TaxSummaryComponent implements OnInit {
  @Input()
  public summary: FormGroup = new FormGroup({});

  constructor() {}

  ngOnInit(): void {
    this.summary = new FormGroup({
      name: new FormControl(''),
      surname: new FormControl(''),
      totalTaxableIncome: new FormControl(''),
      totalDeductableExpenses: new FormControl(''),
      nettTaxableIncome: new FormControl(''),
      taxPayable: new FormControl(''),
      nettTaxPayable: new FormControl(''),
    });
  }
}
