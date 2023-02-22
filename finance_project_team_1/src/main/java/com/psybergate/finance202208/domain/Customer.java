package com.psybergate.finance202208.domain;

import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Past;
import javax.validation.constraints.Size;
import java.time.LocalDate;

/**
 * A class to represent a user of the finance system.
 */
@Entity
@Table(name = "customer")
@SuppressWarnings("unused")
public class Customer {

  /**
   * A unique identifier for the database. The database will generate the value.
   */
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "customer_num")
  private Long customerNum;

  /**
   * A unique identifier for the customer to input. It serves as a backup in-case the customer
   * forgets their customerNum.
   */
  @Size(min = 13, max = 13, message = "Customer must have a valid 13-digit ID number.")
  @Column(name = "id_number", nullable = false, unique = true)
  private String idNumber;

  /**
   * The customer's full-name, excluding their surname.
   */
  @NotEmpty(message = "Customer name cannot be empty.")
  @Column(name = "name", nullable = false)
  private String name;

  /**
   * The customer's surname.
   */
  @NotEmpty(message = "Customer surname cannot be empty.")
  @Column(name = "surname", nullable = false)
  private String surname;

  /**
   * The customer's date of birth.
   */
  @Past
  @Column(name = "date_of_birth", nullable = false)
  @DateTimeFormat(pattern = "yyyy-MM-dd")
  private LocalDate dateOfBirth;

  @Column(name = "active")
  private boolean isActive = true;

  public Long getCustomerNum() {
    return customerNum;
  }

  public void setCustomerNum(Long customerNum) {
    this.customerNum = customerNum;
  }

  public String getIdNumber() {
    return idNumber;
  }

  public void setIdNumber(String idNumber) {
    this.idNumber = idNumber;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getSurname() {
    return surname;
  }

  public void setSurname(String surname) {
    this.surname = surname;
  }

  public LocalDate getDateOfBirth() {
    return dateOfBirth;
  }

  public void setDateOfBirth(LocalDate dateOfBirth) {
    this.dateOfBirth = dateOfBirth;
  }

  public boolean isActive() {
    return isActive;
  }

  public void setActive(boolean active) {
    isActive = active;
  }

}