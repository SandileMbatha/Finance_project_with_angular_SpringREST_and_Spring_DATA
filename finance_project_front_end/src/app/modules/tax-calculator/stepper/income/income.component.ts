import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss'],
})
export class IncomeComponent implements OnInit {
  @Input()
  public income: FormGroup = new FormGroup({});

  constructor() {}

  ngOnInit(): void {
    this.income = new FormGroup({
      salary: new FormControl('', Validators.required),
      bonuses: new FormControl('0.00'),
      interestReceived: new FormControl('0.00'),
      dividends: new FormControl('0.00'),
      totalCapitalGains: new FormControl('0.00'),
    });
  }

  public onFocus(event: any) {}

  public onPaste(event: any) {}
}
