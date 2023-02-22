package com.psybergate.finance202208.service.impl;

import com.psybergate.finance202208.domain.finance.debt.CarFinance;
import com.psybergate.finance202208.exception.FinanceException;
import com.psybergate.finance202208.repository.CarFinanceRepository;
import com.psybergate.finance202208.service.CarFinanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@SuppressWarnings("unused")
@Service("carFinanceService")
@Transactional
public class CarFinanceServiceImpl implements CarFinanceService {

  private final CarFinanceRepository carFinanceRepository;

  @Autowired
  public CarFinanceServiceImpl(CarFinanceRepository carFinanceRepository) {
    this.carFinanceRepository = carFinanceRepository;
  }

  @Override
  public CarFinance create(CarFinance carFinance) {
    carFinance.getMonthlyDetails(); // Calculate monthly details before saving.
    validateCarFinance(carFinance);
    checkForNameDuplicates(carFinance);
    return carFinanceRepository.save(carFinance);
  }

  @Override
  public void update(CarFinance carFinance) {
    carFinance.getMonthlyDetails(); // Calculate monthly details before saving.
    validateCarFinance(carFinance);
    verifyCarFinanceExists(carFinance);
    verifyCarFinanceNameBeforeUpdate(carFinance);
    carFinanceRepository.save(carFinance);
  }

  @Override
  public void delete(Long financeNum) {
    carFinanceRepository.deleteById(financeNum);
  }

  @Override
  public CarFinance findById(Long financeNum) {
    Optional<CarFinance> carFinance = carFinanceRepository.findById(financeNum);
    return carFinance.orElse(null);
  }

  @Override
  public List<CarFinance> findByCustomerId(Long customerNum) {
    return carFinanceRepository.findByCustomerCustomerNumEquals(customerNum);
  }

  @Override
  public Page<CarFinance> findPaginatedByCustomerId(Long customerNum, int page, int size) {
    return carFinanceRepository.findByCustomerCustomerNumEquals(customerNum,
            PageRequest.of(page, size, Sort.by("name")));
  }

  private void validateCarFinance(CarFinance carFinance) {
    if (! carFinance.getInitialDeposit().lessThan(carFinance.getPrice())) {
      throw new FinanceException("Initial deposit must be less than the car price.");
    }

    if (! carFinance.getBalloonPayment().lessThan(carFinance.getPrice())) {
      throw new FinanceException("Balloon payment must be less than the car price.");
    }

    if (! carFinance.getInitialDeposit().add(carFinance.getBalloonPayment())
        .lessThan(carFinance.getPrice())) {
      throw new FinanceException(
          "The sum of the balloon payment and initial deposit must be less than the car price.");
    }
  }

  private void verifyCarFinanceExists(CarFinance carFinance) {
    if (findById(carFinance.getFinanceNum()) == null) {
      throw new FinanceException("Car Finance with finance number " +
          carFinance.getFinanceNum() + " doesn't exist.");
    }
  }

  private void checkForNameDuplicates(CarFinance carFinance) {
    if (carFinanceRepository.findByName(carFinance.getName()) != null) {
      throw new FinanceException("Car Finance with name " +
              carFinance.getName() + " already exists.");
    }
  }

  private void verifyCarFinanceNameBeforeUpdate(CarFinance carFinance) {
    CarFinance storedCarFinance = carFinanceRepository.findByName(carFinance.getName());

    if (storedCarFinance != null && !carFinance.getFinanceNum().equals(storedCarFinance.getFinanceNum())) {
      throw new FinanceException("Car Finance with name " +
              carFinance.getName() + " already exists.");
    }
  }
}