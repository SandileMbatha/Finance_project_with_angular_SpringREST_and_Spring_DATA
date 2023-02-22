package com.psybergate.finance202208.service;

import com.psybergate.finance202208.domain.Customer;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * The service class for handling business logic for Customers.
 */
@SuppressWarnings("UnnecessaryModifier")
public interface CustomerService {

  public Customer create(Customer customer);

  public void update(Customer customer);

  public void delete(Long customerNum);

  public Customer findById(Long customerNum);

  public List<Customer> findAll();

  public Page<Customer> findPaginated(int page, int size);

}
