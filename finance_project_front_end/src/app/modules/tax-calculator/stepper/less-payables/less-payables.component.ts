import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { IOUtils } from 'src/app/models/ioutils';

@Component({
  selector: 'app-less-payables',
  templateUrl: './less-payables.component.html',
  styleUrls: ['./less-payables.component.scss'],
})
export class LessPayablesComponent implements OnInit {
  @Input()
  public lessPayables: FormGroup = new FormGroup({});

  constructor() {}

  ngOnInit(): void {
    this.lessPayables = new FormGroup({
      medicalCredits: new FormControl('0.00'),
    });
  }

  public getPrimaryRebate() {
    return '0';
  }

  public getSecondaryRebate() {
    return '0';
  }

  public getTertiaryRebate() {
    return '0';
  }
  public totalRebate(): string {
    return '0';
  }

  public formatMoneyLabel(str: string): string {
    return IOUtils.formatStringAsMoney(str);
  }

  public onFocus(event: any) {}

  public onPaste(event: any) {}
}
