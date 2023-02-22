package com.psybergate.finance202208.domain.monthly.details.debt;

import com.psybergate.finance202208.domain.money.Money;
import com.psybergate.finance202208.domain.monthly.details.MonthDetails;

@SuppressWarnings("unused")
public class DebtMonthDetails extends MonthDetails {

  @Override
  public Money calcInterest() {
    Money balanceBeforeInterest = getOpeningBalance().add(getWithdraw()).subtract(getDeposit());
    return balanceBeforeInterest.multiply((monthlyInterestRate()) + "");
  }

  @Override
  public Money calcClosingBalance() {
    Money increaseDebt = getOpeningBalance().add(getWithdraw()).add(getInterest());
    Money decreaseDebt = getMonthlyDeposit().add(getDeposit());

    if (increaseDebt.lessThan(decreaseDebt)) {
      setMonthlyDeposit(increaseDebt);
      return Money.ZERO;
    }

    return increaseDebt.subtract(decreaseDebt);
  }
}