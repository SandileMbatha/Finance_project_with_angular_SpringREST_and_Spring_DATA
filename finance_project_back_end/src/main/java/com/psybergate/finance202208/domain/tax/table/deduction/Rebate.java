package com.psybergate.finance202208.domain.tax.table.deduction;

import com.psybergate.finance202208.domain.money.Money;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "rebate")
public class Rebate {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "rebate_num")
  @SuppressWarnings({"unused", "FieldCanBeLocal"})
  private Long rebateNum;

  @NotNull
  @Column(name = "tax_year", nullable = false)
  @SuppressWarnings({"unused", "FieldCanBeLocal"})
  private Integer taxYear;

  @NotNull
  @Column(name = "amount", nullable = false)
  @Type(type = "com.psybergate.finance202208.domain.money.MoneyDecimalType")
  private Money amount;

  @NotNull
  @Column(name = "minimum_age", nullable = false)
  private Integer minimumAge;

  @SuppressWarnings("unused")
  private Rebate() {
  }

  public Rebate(Long rebateNum, Integer taxYear, Money amount, int minimumAge) {
    this.rebateNum = rebateNum;
    this.taxYear = taxYear;
    this.amount = amount;
    this.minimumAge = minimumAge;
  }

  public Money getAmount() {
    return amount;
  }

  public int getMinimumAge() {
    return minimumAge;
  }
}
