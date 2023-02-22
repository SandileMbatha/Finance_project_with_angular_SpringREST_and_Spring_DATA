package com.psybergate.finance202208.repository;

import com.psybergate.finance202208.domain.finance.debt.CarFinance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * The repository class for storing and retrieving CarFinances to and from the database.
 */
@Repository
public interface CarFinanceRepository extends JpaRepository<CarFinance, Long> {

  /**
   * Retrieves all the CarFinances belonging to a specific Customer.
   *
   * @param customerNum The Customer's customerNum.
   * @return A list of CarFinances.
   */
  List<CarFinance> findByCustomerCustomerNumEquals(@Param("customerNum") Long customerNum);

  Page<CarFinance> findByCustomerCustomerNumEquals(@Param("customerNum") Long customerNum,
                                                   Pageable pageable);

  CarFinance findByName(String name);

}