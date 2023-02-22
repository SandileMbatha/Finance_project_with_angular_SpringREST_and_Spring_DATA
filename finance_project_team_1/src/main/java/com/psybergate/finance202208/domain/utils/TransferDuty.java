package com.psybergate.finance202208.domain.utils;

import com.psybergate.finance202208.domain.money.Money;

/**
 * Used for calculating the transfer costs using the transfer duty tables.
 */
public class TransferDuty {

  private static final String[][] limits = {
      {"11_000_000", "1_026_000", "0.13"},
      {"2_475_000", "88_250", "0.11"},
      {"1_925_000", "44_250", "0.08"},
      {"1_375_000", "11_250", "0.06"},
      {"1_000_000", "0", "0.03"}
  };

  /**
   * Use the transfer duty table to calculate the transfer costs.
   * Current table: 1 March 2022 - 28 February 2023
   */
  public static Money calculateTransferCosts(Money propertyPrice) {
    for (String[] limit : limits) {
      if (propertyPrice.moreThan(limit[0])) {
        return new Money(limit[1])
            .add(propertyPrice
                .subtract(limit[0])
                .multiply(limit[2]));
      }
    }

    return new Money();
  }
}