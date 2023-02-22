import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss'],
})
export class PersonalInformationComponent implements OnInit {
  @Input()
  public personalInformation: FormGroup = new FormGroup({});

  constructor() {}

  ngOnInit(): void {
    this.personalInformation = new FormGroup({
      name: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required),
      age: new FormControl('60', Validators.required),
      taxYear: new FormControl('2022/2023', Validators.required),
    });
  }
}
