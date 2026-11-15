# Sunny Bank Basic Accounts — SQL queries

## 1. Show related customer, account records (up to 20).

```sql
SELECT t0."customer_id" AS "customer_customer_id",
       t0."full_name" AS "customer_full_name",
       t1."account_id" AS "account_account_id",
       t1."account_number" AS "account_account_number"
FROM portfolio."customer" t0
JOIN portfolio."account" t1 ON t1."customer_id" = t0."customer_id"
ORDER BY t0."customer_id", t1."account_id"
LIMIT 20;
```

| customer_customer_id | customer_full_name | account_account_id | account_account_number |
| --- | --- | --- | --- |
| 1001 | Avery Morgan | 2001 | SB-100001 |

## 2. Find account records where customer_id matches 1001 (up to 20).

```sql
SELECT * FROM portfolio."account"
WHERE "customer_id" IS NOT DISTINCT FROM 1001
ORDER BY "account_id"
LIMIT 20;
```

| account_id | customer_id | account_number | account_type | opened_on | status | balance |
| --- | --- | --- | --- | --- | --- | --- |
| 2001 | 1001 | SB-100001 | checking | 2025-01-15 | open | 1250.5 |

## 3. Count account records for each customer_id (up to 20 groups).

```sql
SELECT "customer_id", count(*) AS record_count
FROM portfolio."account"
GROUP BY "customer_id"
ORDER BY record_count DESC, "customer_id" NULLS LAST
LIMIT 20;
```

| customer_id | record_count |
| --- | --- |
| 1001 | 1 |

## 4. Find bank_transaction records where posted_at matches "2025-01-16T10:30:00Z" (up to 20).

```sql
SELECT * FROM portfolio."bank_transaction"
WHERE "posted_at" IS NOT DISTINCT FROM '2025-01-16T10:30:00Z'
ORDER BY "transaction_id"
LIMIT 20;
```

| transaction_id | account_id | transaction_reference | transaction_type | amount | posted_at |
| --- | --- | --- | --- | --- | --- |
| 3001 | 2001 | TX-100001 | deposit | 250.5 | 2025-01-16T10:30:00+00:00 |


## Index comparison

| Phase | Median (ms) | Three runs (ms) | Plan nodes | Buffer hits |
| --- | --- | --- | --- | --- |
| Before index | 1.01 | 0.999, 1.01, 1.018 | Sort → Seq Scan | 112 |
| After index | 0.212 | 0.212, 0.195, 0.224 | Sort → Bitmap Heap Scan → Bitmap Index Scan | 25 |

The median execution time changed from 1.01 ms to 0.212 ms. The measured plan used p2_filter_idx. The results matched in both phases. An index adds storage and write-maintenance costs; timings depend on the selected lookup and environment.

## Execution plans

### Before index, run 1

```text
Sort (actual time=0.969..0.97 rows=20 loops=1)
  Seq Scan on bank_transaction (actual time=0.016..0.934 rows=20 loops=1)
Planning Time: 0.378 ms
Execution Time: 0.999 ms
```

### Before index, run 2

```text
Sort (actual time=0.982..0.984 rows=20 loops=1)
  Seq Scan on bank_transaction (actual time=0.017..0.948 rows=20 loops=1)
Planning Time: 0.366 ms
Execution Time: 1.01 ms
```

### Before index, run 3

```text
Sort (actual time=0.99..0.992 rows=20 loops=1)
  Seq Scan on bank_transaction (actual time=0.016..0.955 rows=20 loops=1)
Planning Time: 0.353 ms
Execution Time: 1.018 ms
```

### After index, run 1

```text
Sort (actual time=0.149..0.15 rows=20 loops=1)
  Bitmap Heap Scan on bank_transaction (actual time=0.029..0.111 rows=20 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.015..0.015 rows=20 loops=1)
Planning Time: 0.544 ms
Execution Time: 0.212 ms
```

### After index, run 2

```text
Sort (actual time=0.134..0.136 rows=20 loops=1)
  Bitmap Heap Scan on bank_transaction (actual time=0.03..0.099 rows=20 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.016..0.016 rows=20 loops=1)
Planning Time: 0.563 ms
Execution Time: 0.195 ms
```

### After index, run 3

```text
Sort (actual time=0.14..0.142 rows=20 loops=1)
  Bitmap Heap Scan on bank_transaction (actual time=0.03..0.103 rows=20 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.015..0.015 rows=20 loops=1)
Planning Time: 0.542 ms
Execution Time: 0.224 ms
```

## Reproduce

Use a fresh database with the Portfolio 1 schema and sample data. Run Ojamomi_Adenike_301915595_P2_Queries.sql, then Ojamomi_Adenike_301915595_P2_Optimisation.sql. The optimisation script creates a separate performance table and runs EXPLAIN (ANALYZE, BUFFERS).

[Query screenshot](screenshots/Ojamomi_Adenike_301915595_P2_QueryResults.png) · [Index comparison](screenshots/Ojamomi_Adenike_301915595_P2_IndexComparison.png)

## References

- [PostgreSQL — EXPLAIN](https://www.postgresql.org/docs/17/using-explain.html)

