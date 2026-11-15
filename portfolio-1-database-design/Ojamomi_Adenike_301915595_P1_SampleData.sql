-- Fictional sample records for Sunny Bank Basic Accounts.
BEGIN;
SET LOCAL standard_conforming_strings = on;
INSERT INTO portfolio."customer" ("customer_id", "full_name", "email", "phone") VALUES (1001, 'Avery Morgan', 'avery.morgan@example.test', NULL);
INSERT INTO portfolio."account" ("account_id", "customer_id", "account_number", "account_type", "opened_on", "status", "balance") VALUES (2001, 1001, 'SB-100001', 'checking', '2025-01-15', 'open', 1250.5);
INSERT INTO portfolio."bank_transaction" ("transaction_id", "account_id", "transaction_reference", "transaction_type", "amount", "posted_at") VALUES (3001, 2001, 'TX-100001', 'deposit', 250.5, '2025-01-16T10:30:00Z');
COMMIT;
