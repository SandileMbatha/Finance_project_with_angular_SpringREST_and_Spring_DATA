package com.psybergate.finance202208.web.exception;

import com.psybergate.finance202208.exception.FinanceException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.*;

@SuppressWarnings({"unused", "NullableProblems"})
@ControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {

  @Override
  protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                HttpHeaders headers,
                                                                HttpStatus status,
                                                                WebRequest request) {
    Map<String, Object> body = new HashMap<>();
    List<String> causes = new ArrayList<>();

    body.put("timestamp", new Date());
    body.put("status", 500);
    body.put("error", "Internal Server Error");

    ex.getBindingResult().getAllErrors().forEach((error) -> {
      String fieldName = ((FieldError) error).getField();
      String errorMessage = error.getDefaultMessage();
      causes.add(errorMessage);
    });

    body.put("causes", causes);

    return new ResponseEntity<>(body, headers, status);
  }

  @ExceptionHandler(FinanceException.class)
  protected ResponseEntity<Object> handleConflict(
          FinanceException ex, WebRequest request) {

    Map<String, Object> body = new HashMap<>();
    List<String> causes = new ArrayList<>();

    body.put("timestamp", new Date());
    body.put("status", 500);
    body.put("error", "Internal Server Error");

    causes.add(ex.getMessage());
    body.put("causes", causes);

    return new ResponseEntity<>(body, null, 500);
  }

}
