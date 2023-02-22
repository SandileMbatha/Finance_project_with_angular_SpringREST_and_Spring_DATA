package com.psybergate.finance202208.web.controller;

import com.psybergate.finance202208.domain.Customer;
import com.psybergate.finance202208.exception.FinanceException;
import com.psybergate.finance202208.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/customers")
@SuppressWarnings("unused")
public class CustomerRestController {

  private final CustomerService customerService;

  @Autowired
  public CustomerRestController(CustomerService customerService) {
    this.customerService = customerService;
  }

  @GetMapping
  public List<Customer> customers() {
    return customerService.findAll();
  }

  @GetMapping(params = {"page", "size"})
  public Page<Customer> customersPaginated(@RequestParam("page") int page,
                                           @RequestParam("size") int size) {
    Page<Customer> resultPage = customerService.findPaginated(page, size);
    if (page > resultPage.getTotalPages()) {
      throw new FinanceException("Page not found for customers");
    }
    return resultPage;
  }

  @GetMapping("/{id}")
  public Customer customerById(@PathVariable("id") Long id) {
    return customerService.findById(id);
  }

  @PostMapping
  public Customer createCustomer(@Valid @RequestBody Customer customer) {
    return customerService.create(customer);
  }

  @DeleteMapping("/{id}")
  public void deleteCustomer(@PathVariable("id") Long id) {
    customerService.delete(id);
  }

  @PutMapping("/{id}/update")
  public void updateCustomer(@Valid @RequestBody Customer customer, @PathVariable("id") Long id) {
    customerService.update(customer);
  }
}


