-- Table teachers pour ITAK Manager
CREATE TABLE IF NOT EXISTS public.teachers (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    matricule VARCHAR(20) UNIQUE NOT NULL,
    hire_date DATE NOT NULL,
    photo TEXT,
    marital_status VARCHAR(20),
    specialty VARCHAR(100) NOT NULL,
    diplomas TEXT,
    address TEXT,
    emergency_contact VARCHAR(100),
    notes TEXT
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON public.teachers(user_id);
CREATE INDEX IF NOT EXISTS idx_teachers_matricule ON public.teachers(matricule);
CREATE INDEX IF NOT EXISTS idx_teachers_specialty ON public.teachers(specialty);
CREATE INDEX IF NOT EXISTS idx_teachers_hire_date ON public.teachers(hire_date);

-- Politique RLS (Row Level Security) pour Supabase (à configurer selon les besoins)
-- ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Teachers can view own profile" ON public.teachers FOR SELECT USING (auth.uid() = user_id);
-- CREATE POLICY "Teachers can update own profile" ON public.teachers FOR UPDATE USING (auth.uid() = user_id);
-- CREATE POLICY "Admins have full access" ON public.teachers FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
