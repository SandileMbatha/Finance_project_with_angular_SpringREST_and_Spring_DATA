package com.psybergate.finance202208.web.controller;

import com.psybergate.finance202208.domain.events.Event;
import com.psybergate.finance202208.domain.finance.Finance;
import com.psybergate.finance202208.domain.finance.debt.CarFinance;
import com.psybergate.finance202208.exception.FinanceException;
import com.psybergate.finance202208.service.CarFinanceService;
import com.psybergate.finance202208.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/customers/{id}/car-finances")
@SuppressWarnings("unused")
public class CustomerCarFinanceRestController {

  private final CarFinanceService carFinanceService;

  private final EventService eventService;

  @Autowired
  public CustomerCarFinanceRestController(CarFinanceService carFinanceService, EventService eventService) {
    this.carFinanceService = carFinanceService;
    this.eventService = eventService;
  }

  @GetMapping("/{cId}")
  public CarFinance carFinanceById(@PathVariable("cId") Long id) {
    CarFinance carFinance = carFinanceService.findById(id);

    if (carFinance != null) {
      List<Event> events = eventService.findAllEvents(carFinance.getFinanceNum());
      events.sort(Comparator.comparingInt(Event::getMonth));
      carFinance.setEvents(events);
    }

    return carFinanceService.findById(id);
  }

  @GetMapping
  public List<CarFinance> carFinancesForCustomer(@PathVariable("id") Long id) {
    return carFinanceService.findByCustomerId(id);
  }

  @GetMapping(params = {"page", "size"})
  public Page<CarFinance> carFinancesPaginatedForCustomer(@PathVariable("id") Long id,
                                                          @RequestParam("page") int page,
                                                          @RequestParam("size") int size) {
    Page<CarFinance> resultPage = carFinanceService.findPaginatedByCustomerId(id, page, size);
    if (page > resultPage.getTotalPages()) {
      throw new FinanceException("Page not found for car finances");
    }
    return resultPage;
  }

  @PostMapping
  public CarFinance createCarFinance(@Valid @RequestBody CarFinance carFinance) {
    return carFinanceService.create(carFinance);
  }

  @DeleteMapping("/{cId}/events/{eId}")
  public void deleteEvent(@PathVariable("eId") Long id) {
    eventService.delete(id);
  }

  @PutMapping("/{cId}/events/{eId}/update")
  public void updateEvent(@RequestBody Event event, @PathVariable("eId") Long id) {
    Event event2 = eventService.findById(id);
    event.setFinance(event2.getFinance());;
    eventService.update(event);
  }

  @DeleteMapping("/{cId}")
  public void deleteCarFinance(@PathVariable("cId") Long id) {
    carFinanceService.delete(id);
  }

  @PutMapping("/{cId}/update")
  public void updateCarFinance(@Valid @RequestBody CarFinance carFinance, @PathVariable("cId") Long id) {
    carFinanceService.update(carFinance);
  }

  @PostMapping("/{cId}/events")
  public void createEvent(@PathVariable("cId") Long id, @RequestBody Event event) {
    Finance finance = carFinanceService.findById(id);
    event.setFinance(finance);
    eventService.create(event);
  }
}
