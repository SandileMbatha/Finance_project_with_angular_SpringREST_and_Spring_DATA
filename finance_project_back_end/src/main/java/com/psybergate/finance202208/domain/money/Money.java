package com.psybergate.finance202208.domain.money;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * The money abstraction for the application.
 */
@SuppressWarnings("unused")
public class Money {

  public static final Money ZERO = new Money();

  private final BigDecimal value;

  private static String format(String value) {
    return value.replace(" ", "").replace("_", "");
  }

  public Money() {
    this.value = new BigDecimal("0");
  }

  public Money(String value) {
    this(new BigDecimal(format(value)));
  }

  public Money(double value) {
    this(BigDecimal.valueOf(value));
  }

  public Money(int value) {
    this(BigDecimal.valueOf(value));
  }

  public Money(BigDecimal value) {
    this.value = value;
  }

  public BigDecimal getValue() {
    return value;
  }

  public Money add(String value) {
    return new Money(this.value.add(new BigDecimal(format(value))));
  }

  public Money add(Money money) {
    return new Money(this.value.add(money.value));
  }

  public Money subtract(String value) {
    return new Money(this.value.subtract(new BigDecimal(format(value))));
  }

  public Money subtract(Money money) {
    return new Money(this.value.subtract(money.value));
  }

  public Money multiply(String value) {
    return new Money(this.value.multiply(new BigDecimal(format(value))));
  }

  public Money divide(String value) {
    return new Money(this.value.divide(new BigDecimal(format(value)), RoundingMode.HALF_EVEN));
  }

  public boolean moreThan(String value) {
    return (this.value.compareTo(new BigDecimal(format(value))) > 0);
  }

  public boolean moreThan(Money money) {
    return (this.value.compareTo(money.value) > 0);
  }

  public boolean lessThan(String value) {
    return (this.value.compareTo(new BigDecimal(format(value))) < 0);
  }

  public boolean lessThan(Money money) {
    return (this.value.compareTo(money.value) < 0);
  }

  public boolean equalTo(Money money) {
    if (money == null) return false;
    return this.value.compareTo(money.value) == 0;
  }

  /**
   * Adds an 'R' for Rands and formats the number with spaces and two decimals.
   *
   * @return A String representation of the Money object.
   */
  public String toRands() {
    return String.format("R %,.2f", this.value.setScale(2, RoundingMode.DOWN)).replace(',', ' ');
  }

  /**
   * Formats the number with spaces and two decimals.
   *
   * @return A String representation of the Money object.
   */
  public String toStringFormatted() {
    return String.format("%,.2f", this.value.setScale(2, RoundingMode.DOWN)).replace(',', ' ');
  }

  /**
   * Formats the number with two decimals.
   *
   * @return A String representation of the Money object.
   */
  @Override
  @JsonProperty("value")
  public String toString() {
    return String.format("%.2f", this.value.setScale(2, RoundingMode.DOWN));
  }

  @Override
  public boolean equals(Object obj) {
    if (obj == null) return false;
    if (this == obj) return true;
    if (! this.getClass().equals(obj.getClass())) return false;
    Money money = (Money) obj;
    return this.value.equals(money.value);
  }

  @Override
  public int hashCode() {
    return value.hashCode();
  }
}