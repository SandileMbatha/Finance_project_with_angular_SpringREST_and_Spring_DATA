package com.psybergate.finance202208.domain.tax.table.exemption;

import com.psybergate.finance202208.domain.money.Money;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "interest_exemption")
public class InterestExemption {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "interest_exemption_num")
  @SuppressWarnings({"unused", "FieldCanBeLocal"})
  private Long interestExemptionNum;

  @NotNull
  @Column(name = "tax_year", nullable = false)
  @SuppressWarnings({"unused", "FieldCanBeLocal"})
  private Integer taxYear;

  @NotNull
  @Column(name = "exemption", nullable = false)
  @Type(type = "com.psybergate.finance202208.domain.money.MoneyDecimalType")
  private Money exemption;

  @NotNull
  @Column(name = "minimum_age", nullable = false)
  private Integer minimumAge;

  @SuppressWarnings("unused")
  private InterestExemption() {
  }

  public InterestExemption(Long interestExemptionNum, Integer taxYear, Money exemption,
                           Integer minimumAge) {
    this.interestExemptionNum = interestExemptionNum;
    this.taxYear = taxYear;
    this.exemption = exemption;
    this.minimumAge = minimumAge;
  }

  public Money getExemption() {
    return exemption;
  }

  public Integer getMinimumAge() {
    return minimumAge;
  }
}
