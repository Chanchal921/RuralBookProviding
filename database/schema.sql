-- =====================================================================
-- RuralEdu: Rural Education Resource Sharing Platform
-- Relational MySQL Schema (Aligned with SAD & SRS Architecture)
-- Compatible with MySQL 8.0+ and MySQL Workbench
-- =====================================================================

CREATE DATABASE IF NOT EXISTS ruraledu_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ruraledu_db;

-- ---------------------------------------------------------------------
-- Table: users
-- Conceptual UML: User (with role-based discriminator)
-- Roles: STUDENT, DONOR, TEACHER, NGO, ADMIN
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('STUDENT', 'DONOR', 'TEACHER', 'NGO', 'ADMIN') NOT NULL,
    organization_name VARCHAR(150),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table: resource_types
-- Master catalog for educational resource types (Books, Notes, etc.)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS resource_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL UNIQUE,
    code VARCHAR(30) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table: subjects
-- Master catalog for academic subjects
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subjects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    code VARCHAR(30) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table: class_levels
-- Master catalog for standard school / college levels
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS class_levels (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    standard_order INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table: resources
-- Core repository for educational materials
-- Lifecyle: PENDING -> APPROVED / REJECTED; APPROVED -> DEACTIVATED
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS resources (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    resource_type_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    class_level_id BIGINT NOT NULL,
    uploaded_by_id BIGINT NOT NULL,
    file_path VARCHAR(500),
    file_name VARCHAR(255),
    file_size BIGINT,
    file_type VARCHAR(100),
    external_url VARCHAR(1000),
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'DEACTIVATED') NOT NULL DEFAULT 'PENDING',
    admin_remarks TEXT,
    reviewed_by_id BIGINT,
    reviewed_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_resources_resource_type FOREIGN KEY (resource_type_id) REFERENCES resource_types (id) ON DELETE RESTRICT,
    CONSTRAINT fk_resources_subject FOREIGN KEY (subject_id) REFERENCES subjects (id) ON DELETE RESTRICT,
    CONSTRAINT fk_resources_class_level FOREIGN KEY (class_level_id) REFERENCES class_levels (id) ON DELETE RESTRICT,
    CONSTRAINT fk_resources_uploaded_by FOREIGN KEY (uploaded_by_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_resources_reviewed_by FOREIGN KEY (reviewed_by_id) REFERENCES users (id) ON DELETE SET NULL,
    
    INDEX idx_resources_status (status),
    INDEX idx_resources_subject (subject_id),
    INDEX idx_resources_class (class_level_id),
    INDEX idx_resources_type (resource_type_id),
    INDEX idx_resources_uploaded_by (uploaded_by_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table: resource_requests
-- Requests submitted by Students or Teachers/Schools
-- Lifecycle: PENDING -> MATCHED / APPROVED / REJECTED; MATCHED -> APPROVED / REJECTED; APPROVED -> COMPLETED
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS resource_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    requester_id BIGINT NOT NULL,
    resource_name VARCHAR(200) NOT NULL,
    class_level_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    resource_type_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    reason TEXT NOT NULL,
    status ENUM('PENDING', 'MATCHED', 'APPROVED', 'REJECTED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    matched_resource_id BIGINT NULL,
    admin_remarks TEXT,
    reviewed_by_id BIGINT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_requests_requester FOREIGN KEY (requester_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_requests_class_level FOREIGN KEY (class_level_id) REFERENCES class_levels (id) ON DELETE RESTRICT,
    CONSTRAINT fk_requests_subject FOREIGN KEY (subject_id) REFERENCES subjects (id) ON DELETE RESTRICT,
    CONSTRAINT fk_requests_resource_type FOREIGN KEY (resource_type_id) REFERENCES resource_types (id) ON DELETE RESTRICT,
    CONSTRAINT fk_requests_matched_resource FOREIGN KEY (matched_resource_id) REFERENCES resources (id) ON DELETE SET NULL,
    CONSTRAINT fk_requests_reviewed_by FOREIGN KEY (reviewed_by_id) REFERENCES users (id) ON DELETE SET NULL,
    
    INDEX idx_requests_status (status),
    INDEX idx_requests_requester (requester_id),
    INDEX idx_requests_subject (subject_id),
    INDEX idx_requests_class (class_level_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table: donations
-- Record of educational donations (books, stationery, materials)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS donations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    donor_id BIGINT NOT NULL,
    resource_id BIGINT NULL,
    donation_type ENUM('DIGITAL_RESOURCE', 'PHYSICAL_BOOKS', 'STATIONERY', 'EQUIPMENT') NOT NULL DEFAULT 'DIGITAL_RESOURCE',
    description TEXT,
    quantity INT NOT NULL DEFAULT 1,
    status ENUM('SUBMITTED', 'RECEIVED', 'DISTRIBUTED', 'CANCELLED') NOT NULL DEFAULT 'SUBMITTED',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_donations_donor FOREIGN KEY (donor_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_donations_resource FOREIGN KEY (resource_id) REFERENCES resources (id) ON DELETE SET NULL,
    INDEX idx_donations_donor (donor_id),
    INDEX idx_donations_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

