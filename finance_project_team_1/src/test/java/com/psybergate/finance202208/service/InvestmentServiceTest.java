package com.psybergate.finance202208.service;

import com.psybergate.finance202208.domain.Customer;
import com.psybergate.finance202208.domain.events.*;
import com.psybergate.finance202208.domain.finance.investment.Investment;
import com.psybergate.finance202208.domain.money.Money;
import com.psybergate.finance202208.domain.monthly.details.MonthDetails;
import com.psybergate.finance202208.utils.EntityUtil;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.*;

public class InvestmentServiceTest {

  @Test
  public void testValidateInvestmentCreation() {
    Investment investment = new Investment();

    Customer customer = EntityUtil.getNewCustomer();
    String name = "New Investment";
    Money initialDeposit = new Money("1_000.00");
    Double rate = 10.0;
    Integer term = 10;
    Money monthlyContribution = new Money("100");

    investment.setName(name);
    investment.setCustomer(customer);
    investment.setInitialDeposit(initialDeposit);
    investment.setRate(rate);
    investment.setTerm(term);
    investment.setMonthlyContribution(monthlyContribution);

    assertThat(investment.getName()).isEqualTo(name);
    assertThat(investment.getCustomer()).isEqualTo(customer);
    assertThat(investment.getInitialDeposit()).isEqualTo(initialDeposit);
    assertThat(investment.getRate()).isEqualTo(rate);
    assertThat(investment.getTerm()).isEqualTo(term);
    assertThat(investment.getMonthlyContribution()).isEqualTo(monthlyContribution);
    assertThat(investment.getFinanceNum()).isNull();
    assertThat(investment.getEvents()).isNull();
  }

  @Test
  public void testValidateInvestmentCalculationsWithoutEvents() {
    Investment investment = getInvestmentForCalculations();

    Money totalMonthlyContributions = investment.getTotalMonthlyContribution();
    Money finalAmount = investment.getFinalAmount();
    Money totalDeposits = investment.getTotalDeposits();
    Money totalWithdraws = investment.getTotalWithdraws();
    Money totalInterest = investment.getTotalInterest();

    assertThat(finalAmount.toString()).isEqualTo("218375.58");
    assertThat(totalMonthlyContributions.toString()).isEqualTo("12000.00");
    assertThat(totalDeposits.toString()).isEqualTo("0.00");
    assertThat(totalWithdraws.toString()).isEqualTo("0.00");
    assertThat(totalInterest.toString()).isEqualTo("106375.58");
  }

  @Test
  public void testValidateInvestmentCalculationsWithEvents() {
    Investment investment = getInvestmentForCalculations();

    List<Event> events = new ArrayList<>();

    Event deposit = new Deposit();
    deposit.setMonth(5);
    deposit.setAmount(10000.0);
    deposit.setFinance(investment);

    Event withdraw = new Withdraw();
    withdraw.setMonth(7);
    withdraw.setAmount(500.0);
    withdraw.setFinance(investment);

    Event changeRate = new ChangeRate();
    changeRate.setMonth(8);
    changeRate.setAmount(10.0);
    changeRate.setFinance(investment);

    Event changeAmount = new ChangeAmount();
    changeAmount.setMonth(10);
    changeAmount.setAmount(200.0);
    changeAmount.setFinance(investment);

    Event increaseAmount = new IncreaseAmount();
    increaseAmount.setMonth(20);
    increaseAmount.setAmount(200.0);
    increaseAmount.setFinance(investment);

    events.add(deposit);
    events.add(withdraw);
    events.add(changeRate);
    events.add(changeAmount);
    events.add(increaseAmount);

    investment.setEvents(events);

    List<MonthDetails> monthlyDetails = investment.getMonthlyDetails();
    Money totalMonthlyContributions = investment.getTotalMonthlyContribution();
    Money finalAmount = investment.getFinalAmount();
    Money totalDeposits = investment.getTotalDeposits();
    Money totalWithdraws = investment.getTotalWithdraws();
    Money totalInterest = investment.getTotalInterest();

    assertThat(totalDeposits.toString()).isEqualTo("10000.00");
    assertThat(totalWithdraws.toString()).isEqualTo("500.00");
    assertThat(finalAmount.toString()).isEqualTo("361437.24");
    assertThat(totalMonthlyContributions.toString()).isEqualTo("43300.00");
    assertThat(totalDeposits.toString()).isEqualTo("10000.00");
    assertThat(totalWithdraws.toString()).isEqualTo("500.00");
    assertThat(totalInterest.toString()).isEqualTo("208637.24");
    assertThat(monthlyDetails).size().isEqualTo(120);
  }

  private Investment getInvestmentForCalculations() {
    Investment investment = EntityUtil.getNewInvestment();

    investment.setInitialDeposit(new Money("100_000"));
    investment.setRate(7.0);
    investment.setTerm(120);
    investment.setMonthlyContribution(new Money("100"));

    return investment;
  }
}
