package com.psybergate.finance202208.repository;

import com.psybergate.finance202208.domain.events.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

  /**
   * Retrieves all the Event belonging to a specific Finance.
   *
   * @param financeNum The Event's financeNum.
   * @return A list of Events.
   */
  List<Event> findAllByFinanceFinanceNumEquals(@Param("financeNum") Long financeNum);
}