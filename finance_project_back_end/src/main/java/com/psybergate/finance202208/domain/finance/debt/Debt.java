package com.psybergate.finance202208.domain.finance.debt;

import com.psybergate.finance202208.domain.events.Event;
import com.psybergate.finance202208.domain.events.EventType;
import com.psybergate.finance202208.domain.finance.Finance;
import com.psybergate.finance202208.domain.money.Money;
import com.psybergate.finance202208.domain.monthly.details.MonthDetails;
import com.psybergate.finance202208.domain.monthly.details.debt.DebtMonthDetails;
import org.hibernate.annotations.Type;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

/**
 * The abstract class that all debt classes inherit from.
 */
@MappedSuperclass
@SuppressWarnings("unused")
public abstract class Debt extends Finance {

  @NotNull
  @Column(name = "price", nullable = false)
  @Type(type = "com.psybergate.finance202208.domain.money.MoneyDecimalType")
  private Money price;

  /**
   * The minimum monthly amount that the customer has to give at the end of every month.
   */
  @NotNull
  @Column(name = "monthly_repayment")
  @Type(type = "com.psybergate.finance202208.domain.money.MoneyDecimalType")
  private Money monthlyRepayment;

  public Debt() {
    this.price = new Money();
  }

  public abstract Money calcInitialRepayment();

  public abstract Money calcRepayment(Money balance, double rate, int term);

  /**
   * The total monthlyRepayments paid during Finance
   *
   * @return a Money amount for the term
   */
  public Money getTotalMonthlyRepayments() {
    Money total = new Money();
    for (MonthDetails monthDetails : getMonthlyDetails()) {
      total = total.add(monthDetails.getMonthlyDeposit());
    }
    return total;
  }

  public Integer getActualTerm() {
    return getMonthlyDetails().size();
  }

  public Money getFinalClosingBalance() {
    int lastMonth = getMonthlyDetails().size() - 1;
    return getMonthlyDetails().get(lastMonth).getClosingBalance();
  }

  public Money balanceBeforeRepayment(MonthDetails monthDetails) {
    return monthDetails.getOpeningBalance()
        .add(monthDetails.getWithdraw())
        .add(monthDetails.getInterest())
        .subtract(monthDetails.getDeposit());
  }

  @Override
  public List<MonthDetails> getMonthlyDetails() {
    List<MonthDetails> monthlyDetails = new ArrayList<>();
    Money openingBalance = getPrice().subtract(getInitialDeposit());
    this.setMonthlyRepayment(calcInitialRepayment());

    for (int month = 1; month <= getTerm(); month++) {
      DebtMonthDetails monthDetails = new DebtMonthDetails();

      monthDetails.setMonth(month);
      monthDetails.setOpeningBalance(openingBalance);
      monthDetails.setAnnualInterestRate(getRate());
      monthDetails.setMonthlyDeposit(getMonthlyRepayment());
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
      for (int i = 0; i < getEvents().size(); i++) {
        Event event = getEvents().get(i);
        event.process(monthlyDetails);

        int position = 0;

        for (; position < monthlyDetails.size(); position++) {
          MonthDetails monthDetails = monthlyDetails.get(position);
          monthDetails.setInterest(monthDetails.calcInterest());
          double rate = monthDetails.getAnnualInterestRate();
          Money newBalance = monthDetails.getOpeningBalance()
              .add(monthDetails.getWithdraw())
              .subtract(monthDetails.getDeposit());
          Money newRepayment = calcRepayment(newBalance, rate, getTerm() - position);

          if (event.getKeepRepayment()) {
            if (event.getMonth() != 1) {
              monthDetails.setMonthlyDeposit(monthlyDetails.get(event.getMonth() - 2).getMonthlyDeposit());
            } else {
              monthDetails.setMonthlyDeposit(this.getMonthlyRepayment());
            }
          }

          if (newRepayment.moreThan(monthDetails.getMonthlyDeposit()) ||
              (!event.getKeepRepayment() &&
                  (!(event.getEventType().equals(EventType.CHANGE_AMOUNT.getEventName()) ||
                      event.getEventType().equals(EventType.INCREASE_AMOUNT.getEventName()))))
          ) {
            monthDetails.setMonthlyDeposit(newRepayment);
          }


          monthDetails.setClosingBalance(monthDetails.calcClosingBalance());
          if (position < monthlyDetails.size() - 1) {
            monthlyDetails.get(position + 1).setOpeningBalance(monthDetails.getClosingBalance());
          }

          if (!monthDetails.getClosingBalance().moreThan("0")) {
            break;
          }
        }

        if (i == getEvents().size() - 1) {
          for (position++; position < monthlyDetails.size(); ) {
            monthlyDetails.remove(position);
          }
        }
      }
    }
  }

  public Money getPrice() {
    return price;
  }

  public void setPrice(Money price) {
    this.price = price;
  }

  public Money getMonthlyRepayment() {
    return monthlyRepayment;
  }

  public void setMonthlyRepayment(Money monthlyRepayment) {
    this.monthlyRepayment = monthlyRepayment;
  }
}