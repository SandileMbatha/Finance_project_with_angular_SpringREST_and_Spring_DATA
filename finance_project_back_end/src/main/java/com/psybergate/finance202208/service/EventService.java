package com.psybergate.finance202208.service;

import com.psybergate.finance202208.domain.events.Event;

import java.util.List;

@SuppressWarnings("UnnecessaryModifier")
public interface EventService {

  public void create(Event event);

  void update(Event event);

  public Event findById(Long eventNum);

  public void delete(Long eventNum);


  /**
   * Retrieves all the Event belonging to a specific Finance.
   *
   * @param financeNum The Event's financeNum.
   * @return A list of Events.
   */
  public List<Event> findAllEvents(Long financeNum);
}