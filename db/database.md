# Database

## users

```sql

CREATE TABLE users(
  id                      UUID NOT NULL,
  name                    VARCHAR(255),
  email                   VARCHAR(255),
  phone_no                VARCHAR(255),
  username                VARCHAR(255),
  password                VARCHAR(255),
  role                    VARCHAR(255),
  is_active               BOOLEAN,

  created_at              TIMESTAMP WITH TIME ZONE,
  updated_at              TIMESTAMP WITH TIME ZONE,

  CONSTRAINT users_pkey PRIMARY KEY (id));

```
