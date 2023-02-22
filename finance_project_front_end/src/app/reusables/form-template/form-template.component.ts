import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ValidatorProperties } from 'src/app/models/validator-properties';
import { FormControlProperties } from '../../models/form-control-properties';
import { NavigationService } from '../../services/navigation.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-form-template',
  templateUrl: './form-template.component.html',
  styleUrls: ['./form-template.component.scss'],
})
export class FormTemplateComponent implements OnInit {
  @Input() public title: string = '';

  @Input() public buttonText: string = '';

  @Input() public formGroup: FormGroup = new FormGroup({});

  @Input() public formControlProperties: FormControlProperties[] = [];

  @Input() public validatorProperties: ValidatorProperties[] = [];

  @Input() public observable?: Observable<any>;

  @Input() public path: string = '';

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    this.setReadOnly();
  }

  private redirectPage(savedEntity: Observable<any>): void {
    this.router.navigate([this.path]);
    this.notificationService.showSuccessMessage(
      'Customer successfully registered!'
    );
  }

  public allControlsTouchedAndValid(): boolean {
    let touched: boolean = false;

    for (let property of this.formControlProperties) {
      if (
        this.formGroup.get(property.key)?.valid &&
        this.formGroup.get(property.key)?.touched
      ) {
        touched = true;
      }
    }

    return touched;
  }

  public controlsTouchedAndValid(): boolean {
    let valid: boolean = true;

    for (let property of this.formControlProperties) {
      if (
        !this.formGroup.get(property.key)?.valid &&
        this.formGroup.get(property.key)?.touched
      ) {
        valid = false;
      }
    }

    return valid;
  }

  public setInputType(): void {
    for (let property of this.formControlProperties) {
      if (!property.inputType) {
        property.inputType = 'text';
      }
    }
  }

  public setReadOnly(): void {
    for (let property of this.formControlProperties) {
      if (!property.readonly) {
        property.readonly = false;
      }
    }
  }

  public onClear(): void {
    this.formGroup.reset();
  }

  public onCancel(): void {
    this.navigationService.goBack();
  }

  public onSubmit(): void {
    if (this.formGroup.valid) {
      this.observable?.subscribe({
        next: (savedEntity) => this.redirectPage(savedEntity),
        error: (error) => this.notificationService.showErrorMessage(error),
      });
    }
  }
}
