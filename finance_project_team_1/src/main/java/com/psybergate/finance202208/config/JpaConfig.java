package com.psybergate.finance202208.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * A configuration class for all the necessary JPA requirements.
 */
@Configuration
@ComponentScan(basePackages = "com.psybergate.finance202208")
@EnableJpaRepositories(basePackages = "com.psybergate.finance202208.repository")
@EntityScan(basePackages = "com.psybergate.finance202208.domain")
@EnableTransactionManagement
@SuppressWarnings("unused")
public class JpaConfig {

}