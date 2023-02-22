package com.psybergate.finance202208.domain.events;

@SuppressWarnings("unused")
public enum EventType {
  DEPOSIT("Deposit"), WITHDRAW("Withdraw"), CHANGE_RATE("Change Rate"), CHANGE_AMOUNT("Change " +
      "Amount"), INCREASE_AMOUNT("Increase Amount");

  private final String eventName;

  EventType(String eventName) {
    this.eventName = eventName;
  }

  public String getEventName() {
    return eventName;
  }

  @Override
  public String toString() {
    return eventName;
  }
}