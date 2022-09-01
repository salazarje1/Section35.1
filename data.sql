\c biztime

Drop Table If Exists invoices;
Drop Table If Exists companies;

Create Table companies (
  code text Primary Key, 
  name text Not Null Unique,
  description text
);

Create Table invoices (
  id serial Primary Key,
  comp_code text Not Null REFERENCES companies On Delete Cascade,
  amt float Not Null,
  paid boolean Not Null Default false,
  add_date date Not Null Default CURRENT_DATE,
  paid_date date, 
  CONSTRAINT invoices_amt_check Check ((amt > (0)::double precision))
);

INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.');

INSERT INTO invoices (comp_Code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);