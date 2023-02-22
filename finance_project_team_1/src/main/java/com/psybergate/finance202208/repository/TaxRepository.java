package com.psybergate.finance202208.repository;

import com.psybergate.finance202208.domain.projection.TaxTableView;
import com.psybergate.finance202208.domain.tax.table.TaxTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TaxRepository extends JpaRepository<TaxTable, Integer> {

  TaxTable findTaxTableByTaxYearEquals(@Param("taxYear") Integer taxYear);

  TaxTableView findRebatesByTaxYearEquals(@Param("taxYear") Integer taxYear);

}
