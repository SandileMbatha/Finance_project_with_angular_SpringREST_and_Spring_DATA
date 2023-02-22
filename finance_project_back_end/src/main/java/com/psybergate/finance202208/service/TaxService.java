package com.psybergate.finance202208.service;

import com.psybergate.finance202208.domain.tax.TaxCalculations;
import com.psybergate.finance202208.domain.tax.TaxPayer;
import com.psybergate.finance202208.domain.tax.table.deduction.Rebate;

import java.util.List;

@SuppressWarnings("UnnecessaryModifier")
public interface TaxService {

  public TaxCalculations calculateTaxes(TaxPayer taxPayer);

  public List<Integer> findAllTaxYears();

  public List<Rebate> findAllRebatesByTaxYear(Integer taxYear);

}
