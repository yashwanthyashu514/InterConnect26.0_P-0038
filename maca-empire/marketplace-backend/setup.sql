-- Database Schema for CA Marketplace IDfy Verification

CREATE TABLE IF NOT EXISTS marketplace_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- bcrypt hashed
    role VARCHAR(20) DEFAULT 'ca',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ca_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES marketplace_users(id),
    full_name VARCHAR(255) NOT NULL,
    icai_membership_number VARCHAR(50) UNIQUE NOT NULL,
    verification_status VARCHAR(20) DEFAULT 'pending', -- values: pending, verified, rejected
    idfy_raw_response JSONB, -- save full IDfy API JSON response here
    rejection_reason TEXT, -- why it was rejected
    verified_at TIMESTAMP,
    city VARCHAR(100),
    specialization VARCHAR(255),
    experience_years INT,
    created_at TIMESTAMP DEFAULT NOW()
);
