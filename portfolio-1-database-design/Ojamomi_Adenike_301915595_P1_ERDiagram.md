# Sunny Bank Basic Accounts — ER diagram

```mermaid
erDiagram
    direction LR
    customer {
        bigint customer_id PK
        text full_name
        text email UK
        text phone "Optional"
    }
    account {
        bigint account_id PK
        bigint customer_id FK
        text account_number UK
        text account_type
        date opened_on
        text status
        numeric balance
    }
    bank_transaction {
        bigint transaction_id PK
        bigint account_id FK
        text transaction_reference UK
        text transaction_type
        numeric amount
        timestamptz posted_at
    }
    customer ||--o{ account : "customer_id"
    account ||--o{ bank_transaction : "account_id"
```

PK identifies a record; FK links to another table; UK marks a single-field unique value. The relationship ends show exactly one, zero or one, or zero or many records. Composite unique keys and conditional rules are listed in the schema and design.

[Diagram image](../images/Ojamomi_Adenike_301915595_ERDiagram.png)
