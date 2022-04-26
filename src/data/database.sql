CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE DATABASE oasis_workstation;

CREATE TABLE users (id UUID NOT NULL PRIMARY KEY, username VARCHAR(30) NOT NULL UNIQUE, password TEXT NOT NULL, email VARCHAR(40) UNIQUE);

CREATE TABLE symbols (id UUID NOT NULL PRIMARY KEY, symbol_name VARCHAR(30) NOT NULL UNIQUE, symbol_type VARCHAR(30) NOT NULL, symbol_image TEXT, tags VARCHAR(30)[], symbol_data JSONB, category_id UUID REFERENCES categories(id));

CREATE TABLE categories (id UUID NOT NULL PRIMARY KEY, category_name VARCHAR(30) NOT NULL UNIQUE)

CREATE TABLE files (id UUID NOT NULL PRIMARY KEY, file_name VARCHAR(50) NOT NULL UNIQUE, file_data JSONB, time_created timestamp NOT NULL, date_modified timestamp NOT NULL);

CREATE TABLE refreshTokens (id UUID NOT NULL PRIMARY KEY, refresh_token VARCHAR (600) NOT NULL UNIQUE, user_id UUID REFERENCES users(id));

ALTER TABLE users ADD CONSTRAINT emaildomain CHECK (email ILIKE '%dac-inc.com%');