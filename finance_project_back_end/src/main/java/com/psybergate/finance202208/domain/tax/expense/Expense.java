package com.psybergate.finance202208.domain.tax.expense;

import com.psybergate.finance202208.domain.money.Money;

public class Expense {

  private final ExpenseType type;

  private final Money amount;

  public Expense(ExpenseType type, Money amount) {
    this.type = type;
    this.amount = amount;
  }

  public ExpenseType getType() {
    return type;
  }

  public Money getAmount() {
    return amount;
  }
}
