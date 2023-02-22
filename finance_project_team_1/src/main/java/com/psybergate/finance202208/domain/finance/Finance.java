package com.psybergate.finance202208.domain.finance;

import com.psybergate.finance202208.domain.Customer;
import com.psybergate.finance202208.domain.events.Event;
import com.psybergate.finance202208.domain.money.Money;
import com.psybergate.finance202208.domain.monthly.details.MonthDetails;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * The abstract class that all finance projection classes inherit from.
 */
@Entity
@Table(uniqueConstraints = { @UniqueConstraint(columnNames = { "customer_num", "name" }) })
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@SuppressWarnings("unused")
public abstract class Finance {

  /**
   * A unique identifier for the database. The database will generate the value.
   */
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "finance_num")
  private Long financeNum;

  /**
   * The unique identifier for the customer which the FinanceProjection belongs to.
   */
  @NotNull
  @ManyToOne
  @JoinColumn(name = "customer_num")
  private Customer customer;

  /**
   * The unique name for the projection that the customer chooses.
   */
  @NotEmpty(message = "Finance must have a name.")
  @Column(name = "name", nullable = false)
  private String name;

  /**
   * The initial amount that the customer gave/took for the Finance.
   */
  @NotNull
  @Column(name = "initial_deposit", nullable = false)
  @Type(type = "com.psybergate.finance202208.domain.money.MoneyDecimalType")
  private Money initialDeposit;

  /**
   * The term in months that the FinanceProjection is for.
   */
  @NotNull
  @Column(name = "term", nullable = false)
  private Integer term;

  /**
   * The interest rate per annum (annual interest) as a percentage rounded to 3 decimal places
   */
  @NotNull
  @Column(name = "rate", nullable = false)
  private Double rate;

  /**
   * Contains the events of a FinanceProjection.
   */
  @Transient
  private List<Event> events;

  public Finance() {
    this.initialDeposit = new Money();
    this.term = 0;
    this.rate = 0.0;
  }

  public abstract List<MonthDetails> getMonthlyDetails();

  public abstract void processEvents(List<MonthDetails> monthlyDetails);

  public double monthlyInterestRate(double rate) {
    return rate / 12 / 100;
  }

  public Long getFinanceNum() {
    return financeNum;
  }

  public void setFinanceNum(Long financeNum) {
    this.financeNum = financeNum;
  }

  public Customer getCustomer() {
    return customer;
  }

  public void setCustomer(Customer customer) {
    this.customer = customer;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Money getInitialDeposit() {
    return initialDeposit;
  }

  public void setInitialDeposit(Money initialDeposit) {
    this.initialDeposit = initialDeposit;
  }

  public Integer getTerm() {
    return term;
  }

  public void setTerm(Integer term) {
    this.term = term;
  }

  public Double getRate() {
    return rate;
  }

  public void setRate(Double rate) {
    this.rate = rate;
  }

  public List<Event> getEvents() {
    return events;
  }

  public void setEvents(List<Event> events) {
    this.events = events;
  }

  public Money getTotalDeposits() {
    Money total = new Money();
    for (MonthDetails monthlyDetail : getMonthlyDetails()) {
      total = total.add(monthlyDetail.getDeposit());
    }
    return total;
  }

  public Money getTotalWithdraws() {
    Money total = new Money();
    for (MonthDetails monthlyDetail : getMonthlyDetails()) {
      total = total.add(monthlyDetail.getWithdraw());
    }
    return total;
  }

  public Money getTotalInterest() {
    Money total = new Money();
    for (MonthDetails monthlyDetail : getMonthlyDetails()) {
      total = total.add(monthlyDetail.getInterest());
    }
    return total;
  }
}