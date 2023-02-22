package com.psybergate.finance202208.service;

import com.psybergate.finance202208.domain.money.Money;
import com.psybergate.finance202208.domain.percentage.Percentage;
import com.psybergate.finance202208.domain.tax.*;
import com.psybergate.finance202208.domain.tax.expense.Expense;
import com.psybergate.finance202208.domain.tax.expense.ExpenseType;
import com.psybergate.finance202208.domain.tax.income.Income;
import com.psybergate.finance202208.domain.tax.income.IncomeType;
import com.psybergate.finance202208.domain.tax.table.TaxBracket;
import com.psybergate.finance202208.domain.tax.table.TaxTable;
import com.psybergate.finance202208.domain.tax.table.deduction.Rebate;
import com.psybergate.finance202208.domain.tax.table.deduction.RetirementFundDeductible;
import com.psybergate.finance202208.domain.tax.table.exemption.CapitalGainsExemption;
import com.psybergate.finance202208.domain.tax.table.exemption.InterestExemption;
import com.psybergate.finance202208.repository.TaxRepository;
import com.psybergate.finance202208.service.impl.TaxServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class TaxServiceTest {

  @Mock
  private TaxRepository taxRepository;

  private TaxService taxService;

  @BeforeEach
  public void init() {
    MockitoAnnotations.openMocks(this);

    assertThat(taxRepository).isNotNull();
    when(taxRepository.findTaxTableByTaxYearEquals(any())).thenReturn(loadTaxTable());

    taxService = new TaxServiceImpl(taxRepository);
  }

  @Test
  public void testTaxCalculations1() {
    TaxPayer taxPayer = getTaxPayerForCalculations1();

    TaxCalculations taxCalculations = taxService.calculateTaxes(taxPayer);

    assertThat(taxCalculations.getTotalTaxableIncome().toString()).isEqualTo("525000.00");
    assertThat(taxCalculations.getTotalTaxDeductibleExpenses().toString()).isEqualTo("224375.00");
    assertThat(taxCalculations.getNettTaxableIncome().toString()).isEqualTo("300625.00");
    assertThat(taxCalculations.getTaxPayable().toString()).isEqualTo("60082.50");
    assertThat(taxCalculations.getLessPayables().toString()).isEqualTo("16425.00");
    assertThat(taxCalculations.getNettTaxPayable().toString()).isEqualTo("43657.50");
  }

  @Test
  public void testTaxCalculations2() {
    TaxPayer taxPayer = getTaxPayerForCalculations2();

    TaxCalculations taxCalculations = taxService.calculateTaxes(taxPayer);

    assertThat(taxCalculations.getTotalTaxableIncome().toString()).isEqualTo("829000.00");
    assertThat(taxCalculations.getTotalTaxDeductibleExpenses().toString()).isEqualTo("224375.00");
    assertThat(taxCalculations.getNettTaxableIncome().toString()).isEqualTo("604625.00");
    assertThat(taxCalculations.getTaxPayable().toString()).isEqualTo("157495.00");
    assertThat(taxCalculations.getLessPayables().toString()).isEqualTo("37425.00");
    assertThat(taxCalculations.getNettTaxPayable().toString()).isEqualTo("120070.00");
  }

  private TaxPayer getTaxPayerForCalculations1() {
    int age = 25;

    List<Income> income = new ArrayList<>();
    income.add(new Income(IncomeType.SALARY, new Money("500_000")));
    income.add(new Income(IncomeType.BONUSES, new Money("25_000")));

    income.add(new Income(IncomeType.INTEREST_RECEIVED, new Money()));
    income.add(new Income(IncomeType.DIVIDENDS, new Money()));
    income.add(new Income(IncomeType.TOTAL_CAPITAL_GAINS, new Money()));

    List<Expense> expenses = new ArrayList<>();
    expenses.add(new Expense(ExpenseType.RETIREMENT_FUND, new Money("150_000")));
    expenses.add(new Expense(ExpenseType.TRAVEL_ALLOWANCE, new Money("100_000")));

    Money medicalCredits = new Money();

    return new TaxPayer(age, 2022, income, expenses, medicalCredits);
  }

  private TaxPayer getTaxPayerForCalculations2() {
    int age = 70;

    List<Income> income = new ArrayList<>();
    income.add(new Income(IncomeType.SALARY, new Money("500_000")));
    income.add(new Income(IncomeType.BONUSES, new Money("25_000")));

    income.add(new Income(IncomeType.INTEREST_RECEIVED, new Money("31_246")));
    income.add(new Income(IncomeType.DIVIDENDS, new Money("15_000")));
    income.add(new Income(IncomeType.TOTAL_CAPITAL_GAINS, new Money("800_000")));

    List<Expense> expenses = new ArrayList<>();
    expenses.add(new Expense(ExpenseType.RETIREMENT_FUND, new Money("150_000")));
    expenses.add(new Expense(ExpenseType.TRAVEL_ALLOWANCE, new Money("100_000")));

    Money medicalCredits = new Money("15_000");

    return new TaxPayer(age, 2022, income, expenses, medicalCredits);
  }

  /**
   * Load the tax table for testing.
   * <a href="https://www.sars.gov.za/wp-content/uploads/Docs/Budget/2022/Budget-Tax-Guide-2022.pdf">
   * Currently using tax tables of tax year March 2022 - February 2023.
   * </a>
   */
  private TaxTable loadTaxTable() {
    List<TaxBracket> taxBrackets = new ArrayList<>();
    taxBrackets.add(new TaxBracket(1L, 2022, new Money("226_000"), new Percentage("18")));
    taxBrackets.add(new TaxBracket(1L, 2022, new Money("353_100"), new Percentage("26")));
    taxBrackets.add(new TaxBracket(1L, 2022, new Money("488_700"), new Percentage("31")));
    taxBrackets.add(new TaxBracket(1L, 2022, new Money("641_400"), new Percentage("36")));
    taxBrackets.add(new TaxBracket(1L, 2022, new Money("817_600"), new Percentage("39")));
    taxBrackets.add(new TaxBracket(1L, 2022, new Money("1_731_600"), new Percentage("41")));
    taxBrackets.add(new TaxBracket(1L, 2022, new Money("1_000_000_000"), new Percentage("45")));

    List<InterestExemption> interestExemptions = new ArrayList<>();
    interestExemptions.add(new InterestExemption(1L, 2022, new Money("23_800"), 0));
    interestExemptions.add(new InterestExemption(1L, 2022, new Money("34_500"), 65));

    CapitalGainsExemption capitalGainsExemption = new CapitalGainsExemption(2022, new Money("40_000"),
            new Percentage("40"));

    RetirementFundDeductible retirementFundDeductible = new RetirementFundDeductible(
            2022, new Money("350_000"), new Percentage("27.5"));

    Money travelAllowanceMaxAllowed = new Money("80_000");

    Money medicalCreditsMaxAllowed = new Money("12_000");

    List<Rebate> rebates = new ArrayList<>();
    rebates.add(new Rebate(1L, 2022, new Money("16_425"), 0));
    rebates.add(new Rebate(1L, 2022, new Money("9_000"), 65));
    rebates.add(new Rebate(1L, 2022, new Money("2_997"), 75));

    return new TaxTable(2022, taxBrackets, interestExemptions,
            capitalGainsExemption, retirementFundDeductible,
            travelAllowanceMaxAllowed, medicalCreditsMaxAllowed, rebates);
  }
}