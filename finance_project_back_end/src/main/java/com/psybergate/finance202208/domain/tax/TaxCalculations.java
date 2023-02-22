package com.psybergate.finance202208.domain.tax;

import com.psybergate.finance202208.domain.money.Money;

public class TaxCalculations {

  private final Money totalTaxableIncome;

  private final Money totalTaxDeductibleExpenses;

  private final Money nettTaxableIncome;

  private final Money taxPayable;

  private final Money lessPayables;

  private final Money nettTaxPayable;

  public TaxCalculations(Money totalTaxableIncome, Money totalTaxDeductibleExpenses,
                         Money nettTaxableIncome, Money taxPayable, Money lessPayables,
                         Money nettTaxPayable) {
    this.totalTaxableIncome = totalTaxableIncome;
    this.totalTaxDeductibleExpenses = totalTaxDeductibleExpenses;
    this.nettTaxableIncome = nettTaxableIncome;
    this.taxPayable = taxPayable;
    this.lessPayables = lessPayables;
    this.nettTaxPayable = nettTaxPayable;
  }

  public Money getTotalTaxableIncome() {
    return totalTaxableIncome;
  }

  public Money getTotalTaxDeductibleExpenses() {
    return totalTaxDeductibleExpenses;
  }

  public Money getNettTaxableIncome() {
    return nettTaxableIncome;
  }

  public Money getTaxPayable() {
    return taxPayable;
  }

  public Money getLessPayables() {
    return lessPayables;
  }

  public Money getNettTaxPayable() {
    return nettTaxPayable;
  }
}
