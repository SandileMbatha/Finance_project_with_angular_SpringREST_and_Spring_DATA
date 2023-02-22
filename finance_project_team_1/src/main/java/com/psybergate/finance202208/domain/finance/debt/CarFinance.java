package com.psybergate.finance202208.domain.finance.debt;

import com.psybergate.finance202208.domain.money.Money;
import com.psybergate.finance202208.domain.monthly.details.MonthDetails;
import org.hibernate.annotations.Type;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * The FinanceProjection representation of a Car Finance.
 */
@Entity
@Table(name = "car_finance")
@SuppressWarnings("unused")
public class CarFinance extends Debt {

  /**
   * The balloon payment of the car.
   */
  @NotNull
  @Column(name = "balloon_payment")
  @Type(type = "com.psybergate.finance202208.domain.money.MoneyDecimalType")
  private Money balloonPayment;

  public CarFinance() {
    this.balloonPayment = new Money();
  }

  /**
   * Calculates the monthly repayment amount for the CarPurchase using the formula:
   * i / (1-(1 / (1 + r)^n)) where i is the rate and n is the term.
   */
  @Override
  public Money calcInitialRepayment() {
    return calcRepayment(getPrice().subtract(getInitialDeposit()), getRate(), getTerm());
  }

  @Override
  public Money calcRepayment(Money balance, double rate, int term) {
    double monthlyRate = (rate / 100) / 12;
    double factor = monthlyRate / (1 - Math.pow((1 + monthlyRate), - term));
    Money financeAmount = balance.subtract(getBalloonPayment()
        .divide(Math.pow((1 + monthlyRate), term) + ""));
    return financeAmount.multiply(factor + "");
  }

  @Override
  public void processEvents(List<MonthDetails> monthlyDetails) {
    super.processEvents(monthlyDetails);

    int lastMonthDetails = monthlyDetails.size() - 1;
    MonthDetails monthDetails = monthlyDetails.get(lastMonthDetails);

    Money balanceBeforeRepayment = balanceBeforeRepayment(monthDetails);
    if (balanceBeforeRepayment.subtract(monthDetails.getMonthlyDeposit()).lessThan(getBalloonPayment())) {
      monthDetails.setMonthlyDeposit(balanceBeforeRepayment.subtract(getBalloonPayment()));
      monthDetails.setClosingBalance(monthDetails.calcClosingBalance());
    }
  }

  public Money getBalloonPayment() {
    return balloonPayment;
  }

  public void setBalloonPayment(Money balloonPayment) {
    this.balloonPayment = balloonPayment;
  }
}