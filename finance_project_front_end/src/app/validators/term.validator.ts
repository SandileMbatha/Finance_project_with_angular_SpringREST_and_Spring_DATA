import { AbstractControl, AsyncValidatorFn, ValidationErrors} from "@angular/forms";
import {map, Observable, of} from "rxjs";

function positiveAmount(money: string): boolean {
  let amount: number = +money;
  return amount > 0 ? true : false;
}

export function asyncTermValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return of(control.value).pipe(
      map(result => {
        if (!positiveAmount(result)) {
          return { negativeAmount: true, message: "The term must be greater than 0" };
        }

        if (!wholeNumber(result)) {
          return { wholeNumber: true, message: "The term must be a whole number" };
        }
        return null;
      }),
    );
  };
}

export function wholeNumber(percentage: string): boolean {
  let number: number = +percentage;
  if (number % 1 != 0) {
    return false;
  }
  return true;
}
