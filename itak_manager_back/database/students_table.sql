-- Table students pour ITAK Manager
CREATE TABLE IF NOT EXISTS public.students (
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
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_students_user_id ON public.students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_matricule ON public.students(matricule);
CREATE INDEX IF NOT EXISTS idx_students_enrollment_date ON public.students(enrollment_date);

-- Trigger pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_students_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON public.students
    FOR EACH ROW
    EXECUTE FUNCTION update_students_updated_at_column();

-- Politique RLS (Row Level Security) pour Supabase (à configurer selon les besoins)
-- ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Students can view own profile" ON public.students FOR SELECT USING (auth.uid() = user_id);
-- CREATE POLICY "Students can update own profile" ON public.students FOR UPDATE USING (auth.uid() = user_id);
-- CREATE POLICY "Admins have full access" ON public.students FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
