-- Investments
insert into investment (finance_num, initial_deposit, name, rate, term, customer_num, monthly_deposit)
values (1, 10000,'Investment 1', 12, 60, 1, 0);
insert into investment (finance_num, initial_deposit, name, rate, term, customer_num, monthly_deposit)
values (2, 100000,'Investment 2', 9, 60, 1, 100);
insert into investment (finance_num, initial_deposit, name, rate, term, customer_num, monthly_deposit)
values (3, 100,'Investment 3', 7, 60, 1, 100);
insert into investment (finance_num, initial_deposit, name, rate, term, customer_num, monthly_deposit)
values (4, 50000,'Investment 4', 10.235, 60, 1, 500);
insert into investment (finance_num, initial_deposit, name, rate, term, customer_num, monthly_deposit)
values (5, 500000,'Investment 5', 14.21, 60, 1, 5000);
insert into investment (finance_num, initial_deposit, name, rate, term, customer_num, monthly_deposit)
values (6, 7000000,'Investment 6', 16.541, 60, 1, 7000);
insert into investment (finance_num, initial_deposit, name, rate, term, customer_num, monthly_deposit)
values (7, 1,'Investment 7', 0.1, 60, 1, 1);

insert into investment (finance_num, initial_deposit, name, rate, term, customer_num, monthly_deposit)
values (8, 10000,'Investment 1', 8, 60, 2, 0);
insert into investment (finance_num, initial_deposit, name, rate, term, customer_num, monthly_deposit)
values (9, 500000,'Investment 2', 12, 60, 2, 5000);
insert into investment (finance_num, initial_deposit, name, rate, term, customer_num, monthly_deposit)
values (10, 7000000,'Investment 3', 22, 60, 2, 10000);

insert into investment (finance_num, initial_deposit, name, rate, term, customer_num, monthly_deposit)
values (11, 10000,'Investment 1', 4, 60, 3, 0);
insert into investment (finance_num, initial_deposit, name, rate, term, customer_num, monthly_deposit)
values (12, 500000,'Investment 2', 24, 60, 3, 5000);
insert into investment (finance_num, initial_deposit, name, rate, term, customer_num, monthly_deposit)
values (13, 7000000,'Investment 3', 63, 60, 3, 10000);

insert into investment (finance_num, initial_deposit, name, rate, term, customer_num, monthly_deposit)
values (14, 10000,'Investment 1', 10.235, 60, 5, 0);
insert into investment (finance_num, initial_deposit, name, rate, term, customer_num, monthly_deposit)
values (15, 500000,'Investment 2', 11, 60, 5, 5000);
insert into investment (finance_num, initial_deposit, name, rate, term, customer_num, monthly_deposit)
values (16, 7000000,'Investment 3', 9, 60, 5, 10000);

insert into investment (finance_num, initial_deposit, name, rate, term, customer_num, monthly_deposit)
values (17, 10000,'Investment 1', 7, 60, 7, 0);
insert into investment (finance_num, initial_deposit, name, rate, term, customer_num, monthly_deposit)
values (18, 500000,'Investment 2', 12, 60, 7, 5000);
insert into investment (finance_num, initial_deposit, name, rate, term, customer_num, monthly_deposit)
values (19, 7000000,'Investment 3', 13, 60, 7, 10000);


-- Property Bonds
insert into property_bond (finance_num, initial_deposit, name, rate, term, customer_num, monthly_repayment, price, bond_costs, legal_costs, transfer_costs)
values (1, 500000, 'Property Bond 1', 12, 240, 1, 104603.18, 10000000, 35000,45000,916000);
insert into property_bond (finance_num, initial_deposit, name, rate, term, customer_num, monthly_repayment, price, bond_costs, legal_costs, transfer_costs)
values (2, 90000, 'Property Bond 2', 19, 240, 1, 79575.63, 5000000, 35000,45000,366000);
insert into property_bond (finance_num, initial_deposit, name, rate, term, customer_num, monthly_repayment, price, bond_costs, legal_costs, transfer_costs)
values (3, 0, 'Property Bond 3', 21, 240, 1, 1777.64, 100000, 35000,45000,0);

insert into property_bond (finance_num, initial_deposit, name, rate, term, customer_num, monthly_repayment, price, bond_costs, legal_costs, transfer_costs)
values (4, 50000, 'Property Bond 1', 16, 240, 3, 20173.21, 1500000, 35000, 45000, 18750.00);
insert into property_bond (finance_num, initial_deposit, name, rate, term, customer_num, monthly_repayment, price, bond_costs, legal_costs, transfer_costs)
values (5, 100000, 'Property Bond 2', 19.53, 240, 3, 31578.18, 2000000, 35000,45000, 50250.00);

insert into property_bond (finance_num, initial_deposit, name, rate, term, customer_num, monthly_repayment, price, bond_costs, legal_costs, transfer_costs)
values (6, 1500000, 'Property Bond 1', 9, 240, 6, 76476.71, 10000000, 35000, 45000,916000);
insert into property_bond (finance_num, initial_deposit, name, rate, term, customer_num, monthly_repayment, price, bond_costs, legal_costs, transfer_costs)
values (7, 50000, 'Property Bond 2', 10, 240, 6, 52593.68, 5500000, 35000, 45000, 421000.00);
insert into property_bond (finance_num, initial_deposit, name, rate, term, customer_num, monthly_repayment, price, bond_costs, legal_costs, transfer_costs)
values (8, 0, 'Property Bond 3', 17.365, 240, 6, 44838.62, 3000000, 35000, 45000, 146000);

insert into property_bond (finance_num, initial_deposit, name, rate, term, customer_num, monthly_repayment, price, bond_costs, legal_costs, transfer_costs)
values (9, 10000, 'Property Bond 1', 9.635, 240, 9, 4610.73, 500000, 35000,45000,0);
insert into property_bond (finance_num, initial_deposit, name, rate, term, customer_num, monthly_repayment, price, bond_costs, legal_costs, transfer_costs)
values (10, 1000000, 'Property Bond 2', 12, 240, 9, 154152.06, 15000000, 35000,45000, 1546000.00);


-- Car Finances
insert into car_finance (finance_num, initial_deposit, name, rate, term, customer_num, monthly_repayment, price, balloon_payment)
values (1, 50000, 'Car Finance 1', 12, 120, 1, 13542.80, 1000000, 20000);
insert into car_finance (finance_num, initial_deposit, name, rate, term, customer_num, monthly_repayment, price, balloon_payment)
values (2, 500000, 'Car Finance 2', 20, 120, 1, 183420.06, 10000000, 65000);
insert into car_finance (finance_num, initial_deposit, name, rate, term, customer_num, monthly_repayment, price, balloon_payment)
values (3, 35000, 'Car Finance 3', 15, 72, 1,  20188.81, 1000000, 25000);
insert into car_finance (finance_num, initial_deposit, name, rate, term, customer_num, monthly_repayment, price, balloon_payment)
values (4, 20000, 'Car Finance 4', 6, 60, 1, 4446.54, 250000, 0);

insert into car_finance (finance_num, initial_deposit, name, rate, term, customer_num, monthly_repayment, price, balloon_payment)
values (5, 12000, 'Car Finance 1', 9, 120, 2, 988.07, 90000, 0);
insert into car_finance (finance_num, initial_deposit, name, rate, term, customer_num, monthly_repayment, price, balloon_payment)
values (6, 7000, 'Car Finance 2', 10, 60, 2, 1782.27, 100000, 15000);

insert into car_finance (finance_num, initial_deposit, name, rate, term, customer_num, monthly_repayment, price, balloon_payment)
values (7, 65000, 'Car Finance 1', 15, 120, 4, 13362.47, 900000, 30000);

insert into car_finance (finance_num, initial_deposit, name, rate, term, customer_num, monthly_repayment, price, balloon_payment)
values (8, 42000, 'Car Finance 1', 17, 60, 5, 48426.26, 2000000, 22000);
insert into car_finance (finance_num, initial_deposit, name, rate, term, customer_num, monthly_repayment, price, balloon_payment)
values (9, 35000, 'Car Finance 2', 12.236, 72, 5, 1231.38, 100000, 5000);
insert into car_finance (finance_num, initial_deposit, name, rate, term, customer_num, monthly_repayment, price, balloon_payment)
values (10, 60000, 'Car Finance 3', 9.145, 120, 5, 6780.43, 600000, 20000);

insert into car_finance (finance_num, initial_deposit, name, rate, term, customer_num, monthly_repayment, price, balloon_payment)
values (11, 70000, 'Car Finance 1', 19, 120, 7, 17360.53, 1000000, 0);
insert into car_finance (finance_num, initial_deposit, name, rate, term, customer_num, monthly_repayment, price, balloon_payment)
values (12, 5000, 'Car Finance 2', 14, 72, 7, 1823.46, 100000, 15000);

insert into car_finance (finance_num, initial_deposit, name, rate, term, customer_num, monthly_repayment, price, balloon_payment)
values (13, 100000, 'Car Finance 1', 9, 60, 9, 122076.54, 6000000, 30000);
insert into car_finance (finance_num, initial_deposit, name, rate, term, customer_num, monthly_repayment, price, balloon_payment)
values (14, 50000, 'Car Finance 2', 6, 120, 9, 4690.82, 500000, 50000);

insert into car_finance (finance_num, initial_deposit, name, rate, term, customer_num, monthly_repayment, price, balloon_payment)
values (15, 50000, 'Car Finance 1', 50, 60, 10, 43324.50, 1000000, 0);