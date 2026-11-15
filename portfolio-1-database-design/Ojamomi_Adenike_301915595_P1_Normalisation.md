# Sunny Bank Basic Accounts — normalisation

The example uses the saved sample records. The full set of fields is in the design and schema.

## Starting grouped records

| customer_id | account records (list) |
| --- | --- |
| 1001 | [2001] |


The record IDs are grouped in a list. In 1NF, each record has its own row and each cell holds one value.

## 1NF: one value per cell

| account.account_id | account.customer_id | account.account_number | customer.customer_id | customer.full_name |
| --- | --- | --- | --- | --- |
| 2001 | 1001 | SB-100001 | 1001 | Avery Morgan |

Key: account_id.

## 2NF: depend on the whole key

The declared candidate keys do not introduce a partial dependency here, so the 1NF rows stay unchanged at this step.

## account_example

| account.account_id | account.customer_id | account.account_number | customer.customer_id | customer.full_name |
| --- | --- | --- | --- | --- |
| 2001 | 1001 | SB-100001 | 1001 | Avery Morgan |

## 3NF: store each entity’s details once

The entity keys determine their own descriptions. Related records keep foreign keys rather than repeating those descriptions.

## customer

| customer_id | full_name | email | phone |
| --- | --- | --- | --- |
| 1001 | Avery Morgan | avery.morgan@example.test | NULL |

## account

| account_id | customer_id | account_number | account_type | opened_on | status | balance |
| --- | --- | --- | --- | --- | --- | --- |
| 2001 | 1001 | SB-100001 | checking | 2025-01-15 | open | 1250.5 |

## bank_transaction

| transaction_id | account_id | transaction_reference | transaction_type | amount | posted_at |
| --- | --- | --- | --- | --- | --- |
| 3001 | 2001 | TX-100001 | deposit | 250.5 | 2025-01-16T10:30:00+00:00 |

## Dependencies

- customer: (customer_id) → full_name, email, phone
- account: (account_id) → customer_id, account_number, account_type, opened_on, status, balance
- bank_transaction: (transaction_id) → account_id, transaction_reference, transaction_type, amount, posted_at

Joining the decomposed sample tables reproduces the original 1 example rows. The design assumes the declared keys describe the relevant business dependencies.
