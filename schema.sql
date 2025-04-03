-- Drop tables in correct order to handle foreign key constraints
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS client;
DROP TABLE IF EXISTS property;
DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS assistant;
DROP TABLE IF EXISTS branch;
DROP TABLE IF EXISTS lease;

SET FOREIGN_KEY_CHECKS = 1;

-- Create Branch table
CREATE TABLE IF NOT EXISTS branch (
    branch_id INT AUTO_INCREMENT PRIMARY KEY,
    branch_name VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL
);

-- Create Staff table with updated schema
CREATE TABLE IF NOT EXISTS staff (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    staff_number VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    sex CHAR(1),
    dob DATE,
    position VARCHAR(50) NOT NULL,
    salary DECIMAL(10,2),
    branch_number VARCHAR(20),
    branch_address VARCHAR(255),
    phone VARCHAR(50),
    supervisor VARCHAR(100),
    manager_start_date DATE,
    manager_bonus DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Property table
CREATE TABLE IF NOT EXISTS property (
    property_id INT AUTO_INCREMENT PRIMARY KEY,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postcode VARCHAR(20) NOT NULL,
    type VARCHAR(50) NOT NULL,
    rooms INT NOT NULL,
    rent DECIMAL(10,2) NOT NULL,
    owner_id INT NOT NULL,
    staff_id INT,
    branch_id INT,
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id),
    FOREIGN KEY (branch_id) REFERENCES branch(branch_id)
);

-- Create Client table
CREATE TABLE IF NOT EXISTS client (
    client_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    branch_id INT,
    branch_address VARCHAR(255),
    registered_by INT,
    date_registered DATE,
    property_type VARCHAR(50),
    max_rent DECIMAL(10,2),
    FOREIGN KEY (branch_id) REFERENCES branch(branch_id),
    FOREIGN KEY (registered_by) REFERENCES staff(staff_id)
);

-- Create Lease table
CREATE TABLE IF NOT EXISTS lease (
    lease_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    property_id INT NOT NULL,
    monthly_rent DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    deposit_paid CHAR(1),
    rent_start DATE NOT NULL,
    rent_finish DATE NOT NULL,
    duration VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES client(client_id),
    FOREIGN KEY (property_id) REFERENCES property(property_id)
);

-- Create Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(20) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff') NOT NULL,
    staff_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id) ON DELETE CASCADE,
    UNIQUE (staff_id)
);

-- Insert default admin user (only if it doesn't exist)
INSERT IGNORE INTO users (user_id, password, role) 
VALUES ('admin', '$2a$10$8K1p/a0dL1LXMIgZkH0qE.7XUz0XUz0XUz0XUz0XUz0XUz0XUz0', 'admin'); 