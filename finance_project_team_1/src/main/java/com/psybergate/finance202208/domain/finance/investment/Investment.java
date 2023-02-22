package com.psybergate.finance202208.domain.finance.investment;

import com.psybergate.finance202208.domain.events.Event;
import com.psybergate.finance202208.domain.finance.Finance;
import com.psybergate.finance202208.domain.money.Money;
import com.psybergate.finance202208.domain.monthly.details.MonthDetails;
import com.psybergate.finance202208.domain.monthly.details.investments.InvestmentMonthDetails;
import org.hibernate.annotations.Type;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

/**
 * The FinanceProjection representation of an Investment.
 */
@Entity
@Table(name = "investment")
@SuppressWarnings("unused")
public class Investment extends Finance {

  /**
   * The monthly amount that the customer gives at the end of every month.
   */
  @NotNull
  @Column(name = "monthly_deposit")
  @Type(type = "com.psybergate.finance202208.domain.money.MoneyDecimalType")
  private Money monthlyContribution;

  public Investment() {
    monthlyContribution = new Money();
  }

  @Override
  public List<MonthDetails> getMonthlyDetails() {
    List<MonthDetails> monthlyDetails = new ArrayList<>();
    Money openingBalance = getInitialDeposit();

    for (int month = 1; month <= getTerm(); month++) {
      InvestmentMonthDetails monthDetails = new InvestmentMonthDetails();

      monthDetails.setMonth(month);
      monthDetails.setOpeningBalance(openingBalance);
      monthDetails.setAnnualInterestRate(getRate());
      monthDetails.setMonthlyDeposit(getMonthlyContribution());
      monthDetails.setInterest(monthDetails.calcInterest());
      monthDetails.setClosingBalance(monthDetails.calcClosingBalance());

      openingBalance = monthDetails.getClosingBalance();
      monthlyDetails.add(monthDetails);
    }

    processEvents(monthlyDetails);
    return monthlyDetails;
  }

  @Override
  public void processEvents(List<MonthDetails> monthlyDetails) {
    if (getEvents() != null) {
      for (Event event : getEvents()) {
        event.process(monthlyDetails);

        for (int i = 0; i < monthlyDetails.size(); i++) {
          MonthDetails monthDetails = monthlyDetails.get(i);
          monthDetails.setInterest(monthDetails.calcInterest());
          monthDetails.setClosingBalance(monthDetails.calcClosingBalance());

          if (i < monthlyDetails.size() - 1) {
            monthlyDetails.get(i + 1).setOpeningBalance(monthDetails.getClosingBalance());
          }
        }
      }
    }
  }

  public Money getMonthlyContribution() {
    return monthlyContribution;
  }

  public void setMonthlyContribution(Money monthlyContribution) {
    this.monthlyContribution = monthlyContribution;
  }

  /**
   * The total monthlyAmount paid during FinanceProjection
   */
  public Money getTotalMonthlyContribution() {
    Money total = new Money();
    for (MonthDetails monthDetails : getMonthlyDetails()) {
      total = total.add(monthDetails.getMonthlyDeposit());
    }
    return total;
  }

  public Money getFinalAmount() {
    return getMonthlyDetails().get(getTerm() - 1).getClosingBalance();
  }

}