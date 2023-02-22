package com.psybergate.finance202208.domain.percentage;

import org.hibernate.type.descriptor.WrapperOptions;
import org.hibernate.type.descriptor.java.AbstractTypeDescriptor;
import org.hibernate.type.descriptor.java.ImmutableMutabilityPlan;

import java.math.BigDecimal;

/**
 * Money-string converter for Hibernate.
 */
@SuppressWarnings("unused")
public class PercentageDecimalTypeDescriptor extends AbstractTypeDescriptor<Percentage> {

  /**
   * A public instance of the class.
   */
  public static final PercentageDecimalTypeDescriptor INSTANCE = new PercentageDecimalTypeDescriptor();

  @SuppressWarnings("unchecked")
  public PercentageDecimalTypeDescriptor() {
    super(Percentage.class, ImmutableMutabilityPlan.INSTANCE);
  }

  @Override
  public Percentage fromString(String string) {
    return new Percentage(string);
  }

  /**
   * Unwraps the data for the database by converting it to a Decimal.
   *
   * @param value   The value to unwrap
   * @param type    The type as which to unwrap
   * @param options The options
   */
  @SuppressWarnings("unchecked")
  @Override
  public <X> X unwrap(Percentage value, Class<X> type, WrapperOptions options) {
    if (value == null)
      return null;

    return (X) value.getValue();
  }

  /**
   * Wraps the data from the database by converting it to a Money object.
   *
   * @param value   The value to wrap.
   * @param options The options
   * @return a money object
   */
  @Override
  public <X> Percentage wrap(X value, WrapperOptions options) {
    if (value == null)
      return null;

    if (value instanceof BigDecimal)
      return new Percentage((BigDecimal) value);

    throw unknownWrap(value.getClass());
  }
}