import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import {map, Observable, of} from 'rxjs';


export function asyncPercentageValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return of(control.value).pipe(
      map(result => {
        if (!betweenZeroAndHundred(result)) {
          return { betweenZeroAndHundred: true, message: "The rate must be between 0 and 100" };
        }

        if (!threeDecimalPlaces(result)) {
          return { threeDecimalPlaces: true, message: "The rate exceeds three decimal places" };
        }

        if (result == 0) {
          return { equalToZero: true, message: "The amount must be greater than 0"};
        }
        return null;
      }),
    );
  };
}

function betweenZeroAndHundred(percentage: string): boolean {
  return +percentage <= 100 && +percentage >= 0;
}

function threeDecimalPlaces(percentage: string): boolean {
  let str: string[] = String(percentage).split(".");
  if(str.length > 1){
    return str[1].length < 4 ? true : false;
  }
  return true;
}


