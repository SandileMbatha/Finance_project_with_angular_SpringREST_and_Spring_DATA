package com.psybergate.finance202208.domain.tax.table;

import com.psybergate.finance202208.domain.percentage.Percentage;
import com.psybergate.finance202208.domain.money.Money;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "tax_bracket")
public class TaxBracket {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "tax_bracket_num")
  @SuppressWarnings({"unused", "FieldCanBeLocal"})
  private Long taxBracketNum;

  @NotNull
  @Column(name = "tax_year", nullable = false)
  @SuppressWarnings({"unused", "FieldCanBeLocal"})
  private Integer taxYear;

  @NotNull
  @Column(name = "max", nullable = false)
  @Type(type = "com.psybergate.finance202208.domain.money.MoneyDecimalType")
  private Money max;

  @NotNull
  @Column(name = "rate", nullable = false)
  @Type(type = "com.psybergate.finance202208.domain.percentage.PercentageDecimalType")
  private Percentage rate;

  @SuppressWarnings("unused")
  private TaxBracket() {
  }

  public TaxBracket(Long taxBracketNum, Integer taxYear, Money max, Percentage rate) {
    this.taxBracketNum = taxBracketNum;
    this.taxYear = taxYear;
    this.max = max;
    this.rate = rate;
  }

  public Money getMax() {
    return max;
  }

  public Percentage getRate() {
    return rate;
  }
}
