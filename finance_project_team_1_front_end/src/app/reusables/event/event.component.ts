import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Customer } from 'src/app/models/customer';
import { CarFinanceDataService } from 'src/app/services/car-finance-data.service';
import { InvestmentDataService } from 'src/app/services/investment-data.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PropertyBondDataService } from 'src/app/services/property-bond-data.service';
import { onPaste } from 'src/app/validators/id-number.validator';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventComponent implements OnInit {
  public eventForm = new FormGroup({
    eventNum: new FormControl(),
    finance: new FormControl(),
    eventType: new FormControl(),
    month: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required),
    keepRepayment: new FormControl(true),
  });

  public title: string = '';
  cust_id: any;
  fin_id: any;
  event_id: any;
  eventType: any;
  service: any;
  message: any;
  event: any;
  public KeepRepaymentType: boolean = true;

  public formValid: boolean = true;
  public customer?: Customer;

  public monthLabel: any = 'Amount (R):';

  public errormessage: string = 'Please enter a valid amount';

  constructor(
    private notificationService: NotificationService,
    private investmentDataService: InvestmentDataService,
    private carFinanceService: CarFinanceDataService,
    private propertyBondService: PropertyBondDataService,
    private navigationService: NavigationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fin_id = this.navigationService.getFinanceNumFromPath();
    this.cust_id = this.navigationService.getCustomerNumFromPath();
    this.initialiseEventForProcess();
    this.title = this.eventType;

    if (!this.navigationService.onUpdateEventPage()) {
      this.eventForm.controls['eventType'].setValue(this.eventType);
      this.getServiceForCreate();
    } else {
      this.event_id = Number(this.route.snapshot.paramMap.get('eId'));
      this.getServiceForUpdate();
      this.message = 'Update successfully made.';
    }

    if (this.navigationService.onChangeRatePage()) {
      this.monthLabel = 'Rate (%):';
      this.errormessage = 'Please enter a valid rate.';
    }
  }

  public onPaste(event: any) {
    return onPaste(event);
  }

  public onCancel(): void {
    this.navigationService.goBack();
  }

  onSubmit() {
    if (this.navigationService.onUpdateEventPage()) {
      this.service
        .updateEvent(this.fin_id, this.cust_id, this.eventForm.value)
        .subscribe({
          next: () => this.redirect(),
          error: (error: HttpErrorResponse) =>
            this.notificationService.showErrorMessage(error),
        });
    } else {
      this.service
        .createEvent(this.fin_id, this.cust_id, this.eventForm.value)
        .subscribe({
          next: () => this.redirect(),
          error: (error: HttpErrorResponse) =>
            this.notificationService.showErrorMessage(error),
        });
    }
  }
  redirect(): void {
    this.notificationService.showSuccessMessage(this.message);
    this.navigationService.goBack();
  }

  public initialiseEventForProcess() {
    if (this.navigationService.onDepositPage()) {
      this.eventType = 'Deposit';
      this.message = 'Deposit successfully made.';
    } else if (this.navigationService.onWithdrawPage()) {
      this.eventType = 'Withdraw';
      this.message = 'Withdrawal successfully made.';
    } else if (this.navigationService.onChangeRatePage()) {
      this.eventType = 'Change Rate';
      this.message = 'Rate successfully changed.';
    } else if (this.navigationService.onChangeAmountPage()) {
      this.eventType = 'Change Amount';
      this.KeepRepaymentType = false;
      this.message = 'Amount successfully changed.';
    } else if (this.navigationService.onIncreaseAmountPage()) {
      this.eventType = 'Increase Amount';
      this.KeepRepaymentType = false;
      this.message = 'Amount successfully increased.';
    }
  }

  public getServiceForCreate() {
    if (this.navigationService.onInvestmentPage()) {
      this.service = this.investmentDataService;
    } else if (this.navigationService.onPropertyBondPage()) {
      this.service = this.propertyBondService;
    } else if (this.navigationService.onCarFinancePage()) {
      this.service = this.carFinanceService;
    }
  }

  public getServiceForUpdate() {
    if (this.navigationService.onInvestmentPage()) {
      this.service = this.investmentDataService;
      this.setValues(this.investmentDataService);
    } else if (this.navigationService.onPropertyBondPage()) {
      this.service = this.propertyBondService;
      this.setValues(this.propertyBondService);
    } else if (this.navigationService.onCarFinancePage()) {
      this.service = this.carFinanceService;
      this.setValues(this.carFinanceService);
    }
  }

  setValues(financeService: any) {
    financeService
      .getFinance(this.cust_id, this.fin_id)
      .subscribe((storedFinance: { events: any }) => {
        for (let event of storedFinance.events) {
          if (event.eventNum == this.event_id) {
            this.eventForm.controls['eventNum'].setValue(event.eventNum);
            this.eventForm.controls['finance'].setValue(event.finance);
            this.eventForm.controls['eventType'].setValue(event.eventType);
            this.eventForm.controls['month'].setValue(event.month + '');
            this.eventForm.controls['amount'].setValue(event.amount + '');
            this.eventForm.controls['keepRepayment'].setValue(
              event.keepRepayment
            );
            this.title = 'Update ' + event.eventType;
          }
        }
      });
  }
}
