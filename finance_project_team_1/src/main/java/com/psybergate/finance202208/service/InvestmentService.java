package com.psybergate.finance202208.service;

import com.psybergate.finance202208.domain.finance.investment.Investment;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * The service class for handling business logic for Investments.
 */
@SuppressWarnings("UnnecessaryModifier")
public interface InvestmentService {

  public Investment create(Investment investment);

  public void update(Investment investment);

  public void delete(Long financeNum);

  public Investment findById(Long financeNum);

  /**
   * Retrieves all the Investments belonging to a specific Customer.
   *
   * @param customerNum The Customer's customerNum.
   * @return A list of Investments.
   */
  public List<Investment> findByCustomerId(Long customerNum);

  public Page<Investment> findPaginatedByCustomerId(Long customerNum, int page, int size);
}