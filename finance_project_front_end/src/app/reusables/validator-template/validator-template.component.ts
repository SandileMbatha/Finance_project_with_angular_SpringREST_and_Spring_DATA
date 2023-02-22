import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControlProperties } from 'src/app/models/form-control-properties';
import { ValidatorProperties } from 'src/app/models/validator-properties';

@Component({
  selector: 'app-validator-template',
  templateUrl: './validator-template.component.html',
  styleUrls: ['./validator-template.component.scss'],
})
export class ValidatorTemplateComponent implements OnInit {
  @Input() formGroup: FormGroup = new FormGroup({});

  @Input() validatorProperties: ValidatorProperties[] = [];

  @Input() formControlProperty: FormControlProperties = {
    key: '',
    inputType: '',
    label: '',
    placeholder: '',
  };

  constructor() {}

  ngOnInit(): void {}

  public printError() {
    for (let validatorProperty of this.validatorProperties) {
      console.log(
        this.formGroup.controls[this.formControlProperty.key].hasError(
          validatorProperty.key
        )
      );
      console.log(
        this.formGroup.controls[this.formControlProperty.key].errors
      );
    }
  }
}
