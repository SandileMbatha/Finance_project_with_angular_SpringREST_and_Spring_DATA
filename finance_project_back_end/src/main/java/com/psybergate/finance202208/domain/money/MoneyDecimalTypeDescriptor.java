package com.psybergate.finance202208.domain.money;

import org.hibernate.type.descriptor.WrapperOptions;
import org.hibernate.type.descriptor.java.AbstractTypeDescriptor;
import org.hibernate.type.descriptor.java.ImmutableMutabilityPlan;

import java.math.BigDecimal;

/**
 * Money-string converter for Hibernate.
 */
@SuppressWarnings("unused")
public class MoneyDecimalTypeDescriptor extends AbstractTypeDescriptor<Money> {

  /**
   * A public instance of the class.
   */
  public static final MoneyDecimalTypeDescriptor INSTANCE = new MoneyDecimalTypeDescriptor();

  @SuppressWarnings("unchecked")
  public MoneyDecimalTypeDescriptor() {
    super(Money.class, ImmutableMutabilityPlan.INSTANCE);
  }

  @Override
  public Money fromString(String string) {
    return new Money(string);
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
  public <X> X unwrap(Money value, Class<X> type, WrapperOptions options) {
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
  public <X> Money wrap(X value, WrapperOptions options) {
    if (value == null)
      return null;

    if (value instanceof BigDecimal)
      return new Money((BigDecimal) value);

    throw unknownWrap(value.getClass());
  }
}