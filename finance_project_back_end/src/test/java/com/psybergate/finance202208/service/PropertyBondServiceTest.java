package com.psybergate.finance202208.service;

import com.psybergate.finance202208.domain.Customer;
import com.psybergate.finance202208.domain.events.*;
import com.psybergate.finance202208.domain.finance.debt.PropertyBond;
import com.psybergate.finance202208.domain.money.Money;
import com.psybergate.finance202208.domain.monthly.details.MonthDetails;
import com.psybergate.finance202208.exception.FinanceException;
import com.psybergate.finance202208.repository.PropertyBondRepository;
import com.psybergate.finance202208.service.impl.PropertyBondServiceImpl;
import com.psybergate.finance202208.utils.EntityUtil;
import org.junit.Before;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PropertyBondServiceTest {

  @Mock
  private PropertyBondRepository propertyBondRepository;

  @InjectMocks
  private PropertyBondService propertyBondService = new PropertyBondServiceImpl(propertyBondRepository);

  @Before
  public void init() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  public void testValidatePropertyBondCreation() {
    PropertyBond propertyBond = new PropertyBond();

    Customer customer = EntityUtil.getNewCustomer();
    String name = "New Property Bond";
    Money price = new Money("1_000_000");
    Money initialDeposit = new Money("1_000.00");
    Integer term = 120;
    Double rate = 13.0;
    Money bondCosts = new Money("10_000.00");
    Money legalCosts = new Money("10_000.00");

    propertyBond.setCustomer(customer);
    propertyBond.setName(name);
    propertyBond.setPrice(price);
    propertyBond.setInitialDeposit(initialDeposit);
    propertyBond.setRate(rate);
    propertyBond.setTerm(term);
    propertyBond.setBondCosts(bondCosts);
    propertyBond.setLegalCosts(legalCosts);

    assertThat(propertyBond.getCustomer()).isEqualTo(customer);
    assertThat(propertyBond.getName()).isEqualTo(name);
    assertThat(propertyBond.getPrice()).isEqualTo(price);
    assertThat(propertyBond.getInitialDeposit()).isEqualTo(initialDeposit);
    assertThat(propertyBond.getRate()).isEqualTo(rate);
    assertThat(propertyBond.getTerm()).isEqualTo(term);
    assertThat(propertyBond.getBondCosts()).isEqualTo(bondCosts);
    assertThat(propertyBond.getLegalCosts()).isEqualTo(legalCosts);
    assertThat(propertyBond.getFinanceNum()).isNull();
    assertThat(propertyBond.getEvents()).isNull();
  }

  @Test
  public void testValidatePropertyBondCalculationsWithoutEvents() {
    PropertyBond propertyBond = getPropertyBondForCalculations();

    List<MonthDetails> monthlyDetails = propertyBond.getMonthlyDetails();
    Money monthlyRepayments = propertyBond.getMonthlyRepayment();
    Money totalMonthlyRepayments = propertyBond.getTotalMonthlyRepayments();
    Money finalClosingBalance = propertyBond.getFinalClosingBalance();
    Money totalDeposits = propertyBond.getTotalDeposits();
    Money totalWithdraws = propertyBond.getTotalWithdraws();
    Money totalInterest = propertyBond.getTotalInterest();

    assertThat(monthlyDetails.get(0).getOpeningBalance().toString())
            .isEqualTo(
                    propertyBond.getPrice().subtract(propertyBond.getInitialDeposit()).toString());
    assertThat(monthlyDetails).size().isEqualTo(240);
    assertThat(monthlyRepayments.toString()).isEqualTo("16405.36");
    assertThat(finalClosingBalance.toString()).isEqualTo("0.00");
    assertThat(totalMonthlyRepayments.toString()).isEqualTo("3937288.31");
    assertThat(totalDeposits.toString()).isEqualTo("0.00");
    assertThat(totalWithdraws.toString()).isEqualTo("0.00");
    assertThat(totalInterest.toString()).isEqualTo("2237288.31");
  }

  @Test
  public void testValidatePropertyBondCalculationsWithEvents1() {
    PropertyBond propertyBond = getPropertyBondForCalculations();

    setStandardEventCalculationData(propertyBond);

    List<MonthDetails> monthlyDetails = propertyBond.getMonthlyDetails();
    Money monthlyRepayments = propertyBond.getMonthlyRepayment();
    Money totalMonthlyRepayments = propertyBond.getTotalMonthlyRepayments();
    Money finalClosingBalance = propertyBond.getFinalClosingBalance();
    Money totalDeposits = propertyBond.getTotalDeposits();
    Money totalWithdraws = propertyBond.getTotalWithdraws();
    Money totalInterest = propertyBond.getTotalInterest();

    assertThat(monthlyDetails.get(0).getOpeningBalance().toString())
            .isEqualTo(
                    propertyBond.getPrice().subtract(propertyBond.getInitialDeposit()).toString());
    assertThat(monthlyDetails).size().isEqualTo(126);
    assertThat(monthlyRepayments.toString()).isEqualTo("16405.36");
    assertThat(finalClosingBalance.toString()).isEqualTo("0.00");
    assertThat(totalMonthlyRepayments.toString()).isEqualTo("3008998.42");
    assertThat(totalDeposits.toString()).isEqualTo("300000.00");
    assertThat(totalWithdraws.toString()).isEqualTo("100000.00");
    assertThat(totalInterest.toString()).isEqualTo("1508998.42");
  }

  @Test
  public void testValidatePropertyBondCalculationsWithEvents2() {
    PropertyBond propertyBond = getPropertyBondForCalculations();

    setStandardEventCalculationData(propertyBond);

    List<Event> events = propertyBond.getEvents();
    events.get(0).setKeepRepayment(true);
    events.get(1).setKeepRepayment(true);
    events.get(2).setKeepRepayment(true);

    Money totalMonthlyRepayments = propertyBond.getTotalMonthlyRepayments();
    assertThat(totalMonthlyRepayments.toString()).isNotEqualTo("3111184.69");
  }

  private void setStandardEventCalculationData(PropertyBond propertyBond) {
    List<Event> events = new ArrayList<>();

    Event deposit = new Deposit();
    deposit.setMonth(5);
    deposit.setAmount(300000.0);
    deposit.setFinance(propertyBond);
    deposit.setKeepRepayment(false);

    Event withdraw = new Withdraw();
    withdraw.setMonth(7);
    withdraw.setAmount(100000.0);
    withdraw.setFinance(propertyBond);
    withdraw.setKeepRepayment(false);

    Event changeRate = new ChangeRate();
    changeRate.setMonth(8);
    changeRate.setAmount(15.0);
    changeRate.setFinance(propertyBond);
    changeRate.setKeepRepayment(false);

    Event changeAmount = new ChangeAmount();
    changeAmount.setMonth(10);
    changeAmount.setAmount(20000.0);
    changeAmount.setFinance(propertyBond);

    Event increaseAmount = new IncreaseAmount();
    increaseAmount.setMonth(20);
    increaseAmount.setAmount(5000.0);
    increaseAmount.setFinance(propertyBond);

    events.add(deposit);
    events.add(withdraw);
    events.add(changeRate);
    events.add(changeAmount);
    events.add(increaseAmount);

    propertyBond.setEvents(events);
  }

  @Test
  public void testSavePropertyBondFailsWithInvalidInitialDeposit() {
    PropertyBond newPropertyBond = EntityUtil.getNewPropertyBond();
    newPropertyBond.setPrice(new Money("1_000_000"));
    newPropertyBond.setInitialDeposit(new Money("1_000_001"));

    assertThatThrownBy(() -> propertyBondService.create(newPropertyBond))
            .isInstanceOf(FinanceException.class);

    newPropertyBond.setInitialDeposit(new Money("1_000_000"));

    assertThatThrownBy(() -> propertyBondService.create(newPropertyBond))
            .isInstanceOf(FinanceException.class);
    verify(propertyBondRepository, times(0)).save(newPropertyBond);
    verifyNoMoreInteractions(propertyBondRepository);
  }

  private PropertyBond getPropertyBondForCalculations() {
    PropertyBond propertyBond = EntityUtil.getNewPropertyBond();

    propertyBond.setPrice(new Money("2_000_000"));
    propertyBond.setInitialDeposit(new Money("300_000"));
    propertyBond.setRate(10.0);
    propertyBond.setTerm(240);
    propertyBond.setBondCosts(new Money("50_000"));
    propertyBond.setLegalCosts(new Money("50_000"));

    return propertyBond;
  }

}
