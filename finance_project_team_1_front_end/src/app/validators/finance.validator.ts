import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { map, Observable, of} from "rxjs";
import { CarFinanceDataService } from "../services/car-finance-data.service";
import { InvestmentDataService } from "../services/investment-data.service";
import { PropertyBondDataService } from "../services/property-bond-data.service";

export function investmentNameExist( custID: number, investmentService: InvestmentDataService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return of(control.value).pipe(
      map(result => {
        investmentService.getInvestmentsForCustomer(custID).subscribe((investments) =>{
          for(let investment of investments){
            if(investment.name == result){
              control.setErrors({ nameExist: true, message: "The Investment name already exist"})
            }
          }
        });
        return null
      }),
    );
  };
}

export function carFinanceNameExist( custID: number, carFinanceService:CarFinanceDataService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return of(control.value).pipe(
      map(result => {
        carFinanceService.getCarFinancesForCustomer(custID).subscribe((carFinances) =>{
          for(let carFinance of carFinances){
            if(carFinance.name == result){
              control.setErrors({ nameExist: true, message: "The CarFinance name already exist"})
            }
          }
        });
        return null
      }),
    );
  };
}

export function propertyBondNameExist( custID: number, propertyBondService: PropertyBondDataService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return of(control.value).pipe(
      map(result => {
        propertyBondService.getPropertyBondsForCustomer(custID).subscribe((propertyBonds) =>{
          for(let propertyBond of propertyBonds){
            if(propertyBond.name == result){
              control.setErrors({ nameExist: true, message: "The PropertyBond name already exist"})
            }
          }
        });
        return null
      }),
    );
  };
}
