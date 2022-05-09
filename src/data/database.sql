
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (id UUID NOT NULL PRIMARY KEY, username VARCHAR(30) NOT NULL UNIQUE, password TEXT NOT NULL, email VARCHAR(40) UNIQUE);

CREATE TABLE pages (id UUID NOT NULL PRIMARY KEY, title VARCHAR(75) NOT NULL UNIQUE, intro_text TEXT, intro_table_data TEXT, page_section_data TEXT, user_id UUID REFERENCES users(id));

CREATE TABLE contributors (id UUID NOT NULL PRIMARY KEY, user_id UUID REFERENCES users(id), page_id UUID REFERENCES pages(id));

CREATE TABLE refreshTokens (id UUID NOT NULL PRIMARY KEY, refresh_token VARCHAR (600) NOT NULL UNIQUE, user_id UUID REFERENCES users(id));

ALTER TABLE users ADD CONSTRAINT emaildomain CHECK (email ILIKE '%dac-inc.com%');