package com.psybergate.finance202208.web.controller;

import com.psybergate.finance202208.domain.events.*;
import com.psybergate.finance202208.domain.finance.Finance;
import com.psybergate.finance202208.domain.finance.investment.Investment;
import com.psybergate.finance202208.exception.FinanceException;
import com.psybergate.finance202208.service.EventService;
import com.psybergate.finance202208.service.InvestmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/customers/{id}/investments")
@SuppressWarnings("unused")
public class CustomerInvestmentRestController {

  private final InvestmentService investmentService;

  private final EventService eventService;

  @Autowired
  public CustomerInvestmentRestController(InvestmentService investmentService, EventService eventService) {
    this.investmentService = investmentService;
    this.eventService = eventService;
  }

  @GetMapping("/{iId}")
  public Investment investmentById(@PathVariable("iId") Long id) {
    Investment investment = investmentService.findById(id);

    if (investment != null) {
      List<Event> events = eventService.findAllEvents(investment.getFinanceNum());
      events.sort(Comparator.comparingInt(Event::getMonth));
      investment.setEvents(events);
    }

    return investment;
  }

  @GetMapping
  public List<Investment> investmentsForCustomer(@PathVariable("id") Long id) {
    return investmentService.findByCustomerId(id);
  }

  @GetMapping(params = {"page", "size"})
  public Page<Investment> investmentsPaginatedForCustomer(@PathVariable("id") Long id,
                                        @RequestParam("page") int page,
                                        @RequestParam("size") int size) {
    Page<Investment> resultPage = investmentService.findPaginatedByCustomerId(id, page, size);
    if (page > resultPage.getTotalPages()) {
      throw new FinanceException("Page not found for investments");
    }
    return resultPage;
  }

  @PostMapping
  public Investment createInvestment(@Valid @RequestBody Investment investment) {
    return investmentService.create(investment);
  }

  @DeleteMapping("/{iId}/events/{eId}")
  public void deleteEvent(@PathVariable("eId") Long id) {
    eventService.delete(id);
  }

  @PutMapping("/{iId}/events/{eId}/update")
  public void updateEvent(@RequestBody Event event, @PathVariable("eId") Long id) {
    Event event2 = eventService.findById(id);
    event.setFinance(event2.getFinance());;
    eventService.update(event);
  }

  @DeleteMapping("/{iId}")
  public void deleteInvestment(@PathVariable("iId") Long id) {
    investmentService.delete(id);
  }

  @PutMapping("/{iId}/update")
  public void updateInvestment(@Valid @RequestBody Investment investment, @PathVariable("iId") Long id) {
    investmentService.update(investment);
  }

  @PostMapping("/{iId}/events")
  public void createEvent(@PathVariable("iId") Long id, @RequestBody Event event) {
    Finance finance = investmentService.findById(id);
    event.setFinance(finance);
    eventService.create(event);
  }
}