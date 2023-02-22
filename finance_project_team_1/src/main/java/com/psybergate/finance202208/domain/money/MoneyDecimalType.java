package com.psybergate.finance202208.domain.money;

import org.hibernate.type.AbstractSingleColumnStandardBasicType;
import org.hibernate.type.descriptor.sql.NumericTypeDescriptor;

/**
 * A money-string converter for hibernate.
 */
@SuppressWarnings("unused")
public class MoneyDecimalType extends AbstractSingleColumnStandardBasicType<Money> {

  public static final MoneyDecimalType INSTANCE = new MoneyDecimalType();

  public MoneyDecimalType() {
    super(NumericTypeDescriptor.INSTANCE, MoneyDecimalTypeDescriptor.INSTANCE);
  }

  /**
   * Classifies the class for hibernate
   *
   * @return A String
   */
  @Override
  public String getName() {
    return "MoneyDecimal";
  }
}