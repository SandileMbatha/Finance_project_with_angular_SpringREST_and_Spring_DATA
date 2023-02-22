package com.psybergate.finance202208.web.controller;

import com.psybergate.finance202208.domain.events.Event;
import com.psybergate.finance202208.domain.finance.Finance;
import com.psybergate.finance202208.domain.finance.debt.PropertyBond;
import com.psybergate.finance202208.exception.FinanceException;
import com.psybergate.finance202208.service.EventService;
import com.psybergate.finance202208.service.PropertyBondService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/customers/{id}/property-bonds")
@SuppressWarnings("unused")
public class CustomerPropertyBondRestController {

  private final PropertyBondService propertyBondService;

  private final EventService eventService;

  @Autowired
  public CustomerPropertyBondRestController(PropertyBondService propertyBondService, EventService eventService) {
    this.propertyBondService = propertyBondService;
    this.eventService = eventService;
  }

  @GetMapping("/{pId}")
  public PropertyBond propertyBondById(@PathVariable("pId") Long id) {
    PropertyBond propertyBond = propertyBondService.findById(id);

    if (propertyBond != null) {
      List<Event> events = eventService.findAllEvents(propertyBond.getFinanceNum());
      events.sort(Comparator.comparingInt(Event::getMonth));
      propertyBond.setEvents(events);
    }

    return propertyBond;
  }

  @GetMapping
  public List<PropertyBond> propertyBondsForCustomer(@PathVariable("id") Long id) {
    return propertyBondService.findByCustomerId(id);
  }

  @GetMapping(params = {"page", "size"})
  public Page<PropertyBond> propertyBondsPaginatedForCustomer(@PathVariable("id") Long id,
                                                              @RequestParam("page") int page,
                                                              @RequestParam("size") int size) {
    Page<PropertyBond> resultPage = propertyBondService.findPaginatedByCustomerId(id, page, size);
    if (page > resultPage.getTotalPages()) {
      throw new FinanceException("Page not found for property bonds");
    }
    return resultPage;
  }

  @PostMapping
  public PropertyBond createPropertyBond(@Valid @RequestBody PropertyBond propertyBond) {
    return propertyBondService.create(propertyBond);
  }

  @DeleteMapping("/{pId}/events/{eId}")
  public void deleteEvent(@PathVariable("eId") Long id) {
    eventService.delete(id);
  }

  @PutMapping("/{pId}/events/{eId}/update")
  public void updateEvent(@RequestBody Event event, @PathVariable("eId") Long id) {
    Event event2 = eventService.findById(id);
    event.setFinance(event2.getFinance());
    eventService.update(event);
  }

  @DeleteMapping("/{pId}")
  public void deletePropertyBond(@PathVariable("pId") Long id) {
    propertyBondService.delete(id);
  }

  @PutMapping("/{pId}/update")
  public void updatePropertyBond(@Valid @RequestBody PropertyBond propertyBond, @PathVariable("pId") Long id) {
    propertyBondService.update(propertyBond);
  }

  @PostMapping("/{pId}/events")
  public void createEvent(@PathVariable("pId") Long id, @RequestBody Event event) {
    Finance finance = propertyBondService.findById(id);
    event.setFinance(finance);
    eventService.create(event);
  }
}