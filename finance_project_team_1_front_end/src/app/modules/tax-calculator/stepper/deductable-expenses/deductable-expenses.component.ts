import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-deductable-expenses',
  templateUrl: './deductable-expenses.component.html',
  styleUrls: ['./deductable-expenses.component.scss'],
})
export class DeductableExpensesComponent implements OnInit {
  @Input()
  public deductableExpenses: FormGroup = new FormGroup({});

  constructor() {}

  ngOnInit(): void {
    this.deductableExpenses = new FormGroup({
      retirementFund: new FormControl('0.00'),
      travelAllowance: new FormControl('0.00'),
    });
  }

  public onFocus(event: any) {}

  public onPaste(event: any) {}
}
