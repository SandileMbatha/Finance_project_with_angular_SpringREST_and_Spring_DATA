package com.psybergate.finance202208.service;

import com.psybergate.finance202208.domain.finance.debt.CarFinance;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * The service class for handling business logic for CarFinances.
 */
@SuppressWarnings("UnnecessaryModifier")
public interface CarFinanceService {

  public CarFinance create(CarFinance carFinance);

  public void update(CarFinance carFinance);

  public void delete(Long financeNum);

  public CarFinance findById(Long financeNum);

  /**
   * Retrieves all the CarFinances belonging to a specific Customer.
   *
   * @param customerNum The Customer's customerNum.
   * @return A list of CarFinances.
   */
  public List<CarFinance> findByCustomerId(Long customerNum);

  public Page<CarFinance> findPaginatedByCustomerId(Long customerNum, int page, int size);
}