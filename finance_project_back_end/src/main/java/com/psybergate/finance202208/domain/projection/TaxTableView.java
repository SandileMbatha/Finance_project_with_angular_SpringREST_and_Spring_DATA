package com.psybergate.finance202208.domain.projection;

import com.psybergate.finance202208.domain.tax.table.deduction.Rebate;

import java.util.List;

public interface TaxTableView {

  List<Rebate> getRebates();

}
