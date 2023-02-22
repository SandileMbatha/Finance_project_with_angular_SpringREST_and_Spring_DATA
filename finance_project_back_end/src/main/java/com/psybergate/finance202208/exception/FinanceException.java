package com.psybergate.finance202208.exception;

@SuppressWarnings("unused")
public class FinanceException extends RuntimeException {

  public FinanceException(String message) {
    super(message);
  }

  public FinanceException(String message, Throwable cause) {
    super(message, cause);
  }

}
