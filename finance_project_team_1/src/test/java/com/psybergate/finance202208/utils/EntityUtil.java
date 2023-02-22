package com.psybergate.finance202208.utils;

import com.psybergate.finance202208.domain.Customer;
import com.psybergate.finance202208.domain.finance.debt.CarFinance;
import com.psybergate.finance202208.domain.finance.debt.PropertyBond;
import com.psybergate.finance202208.domain.finance.investment.Investment;
import com.psybergate.finance202208.domain.money.Money;

import java.time.LocalDate;
import java.util.Random;

public class EntityUtil {

  public static Customer getNewCustomer() {
    long randomNum = getRandomLong();
    Customer customer = new Customer();
    customer.setCustomerNum(randomNum);
    customer.setName("John" + randomNum);
    customer.setSurname("Doe" + randomNum);
    customer.setIdNumber(getRandomCustomerIdNumber());
    customer.setDateOfBirth(LocalDate.now());
    return customer;
  }

  public static Investment getNewInvestment() {
    long randomNum = getRandomLong();
    Investment investment = new Investment();
    investment.setFinanceNum(randomNum);
    investment.setName("Investment" + randomNum);
    investment.setTerm(getRandomInt(20));
    investment.setRate(getRandomDouble(20.0));
    investment.setMonthlyContribution(new Money(getRandomDouble(1000.0) + ""));
    investment.setCustomer(getNewCustomer());
    investment.setInitialDeposit(new Money("10_000"));
    return investment;
  }

  public static PropertyBond getNewPropertyBond() {
    long randomNum = getRandomLong();
    PropertyBond propertyBond = new PropertyBond();
    propertyBond.setFinanceNum(randomNum);
    propertyBond.setCustomer(getNewCustomer());
    propertyBond.setName("PropertyBond" + randomNum);
    propertyBond.setPrice(new Money("2_000_000"));
    propertyBond.setInitialDeposit(new Money("10_000"));
    propertyBond.setTerm(240);
    propertyBond.setRate(getRandomDouble(20.0));
    propertyBond.setBondCosts(new Money("50_000"));
    propertyBond.setLegalCosts(new Money("50_000"));
    return propertyBond;
  }

  public static CarFinance getNewCarFinance() {
    long randomNum = getRandomLong();
    CarFinance carFinance = new CarFinance();
    carFinance.setFinanceNum(randomNum);
    carFinance.setCustomer(getNewCustomer());
    carFinance.setName("CarFinance" + randomNum);
    carFinance.setPrice(new Money("600_000"));
    carFinance.setInitialDeposit(new Money("100_000"));
    carFinance.setTerm(72);
    carFinance.setRate(getRandomDouble(20.0));
    carFinance.setBalloonPayment(new Money("200_000"));
    return carFinance;
  }

  private static int getRandomInt(int max) {
    return new Random().nextInt(max + 1);
  }

  private static long getRandomLong() {
    return new Random().nextLong();
  }

  private static double getRandomDouble(double max) {
    return new Random().nextDouble() * max;
  }

  private static String getRandomCustomerIdNumber() {
    StringBuilder idNumber = new StringBuilder(13);
    Random rand = new Random();

    for (int i = 0; i < 13; i++) {
      idNumber.append(rand.nextInt(10));
    }

    return idNumber.toString();
  }

}
