package com.psybergate.finance202208.web.controller;

import com.psybergate.finance202208.domain.tax.*;
import com.psybergate.finance202208.domain.tax.table.deduction.Rebate;
import com.psybergate.finance202208.service.TaxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@SuppressWarnings("unused")
@RestController
@RequestMapping("/taxes")
public class TaxRestController {

  private final TaxService taxService;

  @Autowired
  public TaxRestController(TaxService taxService) {
    this.taxService = taxService;
  }

  @GetMapping("/tax-years")
  public List<Integer> getAvailableTaxYears() {
    return taxService.findAllTaxYears();
  }

  @GetMapping("/rebates/{year}")
  public List<Rebate> getRebates(@PathVariable("year") Integer year) {
    return taxService.findAllRebatesByTaxYear(year);
  }

  @PostMapping
  public TaxCalculations calculateTaxes(@RequestBody TaxPayer taxPayer) {
    return taxService.calculateTaxes(taxPayer);
  }

}
