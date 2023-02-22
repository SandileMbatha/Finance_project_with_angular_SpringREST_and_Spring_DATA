package com.psybergate.finance202208.domain.monthly.details;

import com.psybergate.finance202208.domain.money.Money;

@SuppressWarnings("unused")
public abstract class MonthDetails {

  private int month;

  private Money openingBalance;

  private Money deposit;

  private Money withdraw;

  private Money monthlyDeposit;

  private double annualInterestRate;

  private Money interest;

  private Money closingBalance;

  public MonthDetails() {
    this.openingBalance = Money.ZERO;
    this.deposit = Money.ZERO;
    this.withdraw = Money.ZERO;
    this.monthlyDeposit = Money.ZERO;
    this.interest = Money.ZERO;
    this.closingBalance = Money.ZERO;
  }

  public abstract Money calcInterest();

  public abstract Money calcClosingBalance();

  public double monthlyInterestRate() {
    return getAnnualInterestRate() / 12 / 100;
  }

  public int getMonth() {
    return month;
  }

  public void setMonth(int month) {
    this.month = month;
  }

  public Money getOpeningBalance() {
    return openingBalance;
  }

  public void setOpeningBalance(Money openingBalance) {
    this.openingBalance = openingBalance;
  }

  public Money getDeposit() {
    return deposit;
  }

  public void setDeposit(Money deposit) {
    this.deposit = deposit;
  }

  public Money getWithdraw() {
    return withdraw;
  }

  public void setWithdraw(Money withdraw) {
    this.withdraw = withdraw;
  }

  public Money getMonthlyDeposit() {
    return monthlyDeposit;
  }

  public void setMonthlyDeposit(Money monthlyDeposit) {
    this.monthlyDeposit = monthlyDeposit;
  }

  public double getAnnualInterestRate() {
    return annualInterestRate;
  }

  public void setAnnualInterestRate(double annualInterestRate) {
    this.annualInterestRate = annualInterestRate;
  }

  public Money getInterest() {
    return interest;
  }

  public void setInterest(Money interest) {
    this.interest = interest;
  }

  public Money getClosingBalance() {
    return closingBalance;
  }

  public void setClosingBalance(Money closingBalance) {
    this.closingBalance = closingBalance;
  }
}