-- Tax table for 2022
insert into tax_table (tax_year, medical_credits_max_allowed, travel_allowance_max_allowed) values (2022, 12000, 80000);

-- Tax brackets
insert into tax_bracket (max, rate, tax_year) values (226000, 18, 2022);
insert into tax_bracket (max, rate, tax_year) values (353100, 26, 2022);
insert into tax_bracket (max, rate, tax_year) values (488700, 31, 2022);
insert into tax_bracket (max, rate, tax_year) values (641400, 36, 2022);
insert into tax_bracket (max, rate, tax_year) values (817600, 39, 2022);
insert into tax_bracket (max, rate, tax_year) values (1731600, 41, 2022);
insert into tax_bracket (max, rate, tax_year) values (1000000000, 45, 2022);

-- Interest
insert into interest_exemption (exemption, minimum_age, tax_year) values (23800, 0, 2022);
insert into interest_exemption (exemption, minimum_age, tax_year) values (34500, 65, 2022);

-- Capital Gains
insert into capital_gains_exemption (tax_year, exemption, rate) values (2022, 40000, 40);

-- Retirement Funding
insert into retirement_fund_deductible (tax_year, max_allowed, rate) values (2022, 350000, 27.5);

-- Rebates
insert into rebate (amount, minimum_age, tax_year) values (16425, 0, 2022);
insert into rebate (amount, minimum_age, tax_year) values (9000, 65, 2022);
insert into rebate (amount, minimum_age, tax_year) values (2997, 75, 2022);


