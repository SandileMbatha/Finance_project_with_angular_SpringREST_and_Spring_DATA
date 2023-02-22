package com.psybergate.finance202208.service.impl;

import com.psybergate.finance202208.domain.finance.investment.Investment;
import com.psybergate.finance202208.exception.FinanceException;
import com.psybergate.finance202208.repository.InvestmentRepository;
import com.psybergate.finance202208.service.InvestmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service("investmentService")
@Transactional
@SuppressWarnings("unused")
public class InvestmentServiceImpl implements InvestmentService {

  private final InvestmentRepository investmentRepository;

  @Autowired
  public InvestmentServiceImpl(InvestmentRepository investmentRepository) {
    this.investmentRepository = investmentRepository;
  }

  @Override
  public Investment create(Investment investment) {
    checkForNameDuplicates(investment);
    return investmentRepository.save(investment);
  }

  @Override
  public void update(Investment investment) {
    verifyInvestmentExists(investment);
    verifyInvestmentNameBeforeUpdate(investment);
    investmentRepository.save(investment);
  }

  @Override
  public void delete(Long financeNum) {
    investmentRepository.deleteById(financeNum);
  }

  @Override
  public List<Investment> findByCustomerId(Long customerNum) {
    return investmentRepository.findByCustomerCustomerNumEquals(customerNum);
  }

  @Override
  public Page<Investment> findPaginatedByCustomerId(Long customerNum, int page, int size) {
    return investmentRepository.findByCustomerCustomerNumEquals(customerNum,
            PageRequest.of(page, size, Sort.by("name")));
  }

  @Override
  public Investment findById(Long financeNum) {
    Optional<Investment> investment = investmentRepository.findById(financeNum);
    return investment.orElse(null);
  }

  private void verifyInvestmentExists(Investment investment) {
    if (findById(investment.getFinanceNum()) == null) {
      throw new FinanceException("Investment with finance number " +
          investment.getFinanceNum() + " doesn't exist.");
    }
  }

  private void checkForNameDuplicates(Investment investment) {
    if (investmentRepository.findByName(investment.getName()) != null) {
      throw new FinanceException("Investment with name " +
              investment.getName() + " already exists.");
    }
  }

  private void verifyInvestmentNameBeforeUpdate(Investment investment) {
    Investment storedInvestment = investmentRepository.findByName(investment.getName());

    if (storedInvestment != null && !investment.getFinanceNum().equals(storedInvestment.getFinanceNum())) {
      throw new FinanceException("Investment with name " +
              investment.getName() + " already exists.");
    }
  }
}