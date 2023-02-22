import { FormControl } from '@angular/forms';

export function alphabetsOnly(
  control: FormControl
): { [key: string]: boolean } {
  let regex: RegExp = new RegExp('^[a-zA-Z]+$');
  if (!regex.test(control.value)) {
    return { alphabetsOnly: true };
  }

  return { alphabetsOnly: false };
}

export function alphabetsWithWhiteSpaces(
  control: FormControl
): { [key: string]: boolean } {
  let regex: RegExp = new RegExp('^[a-zA-Z][a-zA-Z ]+$');

  if (!regex.test(control.value)) {
    return { alphabetsWithWhiteSpaces: true };
  }

  return { alphabetsWithWhiteSpaces: false };
}

export function numbersOnly(
  control: FormControl
): { [key: string]: boolean } {
  let regex: RegExp = new RegExp('^[0-9]+$');

  if (!regex.test(control.value)) {
    return { numbersOnly: true };
  }

  return { numbersOnly: false };
}


export function wholeNumber(
  control: FormControl
): { [key: string]: boolean } {
  let number: number = +control.value;
  if (number % 1 != 0) {
    return { wholeNumber: true };
  }

  return { wholeNumber: false };
}
