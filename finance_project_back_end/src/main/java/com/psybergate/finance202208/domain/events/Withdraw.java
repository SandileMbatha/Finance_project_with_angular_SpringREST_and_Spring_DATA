package com.psybergate.finance202208.domain.events;

import com.psybergate.finance202208.domain.money.Money;
import com.psybergate.finance202208.domain.monthly.details.MonthDetails;

import javax.persistence.Entity;
import java.util.List;

import static com.psybergate.finance202208.domain.events.EventType.*;

@Entity
@SuppressWarnings("unused")
public class Withdraw extends Event {

  public Withdraw() {
    this.setEventType(WITHDRAW.getEventName());
  }

  @Override
  public void process(List<MonthDetails> monthlyDetails) {
    for (MonthDetails monthDetails : monthlyDetails) {
      if (monthDetails.getMonth() == this.getMonth()) {
        monthDetails.setWithdraw(monthDetails.getWithdraw().add(new Money(getAmount()))
        );
      }
    }
  }
}