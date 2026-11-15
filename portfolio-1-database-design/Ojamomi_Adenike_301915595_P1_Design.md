# Sunny Bank Basic Accounts — database design

My case study records customer, account, bank_transaction.

## Users

- Customers reviewing their account activity
- Tellers recording deposits and withdrawals
- Bank operations staff reviewing account summaries

## Main operations

- Register a customer and open an account
- Post a deposit or withdrawal
- Review account activity and balances

## Entities

| Entity | Information stored |
| --- | --- |
| customer | A person who holds one or more Sunny Bank accounts. |
| account | A basic bank account owned by one customer, with its current balance and status. |
| bank_transaction | A posted deposit, withdrawal, fee, or interest entry belonging to one account. |

## customer

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| customer_id | BIGINT | PK | Yes |
| full_name | TEXT |  | Yes |
| email | TEXT | Unique | Yes |
| phone | TEXT |  | No |
- Unique key: (email).

## account

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| account_id | BIGINT | PK | Yes |
| customer_id | BIGINT | FK | Yes |
| account_number | TEXT | Unique | Yes |
| account_type | TEXT |  | Yes |
| opened_on | DATE |  | Yes |
| status | TEXT |  | Yes |
| balance | NUMERIC(18,2) |  | Yes |
- customer_id → customer.customer_id
- Unique key: (account_number).

## bank_transaction

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| transaction_id | BIGINT | PK | Yes |
| account_id | BIGINT | FK | Yes |
| transaction_reference | TEXT | Unique | Yes |
| transaction_type | TEXT |  | Yes |
| amount | NUMERIC(18,2) |  | Yes |
| posted_at | TIMESTAMPTZ |  | Yes |
- account_id → account.account_id
- Unique key: (transaction_reference).

## Relationships and business rules

- Each customer email identifies at most one customer.
- Every account must reference an existing customer.
- Each account number identifies at most one account.
- An account balance must be greater than or equal to zero.
- Every posted transaction must reference an existing account.
- Every posted transaction amount must be greater than zero.
- Each transaction reference identifies at most one posted transaction.

## Assumptions

- Each account has exactly one customer owner; joint accounts are out of scope.
- All amounts use one assumed currency. Accounts cannot have a negative balance; overdrafts are out of scope.
- Account balances store the current balance, updated atomically with each posted transaction.
- Worked normalisation example: Account is rooted at its customer_id foreign key to Customer. Customer name and email belong in Customer rather than being repeated on each account; this example has one customer-parent role.
- Primary-key IDs are synthetic globally unique identifiers. Account numbers and transaction references are synthetic unique values.

