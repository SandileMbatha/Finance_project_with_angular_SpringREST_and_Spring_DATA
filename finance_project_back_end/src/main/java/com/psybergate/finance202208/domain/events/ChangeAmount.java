package com.psybergate.finance202208.domain.events;

import com.psybergate.finance202208.domain.money.Money;
import com.psybergate.finance202208.domain.monthly.details.MonthDetails;

import javax.persistence.Entity;
import java.util.List;

import static com.psybergate.finance202208.domain.events.EventType.*;

@Entity
@SuppressWarnings("unused")
public class ChangeAmount extends Event {

  public ChangeAmount() {
    this.setEventType(CHANGE_AMOUNT.getEventName());
    this.setKeepRepayment(false);
  }

  @Override
  public void process(List<MonthDetails> monthlyDetails) {
    for (int i = this.getMonth() - 1; i < monthlyDetails.size(); i++) {
      monthlyDetails.get(i).setMonthlyDeposit(new Money(this.getAmount()));
    }
  }

  @Override
  public void setKeepRepayment(Boolean keepRepayment) {
    super.setKeepRepayment(false);
  }
}