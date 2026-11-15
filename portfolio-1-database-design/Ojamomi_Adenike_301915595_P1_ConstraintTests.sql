-- Run these deliberately invalid statements one at a time, outside a transaction.
-- Each should fail at the named constraint; the sample rows should remain unchanged.

-- 1. customer pk reject. Expected: pk_customer, SQLSTATE 23505.
INSERT INTO portfolio."customer" ("customer_id", "full_name", "email", "phone")
VALUES (1001, 'Jordan Lee', 'jordan.lee@example.test', NULL);

-- 2. customer email unique reject. Expected: uq_customer_0, SQLSTATE 23505.
INSERT INTO portfolio."customer" ("customer_id", "full_name", "email", "phone")
VALUES (1002, 'Jordan Lee', 'avery.morgan@example.test', NULL);

-- 3. customer full name not null reject. Expected: full_name, SQLSTATE 23502.
INSERT INTO portfolio."customer" ("customer_id", "full_name", "email", "phone")
VALUES (1003, NULL, 'casey.park@example.test', NULL);

-- 4. account pk reject. Expected: pk_account, SQLSTATE 23505.
INSERT INTO portfolio."account" ("account_id", "customer_id", "account_number", "account_type", "opened_on", "status", "balance")
VALUES (2001, 1001, 'SB-100002', 'savings', '2025-02-01', 'open', 50);

-- 5. account number unique reject. Expected: uq_account_0, SQLSTATE 23505.
INSERT INTO portfolio."account" ("account_id", "customer_id", "account_number", "account_type", "opened_on", "status", "balance")
VALUES (2002, 1001, 'SB-100001', 'savings', '2025-02-01', 'open', 50);

-- 6. account customer fk reject. Expected: fk_account_0, SQLSTATE 23503.
INSERT INTO portfolio."account" ("account_id", "customer_id", "account_number", "account_type", "opened_on", "status", "balance")
VALUES (2003, 9999, 'SB-100003', 'checking', '2025-02-01', 'open', 50);

-- 7. account balance check reject. Expected: account_balance_nonnegative, SQLSTATE 23514.
INSERT INTO portfolio."account" ("account_id", "customer_id", "account_number", "account_type", "opened_on", "status", "balance")
VALUES (2004, 1001, 'SB-100004', 'checking', '2025-02-01', 'open', -1);

-- 8. transaction pk reject. Expected: pk_bank_transaction, SQLSTATE 23505.
INSERT INTO portfolio."bank_transaction" ("transaction_id", "account_id", "transaction_reference", "transaction_type", "amount", "posted_at")
VALUES (3001, 2001, 'TX-100002', 'withdrawal', 10, '2025-01-17T11:00:00Z');

-- 9. transaction reference unique reject. Expected: uq_bank_transaction_0, SQLSTATE 23505.
INSERT INTO portfolio."bank_transaction" ("transaction_id", "account_id", "transaction_reference", "transaction_type", "amount", "posted_at")
VALUES (3002, 2001, 'TX-100001', 'withdrawal', 10, '2025-01-17T11:00:00Z');

-- 10. transaction account fk reject. Expected: fk_bank_transaction_0, SQLSTATE 23503.
INSERT INTO portfolio."bank_transaction" ("transaction_id", "account_id", "transaction_reference", "transaction_type", "amount", "posted_at")
VALUES (3003, 9999, 'TX-100003', 'deposit', 10, '2025-01-17T11:00:00Z');

-- 11. transaction amount check reject. Expected: transaction_amount_positive, SQLSTATE 23514.
INSERT INTO portfolio."bank_transaction" ("transaction_id", "account_id", "transaction_reference", "transaction_type", "amount", "posted_at")
VALUES (3004, 2001, 'TX-100004', 'deposit', 0, '2025-01-17T11:00:00Z');
