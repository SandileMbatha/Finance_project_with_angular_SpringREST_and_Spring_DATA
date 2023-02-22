package com.psybergate.finance202208.domain.tax.expense;

import com.fasterxml.jackson.annotation.JsonValue;

public enum ExpenseType {

  RETIREMENT_FUND("RetirementFund"),
  TRAVEL_ALLOWANCE("TravelAllowance");

  private final String name;

  ExpenseType(String name) {
    this.name = name;
  }

  @Override
  @JsonValue
  public String toString() {
    return name;
  }
}
