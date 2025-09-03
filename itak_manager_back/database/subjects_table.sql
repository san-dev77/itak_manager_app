-- Table subjects pour ITAK Manager
CREATE TABLE IF NOT EXISTS public.subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    categorie_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categorie_id) REFERENCES public.class_category(id) ON DELETE CASCADE
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_subjects_name ON public.subjects(name);
CREATE INDEX IF NOT EXISTS idx_subjects_code ON public.subjects(code);
CREATE INDEX IF NOT EXISTS idx_subjects_categorie_id ON public.subjects(categorie_id);

-- Insertion de quelques matières par défaut (assurez-vous que les catégories existent d'abord)
INSERT INTO public.subjects (name, code, categorie_id) VALUES 
    ('Mathématiques', 'MATH', 1),
    ('Français', 'FR', 1),
    ('Anglais', 'EN', 1),
    ('Histoire', 'HIST', 2),
    ('Géographie', 'GEO', 2),
    ('Sciences', 'SCI', 3),
    ('Physique', 'PHY', 3),
    ('Chimie', 'CHIM', 3),
    ('Biologie', 'BIO', 3),
    ('Informatique', 'INFO', 4)
ON CONFLICT (code) DO NOTHING;
