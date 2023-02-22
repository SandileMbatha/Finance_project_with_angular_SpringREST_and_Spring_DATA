package com.psybergate.finance202208.service.impl;

import com.psybergate.finance202208.domain.finance.debt.PropertyBond;
import com.psybergate.finance202208.exception.FinanceException;
import com.psybergate.finance202208.repository.PropertyBondRepository;
import com.psybergate.finance202208.service.PropertyBondService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service("propertyBondService")
@Transactional
@SuppressWarnings("unused")
public class PropertyBondServiceImpl implements PropertyBondService {

  private final PropertyBondRepository propertyBondRepository;

  @Autowired
  public PropertyBondServiceImpl(PropertyBondRepository propertyBondRepository) {
    this.propertyBondRepository = propertyBondRepository;
  }

  @Override
  public PropertyBond create(PropertyBond propertyBond) {
    propertyBond.getMonthlyDetails(); // Calculate monthly details before saving.
    validatePropertyBond(propertyBond);
    checkForNameDuplicates(propertyBond);
    return propertyBondRepository.save(propertyBond);
  }

  @Override
  public void update(PropertyBond propertyBond) {
    validatePropertyBond(propertyBond);
    propertyBond.getMonthlyDetails();
    verifyPropertyBondExists(propertyBond);
    verifyPropertyBondNameBeforeUpdate(propertyBond);
    propertyBondRepository.save(propertyBond);
  }

  @Override
  public void delete(Long financeNum) {
    propertyBondRepository.deleteById(financeNum);
  }

  @Override
  public PropertyBond findById(Long financeNum) {
    Optional<PropertyBond> propertyBond = propertyBondRepository.findById(financeNum);
    return propertyBond.orElse(null);
  }

  @Override
  public List<PropertyBond> findByCustomerId(Long customerNum) {
    return propertyBondRepository.findByCustomerCustomerNumEquals(customerNum);
  }

  @Override
  public Page<PropertyBond> findPaginatedByCustomerId(Long customerNum, int page, int size) {
    return propertyBondRepository.findByCustomerCustomerNumEquals(customerNum,
            PageRequest.of(page, size, Sort.by("name")));
  }

  private void validatePropertyBond(PropertyBond propertyBond) {
    if (! propertyBond.getInitialDeposit().lessThan(propertyBond.getPrice())) {
      throw new FinanceException("Initial deposit must be less than the property price.");
    }
  }

  private void verifyPropertyBondExists(PropertyBond propertyBond) {
    if (findById(propertyBond.getFinanceNum()) == null) {
      throw new FinanceException("Property bond with finance number " +
          propertyBond.getFinanceNum() + " doesn't exist.");
    }
  }

  private void checkForNameDuplicates(PropertyBond propertyBond) {
    if (propertyBondRepository.findByName(propertyBond.getName()) != null) {
      throw new FinanceException("Property Bond with name " +
              propertyBond.getName() + " already exists.");
    }
  }

  private void verifyPropertyBondNameBeforeUpdate(PropertyBond propertyBond) {
    PropertyBond storedPropertyBond = propertyBondRepository.findByName(propertyBond.getName());

    if (storedPropertyBond != null && !propertyBond.getFinanceNum().equals(storedPropertyBond.getFinanceNum())) {
      throw new FinanceException("Property Bond with name " +
              propertyBond.getName() + " already exists.");
    }
  }
}
