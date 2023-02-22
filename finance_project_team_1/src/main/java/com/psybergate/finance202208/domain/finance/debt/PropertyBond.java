package com.psybergate.finance202208.domain.finance.debt;

import com.psybergate.finance202208.domain.money.Money;
import com.psybergate.finance202208.domain.utils.TransferDuty;
import org.hibernate.annotations.Type;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

/**
 * The FinanceProjection representation of a Property Bond.
 */
@Entity
@Table(name = "property_bond")
@SuppressWarnings("unused")
public class PropertyBond extends Debt {

  private static final String MAX_WITHDRAWAL_PERCENTAGE = "0.9";

  /**
   * The cost of the property bond.
   */
  @NotNull
  @Column(name = "bond_costs")
  @Type(type = "com.psybergate.finance202208.domain.money.MoneyDecimalType")
  private Money bondCosts;

  /**
   * The cost of any and all legal services related to the property bond
   */
  @NotNull
  @Column(name = "legal_costs")
  @Type(type = "com.psybergate.finance202208.domain.money.MoneyDecimalType")
  private Money legalCosts;

  /**
   * The cost to change the name on the deed of the property.
   */
  @NotNull
  @Column(name = "transfer_costs")
  @Type(type = "com.psybergate.finance202208.domain.money.MoneyDecimalType")
  private Money transferCosts;

  public PropertyBond() {
    this.bondCosts = new Money();
    this.legalCosts = new Money();
    this.transferCosts = new Money();
  }

  public Money getTotalCosts() {
    return getBondCosts().add(getLegalCosts()).add(getTransferCosts());
  }

  public Money maxWithdrawalAmount() {
    return getPrice().multiply(MAX_WITHDRAWAL_PERCENTAGE);
  }

  public Double maxWithdrawalPercentage() {
    return Double.parseDouble(MAX_WITHDRAWAL_PERCENTAGE) * 100;
  }

  @Override
  public void setPrice(Money price) {
    super.setPrice(price);
    setTransferCosts(TransferDuty.calculateTransferCosts(price));
  }

  /**
   * Calculates the monthly repayment amount for the CarFinance using the formula:
   * i / (1-(1 / (1 + r)^n)) where i is the rate and n is the term.
   */
  @Override
  public Money calcInitialRepayment() {
    return calcRepayment(getPrice().subtract(getInitialDeposit()), getRate(), getTerm());
  }

  @Override
  public Money calcRepayment(Money balance, double rate, int term) {
    double monthlyRate = monthlyInterestRate(rate);
    double factor = monthlyRate / (1 - (1 / Math.pow((1 + monthlyRate), term)));
    return balance.multiply(factor + "");
  }

  public Money getBondCosts() {
    return bondCosts;
  }

  public void setBondCosts(Money bondCosts) {
    this.bondCosts = bondCosts;
  }

  public Money getLegalCosts() {
    return legalCosts;
  }

  public void setLegalCosts(Money legalCosts) {
    this.legalCosts = legalCosts;
  }

  public Money getTransferCosts() {
    return transferCosts;
  }

  private void setTransferCosts(Money transferCosts) {
    this.transferCosts = transferCosts;
  }

}