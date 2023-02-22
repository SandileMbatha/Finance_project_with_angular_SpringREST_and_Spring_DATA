package com.psybergate.finance202208.domain.percentage;

import org.hibernate.type.AbstractSingleColumnStandardBasicType;
import org.hibernate.type.descriptor.sql.NumericTypeDescriptor;

/**
 * A money-string converter for hibernate.
 */
@SuppressWarnings("unused")
public class PercentageDecimalType extends AbstractSingleColumnStandardBasicType<Percentage> {

  public static final PercentageDecimalType INSTANCE = new PercentageDecimalType();

  public PercentageDecimalType() {
    super(NumericTypeDescriptor.INSTANCE, PercentageDecimalTypeDescriptor.INSTANCE);
  }

  /**
   * Classifies the class for hibernate
   *
   * @return A String
   */
  @Override
  public String getName() {
    return "PercentageDecimal";
  }
}