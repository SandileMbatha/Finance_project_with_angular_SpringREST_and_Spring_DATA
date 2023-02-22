package com.psybergate.finance202208.domain.events;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.psybergate.finance202208.domain.finance.Finance;
import com.psybergate.finance202208.domain.monthly.details.MonthDetails;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@SuppressWarnings("unused")
public class Event {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "event_num")
  private Long eventNum;

  @NotNull
  @ManyToOne
  @JoinColumn(name = "finance_num")
  @JsonIgnore
  private Finance finance;

  @Transient
  private String eventType;

  @Positive
  @Column(name = "month")
  private Integer month;

  @Positive
  @Column(name = "amount")
  private Double amount;

  @Column(name = "keep_repayment")
  private Boolean keepRepayment = true;

  public void process(List<MonthDetails> monthlyDetails) {
  }

  public Long getEventNum() {
    return eventNum;
  }

  public void setEventNum(Long eventNum) {
    this.eventNum = eventNum;
  }

  public Finance getFinance() {
    return finance;
  }

  public void setFinance(Finance finance) {
    this.finance = finance;
  }

  public String getEventType() {
    return eventType;
  }

  public void setEventType(String eventType) {
    this.eventType = eventType;
  }

  public Integer getMonth() {
    return month;
  }

  public void setMonth(Integer month) {
    this.month = month;
  }

  public Double getAmount() {
    return amount;
  }

  public void setAmount(Double amount) {
    this.amount = amount;
  }

  public Boolean getKeepRepayment() {
    return keepRepayment;
  }

  public void setKeepRepayment(Boolean keepRepayment) {
    this.keepRepayment = keepRepayment;
  }
}