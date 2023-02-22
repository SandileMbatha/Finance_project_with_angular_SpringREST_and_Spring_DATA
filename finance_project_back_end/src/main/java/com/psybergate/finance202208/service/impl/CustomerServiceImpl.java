package com.psybergate.finance202208.service.impl;

import com.psybergate.finance202208.domain.Customer;
import com.psybergate.finance202208.exception.FinanceException;
import com.psybergate.finance202208.repository.CustomerRepository;
import com.psybergate.finance202208.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service("customerService")
@Transactional
@SuppressWarnings("unused")
public class CustomerServiceImpl implements CustomerService {

  private final CustomerRepository customerRepository;

  @Autowired
  public CustomerServiceImpl(CustomerRepository customerRepository) {
    this.customerRepository = customerRepository;
  }

  @Override
  public Customer create(Customer customer) {
    checkForDuplicateIDNumbers(customer);
    return customerRepository.save(customer);
  }

  @Override
  public void update(Customer customer) {
    verifyCustomerExists(customer);
    verifyIDNumberBeforeUpdate(customer);
    customerRepository.save(customer);
  }

  @Override
  public void delete(Long customerNum) {
    Customer customer = findById(customerNum);
    if (customer == null) {
      throw new FinanceException("Customer doesn't exist");
    }
    customer.setActive(false);
    customerRepository.save(customer);
  }

  @Override
  public Customer findById(Long customerNum) {
    Optional<Customer> customer = customerRepository.findById(customerNum);
    return customer.orElse(null);
  }

  @Override
  public List<Customer> findAll() {
    return customerRepository.findAllByIsActiveTrue();
  }

  @Override
  public Page<Customer> findPaginated(int page, int size) {
    return customerRepository.findAllByIsActiveTrue(PageRequest.of(page, size,
            Sort.by("surname").and(Sort.by("name")).and(Sort.by("idNumber"))));
  }

  /**
   * Checks if the customer exists in the repository.
   *
   * @throws FinanceException if the customer is not found.
   */
  private void verifyCustomerExists(Customer customer) {
    if (!customerRepository.findById(customer.getCustomerNum()).isPresent()) {
      throw new FinanceException("Customer doesn't exist");
    }
  }

  private void checkForDuplicateIDNumbers(Customer customer) {
    Customer storedCustomer = customerRepository.findByIdNumberEquals(customer.getIdNumber());

    if (storedCustomer != null) {
      throw new FinanceException("Customer with ID Number " +
              customer.getIdNumber() + " already exists.");
    }
  }

  private void verifyIDNumberBeforeUpdate(Customer customer) {
    Customer storedCustomer = customerRepository.findByIdNumberEquals(customer.getIdNumber());

    if (storedCustomer != null && !customer.getCustomerNum().equals(storedCustomer.getCustomerNum())) {
      throw new FinanceException("Customer with ID Number " +
              customer.getIdNumber() + " already exists.");
    }
  }
}