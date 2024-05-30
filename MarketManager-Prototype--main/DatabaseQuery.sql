DROP TABLE products;

CREATE TABLE products (
id SERIAL PRIMARY KEY,
name varchar UNIQUE,
price integer NOT NULL,
stock integer NOT NULL
);
