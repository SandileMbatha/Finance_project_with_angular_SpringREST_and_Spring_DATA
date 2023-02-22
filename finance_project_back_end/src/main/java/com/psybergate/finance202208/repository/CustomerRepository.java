package com.psybergate.finance202208.repository;

import com.psybergate.finance202208.domain.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * The repository class for storing and retrieving Customers to and from the database.
 */
@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

  List<Customer> findAllByIsActiveTrue();

  Page<Customer> findAllByIsActiveTrue(Pageable pageable);

  Customer findByIdNumberEquals(String idNumber);
}