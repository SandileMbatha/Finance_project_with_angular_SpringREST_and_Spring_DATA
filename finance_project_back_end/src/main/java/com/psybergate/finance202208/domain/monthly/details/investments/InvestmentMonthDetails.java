package com.psybergate.finance202208.domain.monthly.details.investments;

import com.psybergate.finance202208.domain.money.Money;
import com.psybergate.finance202208.domain.monthly.details.MonthDetails;

@SuppressWarnings("unused")
public class InvestmentMonthDetails extends MonthDetails {

  @Override
  public Money calcInterest() {
    Money balanceBeforeInterest = getOpeningBalance().add(getMonthlyDeposit()).add(getDeposit()).subtract(getWithdraw());
    return balanceBeforeInterest.multiply((monthlyInterestRate()) + "");
  }

  @Override
  public Money calcClosingBalance() {
    Money increaseInvestment = getOpeningBalance().add(getMonthlyDeposit()).add(getDeposit()).add(getInterest());
    Money decreaseInvestment = getWithdraw();
    return increaseInvestment.subtract(decreaseInvestment);
  }
}