package com.psybergate.finance202208.domain.tax.income;

import com.psybergate.finance202208.domain.money.Money;

public class Income {

  private final IncomeType type;

  private final Money amount;

  public Income(IncomeType type, Money amount) {
    this.type = type;
    this.amount = amount;
  }

  public IncomeType getType() {
    return type;
  }

  public Money getAmount() {
    return amount;
  }
}
