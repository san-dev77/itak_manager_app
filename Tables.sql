-- =========================================
-- Base de données ITAK (PostgreSQL)
-- =========================================

-- TABLE : users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL, -- student, teacher, staff, parent, admin
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    gender VARCHAR(10),
    birth_date DATE,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE : students
CREATE TABLE students (
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

-- TABLE : teachers
CREATE TABLE teachers (
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

-- TABLE : staff
CREATE TABLE staff (
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

-- TABLE : parents
CREATE TABLE parents (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    occupation VARCHAR(100),
    address TEXT,
    marital_status VARCHAR(20),
    photo TEXT,
    notes TEXT
);

-- TABLE : student_parents
CREATE TABLE student_parents (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id) ON DELETE CASCADE,
    parent_id INT REFERENCES parents(id) ON DELETE CASCADE,
    relation VARCHAR(20) NOT NULL
);

-- TABLE : classes
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    level VARCHAR(20) NOT NULL,
    capacity INT,
    categorie_id INT REFERENCES class_category(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


--classe categorie pour savoir si c'est la fac ou le college
create table class_category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE : subjects
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    categorie_id INT REFERENCES class_category(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE : class_subjects
CREATE TABLE class_subjects (
    id SERIAL PRIMARY KEY,
    class_id INT REFERENCES classes(id) ON DELETE CASCADE,
    subject_id INT REFERENCES subjects(id) ON DELETE CASCADE,
    coefficient INT NOT NULL,
    weekly_hours INT,
    is_optional BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE : student_classes
CREATE TABLE student_classes (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id) ON DELETE CASCADE,
    class_id INT REFERENCES classes(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE : teaching_assignments
CREATE TABLE teaching_assignments (
    id SERIAL PRIMARY KEY,
    teacher_id INT REFERENCES teachers(id) ON DELETE CASCADE,
    class_subject_id INT REFERENCES class_subjects(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- GESTION FINANCIÈRE
-- =========================================

-- TABLE : fee_structures
CREATE TABLE fee_structures (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    amount DECIMAL(10,2) NOT NULL,
    level VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE : student_fees au lieu de student fees faudrait trouver un meilleur nom mais bon...
CREATE TABLE student_fees (
    id SERIAL PRIMARY KEY,
    class_id INT REFERENCES classes(id) ON DELETE CASCADE,
    fee_id INT REFERENCES fee_structures(id) ON DELETE CASCADE,
    due_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'unpaid', -- unpaid, partial, paid, overdue
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE : payments
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    method VARCHAR(50) NOT NULL, -- cash, mobile money, banque, carte
    reference VARCHAR(100),
    received_by INT REFERENCES staff(id),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE : receipts
CREATE TABLE receipts (
    id SERIAL PRIMARY KEY,
    payment_id INT UNIQUE REFERENCES payments(id) ON DELETE CASCADE,
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    validated_by INT REFERENCES staff(id)
);
