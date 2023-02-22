package com.psybergate.finance202208.domain.tax.income;

import com.fasterxml.jackson.annotation.JsonValue;

public enum IncomeType {

  SALARY("Salary"), BONUSES("Bonuses"), INTEREST_RECEIVED("InterestReceived"),
  DIVIDENDS("Dividends"), TOTAL_CAPITAL_GAINS("TotalCapitalGains");

  private final String name;

  IncomeType(String name) {
    this.name = name;
  }

  @Override
  @JsonValue
  public String toString() {
    return name;
  }
}
