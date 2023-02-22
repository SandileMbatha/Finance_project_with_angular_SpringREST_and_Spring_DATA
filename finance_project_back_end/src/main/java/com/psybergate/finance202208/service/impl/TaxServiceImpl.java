package com.psybergate.finance202208.service.impl;

import com.psybergate.finance202208.domain.money.Money;
import com.psybergate.finance202208.domain.projection.TaxTableView;
import com.psybergate.finance202208.domain.tax.*;
import com.psybergate.finance202208.domain.tax.table.deduction.Rebate;
import com.psybergate.finance202208.domain.tax.expense.Expense;
import com.psybergate.finance202208.domain.tax.table.exemption.CapitalGainsExemption;
import com.psybergate.finance202208.domain.tax.income.Income;
import com.psybergate.finance202208.domain.tax.table.exemption.InterestExemption;
import com.psybergate.finance202208.domain.tax.table.TaxTable;
import com.psybergate.finance202208.exception.FinanceException;
import com.psybergate.finance202208.repository.TaxRepository;
import com.psybergate.finance202208.service.TaxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service("taxService")
public class TaxServiceImpl implements TaxService {

  private final TaxRepository taxRepository;

  private TaxTable currentTaxTable;

  @Autowired
  public TaxServiceImpl(TaxRepository taxRepository) {
    this.taxRepository = taxRepository;
  }

  @Override
  public TaxCalculations calculateTaxes(TaxPayer taxPayer) {
    if (taxPayer == null) {
      throw new FinanceException("Invalid tax payer information provided.");
    }

    loadTaxTable(taxPayer.getTaxYear());

    Money totalTaxableIncome = calcTotalTaxableIncome(taxPayer);
    Money totalTaxDeductibleExpenses = calcTotalTaxDeductibleExpenses(taxPayer);
    Money nettTaxableIncome = totalTaxableIncome.subtract(totalTaxDeductibleExpenses);
    Money taxPayable = currentTaxTable.calcTaxPayable(nettTaxableIncome);
    Money lessPayables = calcLessPayables(taxPayer);
    Money nettTaxPayable = calcNettTaxPayable(taxPayable, lessPayables);

    return new TaxCalculations(totalTaxableIncome, totalTaxDeductibleExpenses,
            nettTaxableIncome, taxPayable, lessPayables, nettTaxPayable);
  }

  @Override
  public List<Integer> findAllTaxYears() {
    List<TaxTable> taxTables = taxRepository.findAll();
    List<Integer> taxYears = new ArrayList<>();

    for (TaxTable table : taxTables) {
      taxYears.add(table.taxYear());
    }

    return taxYears;
  }

  @Override
  public List<Rebate> findAllRebatesByTaxYear(Integer taxYear) {
    TaxTableView taxTableView = taxRepository.findRebatesByTaxYearEquals(taxYear);

    if (taxTableView == null) {
      throw new FinanceException("No rebates available for tax year: " + taxYear);
    }

    return taxTableView.getRebates();
  }

  private void loadTaxTable(Integer taxYear) {
    currentTaxTable = taxRepository.findTaxTableByTaxYearEquals(taxYear);

    if (currentTaxTable == null) {
      throw new FinanceException("No tax table available for tax year: " + taxYear);
    }
  }

  private Money calcTotalTaxableIncome(TaxPayer taxPayer) {
    List<Income> allIncome = taxPayer.getIncome();
    Money totalTaxableIncome = new Money();

    for (Income income : allIncome) {
      switch (income.getType()) {
        case SALARY:
        case BONUSES:
          totalTaxableIncome = totalTaxableIncome
                  .add(income.getAmount());
          break;

        case INTEREST_RECEIVED:
          totalTaxableIncome = totalTaxableIncome
                  .add(calcInterestTaxable(taxPayer.getAge(), income));
          break;

        case DIVIDENDS:
          break;

        case TOTAL_CAPITAL_GAINS:
          totalTaxableIncome = totalTaxableIncome
                  .add(calcCapitalGainsTaxable(income));
          break;
      }
    }

    return totalTaxableIncome;
  }

  private Money calcTotalTaxDeductibleExpenses(TaxPayer taxPayer) {
    List<Expense> allExpenses = taxPayer.getExpenses();
    Money totalDeductibleExpenses = new Money();

    for (Expense expense : allExpenses) {
      switch (expense.getType()) {
        case RETIREMENT_FUND:
          totalDeductibleExpenses = totalDeductibleExpenses
                  .add(calcDeductibleRetirementFund(taxPayer, expense));
          break;

        case TRAVEL_ALLOWANCE:
          totalDeductibleExpenses = totalDeductibleExpenses
                  .add(calcDeductibleTravelAllowance(expense));
          break;
      }
    }

    return totalDeductibleExpenses;
  }

  private Money calcLessPayables(TaxPayer taxPayer) {
    return calcDeductibleMedicalCredits(taxPayer.getMedicalCredits())
            .add(calcRebate(taxPayer.getAge()));
  }

  private Money calcNettTaxPayable(Money taxPayable, Money lessPayables) {
    return taxPayable.subtract(lessPayables);
  }

  private Money calcInterestTaxable(int taxPayerAge, Income interest) {
    Money exemption = calcInterestExemption(taxPayerAge);

    if (interest.getAmount().moreThan(exemption)) {
      return interest.getAmount().subtract(exemption);
    }

    return new Money();
  }

  private Money calcInterestExemption(int taxPayerAge) {
    List<InterestExemption> interestExemptions = currentTaxTable.interestExemptions();

    for (int i = interestExemptions.size() - 1; i >= 0; i--) {
      if (taxPayerAge >= interestExemptions.get(i).getMinimumAge()) {
        return interestExemptions.get(i).getExemption();
      }
    }

    return interestExemptions.get(0).getExemption();
  }

  private Money calcCapitalGainsTaxable(Income capitalGains) {
    CapitalGainsExemption capitalGainsExemption = currentTaxTable.capitalGainsExemption();

    if (capitalGains.getAmount().moreThan(capitalGainsExemption.getExemption())) {
      return capitalGains.getAmount()
              .subtract(capitalGainsExemption.getExemption())
              .multiply(capitalGainsExemption.getRate().toPercentage());
    }

    return new Money();
  }

  private Money calcDeductibleRetirementFund(TaxPayer taxPayer, Expense retirementFund) {
    Money deductibleAmount = getTaxPayerSalary(taxPayer)
            .multiply(currentTaxTable.retirementFundDeductible().getRate().toPercentage());

    if (deductibleAmount.moreThan(currentTaxTable.retirementFundDeductible().getMaxAllowed())) {
      deductibleAmount = currentTaxTable.retirementFundDeductible().getMaxAllowed();
    }

    if (retirementFund.getAmount().moreThan(deductibleAmount)) {
      return deductibleAmount;
    }

    return retirementFund.getAmount();
  }

  private Money calcDeductibleTravelAllowance(Expense travelAllowance) {
    if (travelAllowance.getAmount().moreThan(currentTaxTable.travelAllowanceMaxAllowed())) {
      return currentTaxTable.travelAllowanceMaxAllowed();
    }

    return travelAllowance.getAmount();
  }

  private Money calcDeductibleMedicalCredits(Money medicalCredits) {
    if (medicalCredits.moreThan(currentTaxTable.medicalCreditsMaxAllowed())) {
      return currentTaxTable.medicalCreditsMaxAllowed();
    }

    return medicalCredits;
  }

  private Money calcRebate(int taxPayerAge) {
    List<Rebate> rebates = currentTaxTable.rebates();
    Money rebatePayable = new Money();

    for (Rebate rebate : rebates) {
      if (taxPayerAge >= rebate.getMinimumAge()) {
        rebatePayable = rebate.getAmount().add(rebatePayable);
      }
    }

    return rebatePayable;
  }

  private Money getTaxPayerSalary(TaxPayer taxPayer) {
    List<Income> allIncome = taxPayer.getIncome();
    boolean foundSalary = false;
    boolean foundBonuses = false;
    Money taxPayerSalary = new Money();

    int i = 0;
    while ((!foundSalary || !foundBonuses) && i < allIncome.size()) {
      Income income = allIncome.get(i++);

      switch (income.getType()) {
        case SALARY:
          foundSalary = true;
          taxPayerSalary = taxPayerSalary.add(income.getAmount());
          break;
        case BONUSES:
          foundBonuses = true;
          taxPayerSalary = taxPayerSalary.add(income.getAmount());
          break;
      }
    }

    return taxPayerSalary;
  }
}
