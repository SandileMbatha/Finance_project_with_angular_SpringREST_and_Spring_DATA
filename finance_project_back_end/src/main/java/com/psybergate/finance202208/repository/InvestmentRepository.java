package com.psybergate.finance202208.repository;

import com.psybergate.finance202208.domain.finance.investment.Investment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * The repository class for storing and retrieving Investments to and from the database.
 */
@Repository
public interface InvestmentRepository extends JpaRepository<Investment, Long> {

  /**
   * Retrieves all the Investments belonging to a specific Customer.
   *
   * @param customerNum The Customer's customerNum.
   * @return A list of Investments.
   */
  List<Investment> findByCustomerCustomerNumEquals(@Param("customerNum") Long customerNum);

  Page<Investment> findByCustomerCustomerNumEquals(@Param("customerNum") Long customerNum,
                                                   Pageable pageable);

  Investment findByName(String name);
}