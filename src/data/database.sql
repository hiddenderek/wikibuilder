
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (id UUID NOT NULL PRIMARY KEY, username VARCHAR(30) NOT NULL UNIQUE, password TEXT NOT NULL, email VARCHAR(40) UNIQUE);

CREATE TABLE pages (id UUID NOT NULL PRIMARY KEY, title VARCHAR(75) NOT NULL UNIQUE, intro_text TEXT, intro_table_data TEXT, user_id UUID REFERENCES users(id));

CREATE TABLE sections (id UUID NOT NULL PRIMARY KEY, section_id TEXT NOT NULL UNIQUE, title VARCHAR(75), body TEXT NOT NULL, page_id UUID REFERENCES pages(id));

CREATE TABLE infoTables (id UUID NOT NULL PRIMARY KEY, table_data TEXT NOT NULL, section_id UUID REFERENCES sections(id));

CREATE TABLE refreshTokens (id UUID NOT NULL PRIMARY KEY, refresh_token VARCHAR (600) NOT NULL UNIQUE, user_id UUID REFERENCES users(id));

ALTER TABLE users ADD CONSTRAINT emaildomain CHECK (email ILIKE '%dac-inc.com%');