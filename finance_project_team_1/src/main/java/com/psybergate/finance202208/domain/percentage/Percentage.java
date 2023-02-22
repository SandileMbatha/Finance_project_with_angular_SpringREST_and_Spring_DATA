package com.psybergate.finance202208.domain.percentage;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class Percentage {

  private final BigDecimal value;

  private static String format(String value) {
    return value.replace(" ", "").replace("_", "");
  }

  public Percentage(String value) {
    this.value = new BigDecimal(format(value));
  }

  public Percentage(BigDecimal value) {
    this.value = value;
  }

  public BigDecimal getValue() {
    return value;
  }

  @SuppressWarnings("BigDecimalMethodWithoutRoundingCalled")
  public String toPercentage() {
    return this.value.divide(BigDecimal.valueOf(100)).toString();
  }

  @Override
  public String toString() {
    return String.format("%.2f", this.value.setScale(2, RoundingMode.DOWN));
  }

  @Override
  public int hashCode() {
    return value.hashCode();
  }
}
