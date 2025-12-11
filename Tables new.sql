-- =========================================
-- BASE DE DONNÉES ITAK (PostgreSQL)
-- =========================================

-- ===========================
-- TABLES UTILISATEURS & RÔLES
-- ===========================

-- TABLE : users (compte principal)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    gender VARCHAR(10),
    birth_date DATE,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE : roles (admin, student, teacher, staff, parent, etc.)
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- TABLE : user_roles (un user peut avoir plusieurs rôles)
CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    UNIQUE(user_id, role_id)
);

-- ===========================
-- PROFILS SPÉCIFIQUES
-- ===========================

-- Étudiants
CREATE TABLE student_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    matricule VARCHAR(20) UNIQUE NOT NULL,
    enrollment_date DATE NOT NULL,
    photo TEXT,
    marital_status VARCHAR(20),
    father_name VARCHAR(100),
    mother_name VARCHAR(100),
    tutor_name VARCHAR(100),
    tutor_phone VARCHAR(20),
    address TEXT,
    emergency_contact VARCHAR(100),
    notes TEXT
);

-- Enseignants
CREATE TABLE teacher_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    matricule VARCHAR(20) UNIQUE NOT NULL,
    hire_date DATE NOT NULL,
    photo TEXT,
    marital_status VARCHAR(20),
    specialty VARCHAR(100),
    diplomas TEXT,
    address TEXT,
    emergency_contact VARCHAR(100),
    notes TEXT
);

-- Personnel administratif
CREATE TABLE staff_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    matricule VARCHAR(20) UNIQUE NOT NULL,
    hire_date DATE NOT NULL,
    position VARCHAR(50) NOT NULL,
    photo TEXT,
    marital_status VARCHAR(20),
    address TEXT,
    emergency_contact VARCHAR(100),
    notes TEXT
);

-- Parents
CREATE TABLE parent_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    occupation VARCHAR(100),
    address TEXT,
    marital_status VARCHAR(20),
    photo TEXT,
    notes TEXT
);

-- Relation étudiant ↔ parent
CREATE TABLE student_parents (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES student_profiles(id) ON DELETE CASCADE,
    parent_id INT REFERENCES parent_profiles(id) ON DELETE CASCADE,
    relation VARCHAR(20) NOT NULL,
    UNIQUE(student_id, parent_id)
);

-- ===========================
-- CLASSES & MODULES
-- ===========================

-- Catégorie de classes (ex : collège, lycée, fac)
CREATE TABLE class_category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Classes
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    level VARCHAR(20) NOT NULL,
    capacity INT,
    categorie_id INT REFERENCES class_category(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Matières
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    categorie_id INT REFERENCES class_category(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Matières par classe
CREATE TABLE class_subjects (
    id SERIAL PRIMARY KEY,
    class_id INT REFERENCES classes(id) ON DELETE CASCADE,
    subject_id INT REFERENCES subjects(id) ON DELETE CASCADE,
    coefficient INT NOT NULL,
    weekly_hours INT,
    is_optional BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(class_id, subject_id)
);

-- Étudiants par classe (historique possible)
CREATE TABLE student_classes (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES student_profiles(id) ON DELETE CASCADE,
    class_id INT REFERENCES classes(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, class_id, start_date)
);

-- Assignations d’enseignement
CREATE TABLE teaching_assignments (
    id SERIAL PRIMARY KEY,
    teacher_id INT REFERENCES teacher_profiles(id) ON DELETE CASCADE,
    class_subject_id INT REFERENCES class_subjects(id) ON DELETE CASCADE,
    start_date DATE NOT NULL, 
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(teacher_id, class_subject_id, start_date)
);

-- ===========================
-- GESTION FINANCIÈRE
-- ===========================

-- Modèles de frais
CREATE TABLE fee_structures (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(10,2) NOT NULL,
    applicable_level VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Factures (liées à un étudiant et à un frais)
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES student_profiles(id) ON DELETE CASCADE,
    fee_id INT REFERENCES fee_structures(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'unpaid', -- unpaid, partial, paid, overdue
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Paiements (liés à une facture)
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    invoice_id INT REFERENCES invoices(id) ON DELETE CASCADE,
    student_id INT REFERENCES student_profiles(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    method VARCHAR(50) NOT NULL, -- cash, mobile money, banque, carte
    reference VARCHAR(100),
    received_by INT REFERENCES staff_profiles(id),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reçus
CREATE TABLE receipts (
    id SERIAL PRIMARY KEY,
    payment_id INT UNIQUE REFERENCES payments(id) ON DELETE CASCADE,
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    validated_by INT REFERENCES staff_profiles(id)
);
