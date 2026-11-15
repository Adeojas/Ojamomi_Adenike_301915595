// Run once in mongosh against a fresh exercise database.
// These records are fictional events for the case study.
(async function () {
  db = db.getSiblingDB('portfolio_nosql');
  if ((await db.getCollectionNames()).includes("bank_account_events")) {
    throw new Error('The exercise collection already exists. Use a fresh database.');
  }

  // The validator checks the stable event fields while details can vary.
  await db.createCollection("bank_account_events", {
    validator: {
    "$jsonSchema": {
        "bsonType": "object",
        "required": [
            "_id",
            "schemaVersion",
            "simulation",
            "eventType",
            "occurredAt",
            "source",
            "embedded",
            "references",
            "details"
        ],
        "properties": {
            "_id": {
                "bsonType": "string",
                "minLength": 1
            },
            "schemaVersion": {
                "enum": [
                    1
                ]
            },
            "simulation": {
                "enum": [
                    true
                ]
            },
            "eventType": {
                "bsonType": "string",
                "enum": [
                    "account_opened",
                    "deposit_posted"
                ]
            },
            "occurredAt": {
                "bsonType": "date"
            },
            "source": {
                "bsonType": "object",
                "required": [
                    "entity",
                    "key",
                    "snapshot"
                ],
                "properties": {
                    "entity": {
                        "enum": [
                            "account"
                        ]
                    },
                    "key": {
                        "bsonType": "object",
                        "required": [
                            "account_id"
                        ]
                    },
                    "snapshot": {
                        "bsonType": "object"
                    }
                }
            },
            "embedded": {
                "bsonType": "object"
            },
            "references": {
                "bsonType": "object"
            },
            "details": {
                "bsonType": "object"
            }
        }
    }
},
    validationLevel: 'strict', validationAction: 'error'
  });

  // Insert the four example events and show their IDs.
  printjson(await db.getCollection("bank_account_events").insertMany([
    {
        "_id": "event_000001",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "account_opened",
        "occurredAt": ISODate("2030-01-01T10:00:00Z"),
        "source": {
            "entity": "account",
            "key": {
                "account_id": 2001
            },
            "snapshot": {
                "account_id": 2001,
                "customer_id": 1001,
                "account_number": "SB-100001",
                "account_type": "checking",
                "opened_on": "2025-01-15",
                "status": "open",
                "balance": 1250.5
            }
        },
        "embedded": {
            "customer": [
                {
                    "key": {
                        "customer_id": 1001
                    },
                    "snapshot": {
                        "customer_id": 1001,
                        "full_name": "Avery Morgan",
                        "email": "avery.morgan@example.test",
                        "phone": null
                    },
                    "via": [
                        "account.customer_id → customer"
                    ]
                }
            ]
        },
        "references": {},
        "details": {
            "channel": "web"
        }
    },
    {
        "_id": "event_000002",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "deposit_posted",
        "occurredAt": ISODate("2030-01-01T10:01:00Z"),
        "source": {
            "entity": "account",
            "key": {
                "account_id": 2001
            },
            "snapshot": {
                "account_id": 2001,
                "customer_id": 1001,
                "account_number": "SB-100001",
                "account_type": "checking",
                "opened_on": "2025-01-15",
                "status": "open",
                "balance": 1250.5
            }
        },
        "embedded": {
            "customer": [
                {
                    "key": {
                        "customer_id": 1001
                    },
                    "snapshot": {
                        "customer_id": 1001,
                        "full_name": "Avery Morgan",
                        "email": "avery.morgan@example.test",
                        "phone": null
                    },
                    "via": [
                        "account.customer_id → customer"
                    ]
                }
            ]
        },
        "references": {},
        "details": {
            "channel": "mobile",
            "note": "Illustrative event-specific metadata",
            "examples": {
                "amount": "illustrative amount",
                "channel": "illustrative channel",
                "transaction_reference": "illustrative transaction_reference",
                "balance_after": "illustrative balance_after"
            }
        }
    }
]));
  await db.getCollection("bank_account_events").createIndex({eventType: 1, occurredAt: -1}, {name: 'event_type_time'});

  // 1. Find the first sample event type (up to five documents).
  printjson(await db.getCollection("bank_account_events").find({"eventType":"account_opened"}).sort({_id:1}).limit(5).toArray());

  // 2. Find events for the first source record using nested key fields (up to five).
  printjson(await db.getCollection("bank_account_events").find({"source.key.account_id":2001}).sort({_id:1}).limit(5).toArray());

  // 3. Find events in the sample time range using a MongoDB Date filter (up to five).
  printjson(await db.getCollection("bank_account_events").find({"occurredAt":{"$gte":ISODate("2030-01-01T10:00:00Z"), "$lt":ISODate("2030-01-01T11:00:00Z")}}).sort({_id:1}).limit(5).toArray());

  // 4. Count documents for each event type.
  printjson(await db.getCollection("bank_account_events").aggregate([{"$group":{"_id":"$eventType", "documentCount":{"$sum":1}}}, {"$sort":{"_id":1}}]).toArray());

  // A date stored as text should be rejected by the validator.
  try {
    await db.getCollection("bank_account_events").insertOne({...{
    "_id": "event_000001",
    "schemaVersion": 1,
    "simulation": true,
    "eventType": "account_opened",
    "occurredAt": ISODate("2030-01-01T10:00:00Z"),
    "source": {
        "entity": "account",
        "key": {
            "account_id": 2001
        },
        "snapshot": {
            "account_id": 2001,
            "customer_id": 1001,
            "account_number": "SB-100001",
            "account_type": "checking",
            "opened_on": "2025-01-15",
            "status": "open",
            "balance": 1250.5
        }
    },
    "embedded": {
        "customer": [
            {
                "key": {
                    "customer_id": 1001
                },
                "snapshot": {
                    "customer_id": 1001,
                    "full_name": "Avery Morgan",
                    "email": "avery.morgan@example.test",
                    "phone": null
                },
                "via": [
                    "account.customer_id → customer"
                ]
            }
        ]
    },
    "references": {},
    "details": {
        "channel": "web"
    }
}, _id: 'invalid_date_example', occurredAt: 'not-a-date'});
  } catch (error) { print('Invalid date error: ' + error.code); }

  // Reusing an event ID should be rejected by the unique _id index.
  try { await db.getCollection("bank_account_events").insertOne({
    "_id": "event_000001",
    "schemaVersion": 1,
    "simulation": true,
    "eventType": "account_opened",
    "occurredAt": ISODate("2030-01-01T10:00:00Z"),
    "source": {
        "entity": "account",
        "key": {
            "account_id": 2001
        },
        "snapshot": {
            "account_id": 2001,
            "customer_id": 1001,
            "account_number": "SB-100001",
            "account_type": "checking",
            "opened_on": "2025-01-15",
            "status": "open",
            "balance": 1250.5
        }
    },
    "embedded": {
        "customer": [
            {
                "key": {
                    "customer_id": 1001
                },
                "snapshot": {
                    "customer_id": 1001,
                    "full_name": "Avery Morgan",
                    "email": "avery.morgan@example.test",
                    "phone": null
                },
                "via": [
                    "account.customer_id → customer"
                ]
            }
        ]
    },
    "references": {},
    "details": {
        "channel": "web"
    }
}); }
  catch (error) { print('Duplicate ID error: ' + error.code); }

  print('Document count: ' + await db.getCollection("bank_account_events").countDocuments());
})().catch(error => { print(error.stack || String(error)); quit(1); });
