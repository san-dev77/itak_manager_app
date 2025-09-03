-- Table staff pour ITAK Manager
CREATE TABLE IF NOT EXISTS public.staff (
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

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_staff_user_id ON public.staff(user_id);
CREATE INDEX IF NOT EXISTS idx_staff_matricule ON public.staff(matricule);
CREATE INDEX IF NOT EXISTS idx_staff_position ON public.staff(position);
CREATE INDEX IF NOT EXISTS idx_staff_hire_date ON public.staff(hire_date);

-- Politique RLS (Row Level Security) pour Supabase (à configurer selon les besoins)
-- ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Staff can view own profile" ON public.staff FOR SELECT USING (auth.uid() = user_id);
-- CREATE POLICY "Staff can update own profile" ON public.staff FOR UPDATE USING (auth.uid() = user_id);
-- CREATE POLICY "Admins have full access" ON public.staff FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
