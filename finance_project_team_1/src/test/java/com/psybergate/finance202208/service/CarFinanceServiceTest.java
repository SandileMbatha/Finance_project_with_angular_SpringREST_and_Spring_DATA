package com.psybergate.finance202208.service;

import com.psybergate.finance202208.domain.Customer;
import com.psybergate.finance202208.domain.events.*;
import com.psybergate.finance202208.domain.finance.debt.CarFinance;
import com.psybergate.finance202208.domain.money.Money;
import com.psybergate.finance202208.domain.monthly.details.MonthDetails;
import com.psybergate.finance202208.exception.FinanceException;
import com.psybergate.finance202208.repository.CarFinanceRepository;
import com.psybergate.finance202208.service.impl.CarFinanceServiceImpl;
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
public class CarFinanceServiceTest {

  @Mock
  private CarFinanceRepository carFinanceRepository;

  @InjectMocks
  private CarFinanceService carFinanceService = new CarFinanceServiceImpl(carFinanceRepository);

  @Before
  public void init() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  public void testValidateCarFinanceCreation() {
    CarFinance carFinance = new CarFinance();

    Customer customer = EntityUtil.getNewCustomer();
    String name = "New Car Finance";
    Money price = new Money("500_000");
    Money initialDeposit = new Money("1_000.00");
    Integer term = 120;
    Double rate = 12.0;
    Money balloonPayment = new Money("100_000.00");

    carFinance.setCustomer(customer);
    carFinance.setName(name);
    carFinance.setPrice(price);
    carFinance.setInitialDeposit(initialDeposit);
    carFinance.setRate(rate);
    carFinance.setTerm(term);
    carFinance.setBalloonPayment(balloonPayment);

    assertThat(carFinance.getCustomer()).isEqualTo(customer);
    assertThat(carFinance.getName()).isEqualTo(name);
    assertThat(carFinance.getPrice()).isEqualTo(price);
    assertThat(carFinance.getInitialDeposit()).isEqualTo(initialDeposit);
    assertThat(carFinance.getRate()).isEqualTo(rate);
    assertThat(carFinance.getTerm()).isEqualTo(term);
    assertThat(carFinance.getBalloonPayment()).isEqualTo(balloonPayment);
    assertThat(carFinance.getFinanceNum()).isNull();
    assertThat(carFinance.getEvents()).isNull();
  }

  @Test
  public void testValidateCarFinanceCalculationsWithoutEvents() {
    CarFinance carFinance = getCarFinanceForCalculations();

    List<MonthDetails> monthlyDetails = carFinance.getMonthlyDetails();
    Money monthlyRepayments = carFinance.getMonthlyRepayment();
    Money totalMonthlyRepayments = carFinance.getTotalMonthlyRepayments();
    Money finalClosingBalance = carFinance.getFinalClosingBalance();
    Money totalDeposits = carFinance.getTotalDeposits();
    Money totalWithdraws = carFinance.getTotalWithdraws();
    Money totalInterest = carFinance.getTotalInterest();

    assertThat(monthlyDetails.get(0).getOpeningBalance().toString())
            .isEqualTo(
                    carFinance.getPrice().subtract(carFinance.getInitialDeposit()).toString());
    assertThat(monthlyDetails).size().isEqualTo(72);
    assertThat(monthlyRepayments.toString()).isEqualTo("8629.06");
    assertThat(finalClosingBalance.toString()).isEqualTo("120000.96");
    assertThat(totalMonthlyRepayments.toString()).isEqualTo("621292.60");
    assertThat(totalDeposits.toString()).isEqualTo("0.00");
    assertThat(totalWithdraws.toString()).isEqualTo("0.00");
    assertThat(totalInterest.toString()).isEqualTo("241293.56");
  }

  @Test
  public void testValidateCarFinanceCalculationsWithEvents1() {
    CarFinance carFinance = getCarFinanceForCalculations();

    setStandardEventCalculationData(carFinance);

    List<MonthDetails> monthlyDetails = carFinance.getMonthlyDetails();
    Money monthlyRepayments = carFinance.getMonthlyRepayment();
    Money totalMonthlyRepayments = carFinance.getTotalMonthlyRepayments();
    Money finalClosingBalance = carFinance.getFinalClosingBalance();
    Money totalDeposits = carFinance.getTotalDeposits();
    Money totalWithdraws = carFinance.getTotalWithdraws();
    Money totalInterest = carFinance.getTotalInterest();

    assertThat(monthlyDetails.get(0).getOpeningBalance().toString())
            .isEqualTo(
                    carFinance.getPrice().subtract(carFinance.getInitialDeposit()).toString());
    assertThat(monthlyDetails).size().isEqualTo(47);
    assertThat(monthlyRepayments.toString()).isEqualTo("8629.06");
    assertThat(finalClosingBalance.toString()).isEqualTo("120000.00");
    assertThat(totalMonthlyRepayments.toString()).isEqualTo("426156.65");
    assertThat(totalDeposits.toString()).isEqualTo("100000.00");
    assertThat(totalWithdraws.toString()).isEqualTo("0.00");
    assertThat(totalInterest.toString()).isEqualTo("146156.65");
  }

  @Test
  public void testValidateCarFinanceCalculationsWithEvents2() {
    CarFinance carFinance = getCarFinanceForCalculations();

    setStandardEventCalculationData(carFinance);

    List<Event> events = carFinance.getEvents();
    events.get(0).setKeepRepayment(true);
    events.get(1).setKeepRepayment(true);
    events.get(2).setKeepRepayment(true);

    Money totalMonthlyRepayments = carFinance.getTotalMonthlyRepayments();
    assertThat(totalMonthlyRepayments.toString()).isNotEqualTo("426156.65");
  }

  @Test
  public void testSaveCarFinanceFailsWithInvalidInitialDeposit() {
    CarFinance newCarFinance = EntityUtil.getNewCarFinance();
    newCarFinance.setPrice(new Money("1_000_000"));
    newCarFinance.setInitialDeposit(new Money("1_000_001"));

    assertThatThrownBy(() -> carFinanceService.create(newCarFinance))
            .isInstanceOf(FinanceException.class);

    newCarFinance.setInitialDeposit(new Money("1_000_000"));

    assertThatThrownBy(() -> carFinanceService.create(newCarFinance))
            .isInstanceOf(FinanceException.class);
    verify(carFinanceRepository, times(0)).save(newCarFinance);
    verifyNoMoreInteractions(carFinanceRepository);
  }

  @Test
  public void testSaveCarFinanceFailsWithInvalidBalloonPayment() {
    CarFinance newCarFinance = EntityUtil.getNewCarFinance();
    newCarFinance.setPrice(new Money("1_000_000"));
    newCarFinance.setBalloonPayment(new Money("1_000_001"));

    assertThatThrownBy(() -> carFinanceService.create(newCarFinance))
            .isInstanceOf(FinanceException.class);

    newCarFinance.setBalloonPayment(new Money("1_000_000"));

    assertThatThrownBy(() -> carFinanceService.create(newCarFinance))
            .isInstanceOf(FinanceException.class);
    verify(carFinanceRepository, times(0)).save(newCarFinance);
    verifyNoMoreInteractions(carFinanceRepository);
  }

  @Test
  public void testSaveCarFinanceFailsWithInvalidBalloonPaymentAndInitialDeposit() {
    CarFinance newCarFinance = EntityUtil.getNewCarFinance();
    newCarFinance.setPrice(new Money("1_000_000"));
    newCarFinance.setInitialDeposit(new Money("500_001"));
    newCarFinance.setBalloonPayment(new Money("500_000"));

    assertThatThrownBy(() -> carFinanceService.create(newCarFinance))
            .isInstanceOf(FinanceException.class);

    newCarFinance.setInitialDeposit(new Money("500_000"));
    newCarFinance.setBalloonPayment(new Money("500_000"));

    assertThatThrownBy(() -> carFinanceService.create(newCarFinance))
            .isInstanceOf(FinanceException.class);
    verify(carFinanceRepository, times(0)).save(newCarFinance);
    verifyNoMoreInteractions(carFinanceRepository);
  }

  private void setStandardEventCalculationData(CarFinance carFinance) {
    List<Event> events = new ArrayList<>();

    Event deposit = new Deposit();
    deposit.setMonth(5);
    deposit.setAmount(100000.0);
    deposit.setFinance(carFinance);
    deposit.setKeepRepayment(false);

    Event changeRate = new ChangeRate();
    changeRate.setMonth(8);
    changeRate.setAmount(15.0);
    changeRate.setFinance(carFinance);
    changeRate.setKeepRepayment(false);

    Event changeAmount = new ChangeAmount();
    changeAmount.setMonth(10);
    changeAmount.setAmount(9000.0);
    changeAmount.setFinance(carFinance);

    Event increaseAmount = new IncreaseAmount();
    increaseAmount.setMonth(20);
    increaseAmount.setAmount(5000.0);
    increaseAmount.setFinance(carFinance);

    events.add(deposit);
    events.add(changeRate);
    events.add(changeAmount);
    events.add(increaseAmount);

    carFinance.setEvents(events);
  }

  private CarFinance getCarFinanceForCalculations() {
    CarFinance carFinance = EntityUtil.getNewCarFinance();

    carFinance.setPrice(new Money("600_000"));
    carFinance.setInitialDeposit(new Money("100_000"));
    carFinance.setRate(12.0);
    carFinance.setTerm(72);
    carFinance.setBalloonPayment(new Money("120_000"));

    return carFinance;
  }
}
