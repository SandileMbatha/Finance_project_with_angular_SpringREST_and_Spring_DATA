package com.psybergate.finance202208.domain.tax.table.deduction;

import com.psybergate.finance202208.domain.percentage.Percentage;
import com.psybergate.finance202208.domain.money.Money;
import org.hibernate.annotations.Type;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "retirement_fund_deductible")
public class RetirementFundDeductible {

  @Id
  @Column(name = "tax_year")
  @SuppressWarnings({"FieldCanBeLocal", "unused"})
  private Integer taxYear;

  @NotNull
  @Column(name = "max_allowed", nullable = false)
  @Type(type = "com.psybergate.finance202208.domain.money.MoneyDecimalType")
  private Money maxAllowed;

  @NotNull
  @Column(name = "rate", nullable = false)
  @Type(type = "com.psybergate.finance202208.domain.percentage.PercentageDecimalType")
  private Percentage rate;

  @SuppressWarnings("unused")
  private RetirementFundDeductible() {
  }

  public RetirementFundDeductible(Integer taxYear, Money maxAllowed, Percentage rate) {
    this.taxYear = taxYear;
    this.maxAllowed = maxAllowed;
    this.rate = rate;
  }

  public Money getMaxAllowed() {
    return maxAllowed;
  }

  public Percentage getRate() {
    return rate;
  }
}
