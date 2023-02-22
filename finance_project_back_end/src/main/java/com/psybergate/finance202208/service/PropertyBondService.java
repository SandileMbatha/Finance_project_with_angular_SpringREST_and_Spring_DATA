package com.psybergate.finance202208.service;

import com.psybergate.finance202208.domain.finance.debt.PropertyBond;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * The service class for handling business logic for PropertyBonds.
 */
@SuppressWarnings("UnnecessaryModifier")
public interface PropertyBondService {

  public PropertyBond create(PropertyBond propertyBond);

  public void update(PropertyBond propertyBond);

  public void delete(Long financeNum);

  public PropertyBond findById(Long financeNum);

  /**
   * Retrieves all the PropertyBonds belonging to a specific Customer.
   *
   * @param customerNum The Customer's customerNum.
   * @return A list of PropertyBonds.
   */
  public List<PropertyBond> findByCustomerId(Long customerNum);

  public Page<PropertyBond> findPaginatedByCustomerId(Long customerNum, int page, int size);
}