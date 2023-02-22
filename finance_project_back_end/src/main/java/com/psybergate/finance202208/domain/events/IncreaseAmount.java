package com.psybergate.finance202208.domain.events;

import com.psybergate.finance202208.domain.money.Money;
import com.psybergate.finance202208.domain.monthly.details.MonthDetails;

import javax.persistence.Entity;
import java.util.List;

import static com.psybergate.finance202208.domain.events.EventType.*;

@Entity
@SuppressWarnings("unused")
public class IncreaseAmount extends Event {

  public IncreaseAmount() {
    this.setEventType(INCREASE_AMOUNT.getEventName());
    this.setKeepRepayment(false);
  }

  @Override
  public void process(List<MonthDetails> monthlyDetails) {
    for (int i = this.getMonth() - 1; i < monthlyDetails.size(); i++) {
      Money currentMonthlyDeposit = monthlyDetails.get(i).getMonthlyDeposit();
      Money newMonthlyDeposit = currentMonthlyDeposit.add(new Money(this.getAmount()));
      monthlyDetails.get(i).setMonthlyDeposit(newMonthlyDeposit);
    }
  }

  @Override
  public void setKeepRepayment(Boolean keepRepayment) {
    super.setKeepRepayment(false);
  }
}