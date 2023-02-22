package com.psybergate.finance202208.repository;

import com.psybergate.finance202208.domain.finance.debt.PropertyBond;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * The repository class for storing and retrieving PropertyBonds to and from the database.
 */
@Repository
public interface PropertyBondRepository extends JpaRepository<PropertyBond, Long> {

  /**
   * Retrieves all the PropertyBonds belonging to a specific Customer.
   *
   * @param customerNum The Customer's customerNum.
   * @return A list of Investments.
   */
  List<PropertyBond> findByCustomerCustomerNumEquals(@Param("customerNum") Long customerNum);

  Page<PropertyBond> findByCustomerCustomerNumEquals(@Param("customerNum") Long customerNum,
                                                     Pageable pageable);

  PropertyBond findByName(String name);

}