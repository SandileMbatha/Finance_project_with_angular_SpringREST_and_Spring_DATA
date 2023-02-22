package com.psybergate.finance202208.service.impl;

import com.psybergate.finance202208.domain.events.*;
import com.psybergate.finance202208.domain.finance.Finance;
import com.psybergate.finance202208.domain.finance.investment.Investment;
import com.psybergate.finance202208.domain.finance.debt.PropertyBond;
import com.psybergate.finance202208.domain.finance.debt.CarFinance;
import com.psybergate.finance202208.domain.money.Money;
import com.psybergate.finance202208.domain.monthly.details.MonthDetails;
import com.psybergate.finance202208.exception.FinanceException;
import com.psybergate.finance202208.repository.EventRepository;
import com.psybergate.finance202208.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@SuppressWarnings("unused")
@Service("eventService")
@Transactional
public class EventServiceImpl implements EventService {

  private final EventRepository eventRepository;

  @Autowired
  public EventServiceImpl(EventRepository eventRepository) {
    this.eventRepository = eventRepository;
  }

  @Override
  public void create(Event event) {
    validateEvent(event);
    eventRepository.save(getEvent(event));
  }

  private Event getEvent(Event event) {
    Event eventToSave;
    switch (event.getEventType()){
      case "Withdraw":
        eventToSave = getEventToSave(event, new Withdraw());
        break;
      case "Deposit":
        eventToSave = getEventToSave(event, new Deposit());
        break;
      case "Change Amount":
        eventToSave = getEventToSave(event, new ChangeAmount());
        break;
      case "Change Rate":
        eventToSave = getEventToSave(event, new ChangeRate());
        break;
      case "Increase Amount":
        eventToSave = getEventToSave(event, new IncreaseAmount());
        break;
      default:
        eventToSave = getEventToSave(event, new Event());
    }
    return eventToSave;
  }

  private Event getEventToSave(Event event, Event eventToSave) {
    eventToSave.setEventNum(event.getEventNum());
    eventToSave.setEventType(event.getEventType());
    eventToSave.setAmount(event.getAmount());
    eventToSave.setFinance(event.getFinance());
    eventToSave.setMonth(event.getMonth());
    eventToSave.setKeepRepayment(event.getKeepRepayment());
    return eventToSave;
  }

  @Override
  public void update(Event event) {
    removeFromEventsList(event);
    validateEvent(event);
    eventRepository.save(getEvent(event));
  }

  private void removeFromEventsList(Event event) {
    List<Event> events = findAllEvents(event.getFinance().getFinanceNum());
    for (int i = 0; i < events.size(); i++) {
      if (events.get(i).getEventNum().equals(event.getEventNum())) {
        events.remove(i);
        break;
      }
    }
  }

  @Override
  public Event findById(Long eventNum) {
    Optional<Event> event = eventRepository.findById(eventNum);
    return event.orElse(null);
  }

  @Override
  public void delete(Long eventNum) {
    eventRepository.deleteById(eventNum);
  }

  @Override
  public List<Event> findAllEvents(Long financeNum) {
    return eventRepository.findAllByFinanceFinanceNumEquals(financeNum);
  }

  private void validateEvent(Event event) {
    Finance finance = event.getFinance();
    validateFinanceEvent(event, finance);

    if (finance instanceof Investment) {
      validateInvestmentEvent(event, (Investment) finance);
    } else {
      if (finance instanceof PropertyBond) {
        validatePropertyBondEvent(event, (PropertyBond) finance);
      } else {
        if (finance instanceof CarFinance) {
          validateCarFinanceEvent(event, (CarFinance) finance);
        }
      }
    }
  }

  private void validateFinanceEvent(Event event, Finance finance) {
    // Months
    if (event.getMonth() > finance.getMonthlyDetails().size()) {
      throw new FinanceException("Month " + event.getMonth() + " doesn't exist.");
    }
  }

  private void validateInvestmentEvent(Event event, Investment investment) {
    // Withdrawals
    if (event.getEventType().equals(EventType.WITHDRAW.toString())) {
      MonthDetails monthDetails = investment.getMonthlyDetails().get(event.getMonth() - 1);
      Money balance = monthDetails.getOpeningBalance()
          .add(monthDetails.getDeposit())
          .subtract(monthDetails.getWithdraw());

      if (balance.lessThan(event.getAmount() + "")) {
        throw new FinanceException("Withdrawal amount cannot be more than " +
            balance.toRands() + " for month " + event.getMonth() + ".");
      }
    }
  }

  private void validatePropertyBondEvent(Event event, PropertyBond propertyBond) {
    MonthDetails monthDetails = propertyBond.getMonthlyDetails().get(event.getMonth() - 1);
    Money balance = monthDetails.getOpeningBalance()
        .subtract(monthDetails.getDeposit())
        .add(monthDetails.getWithdraw());
    // Deposits
    if (event.getEventType().equals(EventType.DEPOSIT.toString()) &&
        balance.lessThan(event.getAmount() + "")) {

      throw new FinanceException("Deposit amount cannot be more than "
          + balance.toRands() + " for month " + event.getMonth() + ".");
    }

    // Withdrawals
    if (event.getEventType().equals(EventType.WITHDRAW.toString()) &&
        propertyBond.maxWithdrawalAmount().lessThan(balance.add(event.getAmount() + ""))) {
      throw new FinanceException("Cannot withdraw more than " +
          propertyBond.maxWithdrawalAmount().subtract(balance).toRands() +
          " for month " + event.getMonth() + ".");
    }

    // Change Amount
    if (event.getEventType().equals(EventType.CHANGE_AMOUNT.toString())) {
      Money newRepayment = propertyBond.calcRepayment(balance,
          monthDetails.getAnnualInterestRate(),
          propertyBond.getTerm() - event.getMonth() + 1);

      if (newRepayment.moreThan(event.getAmount() + "")) {
        throw new FinanceException("Monthly repayment has to be more than " +
            newRepayment.toRands() + " from month " + event.getMonth() + ".");
      }
    }
  }

  private void validateCarFinanceEvent(Event event, CarFinance carFinance) {
    MonthDetails monthDetails = carFinance.getMonthlyDetails().get(event.getMonth() - 1);
    Money balance = monthDetails.getOpeningBalance()
        .subtract(monthDetails.getDeposit());

    // Deposits
    if (event.getEventType().equals(EventType.DEPOSIT.toString())) {
      balance = balance.subtract(carFinance.getBalloonPayment());

      if (balance.lessThan(event.getAmount() + "")) {
        throw new FinanceException("Deposit amount cannot be more than "
            + balance.toRands() + " for month " + event.getMonth() + ".");
      }
    }

    // Change Amount
    if (event.getEventType().equals(EventType.CHANGE_AMOUNT.toString())) {
      Money newRepayment = carFinance.calcRepayment(balance,
          monthDetails.getAnnualInterestRate(),
          carFinance.getTerm() - event.getMonth() + 1);

      if (newRepayment.moreThan(event.getAmount() + "")) {
        throw new FinanceException("Monthly repayment has to be more than " +
            newRepayment.toRands() + " from month " + event.getMonth() + ".");
      }
    }
  }
}
