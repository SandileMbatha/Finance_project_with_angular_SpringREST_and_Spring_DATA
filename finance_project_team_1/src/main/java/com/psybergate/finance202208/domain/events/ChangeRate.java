package com.psybergate.finance202208.domain.events;

import com.psybergate.finance202208.domain.monthly.details.MonthDetails;

import javax.persistence.Entity;
import java.util.List;

import static com.psybergate.finance202208.domain.events.EventType.*;

@Entity
@SuppressWarnings("unused")
public class ChangeRate extends Event {

  public ChangeRate() {
    this.setEventType(CHANGE_RATE.getEventName());
  }

  @Override
  public void process(List<MonthDetails> monthlyDetails) {
    for (int i = this.getMonth() - 1; i < monthlyDetails.size(); i++) {
      monthlyDetails.get(i).setAnnualInterestRate(this.getAmount());
    }
  }
}