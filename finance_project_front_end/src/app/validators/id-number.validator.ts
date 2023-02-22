import {FormControl, FormGroup} from '@angular/forms';
import { CustomerDataService } from '../services/customer-data.service';

export function alphaOnly(event: any): boolean {
  var regex = new RegExp('^[a-zA-Z]+$');
  var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
  if (regex.test(str)) {
    return true;
  }
  event.preventDefault();
  return false;
}

export function onPaste(event: any): boolean {
  event.preventDefault();
  return false;
}

function validateIdNumber(idNumber: string) {
  const ex =
    /(([0-9]{2})(0|1)([0-9])([0-3])([0-9]))([ ]?)(([0-9]{4})([ ]?)([0-1][8]([ ]?)[0-9]))/;
  if (ex.test(idNumber)) {
    return {
      valid: true,
      dateOfBirth: parseDateOfBirth(idNumber),
    };
  }
  return {
    valid: false,
    dateOfBirth: parseDateOfBirth(idNumber),
  };
}

export function idValidator(
  formcontrol: FormControl,
  formgroup: FormGroup, customerService: CustomerDataService
): { [key: string]: boolean } {
  if (validateIdNumber(formcontrol.value).valid == false) {
    return { 'invalidId': true};
  }

  customerService.getCustomers().subscribe((customers) =>{
    for(let customer of customers){
      if(customer.idNumber == formcontrol.value){
        formcontrol.setErrors({'idExist': true, message: "The ID number already exist"})
      }
    }
  });

  let year = validateIdNumber(formcontrol.value).dateOfBirth.year + '';
  let month = validateIdNumber(formcontrol.value).dateOfBirth.month + '';
  let day = validateIdNumber(formcontrol.value).dateOfBirth.day + '';

  if (day.length < 2) {
    day = '0' + day;
  }

  if (month.length < 2) {
    month = '0' + month;
  }

  formgroup.controls['dateOfBirth'].setValue(year + '-' + month + '-' + day);
  return null as any;
}

function parseDateOfBirth(idNumber: any) {
  const currentYear = new Date().getFullYear();
  const currentCentury = Math.floor(currentYear / 100) * 100;
  const currentMonth = new Date().getMonth();
  const currentDay = new Date().getDay();
  let yearPart = currentCentury + parseInt(idNumber.substring(0, 2));
  const monthPart = parseInt(idNumber.substring(2, 4));
  const dayPart = parseInt(idNumber.substring(4, 6));
  const eligibleYear = currentYear - 16;

  if (
    yearPart > eligibleYear ||
    (yearPart === eligibleYear &&
      (monthPart > currentMonth ||
        (monthPart === currentMonth && dayPart > currentDay)))
  ) {
    yearPart -= 100;
  }

  return {
    year: yearPart,
    month: monthPart,
    day: dayPart,
  };
}


