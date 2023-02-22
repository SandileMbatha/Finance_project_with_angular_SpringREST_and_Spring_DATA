package com.psybergate.finance202208.domain.tax.table;

import com.psybergate.finance202208.domain.percentage.Percentage;
import com.psybergate.finance202208.domain.money.Money;
import com.psybergate.finance202208.domain.tax.table.deduction.Rebate;
import com.psybergate.finance202208.domain.tax.table.deduction.RetirementFundDeductible;
import com.psybergate.finance202208.domain.tax.table.exemption.CapitalGainsExemption;
import com.psybergate.finance202208.domain.tax.table.exemption.InterestExemption;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

@Entity
@Table(name = "tax_table")
public class TaxTable {

  @Id
  @Column(name = "tax_year")
  @SuppressWarnings("FieldCanBeLocal")
  private Integer taxYear;

  @NotEmpty
  @OneToMany
  @JoinColumn(name = "tax_year")
  private List<TaxBracket> brackets;

  @NotEmpty
  @OneToMany
  @JoinColumn(name = "tax_year")
  private List<InterestExemption> interestExemptions;

  @NotEmpty
  @OneToOne
  @JoinColumn(name = "tax_year")
  private CapitalGainsExemption capitalGainsExemption;

  @NotNull
  @OneToOne
  @JoinColumn(name = "tax_year")
  private RetirementFundDeductible retirementFundDeductible;

  @NotNull
  @Column(name = "travel_allowance_max_allowed", nullable = false)
  @Type(type = "com.psybergate.finance202208.domain.money.MoneyDecimalType")
  private Money travelAllowanceMaxAllowed;

  @NotNull
  @Column(name = "medical_credits_max_allowed", nullable = false)
  @Type(type = "com.psybergate.finance202208.domain.money.MoneyDecimalType")
  private Money medicalCreditsMaxAllowed;

  @NotEmpty
  @OneToMany
  @JoinColumn(name = "tax_year")
  private List<Rebate> rebates;

  @SuppressWarnings("unused")
  private TaxTable() {
  }

  public TaxTable(Integer taxYear, List<TaxBracket> brackets,
                  List<InterestExemption> interestExemptions,
                  CapitalGainsExemption capitalGainsExemption,
                  RetirementFundDeductible retirementFundDeductible,
                  Money travelAllowanceMaxAllowed, Money medicalCreditsMaxAllowed,
                  List<Rebate> rebates) {
    this.taxYear = taxYear;
    this.brackets = brackets;
    this.interestExemptions = interestExemptions;
    this.capitalGainsExemption = capitalGainsExemption;
    this.retirementFundDeductible = retirementFundDeductible;
    this.travelAllowanceMaxAllowed = travelAllowanceMaxAllowed;
    this.medicalCreditsMaxAllowed = medicalCreditsMaxAllowed;
    this.rebates = rebates;
  }

  public Integer taxYear() {
    return taxYear;
  }

  public List<InterestExemption> interestExemptions() {
    return interestExemptions;
  }

  public CapitalGainsExemption capitalGainsExemption() {
    return capitalGainsExemption;
  }

  public RetirementFundDeductible retirementFundDeductible() {
    return retirementFundDeductible;
  }

  public Money travelAllowanceMaxAllowed() {
    return travelAllowanceMaxAllowed;
  }

  public Money medicalCreditsMaxAllowed() {
    return medicalCreditsMaxAllowed;
  }

  public List<Rebate> rebates() {
    return rebates;
  }

  private Money getBracketMinimum(int bracketNum) {
    if (bracketNum >= brackets.size() || bracketNum < 1) {
      return new Money();
    }

    return getBracketMaximum(bracketNum - 1);
  }

  private Money getBracketMaximum(int bracketNum) {
    return brackets.get(bracketNum).getMax();
  }

  private Percentage getBracketRate(int bracketNum) {
    return brackets.get(bracketNum).getRate();
  }

  private Money calcBracketTaxableIncome(int bracketNum) {
    return getBracketMaximum(bracketNum)
            .subtract(getBracketMinimum(bracketNum));
  }

  private Money calcBracketTaxPayable(int bracketNum, Money bracketTaxableIncome) {
    return bracketTaxableIncome.multiply(getBracketRate(bracketNum).toPercentage());
  }

  public Money calcTaxPayable(Money taxableIncome) {
    Money taxPayable = new Money();
    Money taxableIncomeAfterChanges = taxableIncome;

    for (int i = 0; i < brackets.size(); i++) {
      Money bracketTaxableIncome = calcBracketTaxableIncome(i);

      if (bracketTaxableIncome.moreThan(taxableIncomeAfterChanges)) {
        taxPayable = taxPayable
                .add(calcBracketTaxPayable(i, taxableIncomeAfterChanges));
        break;
      } else {
        taxPayable = taxPayable
                .add(calcBracketTaxPayable(i, bracketTaxableIncome));

        taxableIncomeAfterChanges = taxableIncomeAfterChanges.subtract(bracketTaxableIncome);
      }
    }

    return taxPayable;
  }
}
