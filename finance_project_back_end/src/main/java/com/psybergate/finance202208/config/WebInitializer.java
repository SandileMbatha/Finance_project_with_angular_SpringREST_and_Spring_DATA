package com.psybergate.finance202208.config;

import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Allows deploying this application in a WAR.
 */
@Configuration
@ComponentScan(basePackages = "com.psybergate.finance202208")
public class WebInitializer extends SpringBootServletInitializer {

  @Bean
  @SuppressWarnings("unused")
  public WebMvcConfigurer corsConfigurer()
  {
    return new WebMvcConfigurer() {
      @Override
      @SuppressWarnings("NullableProblems")
      public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**").allowedOrigins("http://localhost:4200").allowedMethods("GET", "POST","DELETE",
            "PUT");
      }
    };
  }
}
