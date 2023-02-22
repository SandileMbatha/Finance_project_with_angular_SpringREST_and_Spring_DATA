package com.psybergate.finance202208.domain.tax;

import com.psybergate.finance202208.domain.money.Money;
import com.psybergate.finance202208.domain.tax.expense.Expense;
import com.psybergate.finance202208.domain.tax.income.Income;

import java.util.List;

public class TaxPayer {

  private final int age;

  private final Integer taxYear;

  private final List<Income> income;

  private final List<Expense> expenses;

  private final Money medicalCredits;

  public TaxPayer(int age, Integer taxYear, List<Income> income,
                  List<Expense> expenses, Money medicalCredits) {
    this.age = age;
    this.taxYear = taxYear;
    this.income = income;
    this.expenses = expenses;
    this.medicalCredits = medicalCredits;
  }

  public int getAge() {
    return age;
  }

  public Integer getTaxYear() {
    return taxYear;
  }

  public List<Income> getIncome() {
    return income;
  }

  public List<Expense> getExpenses() {
    return expenses;
  }

  public Money getMedicalCredits() {
    return medicalCredits;
  }
}
