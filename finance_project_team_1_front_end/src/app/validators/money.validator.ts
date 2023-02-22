import { AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {map, Observable, of} from 'rxjs';

export function asyncMoneyValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return of(control.value).pipe(
      map(result => {
        if (!positiveAmount(result)) {
          return { negativeAmount: true, message: "The amount must be posiive" };
        }

        if (!twoDecimalPlaces(result)) {
          return { exceedTwoDecimalPlaces: true, message: "The amount exceeds two decimal places"};
        }
        return null;
      }),
    );
  };
}

function positiveAmount(money: string): boolean {
  let amount: number = +money;
  return amount >= 0 ? true : false;
}

function twoDecimalPlaces(money: string): boolean {
  let str: string[] = String(money).split(".");
  if(str.length > 1){
    return str[1].length < 3 ? true : false;
  }
  return true;
}

export function asyncballoonValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return of(control.value).pipe(
      map(result => {
        console.log(result)
        if (!positiveAmount(result)) {
          return { negativeAmount: true, message: "The amount must be posiive" };
        }

        if (!twoDecimalPlaces(result)) {
          return { exceedTwoDecimalPlaces: true, message: "The amount exceeds two decimal places"};
        }
        return null;
      }),
    );
  };
}

