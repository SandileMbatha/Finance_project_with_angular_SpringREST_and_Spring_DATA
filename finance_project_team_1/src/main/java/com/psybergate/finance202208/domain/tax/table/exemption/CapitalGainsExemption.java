package com.psybergate.finance202208.domain.tax.table.exemption;

import com.psybergate.finance202208.domain.percentage.Percentage;
import com.psybergate.finance202208.domain.money.Money;
import org.hibernate.annotations.Type;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "capital_gains_exemption")
public class CapitalGainsExemption {

  @Id
  @Column(name = "tax_year")
  @SuppressWarnings({"unused", "FieldCanBeLocal"})
  private Integer taxYear;

  @NotNull
  @Column(name = "exemption", nullable = false)
  @Type(type = "com.psybergate.finance202208.domain.money.MoneyDecimalType")
  private Money exemption;

  @NotNull
  @Column(name = "rate", nullable = false)
  @Type(type = "com.psybergate.finance202208.domain.percentage.PercentageDecimalType")
  private Percentage rate;

  @SuppressWarnings("unused")
  private CapitalGainsExemption() {
  }

  public CapitalGainsExemption(Integer taxYear, Money exemption, Percentage rate) {
    this.taxYear = taxYear;
    this.exemption = exemption;
    this.rate = rate;
  }

  public Money getExemption() {
    return exemption;
  }

  public Percentage getRate() {
    return rate;
  }
}
